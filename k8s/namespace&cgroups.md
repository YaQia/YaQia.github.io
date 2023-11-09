# Linux的隔离技术

- 什么是Linux中的`namespace`和`cgroups`？

- 为什么它们成为了Docker和k8s奠基性的技术？

- k8s中的`namespace`和Linux中的`namespace`是什么关系？

本文会基于上述问题完成讨论。

## 1 namespace

### 1.1 定义

- 一种以进程集合(set of processes)为单位的隔离内核资源的技术。

> 例如某个进程集合只能看到某个资源集合；另一个进程集合只能看到一个不同的资源集合。

### 1.2 用途

这么做能保证进程集之间不会互相干扰，保证一定程度的安全性。使得创建一个`namespace`就**像创建一个虚拟机一样**对资源进行隔离。

### 1.3 种类

- `user namespace`: 在其中的进程拥有自定义的/独占的`User IDs`和`Group IDs`，并可以使得一个进程在其特定的`user namespace`中拥有root权限（在其他`user namespace`中不一定）
- `process ID namespace`: 在其中的进程拥有自定义/独占的`Process IDs`，在新的`PID namespace`中创建的第一个进程拥有`PID 1`，此后创建的为`PID 2`、`PID 3`......
  > 注：在当前`PID namespace`(`a`)创建一个子进程`p`并将进程`p`作为新`PID namespace`(`b`)的第一个进程，那么`p`在`b`中拥有`PID 1`，并且在`a`中拥有它原本的PID
  > 另：一个有趣的事实：基础的namespace隔离性很差。虽然它能保证独立的PID体系，但`/proc`却可能可以直接访问到外部的进程信息（见下文）
- `network namespace`: 在其中的进程拥有一个独立的网络协议栈，包括路由表、IP地址、套接字、防火墙等网络资源
- `mount namespace`: 在其中的进程拥有一个独立的挂载点列表，这就使得在一个`mount namespace`中挂载和解挂载不会影响主文件系统
- `interprocess communication (IPC) namespace`: 保证消息队列等IPC通信资源的独立性
- `UNIX Time-Sharing (UTS) namespace`: 保证了主机名(hostname)和域名(domain names)的隔离，一个主机可以有多个主机名
- `cgroups namespace`: 是的，你甚至可以让cgroups也被namespace隔离，隔离的进程会看到虚拟的`/proc/self/cgroup`信息

### 1.4 使用实例

Linux提供了`unshare`命令用于创建和持久化namespace

这是`man`对它的解释：

```man
NAME
          unshare - run program in new name namespaces
```

#### 1.4.1 PID的隔离以及用户的隔离

> 以下内容是以一个没有提权能力的普通用户执行unshare的过程

下面这个命令创建一个PID namespace

```bash
unshare --pid --fork fish
```

报错了！

仔细想想：`unshare`默认以root用户的形式启动，如果没有root权限自然是无法执行的，1.3节介绍的时候讲过`User namespace`可以让普通用户在该`namespace`获得root权限，那么我们尝试增加`User namespace`：

```bash
unshare --pid --user --fork fish
```

我们这里创建了`User namespace`，可是我怎么进入变成nobody/依然报错？

- 这条命令会出现预料之外的结果，原因如下：
  > 虽然创建了`User namespace`，但默认情况下，`unshare`没有把当前用户映射为root，导致root仍然需要外部的root权限，需要在namespace内完成`UID`、`GID`映射将当前用户映射到root

正确的指令如下：

```bash
unshare --pid --user --map-root-user --fork fish
```

> 注：为什么这里三条指令都用了`--fork`？不fork会发生什么？（可以自己尝试一下）

1.3节提到过一个进程在两个`PID namespace`同时存在的情况下会拥有两个PID，可以这样验证：

在`namespace`的外部和内部均执行`ps`命令查看`fish`对应的进程号：

```bash
ps -ef | grep fish
```

糟糕！怎么在内部无法执行？麻烦真是一堆！

仔细分析：因为当前的隔离环境没有`mount namespace`，所以`/proc`文件夹还是外面的内容，导致实际环境与`/proc`文件夹的内容不一致；而`ps -ef`指令需要`/proc`文件夹的内容来分析哪些属于当前用户

好说，那就写一段C代码调用API来看PPID（因为在`fish`终端执行的程序其父进程就是`fish`）：

```c
#include <stdio.h>
#include <unistd.h>
int main() {
    printf("PPID = %d\n", getppid());
    return 0;
}
```

可以看到，在外部拥有一个PID号的`fish`，在内部有独立的PID号：PID=1

> 注：为了防止环境不完整导致的命令执行失败以及权限等各种问题，统一使用一个较为完整的隔离环境是更好的选择
> 例如，下面的指令包括PID、User、mount、UTS、cgroups，并且设置好了User映射和`/proc`文件夹的挂载
>
> ```bash
> unshare --user --pid --map-root-user --mount-proc --uts --mount --cgroup  --fork fish
> ```
>
> 由于这里的`/proc`是直接通过挂载完成的，故`umount`可以让它原形毕露

#### 1.4.2 namespace的Unix哲学：万物皆文件

在namespace的外部可以通过`lsns`命令查看所有与当前用户相关的namespace的信息

```
        NS TYPE   NPROCS    PID USER COMMAND
4026532522 user        2 123916 yyq  unshare --user --pid --map-root-user --mount-proc --uts --mount --f
4026532524 mnt         2 123916 yyq  unshare --user --pid --map-root-user --mount-proc --uts --mount --f
4026532525 uts         2 123916 yyq  unshare --user --pid --map-root-user --mount-proc --uts --mount --f
4026532526 pid         1 123917 yyq  └─fish
```

> NPROCS表示在namespace中的进程数，其中`PID namespace`只有1，但如果运行其他程序，就会增加

信息还不够多，可以用`lsns --output-all`来试试

```
4026532527 user   /proc/176430/ns/user        2 176430 176229 unshare 1001 yyq                                       4026531837 4026531837
4026532531 mnt    /proc/176430/ns/mnt         2 176430 176229 unshare 1001 yyq                                                0 4026532527
4026532532 uts    /proc/176430/ns/uts         2 176430 176229 unshare 1001 yyq                                                0 4026532527
4026532533 pid    /proc/176431/ns/pid         1 176431 176430 fish    1001 yyq                                       4026531836 4026532527
4026532534 cgroup /proc/176430/ns/cgroup      2 176430 176229 unshare 1001 yyq                                                0 4026532527
```

没想到namespace也是由文件系统来管理的！

实际上这种组织方式是十分合理的：`PID namespace`对应的第一个进程既是外部的进程也是内部的进程，可以很好地作为namespace管理信息的入口；其他namespace则由创建它们的`unshare`来管理，也是自然而然的。

## 2 cgroups

### 2.1 定义

cgroups出现的时间比namespace要早一些，它提供了对一系列进程的资源（CPU、内存、硬盘I/O、网络等）的限制、管理、隔离

### 2.2 特征

- 细粒度：在cgroups之前，有许多资源分配的工具，但只有cgroups可以做到进程级别的分配
- 资源限制：可以对一个进程的精确到某一特定的资源（如内存、CPU）使用量做出限制
- 优先级：多个cgroup之间可以控制资源使用比例
- 管理：资源限制的监控和报告在cgroup层面实现
- 控制：可以用一个命令简单地控制一个cgroup中的进程状态

### 2.3 使用实例

#### 2.3.1 打印cgroups树

对于使用`systemd`的Linux系统，可以使用下面的命令：

```bash
# systemctl status
systemd-cgls
```

> 注：cgroups本身是由进程组织的（`/proc`中每个进程都有独立的cgroup文件系统），但是systemd是以service、slice等脚本文件将重要程序的启动顺序和执行依赖等信息管理，并将这些脚本文件本身生成一个依赖关系树，进而将cgroup变为这些脚本文件的内容、组织为cgroups树

#### 2.3.2 cgroup资源占用显示

```bash
systemd-cgtop
```

#### 2.3.3 自定义cgroups

在systemd管理下，可以使用`/etc/systemd/system/`文件夹设置自己的cgroups

例如创建文件`/etc/systemd/system/my.slice`：

```
[Slice]
CPUQuota=30%
```

设置完成后不要忘记daemon-reload：

```bash
systemctl daemon-reload
```

之后root使用`systemd-run`即可按照cgroups分配的情况运行一个程序

```bash
systemd-run --slice=my.slice ./a.out # 任意一个程序
```

> 注：这里可以用`htop`看到程序占用CPU情况，也可以用`systemd-cgtop`看到`my.slice`是直接在根下面的cgroup

## 3 二者的区别

同样是隔离，`namespace`和`cgroups`有什么区别？

答：

1. 前者是抽象性隔离（将各个进程集互相隔离），后者是具象性隔离（将资源可见地分配给各个进程/进程集）
2. 前者以多进程（集）间安全性隔离为主（阻止各命名空间之间互相交互），后者以单进程（集）资源分配隔离为主（给一个进程多少CPU就只能用那么多）
3. 前者提供了各个用户级别的隔离，后者只提供了系统级别的隔离
4. 前者提供了更加简单易用的命令行工具和API（[clone、unshare、setns](https://lwn.net/Articles/531381/)），后者只能通过文件系统或者需要依赖于系统资源管理工具本身加以管理（如systemd）

## 4 k8s namespace

k8s中也有一个概念叫作namespace，它和Linux中的namespace一样么？

> Tips: 如果一样还单独列出来做什么呢:)

### 4.1 定义

它与Linux中的namespace类似，提供了对资源的隔离，将同一集群中资源划分为相互隔离的组。同一namespace资源名称唯一。

> 注：k8s里的资源指的是k8s对象，几乎可以说所有的在配置清单上的都是资源对象。

### 4.2 初始名字空间

- default: 默认情况下，kubectl获取的信息都是来自这个命名空间
- kube-node-lease: 包含用于与各个节点关联的租约(lease)对象（这是另外一个大的专题）
- kube-public: 所有客户端都可以读取的名字空间，预留给集群使用，某些资源要求集群整体可见
- kube-system: 用于k8s系统创建的内部对象

### 4.3 使用实例

获得名字空间信息：

```bash
kubectl get namespace
```

请求时设置名字空间：

```bash
kubectl run nginx --image=nginx --namespace=\<namespace\>
kubectl get pods --namespace=\<namespace\>
```

### 4.4 然而

虽然刚刚讲到了绝大多数配置清单上的都是资源，但不是所有资源都在名字空间中

可以用下面的方法检查哪些资源在名字空间中，而哪些不在：

```bash
kubectl api-resources --namespaced=true
kubectl api-resources --namespaced=false
```

## 主要参考资料

[What Are Namespaces and cgroups, and How Do They Work?](https://www.nginx.com/blog/what-are-namespaces-cgroups-how-do-they-work/)

[unshare manual](https://man7.org/linux/man-pages/man1/unshare.1.html)

[user_namespaces manual](https://man7.org/linux/man-pages/man7/user_namespaces.7.html)

[cgroups ArchWiki](https://wiki.archlinux.org/title/cgroups)

[namespace API](https://lwn.net/Articles/531381/)

[k8s namespace](https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/namespaces/)
