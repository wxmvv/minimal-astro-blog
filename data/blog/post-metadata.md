---
title: "文章元信息：日期、封面与草稿"
description: "一份可复制的 frontmatter 起点，展示更新日期、封面图、首页开关与草稿发布流程。"
pubDate: "2026-09-07"
tags: ["写作", "入门"]
comments: false
updatedDate: "2026-09-14"
heroImage: "../assets/blog-placeholder-4.jpg"
---

本文顶部同时显示发布日期、更新日期和封面图。这些信息来自文章开头由 `---` 包围的 frontmatter。

## 最小写作模板

```md title="data/blog/my-post.md"
---
title: "我的第一篇文章"
description: "用一句话说明读者会获得什么。"
pubDate: "2026-09-07"
tags: ["写作"]
comments: false
---

从这里开始正文。
```

`title` 和 `pubDate` 必填。摘要用于搜索、RSS 和页面元信息，即使列表没有显示摘要，也值得认真填写。

## 常用可选字段

| 字段            | 用途                            |
| :-------------- | :------------------------------ |
| `updatedDate`   | 显示文章更新日期                |
| `heroImage`     | 文章顶部的本地封面图            |
| `tags`          | 标签页与搜索关键词              |
| `categories`    | 补充内容分类，写入 RSS 分类信息 |
| `homepage`      | 是否参与首页精选，默认关闭      |
| `homepageMedia` | 首页图片、成对主题图片或视频    |
| `draft`         | 是否为草稿，默认关闭            |
| `comments`      | 是否渲染评论区，默认开启        |

`homepageOrder`、`authors` 和 `postLayout` 虽然存在于内容结构中，当前页面并未用它们实现自定义首页排序、多作者展示或布局切换。

## 更新日期与封面

```yaml
updatedDate: "2026-09-14"
heroImage: "../assets/blog-placeholder-4.jpg"
```

更新内容后手动维护 `updatedDate`。文章列表仍按 `pubDate` 排序，修改更新日期不会自动把文章置顶。

## 草稿到发布

仓库中的 `draft-example.md` 设置了 `draft: true`。草稿不会生成文章页面，也不会进入首页、文章列表、标签、搜索或 RSS；开发环境同样过滤草稿。

准备发布时，将 `draft` 改为 `false`，填写实际发布日期，然后运行 `pnpm build`。草稿状态不等于源码保密，公开仓库中的文件仍然可以被读取。
