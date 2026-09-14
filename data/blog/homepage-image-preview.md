---
title: "首页展示：图片预览与玻璃效果"
description: "为精选文章添加本地图片预览，体验首页悬停反馈，并区分首页媒体和正文封面。"
pubDate: "2026-09-10"
tags: ["首页", "媒体"]
comments: false
homepage: true
homepageMedia: "../assets/google.png"
---

回到[首页](/)，用鼠标悬停在本文标题上，可以看到图片预览与玻璃背景反馈。键盘用户也可以用 Tab 聚焦文章链接来触发预览。

## 添加首页预览

本文使用以下配置：

```yaml title="文章 frontmatter"
homepage: true
homepageMedia: "../assets/google.png"
```

`homepage: true` 让文章参与首页筛选，首页按发布日期取最新 8 篇。图片路径相对于文章文件，这里复用模板已有资源。

## 预览图片与正文封面

`homepageMedia` 控制首页预览；`heroImage` 控制文章标题下方的封面。两者独立，可以使用不同的图片，也可以只设置其中一个。

![本文首页预览所使用的图片](../assets/google.png)

正文再次展示图片，让触屏用户直接打开文章也能看到内容。触屏设备没有鼠标悬停，预览不应承载正文里缺失的重要信息。

## 更换素材

把自己的图片放进 `data/assets/`，再更新路径。需要适应深浅色背景时，可以使用[成对主题图片](/blog/light-and-dark-themes/)。
