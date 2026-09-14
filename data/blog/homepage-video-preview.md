---
title: "首页展示：悬停视频预览"
description: "用本地 MP4 作为首页文章预览，展示静音循环播放与正文视频的独立配置方式。"
pubDate: "2026-09-09"
tags: ["首页", "媒体"]
comments: false
homepage: true
homepageMedia: "../assets/video/smile_in_the_morning.mp4"
---

在[首页](/)悬停或用键盘聚焦本文链接，可以体验本地视频预览。预览使用静音循环播放，离开后会在预览关闭时暂停。

## 配置视频路径

```yaml title="文章 frontmatter"
homepage: true
homepageMedia: "../assets/video/smile_in_the_morning.mp4"
```

当前支持相对路径指向的 MP4、WebM 和 OGG 文件。视频由构建工具输出到站点资源目录，不需要填写外部播放器地址。

## 播放行为

首页会尝试播放当前激活的预览。浏览器自动播放限制可能阻止播放；系统开启减少动态效果时，预览视频也不会自动播放。视频是辅助展示，文章链接仍可直接打开。

## 在正文中展示视频

`homepageMedia` 不会自动把播放器插入正文。需要暂停、拖动或主动播放时，可以将文章写成 MDX 并导入视频：

```mdx
import previewVideo from "../assets/video/smile_in_the_morning.mp4";

<video controls playsInline preload="metadata" aria-label="作品视频">
  <source src={previewVideo} type="video/mp4" />
</video>
```

可实际操作的正文播放器见 [MDX 媒体示例](/blog/mdx-media-and-layouts/)。
