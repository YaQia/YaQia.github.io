# 需要改动的数据结构

## cpumask

```c
	if (!cpumask_equal(housekeeping_cpumask(HK_TYPE_DOMAIN),
			   cpu_possible_mask)) {
		pr_err("sched_ext: Not compatible with \"isolcpus=\" domain isolation");
		return -EINVAL;
	}
```
- housekeeping_cpumask
- cpu_possible_mask

> 需要变为该调度器的cgroup对应的cpumask

## sched_ext_ops添加一个cgroup字段

- 如何从cgroup的前缀转换为cgroup本身？

> 可以参考scx_layered

有一种更简单的方法：将编译好的调度器的.o文件直接放置在cgroup的cpu控制器的一个文件中

例如：
```
cpu.scheduler
```

## 全局变量

__scx_ops_enabled仍然应该只有一个（所有调度器都退出后才为disable）

__scx_switched_all仍只有一个，且多个调度器时swtiched_all仍然成立

### 根据调度器有多少个要动态增删的变量

- scx_ops_helper	// kthread_worker, 不需要多个
- scx_exit_info
- scx_exit_kind
- scx_ops_enable_state_var

global_dsqs **不应该**变为多份，因为虽然有多个调度器，
但是要尽量不修改core调度器的代码，则一个scx调度队列对接一个CPU

struct kobject *scx_root_kobj需要创建树形层级关系

- scx_exit_info
- scx_warned_zero_slice
- scx_ops
- scx_has_op
- scx_watchdog_timeout
- scx_watchdog_timestamp
- task_struct_type
- scx_tasks
