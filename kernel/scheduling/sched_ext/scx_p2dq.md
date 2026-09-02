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

入队是 p2dq 最有特色的一个设计，它把「入队决策」和「入队执行」拆成了两步：

```c
void BPF_STRUCT_OPS(p2dq_enqueue, struct task_struct *p __arg_trusted, u64 enq_flags)
{
	struct enqueue_promise pro;

	async_p2dq_enqueue(&pro, p, enq_flags);   // 第一步：只做决策，不真正入队
	complete_p2dq_enqueue(&pro, p);           // 第二步：根据决策结果执行入队
}
```

第一步 `async_p2dq_enqueue` 会返回一个 tagged union（`struct enqueue_promise`），用 `kind` 字段表示「这个任务最终应该以什么方式、入到哪个队列」：

```c
enum enqueue_promise_kind {
	P2DQ_ENQUEUE_PROMISE_COMPLETE,  // 已经在决策阶段完成了入队（比如直接 dispatch）
	P2DQ_ENQUEUE_PROMISE_VTIME,     // 按 vtime 入内核 DSQ
	P2DQ_ENQUEUE_PROMISE_FIFO,      // 按 fifo 入内核 DSQ（通常是 LOCAL 直接派发）
	P2DQ_ENQUEUE_PROMISE_ATQ_VTIME, // 按 vtime 入 ATQ（arena 红黑树队列）
	P2DQ_ENQUEUE_PROMISE_DHQ_VTIME, // 按 vtime 入 DHQ（双螺旋队列）
	P2DQ_ENQUEUE_PROMISE_FAILED,    // 入队失败
};
```

> [!TIP]
> 之所以要拆开，是为了让 `scx_chaos` 这类衍生调度器可以复用这套入队逻辑——chaos 拿到 `enqueue_promise` 后可以选择「先不执行入队，等 `dispatch` 阶段再完成」，从而往系统里注入熵。代码注释里特别强调 `COMPLETE` 状态必须具有确定性，否则 chaos 会卡住。

`async_p2dq_enqueue` 的决策逻辑（简化版）大致如下，本质就是「这个任务该进哪个队列」的分类器：

```c
static void async_p2dq_enqueue(struct enqueue_promise *ret,
			       struct task_struct *p, u64 enq_flags)
{
	struct cpu_ctx *cpuc;
	struct llc_ctx *llcx;
	task_ctx *taskc;
	s32 cpu = scx_bpf_task_cpu(p);

	// 兜底：默认失败，只设置用到的字段
	__builtin_memset(ret, 0, sizeof(*ret));
	ret->kind = P2DQ_ENQUEUE_PROMISE_FAILED;

	/* 快速路径：只绑定单个 CPU 的内核线程，直接塞进本地 DSQ */
	if (unlikely(p2dq_config.kthreads_local &&
	    (p->flags & PF_KTHREAD) &&
	    p->nr_cpus_allowed == 1)) {
		scx_bpf_dsq_insert(p, SCX_DSQ_LOCAL, min_dsq_time_slice(), enq_flags);
		ret->kind = P2DQ_ENQUEUE_PROMISE_COMPLETE;
		return;
	}

	taskc = lookup_task_ctx(p);

	/* fork/exec 平衡（第一步）：给刚 fork/exec 的任务挑一个最不忙的 LLC，记到 hint 里 */
	if (task_ctx_test_flag(taskc, TASK_CTX_F_FORKNOEXEC) && ...) {
		u32 target_llc = find_least_loaded_llc_for_fork(curr_cpuc->llc_id); // 这里的选 LLC 逻辑即为 pick two 逻辑
		if (target_llc != curr_cpuc->llc_id) {
			taskc->target_llc_hint = target_llc;  // 先只记 hint，不立即迁移
		}
	}

	/* fork/exec 平衡（第二步）：消费 hint，找到目标 LLC 的空闲核并直接派发过去 */
	if (topo_config.nr_llcs > 1 && taskc->target_llc_hint < MAX_LLCS) {
		u32 target_llc_id = taskc->target_llc_hint;
		taskc->target_llc_hint = MAX_LLCS;        // 一次性消费，防止重复触发

		s32 target_cpu = find_idle_cpu_in_target_llc(p, target_llc_id);
		if (target_cpu >= 0) {
			taskc->llc_id = target_llc_id;         // 任务 LLC 归属改到目标 LLC
			taskc->llc_runs = 0;                   // 清空黏性计数

			update_vtime(p, target_cpuc, taskc, target_llc);
			ret->kind = P2DQ_ENQUEUE_PROMISE_FIFO; // 直接派发，不走 vtime 队列
			ret->cpu = target_cpu;
			ret->fifo.dsq_id = SCX_DSQ_LOCAL_ON | target_cpu;
			ret->fifo.slice_ns = taskc->slice_ns;
			ret->fifo.enq_flags = enq_flags;
			return;   // 已确定落点，直接返回
		}
	}

	/* 亲和任务：只能走 per-CPU 的 affn_dsq */
	if (!task_ctx_test_flag(taskc, TASK_CTX_F_ALL_CPUS) || ...) {
		taskc->dsq_id = cpuc->affn_dsq;          // 固定到某个 CPU 的 affn_dsq
		update_vtime(p, cpuc, taskc, llcx);

		ret->kind = P2DQ_ENQUEUE_PROMISE_VTIME;  // 按 vtime 入 affn_dsq
		ret->vtime.dsq_id   = taskc->dsq_id;
		ret->vtime.vtime    = p->scx.dsq_vtime;
		ret->vtime.slice_ns = taskc->slice_ns;
		return;
	}

	/* 无亲和限制的任务：先判断它是否满足「可迁移」条件 */
	bool migrate = can_migrate(taskc, llcx);

	if (migrate) {
		// 可迁移 → 进 mig_dsq（根据配置，可能是 DSQ / ATQ / DHQ 三种后端之一）
		taskc->dsq_id = llcx->mig_dsq;
		if (p2dq_config.dhq_enabled) {
			ret->kind = P2DQ_ENQUEUE_PROMISE_DHQ_VTIME;
			ret->dhq.dhq    = llcx->mig_dhq;
			ret->dhq.strand = llcx->dhq_strand;
		} else if (p2dq_config.atq_enabled) {
			ret->kind = P2DQ_ENQUEUE_PROMISE_ATQ_VTIME;
			ret->vtime.atq = llcx->mig_atq;
		} else {
			ret->kind = P2DQ_ENQUEUE_PROMISE_VTIME;
			ret->vtime.dsq_id = taskc->dsq_id;
		}
	} else {
		// 不可迁移 → 进 LLC 的 llc_dsq
		taskc->dsq_id = cpuc->llc_dsq;
		ret->kind = P2DQ_ENQUEUE_PROMISE_VTIME;
		ret->vtime.dsq_id = taskc->dsq_id;
	}
}
```

第二步 `complete_p2dq_enqueue` 只是一个按 `kind` 分发的大 switch，真正调用内核/arena 的插入函数：

```c
static void complete_p2dq_enqueue(struct enqueue_promise *pro, struct task_struct *p)
{
	switch (pro->kind) {
	case P2DQ_ENQUEUE_PROMISE_COMPLETE:
		break;   // 已经入队过了，什么都不做
	case P2DQ_ENQUEUE_PROMISE_FIFO:
		scx_bpf_dsq_insert(p, pro->fifo.dsq_id, pro->fifo.slice_ns, pro->fifo.enq_flags);
		break;
	case P2DQ_ENQUEUE_PROMISE_VTIME:
		scx_bpf_dsq_insert_vtime(p, pro->vtime.dsq_id, pro->vtime.slice_ns,
					 pro->vtime.vtime, pro->vtime.enq_flags);
		break;
	case P2DQ_ENQUEUE_PROMISE_ATQ_VTIME:
		scx_atq_insert_vtime(pro->vtime.atq, &taskc->common, pro->vtime.vtime);
		break;
	case P2DQ_ENQUEUE_PROMISE_DHQ_VTIME:
		scx_dhq_insert_vtime(pro->dhq.dhq, (u64)p->pid, pro->dhq.vtime, pro->dhq.strand);
		break;
	case P2DQ_ENQUEUE_PROMISE_FAILED:
		scx_bpf_error("p2dq enqueue failed");
		break;
	}

	// 如果之前清掉了 CPU 的 idle 状态，需要 kick 一下让 CPU 重新进入 dispatch
	if (enqueue_promise_test_flag(pro, ENQUEUE_PROMISE_F_KICK_IDLE))
		scx_bpf_kick_cpu(pro->cpu, SCX_KICK_IDLE);
}
```

可以看到，p2dq 把「任务进哪个队列」这条最关键的决策路径，通过 `enqueue_promise` 这个中间产物解耦了出来：决策层只关心分类逻辑，执行层只关心调用哪种插入原语。

### 迁移判定与任务黏性（can_migrate）

进入 `mig_dsq`（即可被 pick-two 偷取）是需要资格的，`can_migrate` 就是那道门槛：

```c
static bool can_migrate(task_ctx *taskc, struct llc_ctx *llcx)
{
	// 单 LLC 模式：没有跨 LLC 迁移可言
	if (unlikely(lb_config.single_llc_mode))
		return false;

	// 系统 LLC 太少 / 有亲和限制 / 交互任务（除非显式开启）都不迁移
	if (topo_config.nr_llcs < 2 ||
	    !task_ctx_test_flag(taskc, TASK_CTX_F_ALL_CPUS) ||
	    (!lb_config.dispatch_lb_interactive && task_ctx_test_flag(taskc, TASK_CTX_F_INTERACTIVE)))
		return false;

	// 任务刚迁移过来不久，还在「黏性期」，不迁移
	if (taskc->llc_runs > 0)
		return false;

	// 系统或本 LLC 饱和了，无条件允许迁移（别黏着了）
	if (unlikely(saturated || overloaded))
		return true;
	if (unlikely(llc_ctx_test_flag(llcx, LLC_CTX_F_SATURATED)))
		return true;

	return false;
}
```

这里最值得注意的字段是 `llc_runs`——它实现了任务的 **LLC 黏性（stickiness）**，用来防止任务在 LLC 之间 ping-pong：

- 任务**迁移到新 LLC** 时，`task_refresh_llc_runs()` 把它重置为 `min_llc_runs_pick2`；
- 任务**继续在同一个 LLC 运行**时，每跑一轮 `llc_runs` 减 1（见下文 `running` 逻辑）；
- 只要 `llc_runs > 0`，`can_migrate` 就返回 false，任务暂时「黏」在当前 LLC；
- 减到 0 之后，任务才重新获得被 pick-two 迁移的资格。

`min_llc_runs_pick2` 不是固定值，而是 `update_idle` 里根据系统负载动态算出来的：

```c
// update_idle 里：
if (saturated) {
	min_llc_runs_pick2 = min(2, lb_config.min_llc_runs_pick2);   // 饱和 → 黏性变小，激进迁移
} else {
	u32 llc_scaler = log2_u32(topo_config.nr_llcs);
	min_llc_runs_pick2 = min(log2_u32(percent_idle) + llc_scaler, lb_config.min_llc_runs_pick2);
}
```

即系统越空闲、LLC 越多，黏性越强（减少不必要的迁移）；越饱和，黏性越弱（尽快把任务摊开）。

### 任务分发逻辑（dispatch）与 pick-two

这是 p2dq 名字的核心所在。先看 `dispatch` 的主流程（简化版）：

```c
static void p2dq_dispatch_impl(s32 cpu, struct task_struct *prev)
{
	// 1. 依次 peek 各队列的头任务，找到 vtime 最小的那个作为待分发队列
	//    - 本 CPU 的 affn_dsq
	//    - 同 LLC 内其他 CPU 的 affn_dsq（亲和任务的工作窃取）
	//    - 本 LLC 的 llc_dsq
	//    - mig_dsq（或 DHQ / ATQ）
	u64 min_vtime = 0, dsq_id = 0;
	p = __COMPAT_scx_bpf_dsq_peek(cpuc->affn_dsq);
	if (p && can_run_here) {
		min_vtime = p->scx.dsq_vtime;
		dsq_id = cpuc->affn_dsq;
	}

	// ... 对其他队列重复上述 peek + 比较 min_vtime 的过程 ...

	// 2. 找到 min_vtime 后，从对应队列真正 pop 并派发到本地
	if (likely(valid_dsq(dsq_id) && scx_bpf_dsq_move_to_local(dsq_id, 0)))
		return;

	// 3. 都没任务，且开启 sharding 时尝试其他 shard
	// ...

	// 4. 还不行，如果 prev 还能「继续跑」（keep_running），就让它接着跑
	if (unlikely(prev && keep_running(cpuc, llcx, prev)))
		return;

	// 5. 最后才走到 pick-two 负载均衡
	dispatch_pick_two(cpu, llcx, cpuc);
}
```

可以看到，`dispatch` 的优先级是：**本地队列 > LLC 队列 > 迁移队列 > keep_running > pick-two**。pick-two 只在本地完全没活干的时候才触发。

pick-two 的核心实现：

```c
static __always_inline int dispatch_pick_two(s32 cpu, struct llc_ctx *cur_llcx, struct cpu_ctx *cpuc)
{
	struct llc_ctx *first, *second, *left, *right;

	// 只有一个 LLC / 显式禁用 / 有 backoff 未到期，都不做
	if (unlikely(topo_config.nr_llcs == 1 || lb_config.dispatch_pick2_disable))
		return -EINVAL;

	// backoff：距上次 pick-two 太近则跳过，避免频繁扰动
	if (lb_config.backoff_ns > 0) {
		u64 now = scx_bpf_now();
		if (now - cur_llcx->last_period_ns < lb_config.backoff_ns)
			return -EINVAL;
	}

	/*
	 * 随机挑两个 LLC（left/right）。
	 * 两个 LLC 的场景直接取 llc_ids[0]/[1]，否则各随机一次。
	 */
	left  = topo_config.nr_llcs == 2 ? lookup_llc_ctx(llc_ids[0]) : rand_llc_ctx();
	right = topo_config.nr_llcs == 2 ? lookup_llc_ctx(llc_ids[1]) : rand_llc_ctx();

	// 运气不好挑到了同一个 LLC，换一个
	if (left->id == right->id) {
		i = llc_get_load(cur_llcx) % topo_config.nr_llcs;
		right = lookup_llc_ctx(llc_ids[i]);
	}

	// 负载高的当 first，低的当 second
	if (llc_get_load(right) > llc_get_load(left)) {
		first = right; second = left;
	} else {
		first = left; second = right;
	}

	// 只有两个 LLC 时，如果 first 恰好是自己，换一下（自己已经被检查过了）
	if (topo_config.nr_llcs == 2 && first->id == cur_llcx->id) {
		first = second; second = cur_llcx;
	}

	// 加松弛因子：只有当对方负载比自己高出 slack_factor% 才去偷
	cur_load = llc_get_load(cur_llcx) + ((llc_get_load(cur_llcx) * lb_config.slack_factor) / 100);

	if (llc_get_load(first) >= cur_load && consume_llc(first))
		return 0;

	if (llc_get_load(second) >= cur_load && consume_llc(second))
		return 0;

	// 系统饱和时，无条件消费，甚至再随机挑第三个 LLC
	if (saturated) {
		if (consume_llc(first))
			return 0;
		if (consume_llc(second))
			return 0;
		if (topo_config.nr_llcs > 2 && (first = rand_llc_ctx()) && consume_llc(first))
			return 0;
	}

	return 0;
}
```

而 `consume_llc` 就是「真正从目标 LLC 的迁移队列里取一个任务」的动作：

```c
static bool consume_llc(struct llc_ctx *llcx)
{
	// DHQ 后端：从本 LLC 对应的 strand 弹出一个，塞回 llc_dsq 再派发
	if (p2dq_config.dhq_enabled && scx_dhq_nr_queued(llcx->mig_dhq) > 0) {
		pid = scx_dhq_pop_strand(llcx->mig_dhq, llcx->dhq_strand);
		p = bpf_task_from_pid((s32)pid);
		scx_bpf_dsq_insert_vtime(p, cpuc->llc_dsq, taskc->slice_ns, p->scx.dsq_vtime, ...);
		return scx_bpf_dsq_move_to_local(cpuc->llc_dsq, 0);
	}
	// ATQ 后端：pop 一个任务
	else if (p2dq_config.atq_enabled && scx_atq_nr_queued(llcx->mig_atq) > 0) {
		taskc = scx_atq_pop(llcx->mig_atq, false);
		// ... 同上，塞回 llc_dsq 再 move_to_local ...
	}
	// 纯 DSQ 后端：直接 move mig_dsq
	if (likely(scx_bpf_dsq_move_to_local(llcx->mig_dsq, 0)))
		return true;
	return false;
}
```

> [!NOTE]
> 注意 pick-two 的「随机挑两个」本质是个**概率式**负载均衡：负载越高的 LLC 被随机采样选中的概率越高，长期下来负载趋于均衡。它避免了全局扫描，是 O(1) 的，LLC 数量越多优势越明显——这也正是 README 里说 p2dq 适合「众多 LLC」场景的原因。

### 任务停止逻辑（stopping）

`stopping` 是 p2dq 做「事后记账」的地方：更新 vtime、记录负载、以及**决定任务下一轮进哪一层 DSQ**。

```c
void BPF_STRUCT_OPS(p2dq_stopping, struct task_struct *p, bool runnable)
{
	u64 now = bpf_ktime_get_ns();
	u64 used = now - taskc->last_run_at;                 // 本次实际运行时长
	u64 scaled_used = scale_by_task_weight_inverse(p, used); // 按权重反缩放

	// 1. 更新 vtime：任务自己的 vtime += 缩放后的运行时长
	scx_bpf_task_set_dsq_vtime(p, p->scx.dsq_vtime + scaled_used);
	//    LLC 的 vtime 也同步推进（用未缩放的 used）
	__sync_fetch_and_add(&llcx->vtime, used);

	// 2. 记录负载（PELT 或简单计数器，这里略）

	if (!runnable) {  // 任务真正结束运行（而不是被抢占后仍可运行）
		u64 last_dsq_slice_ns = taskc->slice_ns;

		// 3. DSQ 升降级：比较实际运行时长与 slice
		if (used >= (9 * last_dsq_slice_ns) / 10) {
			// 用满了 slice → 升到时间片更长的 DSQ（更「非交互」）
			if (taskc->dsq_index < p2dq_config.nr_dsqs_per_llc - 1)
				taskc->dsq_index += 1;
		} else if (used < last_dsq_slice_ns / 2) {
			// 用不满 slice 的一半 → 降到时间片更短的 DSQ（更「交互」）
			if (taskc->dsq_index > 0)
				taskc->dsq_index -= 1;
		}

		// 4. 时间片自适应缩放
		if (p2dq_config.task_slice) {
			if (used >= (7 * last_dsq_slice_ns) / 8)
				taskc->slice_ns = clamp_slice((5 * taskc->slice_ns) >> 2); // 用太满 → 加长
			else if (used < last_dsq_slice_ns / 2)
				taskc->slice_ns = clamp_slice((7 * taskc->slice_ns) >> 3); // 用太少 → 缩短
		}

		// 5. 重新同步 INTERACTIVE flag（dsq_index==0 就是交互）
		if (is_interactive(taskc))
			task_ctx_set_flag(taskc, TASK_CTX_F_INTERACTIVE);
		else
			task_ctx_clear_flag(taskc, TASK_CTX_F_INTERACTIVE);
	}
}
```

这里揭示了 p2dq 的「交互性」是如何**动态分类**的：它不靠任务的静态属性（名字、nice 值之类）判断交互性，而是看任务的实际行为——**频繁用不满时间片的任务会一步步被降到 `dsq_index==0`（最短时间片队列），从而被打上 `TASK_CTX_F_INTERACTIVE` 标签**；反之，CPU 密集任务会被升到长队列。

这也解释了为什么 `TASK_CTX_F_INTERACTIVE` 只是一个 `dsq_index==0` 的缓存，而不是独立计算的指标。

### 负载均衡定时器（load_balance_timer / autoslice）

最后，p2dq 有一个 250ms 的 BPF 定时器做两件「全局性」的事：

```c
static bool load_balance_timer(void)
{
	// 1. 计算每个 LLC 与其「偏移 LLC」的负载不平衡度，标记出需要被偷的 LLC
	bpf_for(llc_index, 0, topo_config.nr_llcs) {
		llc_id  = llc_ids[llc_index];
		lb_llc_id = llc_ids[(llc_index + llc_lb_offset) % nr_llcs];

		u64 llc_load    = p2dq_config.pelt_enabled ? llcx->util_avg : llcx->load;
		u64 lb_llc_load = p2dq_config.pelt_enabled ? lb_llcx->util_avg : lb_llcx->load;

		// 负载差超过 slack 才记为不平衡
		s64 load_imbalance = (100 * (llc_load - lb_llc_load)) / llc_load;
		if (load_imbalance > lb_slack)
			llcx->lb_llc_id = lb_llc_id;   // 让 select_cpu 阶段引导任务往这个 LLC 迁移
		else
			llcx->lb_llc_id = MAX_LLCS;
	}

	// 2. autoslice：根据交互负载占比，自动调整各级 DSQ 的时间片
	if (interactive_sum == 0) {
		// 没有交互负载 → 整体调大时间片
		dsq_time_slices[0] = (11 * dsq_time_slices[0]) / 10;
	} else {
		u64 ideal_sum = (load_sum * p2dq_config.interactive_ratio) / 100; // 目标交互负载
		if (interactive_sum < ideal_sum)
			dsq_time_slices[0] = (11 * dsq_time_slices[0]) / 10;  // 交互太少 → 加长交互片
		else
			dsq_time_slices[0] = max((10 * dsq_time_slices[0]) / 11, min_slice_ns); // 反之缩短
	}

	// 各级 DSQ 时间片按指数拉开：slice[j] = slice[0] << j << dsq_shift
	bpf_for(j, 1, p2dq_config.nr_dsqs_per_llc) {
		dsq_time_slices[j] = dsq_time_slices[0] << j << p2dq_config.dsq_shift;
	}
}
```

这两件事分别对应了 pick-two 的「引导性负载均衡」（`lb_llc_id` 给 `select_cpu` 提示）和「交互时间片的自动标定」（`autoslice`），把前面 `stopping` 里基于行为的动态分类，用定时器在全局层面再校准一次。
