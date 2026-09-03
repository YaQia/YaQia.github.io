# 调度器

本栏目记录 Linux 内核调度相关的学习与改造实践，分为四块：

## 调度核心逻辑

调度器代码量大、逻辑细节多且繁杂，通过完全理解所有代码来理解调度器的行为是困难的，因此我们需要构建一些心智模型来理解调度逻辑。对于通用的调度器实现机制，我们将它们的心智模型放在这一节来讲解。

- [调度触发与执行的心智模型](./core/sched-trigger-and-dispatch.md)
- [Core scheduling](./core/core-scheduling.md)

## 实时调度数据结构

每个 CPU 在实时调度器上的基本数据结构（sched_class、rt_rq 等）与 percpu 机制。

- [每个 CPU 的实时调度基本数据结构](./rt-sched-basics.md)

## sched_ext：可插拔调度框架

sched_ext 是 Linux 6.12 引入的、支持用户用 BPF 程序编写并热插拔的调度器框架。

- [sched_ext 简介](./sched_ext/overview.md)
- [sched_ext 的初始化过程](./sched_ext/initialization.md)
- [需要改动的数据结构](./sched_ext/data-structures.md)
- [scx_nest 调度器分析](./sched_ext/scx_nest.md)
- [scx_p2dq 调度器分析](./sched_ext/scx_p2dq.md)

## EEVDF 算法

Linux 6.6 起用 EEVDF 取代 CFS 的核心算法，这里记录其关键路径与数据结构。

- [EEVDF 介绍](./eevdf/index.md)
