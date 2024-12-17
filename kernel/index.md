# Linux kernel阅读笔记

## 多核实时系统调度器的实现

首先，关于硬实时、软实时的定义是怎样的？它们有什么区别？如果Linux内核实现了实时调度算法，那RT-Linux又是什么？

可参考的链接：

[Arch Linux中的linux-rt相关wiki](https://wiki.archlinux.org/title/Realtime_kernel_patchset)

[理解硬实时的博客](https://zhuanlan.zhihu.com/p/432959322)

在查看相关代码时，第一个冒出的问题就是：多CPU的每个CPU都该拥有的数据结构长什么样？

首先了解了每个CPU在实时调度器上的基本数据结构和对应接口：

[每个CPU的实时调度基本数据结构](./percpu/1.md)

Linux内核通过percpu机制实现多个CPU都单独拥有一份的数据结构：

[percpu机制](https://zhuanlan.zhihu.com/p/340985476)

## sysfs

[kobject](./sysfs/kobject.md)

