# 柚子其实是蜜柑

个人技术博客与笔记站，正式地址为 https://www.tanedanobata.top 。使用 Astro + Fuwari 静态生成，Pagefind 提供站内搜索。

## 开发与验证

需要 Node.js 22 与 pnpm 9.14.4。

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm build
pnpm validate
pnpm preview
```

搜索索引由生产构建生成，请用 `pnpm preview` 验证搜索。Windows 若项目路径较长，可在安装时追加 `--config.virtual-store-dir-max-length=32`，缩短依赖目录，避免 Node 22 的长路径模块解析问题。

## 内容与写作

正文位于 `src/content/posts/`，使用 Markdown；个人介绍位于 `src/content/spec/about.md`。

```yaml
---
title: 文章标题
slug: unique-article-slug
published: 2026-09-16
draft: false
description: 一句话摘要
tags: [UE, 动画]
category: UE
lang: zh_CN
kind: post
directory: ''
route: /posts/unique-article-slug/
---
```

- `kind` 为 `post`、`note` 或 `directory`。目录页不进入首页、归档、分类计数和 RSS。
- 博文地址为 `/posts/<slug>/`；笔记按 `route` 保留原有层级。`directory` 记录笔记所属目录，用于知识导航。
- 所有 `slug` 必须唯一，地址登记于 `src/data/content-routes.json`；不要依赖中文文件名的自动 slug 转换。
- `published` 使用真实发布日期，不用迁移日期；草稿不会发布。
- 内链使用明确地址，如 `[TArray](/UE/Core/容器/TArray/)`；迁移后不再使用 Obsidian 双链。
- 代码使用围栏代码块，提示使用 `> [!NOTE]`，折叠内容使用 `<details>`，数学公式使用 `$...$` 或 `$$...$$`。
- 外部交互内容使用 `external-embed` 容器、带 `data-embed-src` 的按钮及原站链接；不能直接加入自动加载的 iframe。

## 迁移与维护

`docs/migration-manifest.json` 覆盖原仓库全部 78 个 Markdown 文件，记录正文迁移、排除及旧首页合并去向。`docs/migration-links.json` 记录被移除的空白笔记引用。旧博客地址重定向定义在 `vercel.json`。

验证脚本检查迁移覆盖、内部链接、标题锚点、canonical、重定向和模板残留。修改路由时，同时修改内链、地址登记和必要的永久重定向。

## 部署与回滚

继续使用 Vercel 项目 `tanedanobata-blog`，关联本仓库 `main`。项目 Node.js 版本为 22.x；安装命令为 `pnpm install --frozen-lockfile`，构建命令为 `pnpm build`，输出目录为 `dist`。

发布前运行本地验证，并在原项目验证预览部署；推送 `main` 后检查生产部署状态、正式域名、HTTPS 和代表性文章。保留上一成功部署 ID 与构建设置，异常时通过 Vercel 回滚到已记录部署并恢复设置。域名与 DNS 不随框架替换而重建。

## 来源与许可

Fuwari 基线：`saicaca/fuwari@6d39b0dec41282e7852e23e032998a5789abee28`，保留上游 MIT `LICENSE`。模板代码许可不等同于文章许可；本站未为原有文章新增 Creative Commons 授权。
