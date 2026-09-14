---
title: "评论：连接自己的 Giscus 讨论区"
description: "说明站点级评论配置和单篇文章开关，作为启用 Giscus 前的配置示例。"
pubDate: "2026-09-03"
tags: ["配置", "评论"]
comments: false
---

模板已提供 Giscus 评论组件，但还需要绑定自己的仓库与讨论分类才能使用。示例文章统一关闭评论，方便先浏览模板内容。

## 站点级配置

在 `data/config/site.ts` 中查看 `comments`。将 `provider` 设置为 `'giscus'`，并在 `giscusConfig` 中填入自己的配置值。

| 项目字段       | 含义                        |
| :------------- | :-------------------------- |
| `repo`         | 仓库名称，形如 `owner/repo` |
| `repositoryId` | 仓库 ID                     |
| `category`     | 讨论分类名称                |
| `categoryId`   | 讨论分类 ID                 |
| `mapping`      | 文章与讨论的映射方式        |
| `lang`         | 评论界面的语言              |

使用 Giscus 配置页面生成自己的参数，再对应填入这些字段。不要把示例值当作可用的仓库配置。

## 单篇文章开关

```yaml title="关闭本文评论"
comments: false
```

准备好站点配置后，在需要讨论的文章中使用 `comments: true`。若要全站关闭，将 `comments.provider` 设为空字符串。

## 深浅色外观

`theme` 和 `darkTheme` 分别用于浅色与深色模式。评论组件会监听系统外观变化，并通知已加载的 Giscus 界面切换主题。

完成配置并启用某篇文章的评论后，再检查评论区是否加载，以及讨论是否映射到预期文章。本文展示配置说明，不代表模板已经连接了可用的在线讨论区。
