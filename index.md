---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Ethan Yao's Blogs"
  text: "操作系统 · 云计算 · 机器学习 · 前端"
  tagline: C, Rust, JavaScript, Python, Go... 在这里记录我踩过的坑与读过源码的笔记
  actions:
    - theme: brand
      text: 浏览内核专栏
      link: /kernel/
    - theme: alt
      text: 零散博客
      link: /blogs/

# 顶层专栏定义（同时是 nav 的唯一信息源，见 .vitepress/sidebar.ts 的 autoNav）
# - 有 children 的专栏 → nav 下拉分组，首页渲染为内嵌二级卡片的大区块
# - 无 children 的专栏 → nav 平级条目，首页渲染为单卡
columns:
  - title: 内核
    link: /kernel/
    details: 操作系统内核相关的学习笔记与项目实践
    children:
      - title: eBPF
        link: /kernel/ebpf/
        details: eBPF 原理、性能工具使用与容器化部署
      - title: 调度器
        link: /kernel/scheduling/
        details: sched_ext 可插拔框架、EEVDF 与实时调度数据结构
      - title: KVM 虚拟机
        link: /kernel/kvm/
        details: 克隆注意事项与 gdb 调试 libvirt/KVM 内核
  - title: 云计算
    link: /k8s/
    details: namespace/cgroups 原理与自研容器运行时 neodocker
  - title: 分布式计算
    link: /distributed_compute/
    details: MIT 6.824 分布式系统课程笔记
  - title: 深度学习
    link: /deep_learning/
    details: 《动手学深度学习》精简笔记，查漏补缺
  - title: 前端技术
    link: /frontend/
    details: SolidJS 响应式原语
  - title: 编程语言
    link: /programming_language/
    details: Go 和 Rust 等新兴编程语言
    children:
      - title: Golang
        link: /programming_language/go/
        details: interface{} 底层实现与逃逸分析
      - title: Rust
        link: /programming_language/rust/
        details: 类型系统、内存模型与异步编程
  - title: 论文阅读
    link: /papers/
    details: 精读、略读与我参与的论文工作
  - title: 零散博客
    link: /blogs/
    details: 关机权限、neovim 输入法、Drools、iSulad 等零散笔记
---
