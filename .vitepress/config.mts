import { defineConfig } from "vitepress";
import { autoSidebar, autoNav } from "./sidebar";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Ethan Yao's Blogs",
  description: "各种各样的知识，操作系统、云计算、机器学习，甚至是前端...",
  markdown: {
    math: true,
  },
  themeConfig: {
    // nav 与 sidebar 均由文件系统自动生成，见 sidebar.ts。
    // 顶层专栏：首页 index.md 的 features 卡片决定 nav 顺序与文案；新增专栏只需加卡片 + 建目录。
    nav: autoNav(),

    // sidebar 由文件系统自动生成：专栏 index.md 的链接顺序即顺序，文件 H1 即文案。
    sidebar: autoSidebar(),

    // 本地搜索：构建时生成索引，纯客户端，GitHub Pages 直接可用，无需外部服务。
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索",
            buttonAriaLabel: "搜索",
          },
          modal: {
            noResultsText: "没有找到结果",
            resetButtonTitle: "清除查询",
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭",
            },
          },
        },
      },
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/YaQia/YaQia.github.io" },
    ],
  },
});
