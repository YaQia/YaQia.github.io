# 隔离、拓扑与 preferred CPU

这个月隔离与拓扑这条线的主题词有两个。一个是 **preferred CPU 出圈**：它原本是 v7.4 刚合入的 `steal_governor`（虚拟化超卖场景）的配套机制，但 Yury Norov 连发三个系列，想把它变成一个通用的、可写的运行时任务放置隔离接口，甚至拿来做温控。另一个是 **让隔离名副其实**：隔离 CPU 上的 kthread、LRU cache 排空等内核噪声问题被系统性清理。此外还有 cpuset 分区逻辑大重构、调度域重建降本、NUMA 域标志可调等工程化改动。

## `steal_governor` 与 preferred CPUs 进主线（已并入 v7.4）

先补背景。**steal_governor** 是 Shrikanth Hegde 的系列，本周期随 `sched/core` 拉取进入 v7.4：“Implement the steal_governor, introduce preferred CPUs and steal-driven vCPU backoff”。

虚拟化超卖（overcommit）场景下，vCPU 的“需求”和物理 CPU 的实际争用经常脱节：guest 以为该跑，host 侧 pCPU 却已经被别的 vCPU 占着，抢来抢去只会放大争用。steal time 是这个问题最直接的信号——它就是“我本可以跑但被 hypervisor 拿走”的时间。这套机制的思路是维护一个**首选 CPU 掩码（preferred CPUs）**：调度器在 idle 选择和任务放置时偏向首选 CPU。`steal_governor` 作为“governor”角色定期采样 steal time，在 pCPU 争用升高时把这些 CPU 标成非首选，让 vCPU 需求“退避”，从源头减少物理争用和 steal 放大。

随后的 11/09，Yury Norov 的一部分跟进补丁（`store only the sampling delay` 等）已经进了 tip `sched/core`，为下面要讲的 writable 接口铺路。

## preferred CPU 掩码的可写接口（0/6 → Harden 0/7 → 热控 RFC 0/3，讨论中）

Yury Norov 在一个月里发了三波，方向很明确：**把 preferred mask 从 steal_governor 的内部状态，变成一个通用的运行时隔离接口。**

**第一波**：`[PATCH 0/6] sched: Expose writable interface for preferred CPUs mask`（11/01）。

- 动机示例：运行时给选定的 fair 任务留出 CPU，同时把其它 fair 任务引开。做法是给某个 CPU 写 `echo 0 > /sys/devices/system/cpu/cpu3/preferred` 把它标记为非首选，再用 `taskset` 把工作负载钉上去——亲和性里含首选 CPU 的 fair 任务会被引走，而允许 CPU 里没有首选 CPU 的任务照常运行。CPU 保持在线、任务亲和性不变、随时可逆，调度域不受影响。掩码全局可读：`/sys/devices/system/cpu/preferred`。
- 作者将其定位为“类似 `isolcpus=domain` 的任务放置隔离，但带运行时接口”：`isolcpus` 是启动期参数且会拆调度域，而 preferred mask 是软引导，tick 抑制、RCU 卸载、managed-IRQ  avoidance 可以按需另行配置。
- 第 1 个补丁把 `PREFERRED_CPU` 的 Kconfig 依赖从 `PARAVIRT` 解耦——手动控制用途更广，且 s390/LPAR 的硬件辅助虚拟化并不开 `PARAVIRT`。
- 语义要点：多个 governor 可以共存，都通过公共锁更新同一个掩码；手动设置不要求特权，后续 governor 更新可以覆盖它。

**第二波**：`[PATCH 0/7]` 加固（11/13，部分补丁已进 tip `sched/core`）。针对 CPU 热插拔和 governor 互踩：热插拔删掉最后一个首选 CPU 时恢复首选、串行化掩码更新、让 governor 策略写入者互斥、移除最小采样间隔检查、热插拔后立即重启采样、对异常掩码状态告警。

**第三波**：`[RFC 0/3]` 热控（11/17）。在加固系列之上给出可写 sysfs 的完整实现，并新增 `Documentation/scheduler/preferred-cpu-thermal.rst`：让 thermald 这类用户空间 governor 在外部压力（温度）上来时通过把 CPU 标非首选来“鼓励空闲”。作者公开征集意见：preferred CPUs 作为温控机制，与现有 cooling 方法的边界在哪里。

三波合起来看，这是一个“虚拟化机制长成通用接口”的典型案例：温控、低延迟隔离、乃至未来更多用户空间策略，都可以复用同一套软引导语义。值得持续关注。

## NUMA 调度域标志可调（1 补丁，讨论中）

Jianyong Wu 的 `sched_numa_flag_distance` 内核参数提案。

**背景。** 多级 NUMA 系统上，调度域标志对性能影响很大：`SD_BALANCE_FORK`/`SD_BALANCE_EXEC` 决定 `select_task_rq_fair()` 慢路径搜多远（剥掉高层级能让 fork/exec 更快）；`SD_WAKE_AFFINE` 决定唤醒的“拉拢”范围；`SD_BALANCE_NEWIDLE` 挂在每个 NUMA 层级上，高层 newidle 均衡即使无事可做也可能很耗时。问题在于：前三个标志全都由**一个**静态阈值 `node_reclaim_distance` 控制，既分不开也改不了，`SD_BALANCE_NEWIDLE` 甚至没法剥。不同负载偏好不同设置，静态值不可能全适配。

**做法。** 新增启动参数，按距离分别剥离：

```
sched_numa_flag_distance=forkexec:<d>,newidle:<d>,wakeaffine:<d>
```

节点距离大于 `<d>` 的 NUMA 层级剥掉对应标志组，设置后覆盖该组的默认值。

**数据（Hygon 两台，NUMA balancing 关闭，全部归一化到默认值 1.00）：**

- 8 节点机（256 CPU，全部层级距离 15/25/27 都低于默认阈值，即默认全开）：`forkexec:10` 把 UnixBench 的 Execl 吞吐提到 1.27、进程创建 1.29、单并发 shell 脚本 1.35、8 并发 **2.07**；fork/exec 路径在 `select_task_rq_fair()` 里花的时间降到默认的 0.05。`newidle:20` 让 schbench（256 worker）p99 唤醒延迟降到 0.56，吞吐不变。
- 12 节点机（384 CPU，32/35/38 的层级默认已经没有 fork/exec 和 wake_affine）：`wakeaffine:255` 反向全开 wake_affine 后，hackbench 进程 4 组从 1.00 降到 0.80。

方向上很符合“把调度域行为交给管理员微调”的潮流，单补丁、数据扎实，合入概率不低。

## 隔离 CPU 的内核噪声：kthread 与 LRU 排空（0/6，讨论中）

Matthew Ruffell（补丁作者 Caron Wills，生产环境受影响的用户）的 `mm, sched, cgroup` 系列，修复一个真实生产故障：**隔离 CPU 上跑自旋 SCHED_FIFO 任务时，大页迁移能把 PID 1 卡在 D 状态几分钟到十分钟**。

**故障链。** 用户的 192 CPU 系统用 `isolcpus=nohz,18-95,108-178 nohz_full=... rcu_nocbs=... idle=poll` 隔离大量 CPU，每个隔离 CPU 上跑 100% 自旋的 SCHED_FIFO(prio 80) 任务。当约 50GB 页面在 NUMA 节点间迁移时：systemd 调 `flush_migrate_mm_task_workfn()` → kworker 走 `do_migrate_pages()` → `lru_cache_disable()` → `__lru_add_drain_all()`——后者会在**每个** CPU 上建一个 kworker 排空 LRU cache，然后等待全部完成。FIFO 自旋任务永不让出，隔离 CPU 上的 kworker 迟迟轮不到，整个迁移卡住，systemd 在 `flush_workqueue()` 上挂 3–5 分钟（生产环境最长 10 分钟），SSH 登不上、服务起不来、容器杀不掉。

**修复分三层：**

1. **恢复隔离语义**（1/6、2/6）：`cpu_is_isolated()` 重新把 nohz_full CPU 算作隔离（v7.1 的 `8f78b749f3da` 把 `HK_TYPE_KTHREAD` 变成了 `HK_TYPE_DOMAIN` 的别名，`041ee6f3727a` 又让 kthread 亲和性只按 domain 过滤，导致 nohz_full 若没做 domain 隔离，RCU expedited GP worker、rcub/N 等 kthread 全都能落在 nohz_full CPU 上，被用户态 FIFO 活活饿死，`synchronize_rcu_expedited()` 全系统阻塞——Launchpad #2165410 记录的正是这个）。改用显式的 `HK_TYPE_KERNEL_NOISE` 过滤并做两级回退。
2. **不让 LRU cache 在隔离 CPU 上积压**（3/6、4/6）：隔离 CPU 上的 per-CPU LRU cache 直接不做 batching，CPU 变为隔离时先排空存量批次。
3. **不让无辜者陪等**（5/6、6/6）：`cpuset.mems` 用 `O_NONBLOCK` 写入时不再等内存迁移完成；fork 的任务不再在 `cpuset_fork()` 里同步等迁移（去掉冗余的 workqueue flush）。

这个系列横跨 sched/mm/cgroup 三个子系统，是“隔离 CPU 必须连内核后台活动一起隔离”的教科书案例。

## cpuset 本地分区逻辑重构（RFC -v4，22 补丁，讨论中）

Ridong Chen 的 `cpuset: rework local partition logic`。动机直白：最近一堆 partition 相关修复，根源都是分区状态和隔离 CPU 的处理散落各处。现状是 `update_parent_effective_cpumask()` 一个函数 300+ 行，把 enable/disable/invalidate/update 全包了，partition 相关字段在多处直接写入，corner case 层出不穷。

重构方案：拆出 `local_partition_enable()` / `local_partition_disable()` / `local_partition_update()`，与已有的 remote partition 基础设施对称；本地和远程分区都走公共的 `partition_enable()/partition_disable()/partition_update()`，校验统一在 `validate_partition()` 之上。`partition_root_state` 的直接写入从 6 处减到 2 处、`prs_err` 从 12 处减到 3 处；交还给父节点的 CPU 的隔离状态统一在 `partition_xcpus_del()` 里结算。净减约 90 行，删掉那个 312 行的巨函数。v4 还确认了它覆盖了 Waiman Long 近期修复系列所解决的问题，且其新增测试用例在本系列下全部通过。纯重构、无行为变化意图，属于“修够了就该重写”的典型，合入只是时间问题。

## 调度域重建的每 cgroup 开销（0/2，讨论中）

Qiliang Yuan 的系列。调度域重建（CPU 热插拔或 cpuset 分区变更）会把每个活跃 CPU 移入新 root domain，其中 `rq_offline_fair()`/`rq_online_fair()` 在持 rq 锁、关中断下遍历**所有 task group**，总代价 O(nr_cpus × nr_task_groups)。Dietmar Eggemann 在 review `f60a631ab9ed` 时就点过 offline 侧的问题。

- 补丁 1：保持活跃的 CPU 跳过 `rq_offline_fair()`。
- 补丁 2：只有真正下线的 CPU 才需要重新同步 `runtime_enabled`。

32 vCPU VM + 4000 个 cpu cgroup 实测：partition root 切换 13.28ms → **1.21ms**（-91%），CPU offline 44.95ms → 13.44ms（-70%），online 36.84ms → 12.82ms（-65%），且耗时不再随 cgroup 数量增长（RT_GROUP_SCHED 开启时 `rt.c` 的 runtime 遍历仍在）。

## SMT_BUDDY_ASSIST RFC（0/6，讨论中）

Li kunyu 的 `sched/fair: Introduce the SMT_BUDDY_ASSIST feature`（Hygon 7447v，384 逻辑核，多 NUMA 多 LLC）。

**动机。** 负载均衡把任务迁到别的 LLC 域代价很高：L3 不共享命中率掉、高层级域遍历本身开销大、跨 die 迁移还附带 TLB flush/refill。

**方案**（一个 debugfs 特性开关整体使能）：

1. 周期负载均衡里把 CFS 任务**推向 SMT 兄弟 CPU**，快速把负载摊进同一个核；
2. 推送成功后跳过 SMT 域均衡，别把刚推出去的任务又拉回来；
3. newidle 均衡只在 LLC 域内找任务，不跨 die 拉——整机空闲或负载均衡时避免抖动；
4. 用“突发任务唤醒时往空闲 CPU 撒”的路径补偿 3 造成的负载不均（作者也坦承 newidle 受限引入了新问题：突发创建的任务堆积、CPU 间负载不均，patch 5 就是修这个的）。

**结果要泼冷水。** 作者给的整体数字是平均约 +9.26%，但单看列表里的数据：hackbench 平均 +4.27%（8 个配置里 4 个退化）；tbench 平均 **-0.99%**，32/16 并发客户端分别 -18.65%/-15.40%，只有高并发（128/256）改善。这是个方向有意思、数据尚不充分的早期 RFC，机制上与上面 cache-aware RFC v3“跨 LLC 扩展聚合”思路恰好相反（一个尽量避免跨 LLC 迁移、一个主动跨 LLC 聚合），后续讨论值得围观。

## 拓扑小件

- **NVIDIA Olympus 启用 preferred SMT siblings**（Andrea Righi，已并入 v7.4）：给不对称 SMT 优先级平台补齐拓扑支持——idle 选择尊重 SMT 优先级、新增 asymmetric SMT packing override，并在 Olympus 上默认启用。
- **Balance cluster static-key updates**（Hui Su，讨论中）：cluster 级静态键更新的均衡化清理。
- **Avoid overlapping NUMA groups when possible**（Fengyu Wang (Hygon)，RFC，讨论中）：尽量避免 NUMA 组重叠。
- **Retry scheduler domains after failed construction**（Avi Weiss，讨论中）：域构建失败后重试，而不是留下半成品拓扑。
