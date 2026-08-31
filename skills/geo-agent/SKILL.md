---
name: geo-agent
description: 专业的 GEO（生成式引擎优化）战略工具。基于产品知识库自动构建覆盖全生命周期的 SEO 落地页矩阵，帮助您的产品占领 AI 搜索引擎的认知高地。
metadata:
  tags: [seo, geo, ai-writing, content-strategy, landing-page, automation]
  version: 1.2.0
  author: Louis Lili
  homepage: https://geo.yigather.com
---

# GEO Agent — 产品影响力构建战略助手

**GEO Agent** 是一个革命性的平台，旨在帮助开发者和运营者在 AI 时代（Google SGE, Perplexity, ChatGPT Search）通过构建结构化的产品知识库，自动生成高质量、真实、且具备强吸引力的 SEO 落地页矩阵。

## 🔑 第一步：获取您的通行证

在使用本技能之前，**您必须先拥有一个 API Key**。
请立即前往访问：[**geo.yigather.com**](https://geo.yigather.com)

1. **登录控制台**：使用您的账号登录。
2. **生成 Key**：进入左侧菜单的 **Settings > API Keys** 或 **Skills** 页面。
3. **复制密钥**：获取以 `geo_sk_` 开头的密钥，并将其设置在您的 AI 助手环境变量 `Authorization` 中（格式为：`Bearer geo_sk_xxxxxx`）。

---

## 何时使用

- **新产品上线**：需要快速建立 10-20 个核心功能介绍页和场景落地页时。
- **SEO/GEO 攻坚**：想要占领特定的长尾搜索意图或解决 AI 问答引用率低的问题。
- **品牌矩阵扩张**：针对不同行业、不同城市、不同用户群体批量生成定制化内容。
- **维护产品事实**：确保所有 AI 生成的内容都基于您的官方知识库，而非 AI 的虚构。

## 步骤

1. **获取情报**：调用 `get_product_overview`，了解所选产品现在的总页面数发布率、获取知识库。
2. **全盘扫描**：调用 `list_pages` 或直接调用 `suggest_page_topics` 分析我们该朝哪个方向落子。
3. **战略提议**：向用户提议："目前您的产品覆盖了 X 个功能，我建议优先扩充【使用场景】和【客户 FAQ】。"
4. **批量执行**：用户确认后，使用 `batch_create_pages` 大批量建立结构化的落地页草稿。
5. **最终交付**：向用户报备结果，告知这些新内容的 `publish_url` 地址。

## 工具使用

- **`list_products`**: 获取所有产品列表。
- **`get_product_overview`**: 获取特定产品的统计快照和知识库内容。
- **`suggest_page_topics`**: 自动获得具有高优先级的下一批建议主题列表。
- **`batch_create_pages`**: 规模化批量建立站点内容（非常适合拓展期使用）。
- **`publish_page`**: 掌控页面的上线与下线战略。

## 示例

**用户**：“帮我把我的产品 'GEO AI' 的内容矩阵扩大一下。”

1. **调用工具**：先调用 `list_products` 找到 'GEO AI' 的 ID。
2. **现状分析**：调用 `get_product_overview` 发现核心功能覆盖已全，但 FAQ 较少。
3. **选题建议**：调用 `suggest_page_topics` 得到针对电商场景的建议。
4. **批量创建**：通过 `batch_create_pages` 建立 5 个针对性页面。
5. **结果反馈**：提供页面链接给用户，并引导用户去 `geo.yigather.com` 查看渲染效果。

---

🌐 更多信息请访问官方网站：[geo.yigather.com](https://geo.yigather.com)
