# 内存管理

本栏目记录 Linux 内存管理（Memory Management, MM）子系统的学习与踩坑复盘。

MM 是内核里最抽象、历史包袱最重、近些年改动也最剧烈的子系统之一。它难不在单点逻辑，而在**层数多**（虚拟地址 → VMA → PTE → `struct page`/folio → rmap / anon_vma → 页回收），所以这个栏目会尽量**先立主线、再钻细节**，把每个子话题放回它所在的那条链路上。

- [私有、匿名与写时复制：一次 MAP_PRIVATE 踩坑的完整复盘](./cow-private-and-anonymous.md)
