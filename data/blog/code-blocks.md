---
title: "代码块：高亮、行号与修改标记"
description: "展示代码文件标题、终端窗口、行号、重点行和增删标记，附可复制的示例。"
pubDate: "2026-09-12"
tags: ["写作", "代码"]
comments: false
homepage: true
---

技术文章可以直接使用围栏代码块。项目已配置 Expressive Code，支持语法高亮和复制按钮，深浅配色跟随系统外观。

## 文件标题与重点行

在围栏开头指定语言，添加 `title`、`showLineNumbers` 和需要强调的行号：

````markdown
```ts title="greeting.ts" showLineNumbers {2}
const name = "Astro";
const greeting = `Hello, ${name}!`;
console.log(greeting);
```
````

```ts title="greeting.ts" showLineNumbers {2}
const name = "Astro";
const greeting = `Hello, ${name}!`;
console.log(greeting);
```

## 终端命令

```sh frame="terminal" title="构建与预览"
pnpm build
pnpm preview
```

可以通过复制按钮获取命令。运行前确认终端位于项目根目录。

## 修改标记

使用 `del` 和 `ins` 标出删除与新增的行：

```ts title="站点标题示例" del={1} ins={2} showLineNumbers
const title = "Minimal Astro Blog";
const title = "我的博客";
```

这是变更对照，实际文件只保留修改后的那一行。

## 长行与横向滚动

```txt title="一条较长的示例记录"
2026-09-12 INFO article=code-blocks status=published features=syntax-highlighting,line-numbers,line-markers,copy-button theme=system
```

在窄屏上阅读这一行，可以检查代码区域的滚动体验。普通正文中的变量如 `homepageMedia` 使用行内代码即可。
