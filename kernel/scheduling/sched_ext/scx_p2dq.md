# scx_p2dq

## 核心思想

- p2: pick two. 意为在负载均衡的dispatch路径选择两个 queue 来拉取任务。随机挑选两个 LLC，比较两个 LLC 负载，先从负载高的 LLC 中获取任务，失败再消费较低负载的 LLC。
  - pick two是一种常见的概率学技巧：在一堆随机样本中挑选两个，并比较取优，可以保证各个 LLC 的负载能接近均等。如果每次从样本中只选一个，那么随采样次数增加，会呈现出严重的不均衡，分布的方差会变大。
  > [!TIP]
  > 这里既然强调了 pick two，因此 scx_p2dq 调度器适合众多 LLC 的场景，对一个或两个 LLC 不会有太大效果。
- dq: doulbe queue. 以 LLC 为粒度，设置两个队列。
  - `llc_dsq` 负责放置普通任务；
  - `mig_dsq` 负责可迁移任务，这其中的任务可以给 pick-two 的 dispatch 路径偷取。

> [!TIP]
> 除了这两个与其他调度器有重大差异的设计，p2dq 也使用和其他常见 scx 调度器以及 CFS 类似的虚拟时间 `vtime` 实现（没有deadline）。

## 具体实现

p2dq 究竟是如何 pick two 的呢？以及以 LLC 粒度配置的 dsq 是如何维护的呢？带着这些问题我们可以来看看 `scx_p2dq` 的实现。

### 任务选空闲核逻辑 (select_cpu)

在看具体逻辑实现前，有一个关键的 FLAG 需要先介绍下：

- `TASK_CTX_F_ALL_CPUS`: 任务是否设置了 CPU 亲和性限制。该 FLAG 为 TRUE 的时候，这个任务可以在所有 CPU 上执行；该 FLAG 为 FALSE 的时候则有 CPU 亲和性限制。

  ```c
  void BPF_STRUCT_OPS(p2dq_set_cpumask, struct task_struct *p,
              const struct cpumask *cpumask)
  {
      // ...
      // cpus_ptr 指向 cpus_mask，说明它没有被 cgroup 的 cpumask 限制住
      if (p->cpus_ptr == &p->cpus_mask &&
          // 可选 cpu 个数等于机器的总 cpu 数
          p->nr_cpus_allowed == topo_config.nr_cpus)
          task_ctx_set_flag(taskc, TASK_CTX_F_ALL_CPUS);
      else
          task_ctx_clear_flag(taskc, TASK_CTX_F_ALL_CPUS);
      // ...
  }
  ```

`select_cpu` 具体的逻辑如下：

```c
static s32 p2dq_select_cpu_impl(struct task_struct *p, s32 prev_cpu, u64 wake_flags)
{
    // ...
    // 对于那些有选核亲和性的任务执行 pick_idle_affinitized_cpu 逻辑；
	if (unlikely(!task_ctx_test_flag(taskc, TASK_CTX_F_ALL_CPUS)))
		cpu = pick_idle_affinitized_cpu(p, taskc, prev_cpu, &is_idle);
	else // 对于没有这种要求的任务执行 pick_idle_cpu 逻辑。
		cpu = pick_idle_cpu(p, taskc, prev_cpu, wake_flags, &is_idle);

    // ...
    // 空闲核，优先通过快速路径直接选核执行
	if (likely(is_idle)) {
		stat_inc(P2DQ_STAT_IDLE);
		if (task_ctx_test_flag(taskc, TASK_CTX_F_ALL_CPUS)) {
			scx_bpf_dsq_insert(p, SCX_DSQ_LOCAL, taskc->slice_ns, 0);
		}
	}

	return cpu;
}
```

`pick_idle_affinitized_cpu` 是有亲和性的任务执行的选核逻辑（简化逻辑版）：

```c
static s32 pick_idle_affinitized_cpu(struct task_struct *p, task_ctx *taskc,
				     s32 prev_cpu, bool *is_idle)
{
	s32 cpu = prev_cpu;

    // 如果不允许迁移，那么就只能坚持 prev_cpu
	if (is_migration_disabled(p)) {
		*is_idle = scx_bpf_test_and_clear_cpu_idle(prev_cpu);
		return prev_cpu;
	}

	const struct cpumask *idle_cpumask = scx_bpf_get_idle_cpumask();

	struct llc_ctx *llcx = lookup_llc_ctx(taskc->llc_id);

	// 先尝试 prev_cpu
	if (bpf_cpumask_test_cpu(prev_cpu, p->cpus_ptr) &&
	    scx_bpf_test_and_clear_cpu_idle(prev_cpu)) {
		*is_idle = true;
		goto found_cpu;
	}

    // 临时的 cpumask，每个任务都有（我感觉有点浪费）
	struct mask_wrapper *wrapper = bpf_task_storage_get(&task_masks, p, 0, 0);
	struct bpf_cpumask *mask = wrapper->mask;
	if (llcx->cpumask)
		bpf_cpumask_and(mask, cast_mask(llcx->cpumask),
				p->cpus_ptr);

	// 先尝试在一个 LLC 上找空闲物理核
	if (topo_config.smt_enabled) {
		cpu = __pick_idle_cpu(mask, SCX_PICK_IDLE_CORE);
		if (cpu >= 0) {
			*is_idle = true;
			goto found_cpu;
		}
	}

	// 再尝试在一个 LLC 上找空闲逻辑核
	cpu = __pick_idle_cpu(mask, 0);
	if (cpu >= 0) {
		*is_idle = true;
		goto found_cpu;
	}

	// 再尝试在整个 node 上找空闲逻辑核
	if (llcx->node_cpumask && mask) {
		bpf_cpumask_and(mask,
				cast_mask(llcx->node_cpumask),
				p->cpus_ptr);

		cpu = __pick_idle_cpu(mask, 0);
		if (cpu >= 0) {
			*is_idle = true;
			goto found_cpu;
		}
	}

    // 实在找不到空闲核，只能在任务 p 的有效范围内随机选一个核
	cpu = bpf_cpumask_any_distribute(p->cpus_ptr);

found_cpu:

	return cpu;
}
```

对于没有亲和性要求的任务执行的选核逻辑（简化逻辑版）：

```c
static s32 pick_idle_cpu(struct task_struct *p, task_ctx *taskc,
			 s32 prev_cpu, u64 wake_flags, bool *is_idle)
{
	s32 pref_cpu, cpu = prev_cpu;
	bool migratable = false;

	const struct cpumask *idle_cpumask = scx_bpf_get_idle_cpumask();

    // 依旧先选旧核
	if (bpf_cpumask_test_cpu(prev_cpu, idle_cpumask) &&
	    scx_bpf_test_and_clear_cpu_idle(prev_cpu)) {
		*is_idle = true;
		goto found_cpu;
	}

    // 没有 idle 任务，提前短路跳出
	if (idle_cpumask && bpf_cpumask_empty(idle_cpumask))
		goto found_cpu;

	struct llc_ctx *llcx = lookup_llc_ctx(taskc->llc_id);

    // 总有各种理由不允许迁移，最重要的理由是这个任务设置了 CPU 亲和性
    // （即TASK_CTX_F_ALL_CPUS 为 FALSE）
	migratable = can_migrate(taskc, llcx);
	if (topo_config.nr_llcs > 1 &&
	    (llc_ctx_test_flag(llcx, LLC_CTX_F_SATURATED) || saturated || overloaded) &&
	    !migratable) {
		cpu = prev_cpu;
		goto found_cpu;
	}

    struct llc_ctx *llcx;
	if (!valid_dsq(taskc->dsq_id))
        // 随机选一个 LLC
		llcx = rand_llc_ctx();

	// WAKE_SYNC 说明被唤醒者是被 current 同步唤醒的，wakee 执行时 waker 就会陷入睡眠，因此我们需要调度到同一个 LLC 运行来提升缓存命中率。
	if (wake_flags & SCX_WAKE_SYNC) {
        // current 就是 waker
		struct task_struct *waker = (void *)bpf_get_current_task_btf();
		task_ctx *waker_taskc = scx_task_data(waker);

        // 相同 LLC，无需迁移
		if (waker_taskc->llc_id == llcx->id) {
			// Try an idle smt core in the LLC.
			if (topo_config.smt_enabled &&
			    llcx->cpumask &&
			    (cpu = __pick_idle_cpu(llcx->cpumask,
						   SCX_PICK_IDLE_CORE)
			     ) >= 0) {
				*is_idle = true;
				goto found_cpu;
			}
			// Try an idle cpu in the LLC.
			if (llcx->cpumask &&
			    (cpu = __pick_idle_cpu(llcx->cpumask,
						   0)
			     ) >= 0) {
				*is_idle = true;
				goto found_cpu;
			}
			// Nothing idle, stay sticky
			cpu = prev_cpu;
			goto found_cpu;
		}

		// 不同 LLC，尝试迁移到 waker 的 LLC 上
		struct llc_ctx *waker_llcx = lookup_llc_ctx(waker_taskc->llc_id);

        // 先找空闲物理核
		if (waker_llcx->cpumask &&
		    (cpu = __pick_idle_cpu(waker_llcx->cpumask,
					   SCX_PICK_IDLE_CORE)
		     ) >= 0) {
			*is_idle = true;
			goto found_cpu;
		}

        // 再找空闲逻辑核
		if (waker_llcx->cpumask &&
		    (cpu = __pick_idle_cpu(waker_llcx->cpumask,
					   0)
		     ) >= 0) {
			*is_idle = true;
			goto found_cpu;
		}

        // 找不到空闲核，直接将任务转移到 waker CPU上
		cpu = scx_bpf_task_cpu(waker);
		goto found_cpu;
	}

    // 后面有各种特殊条件下的 pick_idle_cpu 实现，这里不一一看了。
	/*
	 * Energy-aware selection with comprehensive scoring
	 * Uses effective capacity, energy cost, and thermal awareness
	 */
	if (p2dq_config.enable_eas && topo_config.has_little_cores) {
		cpu = pick_idle_energy_aware(p, llcx, is_idle);
		if (cpu >= 0)
			goto found_cpu;
	}

	if (p2dq_config.sched_mode == MODE_PERF &&
	    topo_config.has_little_cores &&
	    llcx->big_cpumask) {
		/* Try thermal-aware selection first for big cores if thermal tracking enabled */
		if (p2dq_config.thermal_enabled) {
			cpu = pick_idle_thermal_aware(llcx->big_cpumask, p);
			if (cpu >= 0) {
				*is_idle = true;
				goto found_cpu;
			}
		}
		/* Fallback to non-thermal-aware if thermal disabled or no idle big cores */
		if (llcx->big_cpumask &&
		    (cpu = __pick_idle_cpu(llcx->big_cpumask, SCX_PICK_IDLE_CORE)) &&
		    cpu >= 0) {
			*is_idle = true;
			goto found_cpu;
		}
		if (llcx->big_cpumask &&
		    (cpu = __pick_idle_cpu(llcx->big_cpumask, 0)) &&
		    cpu >= 0) {
			*is_idle = true;
			goto found_cpu;
		}
	}

	if (p2dq_config.sched_mode == MODE_EFFICIENCY &&
	    topo_config.has_little_cores &&
	    llcx->little_cpumask) {
		/* Try thermal-aware selection first for little cores if thermal tracking enabled */
		if (p2dq_config.thermal_enabled) {
			cpu = pick_idle_thermal_aware(llcx->little_cpumask, p);
			if (cpu >= 0) {
				*is_idle = true;
				goto found_cpu;
			}
		}
		/* Fallback to non-thermal-aware if thermal disabled or no idle little cores */
		if (llcx->little_cpumask &&
		    (cpu = __pick_idle_cpu(llcx->little_cpumask, SCX_PICK_IDLE_CORE)) &&
		    cpu >= 0) {
			*is_idle = true;
			goto found_cpu;
		}
		if (llcx->little_cpumask &&
		    (cpu = __pick_idle_cpu(llcx->little_cpumask, 0)) &&
		    cpu >= 0) {
			*is_idle = true;
			goto found_cpu;
		}
	}


	if (llcx->lb_llc_id < MAX_LLCS &&
	    taskc->llc_runs == 0) {
		u32 target_llc_id = llcx->lb_llc_id;
		llcx->lb_llc_id = MAX_LLCS;
		if (!(llcx = lookup_llc_ctx(target_llc_id)))
			goto found_cpu;
	}

	if (topo_config.has_little_cores && llcx->big_cpumask) {
		cpu = __pick_idle_cpu(llcx->big_cpumask,
				      SCX_PICK_IDLE_CORE);
		if (cpu >= 0) {
			*is_idle = true;
			goto found_cpu;
		}
		if (llcx->little_cpumask &&
		    (cpu = __pick_idle_cpu(llcx->little_cpumask,
					   SCX_PICK_IDLE_CORE)) >= 0) {
			*is_idle = true;
			goto found_cpu;
		}
	}

	// Next try in the local LLC (usually succeeds)
	if (likely(llcx->cpumask &&
	    (cpu = __pick_idle_cpu(llcx->cpumask,
				   SCX_PICK_IDLE_CORE)
	     ) >= 0)) {
		*is_idle = true;
		goto found_cpu;
	}

	// Try a idle CPU in the llc (also likely to succeed)
	if (likely(llcx->cpumask &&
	    (cpu = __pick_idle_cpu(llcx->cpumask, 0)) >= 0)) {
		*is_idle = true;
		goto found_cpu;
	}

	if (topo_config.nr_llcs > 1 &&
	    llc_ctx_test_flag(llcx, LLC_CTX_F_SATURATED) &&
	    migratable &&
	    llcx->node_cpumask) {
		cpu = scx_bpf_pick_idle_cpu(cast_mask(llcx->node_cpumask),
					    SCX_PICK_IDLE_CORE);
		if (cpu >= 0) {
			*is_idle = true;
			goto found_cpu;
		}
		if (llcx->node_cpumask) {
			cpu = scx_bpf_pick_idle_cpu(cast_mask(llcx->node_cpumask), 0);
			if (cpu >= 0) {
				*is_idle = true;
				goto found_cpu;
			}
		}
		if (saturated && migratable && all_cpumask) {
			cpu = scx_bpf_pick_idle_cpu(cast_mask(all_cpumask),
						    SCX_PICK_IDLE_CORE);
			if (cpu >= 0) {
				*is_idle = true;
				goto found_cpu;
			}
			if (all_cpumask) {
				cpu = scx_bpf_pick_idle_cpu(cast_mask(all_cpumask), 0);
				if (cpu >= 0) {
					*is_idle = true;
					goto found_cpu;
				}
			}
		}
	}

	cpu = prev_cpu;

found_cpu:

	return cpu;
}
```
### 任务入队逻辑（enqueue）

```c
void BPF_STRUCT_OPS(p2dq_enqueue, struct task_struct *p __arg_trusted, u64 enq_flags)
{
	struct enqueue_promise pro;

	async_p2dq_enqueue(&pro, p, enq_flags);
	complete_p2dq_enqueue(&pro, p);
}
```
