import { defineConfig } from "vitepress";
import { autoSidebar } from "./sidebar";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Ethan Yao's Blogs",
  description: "各种各样的知识，操作系统、云计算、机器学习，甚至是前端...",
  markdown: {
    math: true,
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // nav 仍手动维护：新增"顶层专栏"才需要改这里；子专题/文章增删由 sidebar 自动生成。
    nav: [
      { text: "首页", link: "/" },
      {
        text: "内核",
        items: [
          { text: "eBPF", link: "/kernel/ebpf/" },
          { text: "调度器", link: "/kernel/scheduling/" },
          { text: "KVM 虚拟机", link: "/kernel/kvm/" },
          { text: "内核总览", link: "/kernel/" },
        ],
      },
      { text: "云计算", link: "/k8s/" },
      { text: "分布式计算", link: "/distributed_compute/" },
      { text: "深度学习", link: "/deep_learning/" },
      { text: "论文", link: "/papers/" },
      { text: "博客", link: "/blogs/" },
    ],

    // sidebar 由文件系统自动生成，见 sidebar.ts。
    // 约定：专栏 index.md 的链接顺序即 sidebar 顺序，文件 H1（或 frontmatter.title）即条目文案。
    sidebar: autoSidebar(),

    socialLinks: [
      { icon: "github", link: "https://github.com/YaQia/YaQia.github.io" },
    ],
  },
});
