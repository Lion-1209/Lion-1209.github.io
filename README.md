# Lion 的个人小站

在代码与生活之间，留一片自由的海。

基于 [Astro](https://astro.build/) 与 [Fuwari](https://github.com/saicaca/fuwari) 模板搭建的个人网站，部署在 GitHub Pages：<https://lion-1209.github.io/>。

## 本地开发

需要 Node.js >= 20、pnpm >= 9。

| 命令 | 作用 |
| --- | --- |
| `pnpm install` | 安装依赖 |
| `pnpm dev` | 启动开发服务器（http://localhost:4321） |
| `pnpm build` | 构建生产版本到 `dist/`（含 Pagefind 搜索索引） |
| `pnpm preview` | 本地预览构建结果 |
| `pnpm new-post <文件名>` | 在 `src/content/posts/` 生成一篇带 frontmatter 的新文章 |
| `pnpm check` | 类型与模板检查 |
| `pnpm format` / `pnpm lint` | Biome 格式化 / 检查 `./src` |

## 目录结构

```
src/
├─ content/
│  ├─ posts/        # 文章（Markdown）
│  └─ spec/         # 单页内容（关于页等）
├─ pages/           # 路由：首页 / 归档 / 项目 / 关于 / 文章页
├─ components/      # 组件（Astro + Svelte）
├─ layouts/         # 页面布局
├─ styles/          # 全局样式
└─ config.ts        # 站点配置：标题、导航、头像、主题色
```

## 写文章

文章是 `src/content/posts/` 下的 Markdown 文件，frontmatter 示例：

```markdown
---
title: "文章标题"
published: 2026-01-01
description: "一句话描述"
image: ./cover.png        # 可选，封面图；相对路径或 public/ 下以 / 开头的路径
tags: ["标签"]
category: "分类"
draft: false
---
```

归档页、RSS、搜索索引均自动生成，无需手动维护。

## 站点配置

`src/config.ts` 集中管理：站点标题与副标题、导航链接（`navBarConfig`）、头像与社交链接（`profileConfig`）、主题色（`themeColor.hue`）、文章页许可协议（`licenseConfig`）。

## 部署

推送至 `main` 分支即自动触发 `.github/workflows/deploy.yml`，构建并部署到 GitHub Pages。

## License

本站基于 Fuwari（MIT License）构建，保留其原始版权声明：Copyright (c) 2024 saicaca。
