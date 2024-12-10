# cgroup的详细介绍

> 注：本文仅涉及cgroup v2

## 什么是cgroup

cgroup是分层组织进程和在分层中分配系统资源的控制系统 (control group)

cgroup由两大部分组成：**core**和**controllers**

- core主要负责进程分层组织架构
- controllers主要负责沿层次结构分配特定类型的系统资源（也存在不分配资源的controllers）

cgroups组成了一个树状结构，每一个进程都仅属于一个cgroup（控制组）

相同进程的所有线程都属于相同的cgroup（实际上也有特殊模式可以变成每个线程独立的cgroup）。
在创建时，所有进程都被放入父进程所在的cgroup中。一个进程可以迁移至另一个cgroup。
迁移的进程不会影响已经存在的后代进程。

某个cgroup上可以根据某些约束条件开启或关闭controller。所有controller的行为都是分层的——
如果一个cgroup中启用了该controller，则它会影响包含该cgroup子层的cgroup的所有进程。
当一个controller在一个嵌套cgroup中启动，**会在父层cgroup的限制下进一步限制**资源分配。
在层次结构中离根cgroup接近的限制不能被离根cgroup较远的限制覆盖。
