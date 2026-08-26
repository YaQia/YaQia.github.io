# 调度器

本栏目记录 Linux 内核调度相关的学习与改造实践，分为三块：

## 实时调度数据结构

每个 CPU 在实时调度器上的基本数据结构（sched_class、rt_rq 等）与 percpu 机制。

- [每个 CPU 的实时调度基本数据结构](./rt-sched-basics.md)

## sched_ext：可插拔调度框架

sched_ext 是 Linux 6.12 引入的、支持用户用 BPF 程序编写并热插拔的调度器框架。

- [sched_ext 简介](./sched_ext/overview.md)
- [sched_ext 的初始化过程](./sched_ext/initialization.md)
- [需要改动的数据结构](./sched_ext/data-structures.md)
- [scx_nest 调度器分析](./sched_ext/scx-nest.md)

## EEVDF 算法

Linux 6.6 起用 EEVDF 取代 CFS 的核心算法，这里记录其关键路径与数据结构。

- [EEVDF 介绍](./eevdf/index.md)
