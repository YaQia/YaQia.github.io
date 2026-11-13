# Sub scheduler 多调度器

## 背景

在一个多 socket 的高性能服务器上，同时运行多种负载是很常见的。而多种负载所需要的最优调度策略可能不尽相同，在单一调度器上难以同时满足多种负载的调度需要。

为支持多种负载各自按需调度，最直观的办法就是为系统部署多个调度器同时运行。但是，这种直观的想法很快就会遇到问题：怎么才能让多个调度器同时运行但不互相影响？多个调度器同时对一个 CPU 核操作时怎么能保证不会互相干扰、保证没有劣化的发生？

## 设计

### 多调度器运行路径

`sched_ext` 的 `sub scheduler` 在解决了上述问题的情况下完成了多调度器的编排设置。它的核心思路是将调度器如何编排通过**树状层级结构**来管理——父节点的调度器管理子节点调度器的权限，以及在子节点调度器本地队列为空时父节点调度器为它补充新的任务（`ops.dispatch`）。除了上述两个交互点外，多个调度器间完全互不干涉，按需运行。

下面我们从编写多调度器 scx 的角度来看，按照 `sched_ext` 调度的两种路径来讲解多调度器运行具体的设计方案。

#### 任务选择 DSQ（`ops.enqueue` 路径）

`sched_ext` 调度器路径里，一个任务从睡眠态到运行态就会由任务主动触发一次调度：决定任务应该放到哪一个 DSQ 队列上。这个路径下可以自动确认要运行的调度器，因为每一个任务所在的 cgroup 组一定是由某一个调度器调度的，可以直接通过任务所在 cgroup 组来确定它的调度器是哪一个。

```c
struct cgroup {
    // ...
#ifdef CONFIG_EXT_SUB_SCHED
	struct scx_sched __rcu *scx_sched;
#endif
    // ...
};
```

此外，为了方便一个任务快速获取它的 scx 调度器，在 `task_struct` 里也有指针可以得到这个调度器：

```c
struct task_struct {
    // ...
#ifdef CONFIG_SCHED_CLASS_EXT
	struct sched_ext_entity		scx;
#endif
    // ...
};

struct sched_ext_entity {
#ifdef CONFIG_CGROUPS
	/*
	 * Associated scx_sched. Updated either during fork or while holding
	 * both p->pi_lock and rq lock.
	 */
	struct scx_sched __rcu	*sched;
#endif
    // ...
};

/**
 * scx_task_sched - Find scx_sched scheduling a task
 * @p: task of interest
 *
 * Return @p's scheduler instance. Must be called with @p's pi_lock or rq lock
 * held.
 */
static inline struct scx_sched *scx_task_sched(const struct task_struct *p)
{
	return rcu_dereference_protected(p->scx.sched,
					 lockdep_is_held(&p->pi_lock) ||
					 lockdep_is_held(__rq_lockp(task_rq(p))));
}
```

这样一来，从编写调度器的角度来看，`ops.select_cpu`、`ops.enqueue` 等由任务触发的调度逻辑场景无需做任何修改：调度器之间完全不会互相影响，继续按照自身的选核、选 DSQ 逻辑执行即可。

### CPU 拉取任务（`ops.dispatch` 路径）

某一个 CPU 的本地队列（local DSQ）以及系统全局的队列（global DSQ）没有任务的时候，`sched_ext` 调度器会通过 `ops.dispatch` 抓取新的任务。如果依然没有任务可以运行，将会让该 CPU 陷入睡眠。

为了提供编排调度器的自由度，在 `ops.dispatch` 路径，sub scheduler 机制提供了一个新的 kfunc： `scx_bpf_sub_dispatch`。

```c
bool scx_bpf_sub_dispatch(u64 cgroup_id);
```

这个 kfunc 会触发对应某一个 `cgroup_id` 的子调度器的 `ops.dispatch` 路径。所有的子调度器都需要从根调度器开始往下一路触发 `scx_bpf_sub_dispatch` 才能被允许拉取新的任务。

当 local DSQ 和 global DSQ 为空时，内核让 `sched_ext` 的根调度器执行 `ops.dispatch`，至于根调度器选择将它自己内部的 DSQ/调度器内特殊数据结构存储的任务 `move_to_local` 还是选择 `sub_dispatch` 则是由根调度器自己决定了。

## 使用实例

从理解的角度来看，sub scheduler 比单一 `scx` 调度器就只多了上面这些概念。但是使用时还有一些需要注意的与常规 `sched_ext` 不一样的地方。

sub scheduler 新增了 2 个关键的 struct_ops 回调接口：

```c
struct sched_ext_ops {
    // ...
	/**
	 * @sub_attach: Attach a sub-scheduler
	 * @args: argument container, see the struct definition
	 *
	 * Return 0 to accept the sub-scheduler. -errno to reject.
	 */
	s32 (*sub_attach)(struct scx_sub_attach_args *args);

	/**
	 * @sub_detach: Detach a sub-scheduler
	 * @args: argument container, see the struct definition
	 *
	 * The sub-scheduler holds no caps by this point and can no longer
	 * affect any cid. Every cap reported through
	 * ops.sub_child_ecaps_updated() was also reported lost there before the
	 * sub-scheduler's tasks came back to this sched. Nothing is reported
	 * for a sub-scheduler whose enable failed before its tasks were handed
	 * over. If this sched is being disabled too, it can miss these reports.
	 * On a cpu whose loss wasn't reported, whatever was delegated, e.g.
	 * cpuperf targets, is the parent's to restore here.
	 */
	void (*sub_detach)(struct scx_sub_detach_args *args);
};

/* argument container for ops.sub_attach() */
struct scx_sub_attach_args {
	struct sched_ext_ops	*ops;
	char			*cgroup_path;
};

/* argument container for ops.sub_detach() */
struct scx_sub_detach_args {
	struct sched_ext_ops	*ops;
	char			*cgroup_path;
};
```

### 注册子调度器

`sched_ext` 调度器本质上是一个运行时 attach 的 BPF link。我们可以在用户态程序中先将子调度器的相关信息先填入，再执行 attach 操作开始执行调度器。注册子调度器的逻辑：

```c
int main(int argc, char **argv)
{
	struct scx_min_sub *skel;
	struct bpf_link *link;
	struct min_sub_arena *ma;
	const char *sub_cg_path = NULL;
	int opt, stats_intv = 5, i;
	u64 ecode;

    // ...
restart:
	optind = 1;
	skel = SCX_OPS_CID_OPEN(min_sub_ops, scx_min_sub);

	while ((opt = getopt(argc, argv, "s:c:i:vh")) != -1) {
		switch (opt) {
		case 'c': {
			struct stat st;

			if (stat(optarg, &st) < 0) {
				perror("stat");
				return 1;
			}
			skel->struct_ops.min_sub_ops->sub_cgroup_id = st.st_ino;    // 将子调度器的 cgroup id 填入
			skel->rodata->is_sub = true;
			sub_cg_path = optarg;
			break;
		}
        // ...
		default:
			fprintf(stderr, help_fmt, basename(argv[0]));
			return opt != 'h';
		}
	}

	SCX_OPS_LOAD(skel, min_sub_ops, scx_min_sub, uei);

	ma = &skel->arena->ma;

	link = SCX_OPS_ATTACH(skel, min_sub_ops, scx_min_sub);
    //...
}
```

### 卸载子调度器

```c
int main() {
    // ...
    bpf_link__destroy(link);
    ecode = UEI_REPORT(skel, uei);
    scx_min_sub__destroy(skel);
    // ...
}
```

### 完整代码

scx_min_sub.c:

```c
/* SPDX-License-Identifier: GPL-2.0 */
/*
 * scx_min_sub - loader for the minimal cgroup sub-scheduler demo.
 *
 * Run once without -c to start the root scheduler. Run a second instance with
 * -c CGROUP to attach it as a sub-scheduler beneath the root. See the
 * top-of-file comment in scx_min_sub.bpf.c for the design.
 *
 * Copyright (c) 2026 Meta Platforms, Inc. and affiliates.
 * Copyright (c) 2026 Tejun Heo <tj@kernel.org>
 */
#ifndef _GNU_SOURCE
#define _GNU_SOURCE
#endif
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <inttypes.h>
#include <signal.h>
#include <libgen.h>
#include <sys/stat.h>
#include <bpf/bpf.h>
#include <scx/common.h>
#include "scx_min_sub.h"
#include "scx_min_sub.bpf.skel.h"

const char help_fmt[] =
"A minimal cgroup sub-scheduler demo.\n"
"\n"
"Run one instance without -c as the root scheduler, then run another with\n"
"-c CGROUP to attach it beneath the root as a sub-scheduler for that cgroup.\n"
"The root gives the child the first chance to run a task on every cpu, so the\n"
"child's tasks have strict priority over the root's. This is a demo of the\n"
"mechanism, not a useful policy.\n"
"\n"
"Usage: %s [-s SLICE_US] [-c CG_PATH] [-i SEC] [-v]\n"
"\n"
"  -s SLICE_US   Override slice duration\n"
"  -c CG_PATH    Cgroup path to attach as sub-scheduler, run the root first\n"
"  -i SEC        Stats interval, seconds (default 5)\n"
"  -v            Print libbpf debug messages\n"
"  -h            Display this help and exit\n";

static bool verbose;
static volatile int exit_req;

static int libbpf_print_fn(enum libbpf_print_level level, const char *format, va_list args)
{
	if (level == LIBBPF_DEBUG && !verbose)
		return 0;
	return vfprintf(stderr, format, args);
}

static void sigint_handler(int dummy)
{
	exit_req = 1;
}

int main(int argc, char **argv)
{
	struct scx_min_sub *skel;
	struct bpf_link *link;
	struct min_sub_arena *ma;
	const char *sub_cg_path = NULL;
	int opt, stats_intv = 5, i;
	u64 ecode;

	libbpf_set_print(libbpf_print_fn);
	signal(SIGINT, sigint_handler);
	signal(SIGTERM, sigint_handler);
restart:
	optind = 1;
	skel = SCX_OPS_CID_OPEN(min_sub_ops, scx_min_sub);

	while ((opt = getopt(argc, argv, "s:c:i:vh")) != -1) {
		switch (opt) {
		case 's':
			skel->rodata->slice_ns = strtoull(optarg, NULL, 0) * 1000;
			break;
		case 'c': {
			struct stat st;

			if (stat(optarg, &st) < 0) {
				perror("stat");
				return 1;
			}
			skel->struct_ops.min_sub_ops->sub_cgroup_id = st.st_ino;
			skel->rodata->is_sub = true;
			sub_cg_path = optarg;
			break;
		}
		case 'i':
			stats_intv = atoi(optarg);
			if (stats_intv < 1)
				stats_intv = 1;
			break;
		case 'v':
			verbose = true;
			break;
		default:
			fprintf(stderr, help_fmt, basename(argv[0]));
			return opt != 'h';
		}
	}

	SCX_OPS_LOAD(skel, min_sub_ops, scx_min_sub, uei);

	ma = &skel->arena->ma;

	link = SCX_OPS_ATTACH(skel, min_sub_ops, scx_min_sub);

	if (sub_cg_path)
		printf("scx_min_sub started: sub-scheduler on %s\n", sub_cg_path);
	else
		printf("scx_min_sub started: root scheduler\n");
	fflush(stdout);

	while (!exit_req && !UEI_EXITED(skel, uei)) {
		printf("stats  : enq=%llu dsp=%llu child_cgid=%llu\n",
		       (unsigned long long)ma->nr_enqueued,
		       (unsigned long long)ma->nr_dispatched,
		       (unsigned long long)ma->child_cgid);
		fflush(stdout);

		for (i = 0; i < stats_intv && !exit_req && !UEI_EXITED(skel, uei); i++)
			sleep(1);
	}

	bpf_link__destroy(link);
	ecode = UEI_REPORT(skel, uei);
	scx_min_sub__destroy(skel);

	if (!exit_req && UEI_ECODE_RESTART(ecode))
		goto restart;
	return 0;
}
```

scx_min_sub.bpf.c:

```c
/* SPDX-License-Identifier: GPL-2.0 */
/*
 * scx_min_sub - a minimal cgroup sub-scheduler demo.
 *
 * A sub-scheduler is a whole sched_ext scheduler attached to a cgroup below
 * another, already running sched_ext scheduler. The same binary plays both
 * roles:
 *
 *   root:  started without -c. It owns all CPUs and runs a plain FIFO.
 *   child: started with -c CGROUP. It is attached under the root and runs
 *          the same FIFO, but only for tasks in that cgroup.
 *
 * Two things make this work:
 *
 *   - ops.sub_attach() is called on the root when the child attaches. It
 *     grants the child ENQ and PREEMPT caps on every online CPU. ENQ implies
 *     ENQ_IMMED and PREEMPT implies ENQ, so this hands the child full local
 *     DSQ access to those CPUs.
 *
 *   - ops.dispatch() is called with the cid (CPU) that needs a task. The root
 *     first calls scx_bpf_sub_dispatch(), which runs the child's dispatch in
 *     the root's context on the same CPU. If the child put a task there, the
 *     root is done; otherwise the root dispatches one of its own tasks.
 *
 * The result is strict priority at scheduling points: whenever a CPU needs a
 * task, the child gets the first chance to run one, on any CPU the root
 * granted it. The root runs one of its own tasks only when the child has none
 * queued. There is no fairness between the two, so a busy child can starve the
 * root's tasks. This is a demo of the mechanism, not a useful policy.
 *
 * The child is a cid-form scheduler (struct sched_ext_ops_cid), as all
 * sub-schedulers must be, and therefore must use a BPF arena map.
 *
 * Copyright (c) 2026 Meta Platforms, Inc. and affiliates.
 * Copyright (c) 2026 Tejun Heo <tj@kernel.org>
 */
#include <scx/common.bpf.h>
#include "scx_min_sub.h"

/*
 * enum scx_cap_flags is only used internally by the kernel, so it may be
 * missing from vmlinux.h depending on which types the kernel BTF happens to
 * carry. The values are ABI; supply them if the generated header lacks them.
 */
#ifndef SCX_CAP_ENQ_IMMED
#define SCX_CAP_ENQ_IMMED	(1ULL << 0)
#define SCX_CAP_ENQ		(1ULL << 1)
#define SCX_CAP_PREEMPT		(1ULL << 2)
#define SCX_CAP_PERF		(1ULL << 3)
#endif

char _license[] SEC("license") = "GPL";

/* Our own user DSQ. Names are per-scheduler, so both roles can use 0. */
#define DSQ_ID		0

const volatile u64 slice_ns = 5000000;	/* 5ms */

/* True when this instance runs as a sub-scheduler; false for the root. */
const volatile bool is_sub;

UEI_DEFINE(uei);

/*
 * cid-form schedulers must use exactly one BPF arena map. The verifier
 * associates the arena with each program that touches arena memory, so
 * @ma must be referenced from the callbacks below.
 */
struct {
	__uint(type, BPF_MAP_TYPE_ARENA);
	__uint(map_flags, BPF_F_MMAPABLE);
	__uint(max_entries, 1 << 16);		/* upper bound in pages */
#if defined(__TARGET_ARCH_arm64) || defined(__aarch64__)
	__ulong(map_extra, 0x1ull << 32);	/* user/BPF mmap base */
#else
	__ulong(map_extra, 0x1ull << 44);
#endif
} arena SEC(".maps");

struct min_sub_arena __arena_global ma;

void BPF_STRUCT_OPS(min_sub_enqueue, struct task_struct *p, u64 enq_flags)
{
	s32 cid;

	__sync_fetch_and_add(&ma.nr_enqueued, 1);

	/*
	 * Queue on our own DSQ. It is drained from ops.dispatch() below, which
	 * the kernel calls when a CPU needs a task.
	 */
	scx_bpf_dsq_insert(p, DSQ_ID, slice_ns, enq_flags);

	/*
	 * If the task would run on an idle CPU, nothing else will trigger a
	 * dispatch there, so kick its cid. On a busy CPU this is a no-op until
	 * the running task's slice ends.
	 */
	cid = scx_bpf_task_cid(p);
	if (cid >= 0 && cid < scx_bpf_nr_cids())
		scx_bpf_kick_cid(cid, 0);
}

void BPF_STRUCT_OPS(min_sub_dispatch, s32 cid, struct task_struct *prev)
{
	/*
	 * Root: let the child dispatch first on this CPU. sub_dispatch() runs
	 * the child's ops.dispatch() with our context and returns %true if it
	 * moved a task to this CPU's local DSQ.
	 */
	if (!is_sub && ma.child_cgid &&
	    scx_bpf_sub_dispatch(ma.child_cgid))
		return;

	/* Otherwise run one of our own tasks, if any. */
	if (scx_bpf_dsq_move_to_local(DSQ_ID, 0))
		__sync_fetch_and_add(&ma.nr_dispatched, 1);
}

s32 BPF_STRUCT_OPS(min_sub_sub_attach, struct scx_sub_attach_args *args)
{
	const struct scx_cmask __arena *online;
	s32 ret;

	if (ma.child_cgid)
		return -EBUSY;

	online = (const struct scx_cmask __arena *)scx_bpf_online_cmask();
	if (!online)
		return -EINVAL;

	/*
	 * Hand every online CPU to the child. A sub-sched can only hold caps
	 * its parent holds; the kernel narrows the grant accordingly and
	 * returns -EPERM for CPUs the parent can't delegate.
	 */
	ret = scx_bpf_sub_grant(args->ops->sub_cgroup_id,
				SCX_CAP_ENQ | SCX_CAP_PREEMPT, online, NULL);
	if (ret)
		return ret;

	ma.child_cgid = args->ops->sub_cgroup_id;
	bpf_printk("scx_min_sub: attached child %llu on %s",
		   ma.child_cgid, args->cgroup_path);
	return 0;
}

void BPF_STRUCT_OPS(min_sub_sub_detach, struct scx_sub_detach_args *args)
{
	/* The kernel drops the child's caps for us. */
	if (ma.child_cgid == args->ops->sub_cgroup_id)
		ma.child_cgid = 0;
	bpf_printk("scx_min_sub: detached child %llu from %s",
		   args->ops->sub_cgroup_id, args->cgroup_path);
}

s32 BPF_STRUCT_OPS_SLEEPABLE(min_sub_init)
{
	s32 ret;

	ret = scx_bpf_create_dsq(DSQ_ID, -1);
	if (ret)
		scx_bpf_error("failed to create DSQ %d (%d)", DSQ_ID, ret);
	return ret;
}

void BPF_STRUCT_OPS(min_sub_exit, struct scx_exit_info *ei)
{
	UEI_RECORD(uei, ei);
}

SCX_OPS_CID_DEFINE(min_sub_ops,
	       .flags			= SCX_OPS_ENQ_LAST,
	       .enqueue			= (void *)min_sub_enqueue,
	       .dispatch		= (void *)min_sub_dispatch,
	       .sub_attach		= (void *)min_sub_sub_attach,
	       .sub_detach		= (void *)min_sub_sub_detach,
	       .init			= (void *)min_sub_init,
	       .exit			= (void *)min_sub_exit,
	       .timeout_ms		= 5000U,
	       .name			= "min_sub");
```
