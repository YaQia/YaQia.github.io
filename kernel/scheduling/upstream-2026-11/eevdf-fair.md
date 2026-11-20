# EEVDF 与公平调度

这一个月公平调度最大的动作是 Vincent Guittot 把酝酿多轮的 **push-task 机制**推到了 v3，围绕它还有一串 EEVDF lag 处理、CPU 选择、EAS 的配套改动。另有几个已并入 v7.4 的小而关键的修复，以及若干正在讨论的健壮性补丁。

## 短 slice 任务的唤醒延迟优化（已并入 v7.4）

`sched/core` 拉取里 Vincent 的“Improve the scheduling latency of short slice tasks”已经进入 v7.4。这是 push-task 大系列的一个前置成果：之前短 slice（低延迟）任务在唤醒时和普通 slice 任务一视同仁地找 CPU，容易落到一个已经有同样或更短 slice 任务在跑的 CPU 上，排在后面等。现在选 CPU 时会参考 slice，尽量把短 slice 任务放到能更早跑上的 CPU。

## push-task 机制：让 fair 主动“推”任务（v3，讨论中）

这是本月公平调度的主线，Vincent Guittot 的 `[PATCH v3 00/20]`（从 v2 的 18 个补丁扩到 20 个）。

**背景与动机。** EAS（能耗感知调度）本质上是“唤醒驱动”的：只有在任务唤醒（wakeup / exec / fork）时，`select_task_rq_fair()` 才会被调用，顺着 EAS 和 fast-path 去挑一个节能且合适的 CPU。问题是，有些任务长时间不唤醒，或者唤醒频率太低，一旦放错了位置就会一直待在次优 CPU 上，没有机会被重新评估。常规负载均衡能兜底，但它是周期性、以组为单位拉任务，粒度粗、反应慢。

push-task 补上的是**“从源头主动推”**这条路径：当一个 runnable 任务被重新放回 enqueued 列表时（而不是等它下次唤醒），检查它是不是该被推到更好的 CPU 上。系列把这件事拆成“机制”和“用户”两层：

- **机制层**（`sched/fair: Add push task mechanism for fair` 等）：给 fair 增加一套 push 回调，复用类似 RT/DL 的 pushable 列表思路。任务被放回 runnable 列表时触发检查；任务若“独占 CPU”永远不会被放回列表，这种情况改用 tick 来跑检查（`Add force push task mechanism`、`Add rq flag to tick parameters`、把 `sched_balance_newidle()` 的解锁下沉以便在 tick 里强制迁移）。
- **让 `select_task_rq_fair()` 支持新场景**（`Prepare select_task_rq_fair() to be called for new cases`、`Support not wakeup case in select_idle_sibling`）：以前这个函数只在 wakeup/exec/fork 三种场景下被调。push 要在“任务已经 enqueued”的情况下调它选 rq，既不是唤醒也不是 fork/exec，于是把这条新路径接进 EAS 和 fast-path，同时保证不打扰原有三种场景。

**第一个使用者是 preempt-short（短 slice）**：

- `Add per cpu cached min_slice` + `Add min slice check when selecting CPU`（06/20）：缓存每个 CPU 上（含 current）的最小 slice，在 `select_task_rq_fair()` 找不到完全空闲 CPU 时增加“最后一级”比较——比较 min slice，挑一个能让任务更早跑的 CPU，而不是落到一个已经有同样/更短 slice 任务的 CPU 上。
- `Try to push short slice task on a better CPU`、`Push short slice task that are not picked`：即使任务被设成 next buddy，也可能因为各种事件没被选中（典型情况是多个短 slice 任务在唤醒时被堆到同一个 CPU）。把没选中的任务放进 pushable 列表，给它一次被推到更好 CPU 的机会；一旦被选中就从列表里摘掉。
- `Fix tasks stacking on same idle CPU`（20/20）：同时唤醒的任务很容易堆在同一个 idle CPU 上，但只有一个能立刻跑。用 push 回调给“没抢到”的任务再找 CPU，同时调用更高调度类的 `wakeup_preempt`，让 fair 对“多个任务堆在一个 CPU”的局面有准备。

**EAS 侧的改造**（后半截补丁）：

- `Rework feec() to use cost instead of spare capacity`（17/20）：`feec()`（find energy efficient CPU）原来在一个 performance domain 里找剩余容量最大的 CPU，默认它最省电（OPP 抬升最小）。但很多时候几个 CPU 会落到同一个 OPP、能耗成本相同，只按剩余容量挑会误滤掉同样高效的候选。改成先在 PD 内找成本最低，再在成本相同的 CPU 之间挑最能让任务快跑的那个；PD 之间仍以 OPP 成本为准。
- `Take into account slice in EAS`（19/20）：成本相同时，把 slice 也纳入考量，优先选任务能更早跑上的 CPU。

**EEVDF lag 处理**（系列前几个补丁，和 push 相对独立但同批提交）：

- `Decay positive lag of sleeping entities`（01/20）：对称于 delayed-dequeue 让负 lag 在睡眠期间衰减，正 lag 也不该永远保留。用睡眠时长和权重在唤醒时衰减正 lag（在 prev rq 上入队、持锁拿到 `rq_clock_task()` 时做）。
- `Reset lag at wakeup when prev CPU has been idle`（02/20）、`when migrating and prev has been idle`（03/20）、`Reset lag when waking up on idle cpu`（04/20）：如果任务睡眠期间它的 prev CPU 曾进入 idle，就认为它已经“得到了足够运行时间”，lag 可以像负 lag 那样清零。跟踪 CPU 的 idle 阶段、在任务睡下时记录，唤醒时判断本地 CPU 是否在它睡眠期间 idle 过。

这个系列还在 review 中，是公平调度接下来一两个周期的重点，值得盯住。

## cgroup::idle 抢占修复（讨论中 → 已有 Fixes 标记）

**背景。** `SCHED_IDLE` 既可以标在任务上，也可以通过 cgroup 的 `cpu.idle` 标在整个任务组上，表示“这棵子树不要紧，有别的可跑就别跑它”。自从 `85570f10a4c6`（"sched/eevdf: Move to a single runqueue"）把运行队列拍平成单队列后，判断“当前 cgroup 是否在其祖先路径上某处被标了 idle”就不再直观——拍平后所有 runnable 任务进同一个 cfs_rq，但 idle 语义是沿层级继承的。结果是 cgroup::idle 的抢占被漏掉了。

Vincent 先发了 `sched/eevdf: Fix sched idle task group preemption`（v2，10/19）：即便是 flat hierarchy，也要重新沿层级走一遍、用 `find_matching_se()` 找到两个实体的共同祖先来做抢占判断。

Peter Zijlstra 随后用“新脑子 + LLM 生成的测试用例”重做了一版 `[PATCH 0/3] sched/fair: Fix cgroup::idle preemption`（11/05），核心思路是 `Make cfs_rq::idle the sum of ancestor tg::idle`：不再让 `cfs_rq::idle` 只是 `tg::idle` 的拷贝，而是让它等于所有祖先 `tg::idle` 的“和”，这样“当前 cgroup 的祖先路径上是否有人被标 idle”一眼就能看出来，`se_is_idle()` 的语义相应改变。Vincent 的 patch 被放在系列最后一个，改用这个新 idle 状态做优化。两者都带 `Fixes: 85570f10a4c6`。

## 突发唤醒任务的分散（v4，讨论中）

Li kunyu 的 `[PATCH v4] sched/fair: Distribute burst-woken tasks when rq depth reaches 3x average`（Peter 建议的方向）。

**问题。** 一个任务在短时间内突发唤醒大量任务时，这些任务会堆到单个 CPU 上，无论系统有没有 idle CPU、有没有开 NO_HZ。做法是在顶层域的周期负载均衡里计算并缓存“3 倍平均 runqueue 深度”阈值（最低 3 个任务，存到 `root_domain`，变化时才更新）；`select_task_rq_fair()` 里若目标 rq 深度达到这个阈值，就回退到 `cpumask_any_and_distribute()` 配合 `housekeeping_cpumask(HK_TYPE_DOMAIN)`，把唤醒的任务在允许的非隔离 CPU 间轮转，同时重置周期负载均衡和调度域的间隔，让常规均衡尽快把分布抹平。

## 延迟任务的瞬时双重计数修复（讨论中）

K Prateek Nayak 的 `sched/fair: Avoid transient double accounting for delayed tasks`，同样带 `Fixes: 85570f10a4c6`。

延迟任务的 `h_nr_runnable` 由 `set_delayed()` 调整；用 `DEQUEUE_DELAYED` 出队时，`dequeue_hierarchy()` 会再减一次 `cfs_rq->h_nr_runnable`，然后在 `__dequeue_task()` 里经 `clear_delayed()` 立刻修正。在 `dequeue_hierarchy()` 的 `h_nr_runnable` 核算后加 `WARN_ON_ONCE(((int)cfs_rq->h_nr_runnable) < 0)` 能在早期启动阶段稳定触发。虽然这个错值是瞬时的，但它会被缓存进 `se->runnable_weight`，在下一次 enqueue/dequeue 修正前一直影响 PELT 计算。补丁在 `__dequeue_task()` 里避免错误核算，并对“延迟任务只带 `ENQUEUE_WAKEUP` 到达 enqueue”的非法 flag 组合告警。

## PELT 零值快进（讨论中）

`sched/pelt: Skip redundant decay and divisions when sched_avg is zero`。此前 `d040e0734fb3` 已经在 load 为 0 时跳过 `__accumulate_pelt_segments()`（因为 `___update_load_sum()` 带 load==0 被调用的频率是非零的 45 倍）。但当 load 为 0 且 `load_sum`/`runnable_sum`/`util_sum`/`load_avg` 都已衰减到 0 时，`accumulate_sum()` 每跨一个 1024us PELT 周期边界，仍会白跑三次 `decay_load(0, periods)` 并返回 `periods > 0`，于是 `___update_load_avg()` 做三次“0 / divider”的除法，还向 `cpufreq_update_util()` 这类 caller 报告一次假的衰减。另外 `update_irq_load_avg(rq, 0)` 在 `running == 0` 时也会多调一次 `___update_load_sum()`。补丁在 `sched_avg` 已经归零时跳过这些冗余计算。

## SIS_UTIL 回退（讨论中）

`Revert "sched/fair: Add SIS_UTIL support to select_idle_capacity()"`（回退 `61ea17a63719`）。

那个提交把 SIS_UTIL 的扫描预算也套到了 `select_idle_capacity()` 上。`select_idle_sibling()` 的早期检查只看 target/prev/recent 几个特定候选，都不中就走非对称路径调 `select_idle_capacity()` 扫整个允许域。开了 SIS_UTIL 后，零扫描预算会让它在真正搜索前就返回 -1，caller 于是退回选中的 target，哪怕域里有空闲且合适的 CPU 没被看过。预算由聚合 CFS 利用率推出，而高聚合利用率完全可能和“有空闲 CPU”共存。在一台 72 核的 NVIDIA Grace arm64 服务器上，单 LLC 内 1013–1024 的微小容量差就激活了非对称选择，延迟敏感、唤醒密集的生产负载 p50 延迟因此明显劣化。回退掉。

## EEVDF 空挑回退 RFC（讨论中）

`[RFC] sched/eevdf: fall back to the leftmost entity when nobody is eligible`（Aleksei Fedorov）。当有多个实体 runnable、但 `entity_eligible()` 对所有实体（含 curr）都返回 false 时，`pick_eevdf()` 返回 NULL，caller 随后解引用空指针 oops。报告者在 Ubuntu linux-aws 6.8 的 Xen HVM guest 上多次复现，而已有的 `1560d1f6eb6b`（防 vlag 越界）并不能挡住这个 NULL。补丁的做法是取最左实体让 `schedule()` 能跑完，并用 `WARN_ON_ONCE` 记录这次替换——它不修复“为何所有实体都不 eligible”的底层 eligibility 状态，只保证机器不倒。属于防御性兜底，值得关注后续讨论是否会追到根因。

## 零碎优化

- **不改变默认 slice 时跳过参数更新路径**（Chengfeng Lin，已入 v7.4 相关树）：fair 任务用默认 slice 时，`_sched_setscheduler()` 的 `attr.sched_runtime` 为 0，而 `se.slice` 存着真实时长，直接比较会让一次没改任何东西的 `sched_setparam()` 也走参数更新慢路径。改为先比较 default/custom 模式再比时长。i7-12700KF 上重复 `sched_setparam(0, prio=0)` 从 616.51ns/次 降到 162.39ns/次（-73.66%）。
- **重写 `sched-eevdf.rst` 文档**（Kayra Cizmeci，讨论中）：现有文档几乎没解释 EEVDF 的概念，这版补上 V（virtual time）、vruntime、deadline、eligibility、lag 等概念，+155/-39 行。对想给团队做 EEVDF 培训的人是现成素材。
