---
title: "草稿示例：发布前的写作起点"
description: "这是一篇不会生成公开页面的草稿，用于演示发布状态。"
pubDate: "2026-09-14"
tags: ["草稿示例"]
comments: false
draft: true
homepage: true
---

## 为什么没有出现在网站上

因为 frontmatter 设置了 `draft: true`。即使同时设置 `homepage: true`，它也不会进入首页、列表、标签、搜索或 RSS，不会生成文章路由。

## 发布前替换

修改标题、摘要和正文，设置真实的 `pubDate`。完成后将 `draft` 改为 `false`，运行 `pnpm build` 检查输出。发布后再决定是否保留 `homepage: true`。
