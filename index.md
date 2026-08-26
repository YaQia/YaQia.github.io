---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Ethan Yao's Blogs"
  text: "操作系统 · 云计算 · 机器学习 · 前端"
  tagline: C, Rust, JavaScript, Python, Go... 在这里记录我踩过的坑与读过源码的笔记
  actions:
    - theme: brand
      text: 专题项目
      link: /kernel/
    - theme: alt
      text: 零散博客
      link: /blogs/

features:
  - title: eBPF
    details: eBPF 原理介绍、性能工具使用与将 eBPF 程序容器化部署到 k8s 的实践
    link: /kernel/ebpf/
  - title: 调度器
    details: 实时调度数据结构（percpu、sched_class、rt_rq）、sched_ext 可插拔调度框架与 EEVDF 算法分析
    link: /kernel/scheduling/
  - title: KVM 虚拟机
    details: KVM 克隆时必须注意的标识符问题，以及用 gdb 调试 libvirt/KVM 内核的方法
    link: /kernel/kvm/
  - title: 云计算与容器
    details: namespace 与 cgroups 原理，以及自己动手实现的一套容器运行时 neodocker
    link: /k8s/
  - title: 分布式计算
    details: MIT 6.824 分布式系统课程笔记：抽象、一致性、容错与可扩展性
    link: /distributed_compute/
  - title: 深度学习
    details: 《动手学深度学习》精简浓缩笔记，针对个人不熟悉概念的查漏补缺
    link: /deep_learning/
  - title: 前端技术
    details: SolidJS 响应式原语与 2.0 Beta 的新机制预览
    link: /frontend/
  - title: Go 语言
    details: Go interface{} 底层实现与逃逸分析
    link: /go/
  - title: 论文阅读
    details: 精读、略读与自己参与的论文工作，覆盖调度、QoS、Serverless 等方向
    link: /papers/
  - title: 零散博客
    details: 关机权限、neovim 输入法、Drools 规则引擎、iSulad 沙箱、内核 compile_commands 等零散笔记
    link: /blogs/
---
