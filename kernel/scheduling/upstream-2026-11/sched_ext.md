# sched_ext：proxy 钩子、子调度器与 NUMA 平衡

sched_ext 在 v7.4 的改动可以分三块看：**让 proxy execution 能和 BPF 调度器共存**（已合入）、**把子调度器（sub-scheduler）功能补完整**（已合入，占了这次 fix 拉取的大头）、**让 BPF 调度器拿到 NUMA 偏好信息**（在 for-7.5 排队）。

## proxy execution 与 sched_ext 共存（已并入 v7.4）

背景：proxy execution 是把“被 mutex 阻塞的任务”留在运行队列上、让它把自己的调度上下文（优先级、带宽）捐给锁持有者去跑的机制，用来做内核态的优先级继承。过去它和 sched_ext 互斥，因为一个被阻塞的任务滞留在 rq 上、却又归 BPF 调度器管，会打破 sched_ext 对任务状态机的一系列假设。

v7.4 让两者可以同时打开。关键改动（Andrea Righi）：

- `sched: Allow enabling proxy exec with sched_ext` 拆掉了互斥限制。
- BPF 调度器可以选择接收这些“捐献者（donor）”任务，自己决定把它们放哪。新增 `ops.running/stopping()` 的配对修正，保证 donor 在 proxy 迁移时上下文正确。
- `Track proxy execution for NOHZ_FULL`：donor 滞留在 rq 上会影响 NOHZ_full 的“单任务”判断，需要单独跟踪。
- `Delegate proxy donor admission to BPF schedulers`：donor 的准入（admission）交给 BPF 调度器决定，而不是核心代码硬塞。
- 示例调度器 `scx_qmap` 加了 proxy execution 支持，可作为移植参考。

对你写单调度器的影响：如果你的调度器声明接收 proxy donor，`ops.enqueue()` 会看到处于“已排队 + 阻塞”状态的任务，这是以前 `scx_prepare_setscheduler()` 承诺绝不会发生的情况。相关的契约在 v7.4-rc2 的 fix 里被进一步收紧（见下文 `rt_mutex_setprio` 一节）。

## 惰性抢占（lazy preemption）（已并入 v7.4）

BPF 调度器现在可以像 fair 类一样做惰性抢占：`scx_bpf_task_set_lazy_resched()` 请求的抢占/kick 会推迟到下一次返回用户态或 tick 时才真正切换，而不是立刻发 IPI。配套有 selftest。这让延迟不敏感的重排队操作不再引入即时的核间中断开销。

（注：pahole 1.32 会把 `scx_bpf_task_set_lazy_resched()` 从 BTF 里丢掉，Tejun 加了一个 workaround，构建新内核时留意。）

## 子调度器（sub-scheduler）补完（已并入 v7.4 + fix 拉取）

背景：子调度器是让多个 BPF 调度器嵌套，由一个父调度器把 CPU 分发给子调度器的机制。它被反复重构过多个周期，到 v7.4 终于“功能完整”。把真实调度器移植上去的过程不断暴露边角情况，这也是 `for-7.4-fixes` 异常大的原因。

这次补齐的核心语义：**一旦 CPU 可以被共享、又能被收回，内核就必须保证任务在“其调度器跑不了它”或“调度器正在失败”时仍然能继续前进。** 相关改动：

- 父调度器现在能知道每个它委派出去的 CPU 上**具体在跑哪个子调度器**（`ops.sub_cid_sched_updated()`），以及某个 cap 变更**何时生效**（`ops.sub_child_ecaps_updated()`）。
- 子调度器 detach 时先失去它的 caps，父调度器再恢复这些 CPU，顺序被理顺。
- CID 拓扑现在包含 cluster 一层（`cid: Represent clusters explicitly`）。
- bypass（紧急绕过）路径下的一大批修复：被 reenqueue 上限卡住的任务、在缺少某类 cap 的 CPU 上空转的任务、宿主缺 `SCX_CAP_BASE` 时被遗落的任务等。这些都属于“保证任务始终前进”这条主线。
- 失速看门狗（stall watchdog）之前会在 bypass 下冤枉错误的调度器，甚至拖垮整个 sched_ext，现在改成只追究真正在跑该任务的调度器、按它的超时判断。

新增/变更的 kfunc：

- `scx_bpf_dsq_reenq_task()`：在遍历一个 DSQ 的过程中把单个任务重新入队。
- `scx_bpf_cgroup_nr_cpus()`：报告一个 cgroup 的 CPU 数。
- CID 的 NUMA 节点查询 kfunc。

热路径优化（Usama Arif 等）：DSQ 和任务查找内联比较 key、远程任务迁移不再重复抓两次 DSQ 锁、没有子调度器时相关钩子零开销（`scx_has_subs()` 内联判断）、内建 DSQ 不再分配随 CPU 数平方增长的 per-CPU 状态。

硬化：可从 tracing 程序调用的 kfunc 现在能抗 NMI/IRQ 嵌套，之前在嵌套下可能硬锁 CPU 或选错 idle CPU。

## 两个值得单独拎出来的 entry-path 契约修复（v7.4-rc2 fixes）

这两个虽然是 bugfix，但点出了 proxy execution 和 sched_ext 交界处的两条隐含契约（Tao Cui，`sched_ext: Fix entry-path contract breaks in core.c`）：

1. `wake_up_new_task()` 在 fork 路径上会咨询 `select_task_rq()`，但激活新任务时没带 `ENQUEUE_RQ_SELECTED`，于是 `ops.enqueue()` 在 fork 路径上永远看不到 `SCX_ENQ_CPU_SELECTED`，`SCX_EV_SELECT_CPU_FALLBACK` 也从不计 fork 路径的回退。修复是在首次入队时补上这个 flag，和唤醒路径对齐。
2. `rt_mutex_setprio()` 是唯一一条不调用 `sched_proxy_block_task()` 就进入 sched_ext 的入口。一个被 rt waiter PI-boost、又阻塞在第二把内核 mutex 上的 ext 任务，deboost 时会带着“已排队 + 阻塞”状态被路由回 ext——而这正是契约承诺不会发生的状态。修复是在 deboost 把 donor 送回 ext 之前先 block 它。

如果你在写涉及 PI/mutex 的调度器，这两点决定了你在 `ops.enqueue()` 里能假设什么。

## NUMA 平衡支持（for-7.5 排队中，v2）

背景：跑在 BPF 调度器下的任务对 NUMA 平衡是“隐形”的——它们的地址空间从不被扫描 hinting fault，因此不记录 NUMA fault 统计、也拿不到 preferred node。于是 BPF 调度器在决定“把任务放哪”时，完全不知道这个任务的内存在哪个节点。

Andrea Righi 的这个系列（v2，6 个补丁，目标 `for-7.5`）让 BPF 调度器可以选择性加入 NUMA hinting-fault 扫描：

- 新回调 `ops.set_numa_node()`：调度器实现它即表示要开启扫描。扫描由 sched_ext tick 驱动，hinting fault 的处理和 fair 任务一样——内核维护 NUMA fault 统计和 preferred node，并把任务访问的内存迁向它运行的节点。**但任务本身不被内核迁移，放置权仍留给 BPF 调度器。**
- `ops.set_numa_node()` 报告 preferred node 的变化：`ops.enable()` 后报一次（类比 `ops.set_weight()` 之于权重），此后每次偏好改变都报。变更在 `sched_setnuma()` 中、持 rq 锁、任务重新入队之前报出，这样调度器能在 `ops.enqueue()` 看到任务之前更新自己的放置状态。
- `scx_bpf_task_numa_nid()`：让调度器从任意回调里读当前偏好。对未实现 `ops.set_numa_node()` 的调度器的任务返回 `NUMA_NO_NODE`。
- 为不把 class 相关代码塞进 sched core，`sched_setnuma()` 通过新的可选 `sched_class->numa_node_changed()` 通知任务所属的 class，目前只有 sched_ext 实现。

设计者说明了这是“两个控制”中的第一个：**把任务搬到它内存所在的节点**（本系列提供）；第二个是**把任务用的内存搬到它运行的节点**，将作为后续系列、以一个 kfunc 的形式提供。这个话题在 LPC 2026 的 sched_ext microconference 上讨论过，背景是把加速器（accelerator）负载放到靠近其设备和内存的地方。

## 示例调度器健壮性修复（讨论中）

Tao Cui 的 `tools/sched_ext: robustness fixes from cold review`（9 个补丁）修了 `scx_pair`、`scx_flatcg`、`scx_qmap`、`scx_userland` 的一批健壮性问题，比如 `scx_userland` 把批量大小限制在 dispatch buffer 内（否则约 13ms 后溢出）、拒绝 batch size 0（否则 livelock 直到看门狗触发）。这些是写示例调度器时容易踩的坑，值得翻一眼。
