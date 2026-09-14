---
title: "从这里开始：模板功能导览"
description: "用一组可以直接浏览和复制的示例，认识这个博客模板的写作、媒体展示与内容发现功能。"
pubDate: "2026-09-14"
tags: ["模板", "入门"]
comments: false
homepage: true
---

这组文章既是模板的演示内容，也是写作时可以复制的起点。先看首页的媒体预览，再打开文章体验排版、目录和代码块；准备发布自己的内容时，按需替换这些示例即可。

## 写作与排版

- [Markdown 排版指南](/blog/markdown-style-guide/)：标题、引用、列表、表格、脚注与图片。
- [代码块展示](/blog/code-blocks/)：语法高亮、文件名、行号、重点行与复制。
- [MDX 图文布局](/blog/mdx-media-and-layouts/)：本地图片、视频和响应式双列。
- [文章元信息](/blog/post-metadata/)：日期、摘要、封面与草稿。

## 首页与阅读体验

- [首页图片预览](/blog/homepage-image-preview/)：图片预览与玻璃悬停效果。
- [首页视频预览](/blog/homepage-video-preview/)：悬停播放的本地视频。
- [深浅色主题](/blog/light-and-dark-themes/)：跟随系统外观切换图片。
- [文章目录](/blog/table-of-contents/)：长文中的章节导航。

## 发现与订阅

- [搜索与标签](/blog/search-tags-and-pagination/)：按标题、摘要和标签查找内容。
- [RSS 与站点信息](/blog/rss-and-metadata/)：订阅文章与分享元信息。
- [评论配置](/blog/comments/)：连接自己的 Giscus 评论区。

[全部文章](/blog/)保留了足够的示例来展示分页，可以继续打开[第二页](/blog/page/2/)。

## 换成自己的博客

先修改 `data/config/site.ts` 中的站点名称、作者、简介和域名，再更新导航、项目与关于页面。在 `data/blog/` 新建 `.md` 或 `.mdx` 文件，运行 `pnpm build` 检查内容能否正常生成。

首页只展示设置了 `homepage: true` 的文章，按发布日期从新到旧取前 8 篇。本文没有配置预览媒体，可以用来体验纯文字首页条目。
