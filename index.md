---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Ethan Yao's Blogs"
  text: "这里有各种各样知识：操作系统、云计算、机器学习，甚至是前端..."
  tagline: C, Rust, JavaScript, Python, Go...
  actions:
    - theme: brand
      text: 专题项目
      link: ./projects_link.md
    - theme: alt
      text: 零散博客
      link: ./blogs_link.md

features:
  - title: sched_ext
    details: 介绍和改造Linux 6.12引入的最新的用户可以自行编写、热插拔的调度器框架
    link: ./sched_ext/index.md
  - title: eBPF
    details: 解读eBPF原理与将eBPF作为性能分析工具的常见用法
    link: ./eBPF/index.md
  - title: 云计算技术
    details: 记录了namespace和cgroups的技术原理和自己实现的容器运行时
    link: ./k8s/index.md
  - title: 深度学习
    details: 主要是《动手学深度学习》的内容的精简浓缩记录，针对个人之前没接触过/不熟悉的概念的查漏补缺
    link: ./deep_learning/index.md
---
