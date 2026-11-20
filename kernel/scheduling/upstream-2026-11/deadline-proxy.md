# SCHED_DEADLINE、带宽核算与 proxy execution

这一个月 deadline 这条线异常热闹，主线是 Mathieu Desnoyers 那套把 deadline 带宽核算从头捋一遍的大系列（v6→v7，一路修到 36 个 bug），外加它顺手扒出来的几个上游旧 bug。与之纠缠的是 proxy execution：John Stultz 的 v33 继续往前拱，Mathieu 又发了一套专门修 proxy 的 RFC。此外还有重写 RT_GROUP_SCHED 的 HCBS RFC v7，以及 core scheduling 下 DL server 饿死、SMT 兄弟互刷 IPI 等几组修复。

## deadline 带宽核算修复系列（v7，40 补丁，讨论中）

Mathieu Desnoyers 的 `[PATCH v7 00/40] sched/deadline: bandwidth accounting fixes and selftests`。这是本月 deadline 的头号大件：从 v2 的 21 个补丁、v5 的 29 个、v6 的 37 个（修 33 个 bug），走到 v7 的 40 个补丁、修 **36 个 bug**。Ingo 要求“修复在前”，所以补丁 1–36 全是 fix、都标了 stable，后面才是 sched_debug 展示和 selftests。

**为什么会有这么多 bug。** SCHED_DEADLINE 的带宽核算（admission control）维护两组量：每个 root domain 的 `total_bw`（已承诺带宽总和）和每个 runqueue 的 `this_bw`。任务进出 deadline 类、改参数、迁移、被 PI 提升、cpuset attach、root domain 重建、CPU 上下线，每一条路径都要正确地加减这两个量。一旦哪条路径算错，root domain 要么超额接纳 deadline 任务（破坏可调度性保证），要么拒绝所有任务。这套核算历年来在边角路径上欠了很多账，这个系列是一次集中清算。

**最严重的几个。** 三个会直接把内核打挂（patch 4、8、26）；patch 9 是 rtmutex 链遍历里的 use-after-free；patch 12 会让一个被节流的任务永远不再运行；patch 6 会让 `cpuset_mutex` 一直锁着（sysrq-n 触发）。其余大多是 `total_bw` / `this_bw` 算错。

**几条值得单独点名的修复：**

- **KEEP_PARAMS 的语义**（patch 1、2）：`SCHED_FLAG_KEEP_PARAMS` 的请求若会改变 policy 或 class，应当拒绝；对它要保留的参数跳过 admission。
- **PI 提升路径**（patch 3、8、11、32、33）：被 deadline waiter 提升的任务允许改 policy；不要用“已清空的参数”去 refill 一个 boost（否则 owner 的 CPU 死锁）；在类内 deboost 时，如果 boost 曾用 donor 的 runtime 补过，要开新周期；把提升给出的带宽计入 `this_bw`；在 rt_mutex 上等待时进入 deadline 类的任务要给它一个 deadline。
- **节流任务复活**（patch 7、12）：被切出又切回的节流任务要补充（replenish）才能再跑；一个在睡眠中被 waiter 提升的节流任务同样要补充。
- **root domain 记账重做**（patch 18、19、21–30，一组）：patch 18 记录“哪个 root domain 在为某任务的带宽记账”；19 和 21–27 修由此暴露出来的 rebuild / attach / migration 路径；28–30 保证只要那个记账 root domain 还有 CPU 给它，任务就留在那里。这组是整个系列的核心骨架。
- **Andrea Parri 的 patch 20**（原样搬入，Sebastian review 过）：在 runqueue 锁下检查 deadline 任务的亲和性，使 `sched_setaffinity()` 和 `sched_setattr()` 不能同时成功。

Juri Lelli 之前有四个修复被 Ingo 从 `sched/urgent` 里撤了下来（第一个合入后出问题），现在作为 patch 18/13/1/14 折叠进本系列重新编号。patch 37 在 sched_debug 里展示每个 runqueue 的 deadline 带宽；patch 38–40 往 `tools/testing/selftests/sched/deadline` 加了 112 个用例。

**作者的坦诚声明值得注意：** 这套补丁及其 commit message 由 LLM 编码助手在作者指导和 review 下写成。作者明确说“一个不再失败的 reproducer 只能证明症状消失，不能证明这个修复就是你会写的那个”，并逐条列出了已知未覆盖的边角（patch 9 两个链遍历在三锁以上会重叠、patch 15 离类任务的带宽保留到 0-lag、patch 27/28 仍可能把带宽搬到没做 room 检查的 root domain 等）。鉴于改动面之大、全是 stable 候选，作者反复请求仔细 review。

## 顺手扒出的两个上游旧 bug（2 补丁，讨论中）

v7 的“留给单独补丁”清单里的两个，Mathieu 随后发成 `[PATCH 0/2]`：

1. **0-lag 时间溢出**：`task_non_contending()` 里算 0-lag 时间，周期到几秒量级就会溢出，带宽因此晚几秒才释放。改用 128 位计算。带 reproducer，tip 上 6/6 失败、打上后 6/6 通过，标 stable。
2. **extra_bw 只摊到活跃 CPU**：`dl_task_offline_migration()` 和 `dl_add_task_root_domain()` 把 extra_bw 摊到整个 span（含离线 CPU），导致 `SCHED_FLAG_RECLAIM` 任务多回收一点，直到下次 rebuild。改为只摊到活跃 CPU。patch 2 依赖 v7 的 patch 4（让 `__dl_add()`/`__dl_sub()` 接受 0 个 CPU），所以基于 v7。

这两个同样是 Sashiko（自动化 AI review 工具）在 v6 review 里读出来的，作者同样声明由 LLM 助手写成、extra_bw 那个没有 reproducer（用户态不可见，靠读代码发现）。

## core scheduling 下的 DL server 饿死与 IPI 风暴（讨论中）

Fernand Sieber 发了两组独立但相关的 core-sched 修复。

**DL server 饿死**（`[PATCH 0/5] sched: Fix DL server starvation under core scheduling`）：开 core scheduling 后，DL server 为之预留 CPU 时间的那个类几乎什么都拿不到。默认 fair server（50ms/1s）下，一个 CFS 自旋任务和一个带 cookie 的 SCHED_FIFO 任务分别跑在一对 SMT 兄弟上，CFS 实测拿到 0.000% 而不是预留的 5%；ext server 对 sched_ext 任务同样饿死。两个独立机制都有份：core-wide 选择把 `rq->dl_server` 的交接搞错了——陈旧的链接被传给 idle（强制兄弟 idle 还触发 forced-idle WARN）、快路径上丢了兄弟的链接、排序发生在 `p->dl_server` 设置之前（patch 1–3，`Fixes: bd9bbc96e835`）；另外被延迟的 server 被记了它所在 rq 的 forced-idle 时间，runtime 在仍被节流时就耗尽，`replenish_dl_new_period()` 把激活推后整整一个周期，下一段 forced idle 再推一次（patch 4，`Fixes: a110a81c52a9`）。单修一个都只能把份额留在 ~0%。patch 5 加了 `cs_dl_server_test` 自测，tip 上 10/10 失败在 0.000%，全系列打上后 31/31 通过在 3.99–5.19%。

**SMT 兄弟互刷 IPI**（`[PATCH 0/2] sched/fair: Stop core-scheduled siblings trading rescheduling IPIs`）：自 v6.17 起，core scheduling 下两个 SMT 兄弟会互相狂发 reschedule IPI，每 CPU 每秒上千个，而各自一直在跑同一个任务。根因是 `0b9ca2dcabc3`（"Always trigger resched at the end of a protected period"）让 `update_curr()` 在保护期到期后请求 resched，而 `set_protect_slice()` 只在新 pick（`SNT_PICK`）时重置保护期；一个被再次选中的实体保持过期的 vprot，之后每次 `update_curr()` 都再请求一次。core scheduling 下这个请求是跨核的：一次 core-wide pick 会在每个兄弟的 rq 上调 `pick_task()`（从而 `update_curr()`），于是互相 IPI。patch 1 在 repick 时重置保护；patch 2 加自测，不打 patch 1 时 6/7 失败（808–2123 IPI/CPU/s），打上后 7/7 通过（224–271）。

**陈旧 core_pick 修复**：patch 1（`Clear stale rq->dl_server when core-sched replaces a pick`）也属于上面 DL server 那组，清掉 core-sched 替换 pick 时残留的 `rq->dl_server`。

## Peter 的 core-sched 修复与均衡（v2，12 补丁，讨论中）

Peter Zijlstra 的 `[PATCH v2 00/12] sched: core-sched fixes and balancing`。相比 v1 的主要差别是重做 `rq_clock`（TJ 指出 v1 做错了）。这一版围绕 `pick_next_task()` 自递归修复（patch 1）、`update_rq_clock()` 分解与时间更新简化（patch 3–7）、允许 core-sched 走 newidle（patch 8）、RT 均衡路径提前退出（patch 9）、`pick_task_fair()`/newidle 重排（patch 10）、把 `sched_balance_newidle()` 的解锁下沉（patch 11，和前面 fair push-task 用的是同一处改动），最后 patch 12 移除 `sched_class::balance()`。作者自己说有些 patch 看着“有点漫无目的”，是因为最初的修法没走通但保留了做出来更简单的那部分地基。

## proxy execution：sleeping owner handling（v33，讨论中）

John Stultz 的 `[PATCH v33]` 继续把 proxy execution 这块大工程切成小块往上推。整体路线图：预备补丁 → 单 rq proxying → 简单 donor 迁移 → 优化 donor 迁移 →（当前）**sleeping owner handling** → K Prateek 的 core-sched 修复 → Connor 的链级均衡 → Suleiman 的 proxy rwsem / futex → ……

本轮主角是 sleeping owner handling：一个任务阻塞在某个 mutex 上、而持锁 owner 在睡觉时怎么办。此刻没法 boost 睡着的 owner，于是把 waiter 从 rq 上摘下、挂到 owner 的一个列表上；owner 醒来时在同一个 rq 上激活这些 waiter，让它们去 boost owner。听起来简单，实现却很复杂：会形成 waiter 树，树中间的任务也可能被唤醒，唤醒沿树向下级联时要正确处理。v32/v33 这几轮里修了一堆相关问题——PSI flag 处理、`sched_tick_remote()` 用 `rq->donor`、NULL owner 优化、return-migration 时置 `TASK_RUNNING`、链深度限制防死锁、用 Brent 算法更快检测锁环、以及一个“`do_activate_blocked_waiter()` 被显著延迟后可能让任务在 affinity mask 外执行”的潜在崩溃修复。整个 proxy-exec 全系列在 John 的 GitHub 分支上维护。

## 专门修 proxy execution 的 RFC（v1，6 修复 + 自测，讨论中）

Mathieu Desnoyers 在研究“SCHED_DEADLINE 的优先级继承如何迁到 proxy execution”时，顺带发现并修了 proxy execution 的六个问题，发成一套 RFC（带测试模块和 selftest）。它基于前述 deadline 系列的 v6（patch 4 和 6 要改 v6 给带宽核算加的代码）：

1. 一个被阻塞的任务在 proxy 下被唤醒时要 reschedule，让老 owner 停止在 donor 的上下文里运行。
2. 被阻塞的 RT / deadline 任务要走完整唤醒路径，这样它们是 pushable 的、别的 CPU 能接走。
3. `blocked_on` 链是环时停止链遍历，让 mutex 死锁不再锁死 CPU。
4. 把 proxy 迁移告知调度类：fair donor 的 load attach 到它迁去的 rq；deadline donor 的带宽留在它的 root domain。
5. donor 停止捐献时清掉 `blocked_donor`，让 unlock 路径不再用一个可能被释放的任务。
6. 在 proxy 迁移后的 deadline 任务自己的 root domain 里检查并接纳它，让 `sched_setattr()` 不再 EPERM。

## HCBS：替换 RT_GROUP_SCHED 的 RFC（v7，29 补丁，讨论中）

Yuri Andriaccio（含 luca abeni、Juri Lelli 的补丁）的 `[RFC PATCH v7 00/29] Hierarchical Constant Bandwidth Server`。目标是用一套理论上更扎实的机制替换现有的 `RT_GROUP_SCHED`。

**背景。** 现有 `RT_GROUP_SCHED` 给 RT cgroup 分配实时带宽的方式长期被认为脆弱、理论基础不牢（本月 infra 页里 RT throttling 清理那条也提到 `CONFIG_RT_GROUP_SCHED` 已被标为 broken）。HCBS 的思路是让每个 RT cgroup 背后跑一个 deadline server（Constant Bandwidth Server），用 SCHED_DEADLINE 的隔离性来给 cgroup 做实时带宽预留——cgroup 里的 FIFO/RR 任务在一个 dl_server 之下被调度。该工作在 OSPM25/26 上介绍过，LWN 有综述（Articles/1021332、1078696）。

**v7 的主要新增**（相对 v6 大量变化，且据作者说 Sashiko 这个自动化 AI 工具意外地抓出很多问题）：

- rebase 到 7.4-rc1。
- 新增 `dl_freq_invariant` 标志：强制 fair/ext server 频率/容量不变，而允许 HCBS server 按容量缩放其消耗的 runtime，从而让 HCBS 也能做容量感知的带宽预留。
- 重做 cgroup-v2 接口：`cpu.rt.internal` 改名 `cpu.rt.effective.local`，修内部 runtime 取整误差。
- 允许在已配置好的 HCBS cgroup 里跑**非 root** 的 FIFO/RR 任务（管理员建好带宽后，普通用户绑在该带宽里既不能饿死别人也不能偷时间，权限也不允许把任务迁出去偷更多带宽）。
- 允许 HCBS server 用 `HRTICK_DL`。
- **整合 `cpu` 与 `cpuset` 控制器**（维护者要求）：强制 rt-cgroup 的活跃 CPU 等于 `cpuset.effective.local` 允许的 CPU；要求管理员先配 cpuset 再设 HCBS 带宽。
- **dl_server override**（原“multi-runtime/multi-CPU”）：管理员可为特定 CPU 集合覆盖默认的 runtime/period，通过往 `cpu.rt.max` 写新的 nested-keyed 格式实现。
- 整合 CPU hotplug/hotunplug：只有目标核上没有活跃 HCBS cgroup 时才允许 hotunplug。

整个 29 个补丁里，8–18 实现无迁移的 HCBS 并删掉旧 `RT_GROUP_SCHED` 代码（含移除 cgroup-v1 支持、实现 cgroup-v2 `cpu.rt.max` 接口），19–23 加任务迁移，24–29 是非特权 FIFO/RR、HRTICK_DL、文档、cpuset 整合、hotplug、多 CPU override。Juri Lelli 在 11/16–17 还在 review 往返中，距合入尚远，但这是 RT_GROUP_SCHED 长期替代方案，值得长期跟踪。

