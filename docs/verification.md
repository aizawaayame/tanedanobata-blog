# 迁移验收记录

验收日期：2026-09-16。Fuwari 基线及操作说明见 README。

- Node.js 22：Astro 类型检查 0 错误、0 警告；静态构建完成 72 个页面。
- 78 个原 Markdown 文件逐项登记：61 个迁移、16 个排除、1 个旧首页合并到关于页和简历归档。详见 migration-manifest.json。
- 构建校验通过：正文内部链接、标题锚点、canonical、永久重定向目标与无循环、排除内容、KaTeX 无错误。
- 104 个原代码围栏按容器缩进归一化后内容一致；209 个旧标题锚点保留。详见 code-preservation.json 和 src/data/legacy-anchors.json。
- 91 个正文远程图片地址在检查时均返回 HTTP 200 和图片类型；这不保证第三方资源未来持续可用。原仓库缺失的 PDF 已明确记载，见 content-notes.md。
- 本地生产构建和 Vercel 预览均检查了首页、知识目录、简历、最长代码文章、公式文章、图片、代码复制、按需加载嵌入、中文及 C++ / TArray 搜索、分类过滤与浏览器前进后退。
- 桌面 1600px、手机 390px 布局通过，无整页横向溢出；键盘可操作导航、搜索和结果。修复了云端转场后重复事件监听，最终预览已复核。
- Lighthouse 13.4.1 默认移动模拟配置，Chrome 153，本地生产构建每页三次：首页中位数 99 / LCP 1.98s / CLS 0；最长代码文章 97 / LCP 2.29s / CLS 0。原始汇总见 lighthouse-results.json；不是公网正式域名网络性能测量。
- 最终预览：https://tanedanobata-blog-c0t158sui-aizawaayames-projects.vercel.app 。原项目域名和 DNS 保留，发布配置与可回滚的旧生产部署见 deployment-rollback.json。

GitHub CI 会在 main 推送时再次执行依赖安装、类型检查、构建和内容验证。生产发布结果需以对应提交的 CI 和 Vercel 部署状态为准。
