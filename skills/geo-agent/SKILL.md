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

**GEO Agent** 是一个革命性的平台，旨在帮助开发者和营运者在 AI 时代（Google SGE, Perplexity, ChatGPT Search）通过构建结构化的产品知识库，自动生成高质量、真实、且具备强吸引力的 SEO 落地页矩阵。

## 🔑 第一步：获取您的通行证

在使用本技能之前，**您必须先拥有一个 API Key**。
请立即前往访问：[**geo.yigather.com**](https://geo.yigather.com)

1. **登录控制台**：使用您的账号登录。
2. **生成 Key**：进入左侧菜单的 **Settings > API Keys** 或 **Skills** 页面。
3. **复制密钥**：获取以 `geo_sk_` 开头的密钥，并将其设置在您的 AI 助手环境变量 `Authorization` 中（格式为：`Bearer geo_sk_xxxxxx`）。

---

## 🏗️ 什么时候使用这个技能？

- **新产品上线**：需要快速建立 10-20 个核心功能介绍页和场景落地页时。
- **SEO/GEO 攻坚**：想要占领特定的长尾搜索意图或解决 AI 问答引用率低的问题。
- **品牌矩阵扩张**：针对不同行业、不同城市、不同用户群体批量生成定制化内容。
- **维护产品事实**：确保所有 AI 生成的内容都基于您的官方知识库，而非 AI 的虚构。

---

## 🚀 核心工作流（SOP）

作为您的 GEO 战略顾问，我将引导您完成以下五个阶段：

1. **理解现状 (Phase 1-2)**:
   - 调用 `list_products` 查看您的业务盘子。
   - 调用 `get_product_overview` 获取指定产品的知识库摘要和页面现状。
   
2. **制定策略 (Phase 3)**:
   - 调用 `suggest_page_topics`。我会根据您的知识库和已有的内容，建议下一批最应该填补的内容空白（如：FAQ、竞品对比、场景应用）。

3. **批量执行 (Phase 3-4)**:
   - 调用 `batch_create_pages`。一次性为您生成多个高质量落地页草稿，确保每个页面都包含完整的 Markdown 内容、SEO 标签和 3 组以上的关键 FAQ。

4. **效果优化 (Phase 4-5)**:
   - 调用 `update_page` 迭代过时的信息。
   - 调用 `publish_page` 掌控发布节奏，按需面向全网公开。

---

## 🛠️ 工具箱说明

| 工具名 | 核心功能 |
| :--- | :--- |
| `list_products` | **前置首选**：了解当前有哪些产品正在运营。 |
| `get_product_overview` | **情报中心**：查看产品的详细知识库、总页面数及发布状态。 |
| `suggest_page_topics` | **智囊团**：自动为您规划下一波应创作的主题。 |
| `batch_create_pages` | **重火力**：大批量建立结构化的落地页草稿。 |
| `create_page` | **精耕细作**：打造单个高权重的核心精品页。 |
| `publish_page` | **司令部**：掌控页面的上线与下线。 |

---

## 📝 创作质量守则

为了确保您的内容在搜索引擎中有极高的权重，我严格遵守以下规则：
- **拒绝虚构**：所有内容必须出自您的 `ai_knowledge_base`。
- **结构完整**：正文不少于 500 字，必须包含 H2/H3 层级和列表。
- **GEO 赋能**：每个页面必须包含不少于 3 组的结构化 FAQ，这是捕获语音搜索的关键。
- **实体锚向**：必须填写 `geo_entities` 标签，方便搜索引擎进行语义关联。

## 💡 示例

用户：“帮我把我的产品 'GEO AI' 的内容矩阵扩大一下。”

1. 我会先调用 `list_products` 找到 'GEO AI' 的 ID。
2. 调用 `get_product_overview` 看看您已经写了什么，没写什么。
3. 调用 `suggest_page_topics`。
4. 建议您：“目前您还没写针对电商和医疗场景的落地页，我已经准备好了草稿，是否建立？”
5. 确认后，通过 `batch_create_pages` 完成任务。

---

🌐 更多信息请访问官方网站：[geo.yigather.com](https://geo.yigather.com)
或关注我们的 GitHub：[louislili/geo-agent-mcp](https://github.com/louislili/geo-agent-mcp)
