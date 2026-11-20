---
title: 调度器社区动态（2026-10 ~ 2026-11）
---

# 调度器社区动态（2026-10 ~ 2026-11）

本专题梳理 2026 年 10 月中旬到 11 月中旬这一个月内，Linux 内核调度子系统在邮件列表上的**功能性进展**。观察窗口大致是 v7.4 合并窗口打开（10/18 `sched/core` 拉取）到 v7.4-rc3（11/15）之间。

## 这一个月的主线

一句话概括：**v7.4 把 proxy execution 的地基铺进了主线，围绕它的收尾工作主导了整个周期。**

`sched/core` 为 proxy execution 预埋了钩子，sched_ext 紧随其后适配；与此同时，几条独立的大系列都在向“让每个 CPU 的带宽/缓存/隔离状态可被精确核算和控制”的方向收敛：SCHED_DEADLINE 带宽核算大修、cache-aware 调度跨 LLC 扩展、preferred CPU 从“虚拟化专用”变成“通用运行时隔离接口”。

## 已并入 v7.4 的改动速览

| 领域 | 改动 | 作者 |
|------|------|------|
| Fair/EEVDF | 短 slice 任务的唤醒延迟优化；repick 后重启 fair hrtick；精简 augmented rbtree 回调 | Vincent Guittot 等 |
| Preempt | 简化 `PREEMPT_DYNAMIC` 的 Kconfig | Mark Rutland |
| 能耗/虚拟化 | `steal_governor`、引入 preferred CPUs、steal 驱动的 vCPU 回退 | Shrikanth Hegde |
| 负载均衡 | NVIDIA Olympus 上启用 preferred SMT sibling；随机化同样浅的 idle CPU 选择 | Andrea Righi、Christian Loehle |
| Deadline/RT | PREEMPT_RT 下 irq_work 的 CPU 热插拔改进 | Sebastian Siewior |
| sched_ext | 子调度器（nested BPF scheduler）功能完善、CID 分片、proxy execution 钩子 | Tejun Heo 等 |

`sched/core` 拉取请求由 Ingo Molnar 在 10/18 发出；sched_ext 的 `for-7.4` 由 Tejun Heo 在 10/19 发出，并声明依赖 `sched/core`（后者携带 proxy execution 的 sched_ext 钩子），须在其之后合并。此后 sched_ext 又有两轮 fix 拉取（`for-7.4-fixes`，10/27；`for-7.4-rc2-fixes`，11/15），`sched/urgent` 在 10/25 也有一轮。

## 分主题阅读

- [sched_ext：proxy 钩子、子调度器与 NUMA 平衡](./sched_ext.md)
- [EEVDF 与公平调度](./eevdf-fair.md)
- [SCHED_DEADLINE 与 proxy execution](./deadline-proxy.md)
- [缓存感知调度（cache-aware）](./cache-aware.md)
- [隔离、拓扑与 preferred CPU](./isolation-topology.md)
- [调度基础设施杂项：haltpoll、mm_cid、membarrier、RT 节流](./infra-misc.md)

> 数据来源为 LKML 公开归档（`lkml.iu.edu` 镜像）10/16 至 11/17 的线程索引与封面信。最后一个归档周（11/16 起）在截稿时只覆盖到 11/17，该周内容一律按“讨论中”处理。
