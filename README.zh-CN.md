# Minimal Astro Blog

基于 Astro、React 和 Tailwind CSS 的极简博客与作品集。

Markdown & MDX · 文章搜索 · 深色模式 · RSS · Giscus 评论

[English](./README.md) · 简体中文

## 开始

需要 Node.js 22.12.0+ 和 pnpm。

```sh
pnpm install
pnpm dev
```

打开 `http://localhost:4321`。

## 换成你的内容

- [站点配置](./data/config/site.ts) — 标题、作者、站点网址、搜索和评论。
- [导航](./data/config/navigation.ts)与[项目](./data/config/projects.ts)。
- [关于页面](./data/about/about.md)。

替换示例内容，并将 `siteMetadata.siteUrl` 设为你的域名。使用评论前，填写 `comments.giscusConfig`；或将 `comments.provider` 设为 `''` 以禁用评论。

## 写作

在 `data/blog/` 中添加 Markdown 或 MDX 文件：

```md
---
title: "Hello, world"
pubDate: "2026-09-09"
homepage: true
---

一个新的开始。
```

使用 `draft: true` 将文章设为草稿。添加 `homepageMedia` 可展示图片或视频预览。更多选项见[内容结构定义](./src/content.config.ts)。

## 部署

```sh
pnpm build
```

将 `dist/` 发布到静态托管服务。使用 `pnpm preview` 在本地预览。

---

基于 Astro 博客起始模板，灵感来自 [Bear Blog](https://github.com/HermanMartinus/bearblog/)。

这里有 [旧的nextjs版本](https://github.com/wxmvv/minimal-tailwind-nextjs-blog) .
