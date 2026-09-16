# 内容迁移核对

- 原始 78 个 Markdown 文件：61 个迁移、16 个排除、1 个旧首页合并到简历归档。逐项见 `migration-manifest.json`。
- 104 个原围栏代码块逐行核对；仅统一制表符及 MkDocs 容器缩进，没有删除代码内容。见 `code-preservation.json`。
- 旧生产站点的标题锚点保存于 `src/data/legacy-anchors.json`，构建时在对应标题保留锚点别名。原站站点地图的地址覆盖见 `legacy-url-coverage.json`。
- 原生产部署未包含“远征 IM@S Live”，旧地址返回 404；该篇存在于仓库，已迁移，并按原构建规则预备永久重定向。
- “图形学基础”有一处分隔符与中文混写，已拆开数学块与正文。“贝塞尔曲线”中两处 `\sum_^{n}` 缺少下标内容，改为 `\sum^{n}`；嵌套 `align` 改为 `aligned`。仅修正渲染语法。
- “贝塞尔曲线”原文引用 `preview-9781483296999_A23889377.pdf`，原仓库没有该文件。保留文件名并标注缺失，没有伪造附件链接。
- 91 个不同外部图片 URL 的 HEAD 检查全部返回 HTTP 200 且为图片类型，结果见 `external-images.json`。这是检查时的可达性，不保证外部服务未来可用。地址保持原样。

原仓库资源中的 `Extras/Media/9AC5E41A.png` 未被正文引用；MkDocs 字典、CSS、MathJax 及主题脚本不属于文章资源，不进入新站构建。
