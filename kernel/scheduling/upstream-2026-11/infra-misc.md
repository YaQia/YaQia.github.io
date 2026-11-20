# 调度基础设施杂项

这页收容调度基础设施里不便归入其它主题的进展：`need-resched` 定时等待原语（直接服务 haltpoll/polling idle）、mm_cid 与 membarrier 两个 Mathieu Desnoyers 的 LLM 辅助大系列、RT 节流机制的接口清理、RT_PUSH_IPI 风暴、NUMA 提升门控、nohz tick 与 PSI 的一批修复。

## `need-resched` 定时等待：`smp_cond_load_*_timeout()`（v17，16 补丁，讨论中）

Ankur Arora 的 `barrier: Add smp_cond_load_{relaxed,acquire}_timeout()`，从 v16 到 v17 一个月内又磨了一轮，是这个周期当之无愧的“铁杵磨成针”系列。

**背景。** 内核里到处用 `smp_cond_load_{relaxed,acquire}()` 自旋等待条件变量，靠架构原语避免打爆 cacheline（x86 是 `cpu_relax()` 慢化流水线，arm64 是 `__cmpwait()` 让 CPU 等待 cacheline 变化）。但这个原语**没有超时**。受影响最典型的是 idle 轮询路径：`cpuidle` 的 poll state 和虚拟化的 haltpoll 都在 `TIF_NEED_RESCHED` 上无界自旋——纯空转烧电，虚拟机里还烧着 host 的 pCPU。

**方案。**

- 通用层新增 `smp_cond_load_relaxed_timeout()` / `smp_cond_load_acquire_timeout()`，超时后退出循环。v17 的重要修正是给超时出口补齐完整的 ACQUIRE 语义（此前版本在“条件恰好与超时同时成立”的边界上有编译器相关的空隙）；bpf 的 rqspinlock 也用上了它。
- `sched: add need-resched timed wait interface`（`tif_need_resched_relaxed_wait()`）：调度器暴露“带着期限等 need-resched”的接口。
- arm64 用 WFET（WFE + timer）实现 `arm64_wfet_deadline()`，把“等 cacheline”和“等定时器”合成一条指令路径，并在延迟库把换算函数收进 `lib/delay.c`。

**效果数据。** AWS Graviton3/4/5（Neoverse V1/V2/V3）裸机上，MySQL/PostgreSQL/Cassandra/memcached 延迟敏感配置平均约 **+6%**；HyperV guest 上的 PostgreSQL pgbench 更夸张：低并发（2–32 客户端）TPS **+83% 到 +99%**，平均延迟从 ~52us 降到 ~28us（64 客户端时收益归零）。解释是轮询 idle 避免了深 idle state 进出和 hypervisor 切换的唤醒延迟。另外 haltpoll tracepoint 的小修（`guest_halt_poll_ns` 只在使用时定义）已由 Steven Rostedt 经 tracing 树收下。

17 个版本、KUnit 测试齐备（v17 还专门改了测试文件命名），各架构维护者也已卷入，合入在望。

## mm_cid 修复系列（00/17，讨论中）

Mathieu Desnoyers 的 `sched/mmcid: fixes for execve, mode switches and affinity`。mm_cid 是 rseq 给用户空间的“每 mm 紧凑并发 ID”，随线程数变化在几种分配模式间切换，路径本就很绕；这个系列修了六个 bug，全部标 stable：

1. **失败的 execve** 后任务回到用户空间拿着无效的 mm_cid（`0x80000000` 是内部标记值）；
2. **io_uring / vhost worker** 不再占用进程线程的 CID 配额；
3. 失败 execve 留下的**过期 per-CPU 状态**在 mm 首个用户加入时重置——否则 2~3 个 CPU 的机器直接锁死（此补丁的整理版源自 Thomas Gleixner）；
4. 正在运行的 joiner 在修复完成前保持非活跃，避免它拿着 `mm_cid.mutex` 在 `mm_get_cid()` 里自旋；
5. 首个用户加入时把它的 allowed CPUs 记入 mm，execve 期间被别的进程改的亲和性不再丢失；
6. `set_cpus_allowed_common()` 里旧 mm 的 use-after-free。

配套 17 个 selftest（补的正是现有测试没覆盖的：线程数上下穿模式阈值、exit/fork/失败 execve、别改亲和性）。和 deadline 系列一样声明由 LLM 助手写成、作者逐一复核。同作者的 membarrier 系列见下。

## membarrier 复审（RFC 00/16，讨论中）

Mathieu Desnoyers 对 `membarrier(2)` 系统调用做了一次全面复审——代码、selftest、历年修复，以及**每个架构的屏障与核序列化要求**——产出四个内核修复加一大坨测试和文档：

- **补丁 1**：调度器从“借用 mm 的内核线程或已退出任务”切换走时，runqueue 的 membarrier 状态没有更新，`MEMBARRIER_CMD_GLOBAL_EXPEDITED` 会漏掉一个已注册进程（用户态复现于 v7.4-rc2）。
- **补丁 2**：`MEMBARRIER_CMD_GET_REGISTRATIONS` 把未完成的注册也报出去（rseq 或 sync core 注册被误报成 private expedited 注册）。
- **补丁 8/9**：LoongArch 和 parisc 的 `switch_mm()` 缺一个完整内存屏障，expedited 命令在 `rq->curr` 的 store 之后需要它（读代码和架构手册发现，征求两个架构维护者意见中）。

测试侧的扩展很有诚意：让测试在 nohz_full 内核上跑（只缺 `MEMBARRIER_CMD_GLOBAL`）；新增 `membarrier_test_ipi`（验证每条 expedited 命令各打断了哪些 CPU）和 `membarrier_test_cmd`（fork/exec/CLONE_VM 下的参数与注册语义）；13 个 litmus 测试进 Linux 内核内存模型（herd7 验证），其中一个直接展示 LoongArch/parisc 问题；`membarrier_test_barrier` 用 kprobes 上的 BPF 程序逐线程统计 membarrier 依赖的内存屏障条数，还能数 sync-core 的序列化指令。文档补齐了 x86 FRED、arm64 FEAT_ExS 下的序列化说明。同属 LLM 辅助系列。如果你的用户空间重度使用 membarrier/rseq（数据库、运行时、GC 屏障），这版 RFC 值得精读一遍再自查。

## RT 节流机制清理与 sysfs 化（v3，8 补丁，讨论中）

Sebastian Andrzej Siewior 的 `sched: RT throttling cleanup and a bit of documentation`。Rasmus/Vincent 的 fair server 体系进来之后，老 RT 节流的语义已经悄悄变了，这系列把账重新算清：

- **语义澄清**：v6.12 起往 `sched_rt_runtime_us` 写 -1 **不再**禁用 RT 节流，机制被 fair_server 接管（经 debugfs 配置）。这件事只在一个犄角旮旯的文档里提过一句。
- **`CONFIG_RT_GROUP_SCHED` 标记为 broken**：Sebastian 原本想直接删掉它（“发现它没用”），Tejun 和 Peter 让他先标 broken——这也与前面 deadline 页里要用 HCBS 替换 RT_GROUP_SCHED 的方向互相印证。
- **DL 带宽解耦**：deadline 的全局资源控制从 `sched_rt_runtime_us` 里拆出来，搬到新接口 `/sys/kernel/sched/dl_period_us`、`/sys/kernel/sched/dl_runtime_us`（保持 _us 语义）。
- **fair_server 只在 CPU 活跃时可改配置**（与 Mathieu 的 dl_server debugfs 修复是同一问题的两种处理，作者互相致意了）。
- **每 rq 的 sysfs 接口**：`/sys/kernel/sched/cpuX/fair_server_{period,runtime}`，目标是最终取代 debugfs；rcutorture 也从 procfs 接口上挪开。

v2→v3 的主要修正是给 `sched_dl_try_boundary()` 加私有 mutex（Sashiko 指出 period/runtime 可能读在锁外、写在锁内导致写回旧值）。

相关的一条：Qais Yousef 的 RFC v5（部分）回退 `f4ebcbc0d7e0`（"sched/rt: Substract number of tasks of throttled queues from rq->nr_running"）。这个提交把 `rq->nr_running` 的调整挪到了带外做，绕过了正常的家务位置；RT 与 fair 的节流都不走 core 的完整 dequeue，`nr_running` 的带外管理正好把两者的不一致放大出来。回退后把 `{add,sub}_nr_running()` 放回 `inc/dec_rt_tasks()`，`rt_queued` 一并退场，净删 58 行。这是“节流语义”讨论的延伸，与 Sebastian 的清理互补。

## RT_PUSH_IPI 风暴（0/3，讨论中）

Mel Gorman（首补丁原作者 Qais Yousef）的 `Reduce spurious RT_PUSH_IPI storms`。

**背景。** RT_PUSH_IPI 机制：RT 负载分布变化时，给有可推任务的 CPU 发 IPI，让它自己在本地 rq 锁下推任务，减少锁竞争。问题是一个 CPU 标记着 rt_overloaded、但唯一的候选任务是 `migrate_disabled` 时——推不出去，却继续被反复 IPI。7.4-rc2 实测：一个 migrate-disabled 的 RT 任务坐在 CPU1 上，**每 5 秒 4 万多个** IPI，30 个样本方差极小，且确认这些 IPI 没有促成任何任务迁移。`dae5c0292080` 曾试图修但不完整（其 changelog 自己也承认）。

**修复**：migrate-disabled 的任务不再计入 pushable；资格检查收拢到一处；但 `RT_PUSH_IPI` 关闭时仍把它们当 pushable（保持无 IPI 模式的正确性）。修后两个 CPU 的假 IPI 都归零，真实迁移不受影响。

## NUMA balancing 的提升门控（v5，7 补丁，讨论中）

Gregory Price（Meta）的 `sched/numa: stop VMA scan filters from gating promotion`。

**背景。** NUMA balancing 的 hinting fault 一鱼两吃：既用于任务放置（placement），也用于内存分层提升（promotion，`kernel.numa_balancing=2/3` 时往快层搬）。问题是：为避免无谓的 socket 放置扫描而设计的几个 VMA 过滤器，**把 promotion 扫描也一并挡了**；一个近期的 shmem 修复之后，生产环境里 promotion 干脆整个失效。根因是全局模式只说明开了哪些机制，并不描述**这一次** PTE 扫描的意图是放置还是提升。

**修复**：把扫描意图（promotion-only walk）一路传进 PROT_NONE 注入路径，保留放置侧过滤、单独放行提升侧；共享 folio 允许提升（谓词改名 `folio_numab_promotable()`）；PID-inactive 的 VMA 也做提升扫描；legacy 文件放置过滤器覆盖的映射用 promotion-only 扫描。补丁 1–5 构成可回灌 stable 的修复集。

**生产数据**（AMD Zen5，768GB DRAM + 256GB CXL，两个约 430GB 的数据库、大块独立 shmem VMA）：

| 指标 | 修复前 | 修复后 |
|------|--------|--------|
| DRAM 带宽 | 150–200 GB/s | 250+ GB/s 持续 |
| CXL 带宽 | 40–45 GB/s（打满设备） | 5–10 GB/s |
| 请求延迟 | >5ms、长尾严重 | 0.8–2ms |

热内存终于能搬回本地节点。对 CXL 分层内存的用户，这是本月最实在的修复之一。

## polling idle 的 nohz tick（v3，5 补丁，讨论中）

Marco Crivellari 的 `Stop the idle tick on polling idle on nohz_full CPUs`（v1→v3 三周内迭代）。

**问题。** `nohz_full` CPU 若用 `idle=poll`，**每次从 idle 醒来都会多吃一个 tick**：`do_idle()` 在轮询前重启了 tick，`tick_nohz_idle_exit()` 只在 tick 已停时才重新评估，于是 tick 一直跑着、在用户态里响一次之后才被 `tick_nohz_irq_exit()` 停掉。没开 `idle=poll` 的 CPU 反而没这毛病（`a5183862e76f` 早就让它们带着停掉的 tick 出 idle）。

**修复**：回到用户空间时（context tracking 路径）直接重新评估并按需停掉 tick（常态下只是几个标志位检查的开销）；轮询 idle 不再算 dynticks idle（`TS_FLAG_INIDLE` 的归属收正，kick 和已停 tick 的到期在 IRQ exit 处理，轮询期间 tick 尽量保持停止）；`tick_nohz_idle_restart_tick()` 再无用户，删除；配套的 `got_idle_tick` 复位和文档更新。想法源自 Marcelo Tosatti，按 Frederic Weisbecker 的 review 收窄到 nohz_full。顺带一提：Peng Wang 的 RFC“per-CPU 控制非 idle tick 抑制”也在同方向探索。

## PSI 一批修复

PSI（压力失速信息）这月攒了一堆小修，挑重点：

- **已并入 v7.4**：trigger 销毁不再等 RCU（Shakeel Butt）；优先级注册失败时不再改 wait-entry（Hui Su）。
- **RT 触发通知丢失**（Hui Su，0/2，10/19）：RT 级 trigger 注册时的压力核算会被清掉、pending 的 RT poll 事件在轮询过期后不送达——两个补丁分别保住。
- **延迟出队下的 PSI 状态**（Shubhang Kaushik，v2，11/11）：delayed dequeue 路径上 PSI 标志处理不当会把本该睡眠持久的失速状态算错。这与 proxy-exec 的工作遥相呼应——John Stultz 的 v33 里也有一个 PSI flag 保全补丁（见 deadline 页）。
- **权限检查**（Hungyu Lin，11/06）：PSI trigger 的 `CAP_SYS_RESOURCE` 检查改在初始用户命名空间做，防容器内提权滥用。
- 另有 Christian Brauner 的 procfs 大系列（51+30 补丁的 RFC/RESEND）在把 pressure 文件的 seq_file、waitqueue 所有权移交给 procfs——影响 PSI 接口的长期形态，跟进 v7.5。

## 杂项

- **preempt-count 簿记与 raw 更新分离**（Karl Mehltretter，RFC v2 00/13，10/27）：entry 子系统的“pre-counted hardirq lifecycle”重构——arm64 把 raw preempt count 更新强制内联并标注 `__always_inline`/notrace，调度侧把 `preempt_count` 的簿记从 raw 更新里拆开，hardirq 生命周期改用预计数。深水区重构，短期内影响不大，但会改变 preempt 计数与 tracing/notrace 的契约。
- **`inline` 不再隐含 notrace**（Song Liu，v2 00/16，讨论中）：`45959ee7aa64` 之后所有 `inline` 函数连带 notrace，编译器没内联时就变成不可 ftrace/不可 BPF fentry/不可 livepatch 的盲区。系列把 notrace 移到 `__always_inline`，并给确实需要的低层助手（含 `preempt_count()`、`current` 背后的访问器、tracing 自身依赖的助手）显式标注。前 15 个补丁不改变生成代码（x86_64 .text 逐字节相同）。
- **离开 fair 类时清掉节流状态**（Daehyeon Ko）：小修复，已进 tip `sched/urgent`（11/06）。
- **uclamp 竞态**（Qais Yousef，v4，2 补丁）：uclamp 静态键切换路径的竞态导致 `uclamp_rq` 不均衡，连带把 `UCLAMP_FLAG_IDLE` 的 open code 换成封装。修 uclamp 边界的值得一看。
- **sched stats**（albin_yang，10/25）：proxy 迁移的阻塞 donor 让 `run_delay` 多计——proxy execution 落地后的统计语义问题，还会越来越多。
