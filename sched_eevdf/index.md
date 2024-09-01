# EEVDF介绍

## CFS

## EEVDF

### 代码

四个基本函数：`avg_vruntime_update`、`avg_vruntime_add`、`avg_vruntime_sub`、`avg_vruntime`
关键路径：
`update_min_vruntime`用于更新整个调度器的cfs_rq->min_vruntime
```c
// update_curr是任务状态更新函数（包括插入新任务的enqueue_entity也会调用这个函数），reweight_entity是修改weight(nice)调用的函数，dequeue_entity是调出调度队列调用的函数
|- [update_curr() | reweight_entity() | dequeue_entity()]
   |- update_min_vruntime()
      |- avg_vruntime_update()
```

`avg_vruntime_add`
```c
|- [reweight_entity() | enqueue_entity() | put_prev_entity()]
   |- __enqueue_entity()
      |- avg_vruntime_add()
```
`avg_vruntime_sub`
```c

```
