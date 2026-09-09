# Minimal Astro Blog

A minimal blog and portfolio built with Astro, React, and Tailwind CSS.

Markdown & MDX · Search · Dark mode · RSS · Giscus comments

English · [简体中文](./README.zh-CN.md)

## Start

Requires Node.js 22.12.0+

```sh
pnpm install
pnpm dev
```

Open `http://localhost:4321`.

## Make it yours

- [Site settings](./data/config/site.ts) — title, author, site URL, search, and comments.
- [Navigation](./data/config/navigation.ts) and [projects](./data/config/projects.ts).
- [About page](./data/about/about.md).

Replace the sample content and set `siteMetadata.siteUrl` to your domain. For comments, fill in `comments.giscusConfig` or set `comments.provider` to `''` to disable them.

## Write

Add a Markdown or MDX file to `data/blog/`:

```md
---
title: "Hello, world"
pubDate: "2026-09-09"
homepage: true
---

A fresh start.
```

Use `draft: true` to keep a post unpublished. Add `homepageMedia` for an image or video preview. See the [content schema](./src/content.config.ts) for more options.

## Deploy

```sh
pnpm build
```

Publish `dist/` to your static host. Run `pnpm preview` to preview locally.

---

Built on the Astro blog starter. Inspired by [nelson](https://nelson.co/)

The old nextjs version is [here](https://github.com/wxmvv/minimal-tailwind-nextjs-blog).