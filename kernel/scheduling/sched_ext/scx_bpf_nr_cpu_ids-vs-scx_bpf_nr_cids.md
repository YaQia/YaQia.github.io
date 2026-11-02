# scx_bpf_nr_cpu_ids 和 scx_bpf_nr_cids 究竟有什么区别？

最近，我在看 `scx_qmap.bpf.c` 的时候碰到了一个比较奇怪的东西：

```c
s32 BPF_STRUCT_OPS_SLEEPABLE(qmap_init)
{
    // ...
	u32 nr_cids, nr_cpu_ids;
    // ...
	nr_cids = scx_bpf_nr_cids();
	nr_cpu_ids = scx_bpf_nr_cpu_ids();
    //...
}
```

这里同时调用了两个 bpf kfunc，它俩的实现有所不同：

```c
/**
 * scx_bpf_nr_cpu_ids - Return the number of possible CPU IDs
 *
 * All valid CPU IDs in the system are smaller than the returned value.
 */
__bpf_kfunc u32 scx_bpf_nr_cpu_ids(void)
{
	return nr_cpu_ids;
}

/**
 * scx_bpf_nr_cids - Return the size of the cid space
 *
 * Equals num_possible_cpus(). All valid cids are in [0, return value).
 */
__bpf_kfunc u32 scx_bpf_nr_cids(void)
{
	return num_possible_cpus();
}
```

我瞬间来劲了：这俩看起来表达的含义不是一样吗？最大的 CPU id 和可能的CPU数量有什么区别？于是，Talk is cheap, show me the code.

## nr_cpu_ids 搜寻定义之路

```c
// kernel/smp.c:1126
#if (NR_CPUS > 1) && !defined(CONFIG_FORCE_NR_CPUS)
/* Setup number of possible processor ids */
unsigned int nr_cpu_ids __read_mostly = NR_CPUS;
EXPORT_SYMBOL(nr_cpu_ids);
#endif

/* An arch may set nr_cpu_ids earlier if needed, so this would be redundant */
void __init setup_nr_cpu_ids(void)
{
	set_nr_cpu_ids(find_last_bit(cpumask_bits(cpu_possible_mask), NR_CPUS) + 1);

	if (IS_ENABLED(CONFIG_PREEMPTION) && cpumask_size() <= sizeof(unsigned long))
		static_branch_enable(&ipi_mask_inlined);
}
```

从上面的代码可以看出，`nr_cpu_ids` 是一个在初始化阶段被配置的值，它的值通过在 `cpu_possible_mask` 这个掩码里找到小于 `NR_CPUS` 最后一位的位数里的最高有效位得到。等等...这样会不会溢出？有没有可能 `cpu_possible_mask` 的掩码范围很小，到不了 `NR_CPUS`？（后面会讲到）

`set_nr_cpu_ids` 就是简单的给 `nr_cpu_ids` 赋值的内联函数，定义如下：

```c
// include/linux/cpumask.h:30
#if (NR_CPUS == 1) || defined(CONFIG_FORCE_NR_CPUS)
#define nr_cpu_ids ((unsigned int)NR_CPUS)
#else
extern unsigned int nr_cpu_ids;
#endif

static __always_inline void set_nr_cpu_ids(unsigned int nr)
{
#if (NR_CPUS == 1) || defined(CONFIG_FORCE_NR_CPUS)
	WARN_ON(nr != nr_cpu_ids);
#else
	nr_cpu_ids = nr;
#endif
}
```

那么 `cpu_possible_mask` 是什么？

```c
// include/linux/cpumask.h:131
#define cpu_possible_mask ((const struct cpumask *)&__cpu_possible_mask)
// kernel/cpu.c:3077
#ifdef CONFIG_INIT_ALL_POSSIBLE
struct cpumask __cpu_possible_mask __ro_after_init
	= {CPU_BITS_ALL};
unsigned int __num_possible_cpus __ro_after_init = NR_CPUS;
#else
struct cpumask __cpu_possible_mask __ro_after_init;
unsigned int __num_possible_cpus __ro_after_init;
#endif
EXPORT_SYMBOL(__cpu_possible_mask);
EXPORT_SYMBOL(__num_possible_cpus);
```

从上面的代码不难看出，`__cpu_possible_mask` 是 `cpu_possible_mask` 的实际定义，它是一个`struct cpumask`。而 `struct cpumask` 的映射范围多大？它的掩码映射大小实际上就是`NR_CPUS`：

```c
// include/linux/cpumask_types.h:8
/* Don't assign or return these: may not be this big! */
typedef struct cpumask { DECLARE_BITMAP(bits, NR_CPUS); } cpumask_t;
```

所以说，`nr_cpu_ids` 实际上的最大值就是 `NR_CPUS` - 1。回顾最开始看到的`set_nr_cpu_ids(find_last_bit(cpumask_bits(cpu_possible_mask), NR_CPUS) + 1);`，既然`nr_cpu_ids` 严格小于 `NR_CPUS`，我们就可以直接定义 `nr_cpu_ids` 是 `__cpu_possible_mask` 这个掩码的最高有效位 CPU ID + 1。

那么问题就只有一个了：`__cpu_possible_mask` 是怎么被维护的？实际上，`__cpu_possible_mask` 就和 `num_possible_cpus()` 关联起来了：

```c
// kernel/cpu.c:3143
/*
 * This should be marked __init, but there is a boatload of call sites
 * which need to be fixed up to do so. Sigh...
 */
void set_cpu_possible(unsigned int cpu, bool possible)
{
	if (possible) {
		if (!cpumask_test_and_set_cpu(cpu, &__cpu_possible_mask))
			__num_possible_cpus++;
	} else {
		if (cpumask_test_and_clear_cpu(cpu, &__cpu_possible_mask))
			__num_possible_cpus--;
	}
}
// include/linux/cpumask.h:1253
static __always_inline unsigned int num_possible_cpus(void)
{
	return __num_possible_cpus;
}
```

这个 `set_cpu_possible` 函数只会在 `__init` 函数里被调用，因此会在初始化过程中完成配置。`__num_possible_cpus` 会随着 `__cpu_possible_mask` 更新而计数器变化，`nr_cpu_ids` 则被赋值为 `__cpu_possible_mask` 的最高有效位的CPU ID + 1。

这样一来，我们就很明确地区分出这两个变量了。

## 总结

- `scx_bpf_nr_cpu_ids`/`nr_cpu_ids`: 表示系统中的最大 CPU ID + 1，即从它开始后续的CPU ID均无效。
- `scx_bpf_nr_cids`/`num_possible_cpus()`: 表示系统中CPU数量的最大值。

由于 `__cpu_possible_mask` 可能存在空洞，在空洞位置`num_possible_cpus()`不计数，因此我们可以得出一个结论：`nr_cpu_ids` >= `num_possible_cpus()`。

至于空洞是否存在，那就看初始化时 `set_cpu_possible` 是怎么执行的了，这和体系结构有关。具体空洞为什么会存在就脱离本文的讨论范围了。

> [!TIP]
> cid 其实是 sched_ext 里引入的另外一个概念，有机会我也会讲一讲它的来历。
