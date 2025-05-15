import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Ethan Yao's Blogs",
  description: "各种各样的知识，操作系统、云计算、机器学习，甚至是前端...",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "sched_ext", link: "/sched_ext" },
    ],

    sidebar: {
      // "/": [
      //   {
      //     text: "Examples",
      //     items: [
      //       { text: "Markdown Examples", link: "/markdown-examples" },
      //       { text: "Runtime API Examples", link: "/api-examples" },
      //     ],
      //   },
      // ],
      "/eBPF/": [
        {
          text: "eBPF",
          items: [
            {
              text: "eBPF原理介绍",
              link: "/eBPF/1",
            },
            {
              text: "eBPF实现某个内核函数调用次数的统计",
              link: "/eBPF/2",
            },
            {
              text: "将程序部署到k8s中运行",
              link: "/eBPF/3",
            },
          ],
        },
      ],
      "/sched_ext/": [
        {
          text: "sched_ext",
          items: [
            {
              text: "sched_ext用户层接口",
              items: [
                {
                  text: "sched_ext简介",
                  link: "../sched_ext/1.md",
                },
              ],
            },
            {
              text: "sched_ext内核代码分析",
              items: [
                {
                  text: "sched_ext源码框架",
                  link: "../sched_ext/2.md",
                },
                {
                  text: "sched_ext初始化过程",
                  link: "../sched_ext/3.md",
                },
                {
                  text: "改造为msched_ext",
                  link: "../sched_ext/4.md",
                },
              ],
            },
          ],
        },
      ],
      "/k8s/": [
        {
          text: "k8s相关技术",
          items: [
            {
              text: "namespace和cgroups",
              link: "../k8s/namespace_and_cgroups.md",
            },
            {
              text: "实现一套自己的容器运行时",
              link: "../k8s/neodocker.md",
              items: [
                {
                  text: "简单容器运行时(neodocker)仓库",
                  link: "https://gitee.com/Ya_Qia/neodocker",
                },
              ],
            },
          ],
        },
      ],
      "/deep_learning": [
        {
          text: "深度学习",
          items: [
            {
              text: "第一章：引入",
              link: "../deep_learning/chapter1_intro.md",
            },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/YaQia/YaQia.github.io" },
    ],
  },
});
