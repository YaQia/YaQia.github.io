# 调度触发与执行的心智模型

本文总结 Linux 内核调度的两个核心问题：**何时触发调度**（触发逻辑）和**如何选择下一个任务**（执行逻辑）。

## 一、调度触发逻辑

调度触发的核心思想：各种事件通过设置 `TIF_NEED_RESCHED` 标志「挂号」，但**不立即切换任务**，而是延迟到安全点统一执行。

> [!TIP]
> 之所以设置 `TIF_NEED_RESCHED` 并异步完成调度，最主要的原因是大量路径存在自旋锁，自旋锁是禁止抢占的（可能出现死锁）。如果直接触发 `schedule()`，那么持有锁的任务将睡眠，导致可能出现死锁。同样的道理，在调度的核心逻辑中，需要占用 `rq->lock` 这个自旋锁，因此在 `schedule()` 的核心路径要求要关中断、关抢占。

### 1.1 触发源：谁设置 TIF_NEED_RESCHED

所有触发源最终都通过 `resched_curr()` 或 `resched_curr_lazy()` 设置标志：

| 触发场景 | 位置 | 场景 |
|----------|------|------|
| `sched_tick()` | 时钟中断 | 时间片耗尽、EEVDF deadline 到期 |
| `try_to_wake_up()` | 唤醒路径 | 高优先级任务入队 |
| 负载均衡 | `load_balance()` | 任务迁移 |
| 优先级变更 | `set_user_nice()` 等 | nice/sched_setscheduler |
| Core Scheduling | `task_tick_core()` | force idle 场景 |

其中 `sched_tick()` 的内部调用链：

```
sched_tick()
  ├─ donor->sched_class->task_tick()
  │   └─ entity_tick()
  │       └─ update_curr()
  │           └─ update_deadline()  → vruntime >= deadline 时返回 true
  │               └─ resched_curr_lazy()  → 设置 TIF_NEED_RESCHED_LAZY
  │
  └─ task_tick_core()  → 仅 Core Scheduling 场景
      └─ resched_curr()  → 设置 TIF_NEED_RESCHED
```

### 1.2 检查点：哪里消费 TIF_NEED_RESCHED

```
                    ┌─────────────────────────────┐
                    │      resched_curr()         │
                    │  set TIF_NEED_RESCHED       │
                    └──────────────┬──────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        ↓                          ↓                          ↓
┌───────────────────┐  ┌─────────────────────┐  ┌────────────────────┐
│ 返回用户态         │  │ 中断返回内核态       │  │ preempt_count → 0  │
│ exit_to_user_     │  │ raw_irqentry_exit_  │  │ __preempt_count_   │
│ mode_loop()       │  │ cond_resched()      │  │ dec_and_test()     │
└─────────┬─────────┘  └──────────┬──────────┘  └─────────┬──────────┘
          │                       │                       │
          ↓                       ↓                       ↓
      schedule()         preempt_schedule_irq()    preempt_schedule()
          │                       │                       │
          └───────────────────────┼───────────────────────┘
                                  ↓
                           __schedule()
```

三个**自动检查点**的区别：

| 路径 | 触发条件 | 函数 |
|------|----------|------|
| 返回用户态 | 每次 syscall/irq/exception 出口必查 | `exit_to_user_mode_loop()` |
| 中断返回内核态 | `preempt_count() == 0` | `preempt_schedule_irq()` |
| preempt_count 归零 | `preempt_enable()` 或中断返回 | `preempt_schedule()` |

除了上述自动检查点，还有大量**主动检查点**——内核代码在合适位置显式调用 `schedule()` 或 `cond_resched()`：

- 阻塞操作：`mutex_lock()`、`wait_event()`、`down_read()` 等会主动调用 `schedule()`
- 长循环中的让步：`cond_resched()` 用于不可抢占的长循环中主动让出 CPU
- 驱动/子系统：文件系统、内存回收等路径中的调度点

**设计意图**：自动检查点保证「不会永远不调度」，主动检查点保证「及时让出 CPU」。

---

## 二、调度执行逻辑

当 `__schedule()` 被调用后，核心流程如下：

```
__schedule(sched_mode)
    │
    ├─ 1. 锁定当前 rq，取 prev = rq->curr
    │
    ├─ 2. 处理 prev 状态
    │      ├─ SM_IDLE: rq 空闲，直接选 idle
    │      └─ !preempt && prev->__state:
    │           try_to_block_task()  → 将 prev 移出 runqueue
    │
    ├─ 3. pick_next_task(rq)  ← 核心：选择下一个任务
    │      │
    │      │  按优先级从高到低遍历调度类:
    │      │
    │      │  stop_sched_class     ← 最高优先级，热插拔/CPU down
    │      │      ↓
    │      │  dl_sched_class       ← SCHED_DEADLINE (EDF)
    │      │      ↓
    │      │  rt_sched_class       ← SCHED_FIFO / SCHED_RR
    │      │      ↓
    │      │  fair_sched_class     ← SCHED_NORMAL (CFS/EEVDF)
    │      │      ↓
    │      │  idle_sched_class     ← idle 线程
    │      │
    │      └─ 返回 next 指针
    │
    ├─ 4. context_switch(rq, prev, next)  ← 硬件上下文切换
    │      ├─ switch_mm_irqs_off()  ← 切换地址空间（CR3/TTBR0）
    │      └─ switch_to(prev, next) ← 切换寄存器/内核栈（汇编）
    │
    └─ 5. finish_task_switch()
           ├─ 清理 prev 残留状态
           └─ 释放 rq 锁
```

### 2.1 pick_next_task 的调度类层级

调度器采用**层级式**调度类，高优先级类的任务永远优先于低优先级类：

```
优先级:  高 ──────────────────────────────→ 低

         stop   dl    rt    fair   idle
         ────   ──    ──    ────   ────
         独占   专用于  RT    普通   空闲
         CPU    实时    任务   任务   任务
```

`pick_next_task()` 的伪代码：

```c
for_each_class(class) {
    next = class->pick_task(rq);
    if (next)
        return next;
}
```

### 2.2 context_switch 的两个阶段

```
context_switch(rq, prev, next)
    │
    ├─ 阶段1: 切换地址空间（仅用户态任务需要）
    │   └─ switch_mm_irqs_off()
    │       └─ load_new_mm_cr3(next->mm)  ← x86: 写 CR3 寄存器
    │
    └─ 阶段2: 切换执行上下文（所有任务都需要）
        └─ switch_to(prev, next)  ← 汇编实现
            ├─ 保存 prev 的寄存器（SP, PC 等）
            └─ 恢复 next 的寄存器
```

注意：`switch_to()` 是**三参数**宏，因为切换到 next 后，prev 变量已经不存在了，需要第三个参数来保存当前 task 指针以便后续清理。

---

## 三、总结


| 维度 | 触发逻辑 | 执行逻辑 |
|------|----------|----------|
| 核心问题 | 要不要调度？ | 调谁上来？ |
| 关键标志 | `TIF_NEED_RESCHED` | `rq->nr_running` |
| 解耦方式 | 设置 flag 后不立即切换 | `__schedule()` 统一执行 |
| 安全保证 | 延迟到安全点（关中断/抢占计数检查） | 持有 `rq->lock` 串行化 |

两者通过 `TIF_NEED_RESCHED` 解耦：触发方只管挂号，执行方统一处理，职责清晰。
