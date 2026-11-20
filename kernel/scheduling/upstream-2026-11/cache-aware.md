# Cache-aware 调度

cache-aware 调度（`CONFIG_SCHED_CACHE`）在 v7.2 前后进入主线，目标是把同一进程的线程聚合到同一个 LLC 里，减少跨 LLC 的 cache-to-cache 通信。这个月它进入了“打磨期”：已有几处修复并入 v7.4，Jianyong Wu 提出了把聚合粒度从“单个 LLC”扩展到“多个 LLC / NUMA 节点”的 RFC v3，Luo Gengkun 在降低 `task_cache_work()` 的扫描开销，Tim Chen 补上了第一份文档。

## 已并入 v7.4 的修复

| 内容 | 作者 | 路径 |
| --- | --- | --- |
| 避免发布“局部”LLC 利用率 | Jemmy Wong | `sched/core` pull（10/18） |
| 混合架构上 asym packing 优先于 cache-aware | Tim Chen | `sched/urgent` pull（10/25） |
| 修正 `!CONFIG_SCHED_CACHE` 时过期的 `get_pref_llc()` 桩 | Yafang Shao | `sched/urgent` pull（10/25） |

**局部 LLC 利用率。** `update_sg_lb_stats()` 的利用率只累加 `sched_group_span(group)` 与 `env->cpus` 的交集，而 capacity 取的是整个 group 的 `group->sgc->capacity`，`record_sg_llc_stats()` 把两者一起发布。负载均衡里若某个源 rq 的任务全被亲和性钉住，这个 CPU 会从 `env->cpus` 移除并重新选 group，重试时就会发布“局部利用率 + 完整容量”。`can_migrate_llc()` 于是把一个已经很忙的首选 LLC 当成还有余量：更多任务聚合进去，向外迁移被挡住，两个都忙的 LLC 也可能回不到通用均衡，表现为 CPU 争用和任务延迟上升。CPU 热插拔期间同样有这个窗口（`set_cpu_active(false)` 后 `env->cpus` 已少一个 CPU，但 group span 和 capacity 要等 `cpuset_cpu_inactive()` 重建域后才更新）。补丁在亲和性重试（`LBF_ALL_PINNED`）时不发布，首轮只在 `env->cpus` 覆盖整个 group 时才发布；实际的负载均衡仍用过滤后的统计。

**asym packing 与 cache-aware 的冲突。** 报告来自 AMD Ryzen AI HX 370 上的 Clang full-LTO 链接：小核频率低得多（3.3 GHz 对 5.1 GHz），L3 也只有一半（8 MB 对 16 MB），cache-aware 把任务钉在小核所在的 LLC，双重受损，链接时间比引入 cache-aware 之前的内核慢得多。两种策略本质冲突：asym packing 要任务跑在最高优先级 CPU 上，cache-aware 要同进程线程共处一个 LLC，不管那个 LLC 里的 CPU 优先级。补丁定的规则很简单：当 asym packing 要把任务迁到比源 CPU 优先级更高的空闲核时，让 asym packing 赢，因为迁到更强的空闲核收益大于 cache 共处。常规均衡和 active balance 都按此处理。

另有两个小修复已在 tip：Kayra Cizmeci 的 `Ignore non-fair current in alb_break_llc()`（已进 `sched/urgent`，11/06），和 Zhan Xusheng 的 `Check reduced capacity before alb_break_llc()`（讨论中）。

## 把聚合粒度扩展到多个 LLC（RFC v3，17 补丁，讨论中）

Jianyong Wu 的 `[RFC PATCH v3 00/17] sched: Scale cache-aware aggregation at LLC granularity`。

**问题。** 现有实现以单个 LLC 为聚合目标，作用范围固定，无法随负载扩展。在 NUMA 节点和 LLC 很多的机器上，一个 LLC 可能只有 4 个核（作者测试的 Hygon 机器就是每 LLC 4 核、每节点 4 个 LLC），把线程聚合进单个 LLC 帮助有限；跨 LLC、跨节点聚合同样能降低 cache-to-cache 延迟，如果内存也跟着线程走，还能降低远端内存访问延迟、提高有效带宽。

**方案（采纳了 Peter Zijlstra 的建议：按 LLC 粒度伸缩）。** 关键问题是首选 LLC 饱和之后，下一个该接住多余负载的 LLC 是谁。

- **LLC 亲和序列。** 节点级沿用 NUMA 节点距离，距离相同时用**三角数**（`T(i) = i(i+1)/2 mod M`，M 取不小于 N 的最小 2 的幂，丢弃 ≥N 的偏移）打破平局；LLC 级只在“含首选 LLC 的节点”内用三角数排序，跨节点的 LLC 按 LLC ID 升序。目的是避免简单按 ID 排序时系统性偏向低 ID 的 LLC。比如 4 个 LLC，从 LLC0 出发的顺序是 `LLC0, LLC1, LLC3, LLC2`，从 LLC1 出发则是 `LLC1, LLC2, LLC0, LLC3`。序列只依赖 CPU 拓扑，在系统初始化时算好。
- **负载均衡两步。** 先选出能带来最大“亲和度增益”的源 group 或 rq（增益只用原始节点距离作权重，同节点权重为 1）；再用 `can_migrate_llcs()` 取代 `can_migrate_llc()` 判断跨 LLC 迁移是否允许（补丁 12）。补丁 13 允许 active balance 在聚合阈值被超出时不等 `nr_balance_failed` 就从满的 LLC 向外疏散，要求源比目的至少多两个 CPU 的负载，避免迁完又被迁回去；补丁 11 去掉了 `llc_balance` 对 `prefer_sibling` 的依赖。
- **调试可见性。** 补丁 17 在 `/proc/<pid>/sched` 里显示 mm 选中的 CPU、其 LLC 与 NUMA 节点，以及任务的首选 LLC。

**与 NUMA balancing 的关系是难点。** 本系列改变了“在线程组所有有效首选 NUMA 节点里选首选 LLC”的方式，让首选 LLC 更稳定、争用更少，并放宽了一些与首选 NUMA 节点绑定的迁移限制；v3 起不再限制 NUMA balancing 的任务迁移，也去掉了 v2 为此加的调节开关。作者坦承问题没完全解决：首选 NUMA 节点不在聚合范围内的任务仍会游走，因为它优先服从 NUMA balancing 而不是 cache-aware。

**v2→v3 的主要变化：** 丢弃人为构造的节点/LLC 距离矩阵，改用三角数；简化线程迁移决策；去掉用负载估算聚合范围的做法。

**测试结果（作者提供，需自行评估代表性）：**

- Hygon 2 路、每路 4 个 NUMA 节点、每节点 4 个 LLC、每 LLC 4 核 × 2 SMT；`aggr_tolerance=30`（负载超过约 100 个 CPU 时放弃聚合，交还通用均衡）。hackbench（线程、pipe）在多数配置下耗时下降，`fds=4/8, groups=1` 约下降 27–42%；`fds=48` 出现退化（-2.01%、-6.90%）。schbench p99 唤醒延迟在 11 个线程数下都下降，32 和 48 线程约下降 80%。作者也指出基线有时会把线程散到不同 socket 上，这是基线 p99 偏高的部分原因。
- Intel Xeon 8592+，每 socket 一个 LLC 由 2 个 sub-NUMA 节点共享，作者说调度器能按 sub-NUMA 粒度伸缩；hackbench 结果更零散（多数 ±数个百分点，个别配置约 26% 的改善、也有约 -8% 的退化）。

随后 Jianyong Wu 还发了 `Enable LLC aggregation above the first NUMA level`（v2，11/12）：`sched_balance_find_src_group()` 原本只在 `sds.prefer_sibling` 为真时才考虑 `group_llc_balance`，而 `sd_init()` 会在每个 `SD_NUMA` 域上清除该标志，所以在有多级 NUMA（例如每 socket 多个节点）的机器上，被 `llc_balance()` 标成 `group_llc_balance` 的 group 永远走不到 `force_balance`，超出第一级 NUMA 的任务也就拉不回首选 LLC。补丁把这个条件拆成两个独立判断，`prefer_sibling` 只保留给 `sibling_imbalance()` 使用，`llc_balance` 那个用 `sched_cache_enabled()` 把关。这是现有 cache-aware 在大机器上的真实缺陷，不依赖 RFC 合入。

## 降低 `task_cache_work()` 的开销（v11，讨论中）

Luo Gengkun 的 `[PATCH v11 1/2] sched/cache: Reduce the overhead of task_cache_work by only scan the visisted cpus`。

**问题。** `task_cache_work()` 为了找出首选 LLC 会扫描系统里所有 CPU，在多 NUMA 机器上开销很高，而其中大部分扫描没有意义（从没被访问过，或者很久以前才访问过的 CPU）。

**做法。** 引入 `visited_cpus` 记录访问过的 CPU，超过 `llc_epoch_affinity_timeout` 未再访问的就逐出；既然知道该扫哪些 CPU，就可以删掉 `get_scan_cpumasks()`。新增 `SC_VISIT` 调度特性开关（`/sys/kernel/debug/sched/features`）便于对比。

**数据（AMD 服务器，valkey-benchmark 400000 rps）：** 关闭 NUMA balancing 时，`sched_cache_scan` 每次扫描的 CPU 数从 384 降到 13–16；`perf top` 里 `task_cache_work` 的占比从 0.81% 降到 0.02%，p99 延迟相对“无 cache-aware”基线的劣化从 -25.68% 缩小到 -1.14%。开启 NUMA balancing 时 `task_cache_work` 占比从 0.13% 降到 0.03%，p99 劣化从 -3.89% 缩到 -1.14%。作者另跑了 hackbench，称不影响 cache-aware 的聚合效果。已经到了 v11，这条合入的概率较高。

## 第一份文档与注释表修正（Tim Chen，讨论中）

`[PATCH 0/2] sched/cahce: Document cache aware scheduling`（标题里 cache 拼错了，原文如此）：

1. 新增 `Documentation/scheduler/sched-cache.rst`（554 行），风格仿照 `sched-energy.rst`，讲调度器的运行原理，并列出 debugfs 可调参数及调优建议。已经写了 cache-aware 内核代码的人可以直接拿它当导读。
2. 修正 `can_migrate_llc()` 上方注释里的决策表。不匹配默认阈值的几个格子：40%→60% 朝首选 LLC 方向其实是被禁止的，50%→30% 离开首选 LLC 其实是允许的，60%→40% 离开也是允许的。因为判断是比值而不是差值，50% 比 40% 已经忙了 25%。表里改用 45%，顺便展示 `imb_pct` 迟滞。仅注释变更，标了 stable（v7.2.y、v7.3.y）。Chen Yu 是共同作者。
