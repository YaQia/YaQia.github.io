# 调用栈占比分析评判性能瓶颈

在内核函数中，使用callee（被调用者）占caller（调用者）的调用比例（或者反过来，caller占callee的比例）是一种简单而可行的分析干扰情况的方法。

当存在某种干扰时，会存在某些调用栈中**某callee占caller比例增、减、从有到无或从无到有**的可能性（也可能反过来，**某caller占callee比例增、减、从有到无或从无到有**）。

我们使用5.15.0的内核进行实验，验证该方法的**可行性**与**有效性**。

## 可行性分析

在发生CPU干扰时：

1. `psi_task_change`内会更频繁地发生`psi_group_change`的调用，使得`psi_task_change`作为caller占`psi_group_change`的占比提升

![](../pic/caller&callee/1.png)

2. `select_idle_sibling`选目标核时会产生明显的`select_idle_cpu`调用次数的上升。

![](../pic/caller&callee/2.png)

这些调用占比的增减是否是一种偶然？还是与实际干扰的发生有强逻辑相关性？上述的例子已经足以支撑该方法在CPU干扰情况下的可行性，下面的内容将验证**调用栈占比分析评判性能瓶颈**的方法在**CPU干扰情况下**的有效性。

## 有效性分析

`psi_task_change`和`select_idle_sibling`的父调用链上都有`try_to_wake_up`，应该从其基本逻辑出发开始分析

ftrace的function_graph相关调用栈如下所示：

```c
 15)               |try_to_wake_up() {
 15)   0.195 us    |  // ...
 15)               |  select_task_rq_fair() {
 15)   0.431 us    |    // ...
 15)               |    select_idle_sibling() {
 15)   0.182 us    |      available_idle_cpu();
 15)   0.314 us    |      select_idle_cpu();
 15)   1.146 us    |    }
 15)   0.185 us    |    // ...
 15)   3.627 us    |  }
 15)   0.587 us    |  // ...
 15)               |  ttwu_do_activate() {
 15)               |    psi_task_change() {
 15)   0.191 us    |      psi_flags_change();
 15)   0.217 us    |      // ...
 15)   0.723 us    |      psi_group_change();
 15)   0.199 us    |      // ...
 15)   0.295 us    |      psi_group_change();
 15)   0.211 us    |      // ...
 15)   0.299 us    |      psi_group_change();
 15)   0.191 us    |      // ...
 15)   3.993 us    |    }
 15) + 10.187 us   |    // ...
 15) + 20.704 us   |  }
 15)   0.190 us    |  // ...
 15) + 27.971 us   |}
}
```

[try_to_wake_up的基本逻辑](./try_to_wake_up_basic_logic.md)
