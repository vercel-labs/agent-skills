# change 完整路由对照表（30+ skill）

> 适用：change-mode（任务分诊）
> 目的：每项任务必须指向一个具体 skill，不允许"自己干"

## 路由原则

1. **每项任务必须路由到具体 skill**——不写"自己干" / "直接做"
2. **不允许路由回 requirement-clarifier**（除非用户明确说"重新澄清"）
3. **如任务跨多个 skill**：按主从关系选 1 个主路由 + 1-2 个辅助
4. **如任务没有合适 skill**：标"待开发"或"用通用 Agent"

---

## 内容创作类

| 任务 | 主路由 | 辅助 |
|---|---|---|
| 公众号/小红书长文原创 | `original-writing` | `ad-copywriting` |
| 商单/广告文案 | `ad-copywriting` | - |
| 视频脚本 | `original-writing` | 平台适配 skill |
| 小红书图文卡片 | `advanced-xhs-visual-design` | - |
| 视频号内容 | `original-writing` | `video-account-analysis` |
| 改写（保留原意） | `content-rewrite` | - |
| 翻译 | `content-rewrite` | - |
| 去 AI 味（中文） | `ai-polish` | - |
| 去 AI 味（英文） | `humanizer` | - |
| 视频转录/字幕 | `video-transcribe` | - |
| 文案风格迁移 | `content-rewrite` | `ad-copywriting` |

## 设计与开发类

| 任务 | 主路由 | 辅助 |
|---|---|---|
| 前端代码 | `frontend-design` | - |
| UI/UX 设计 | `ui-ux-pro-max` | - |
| 设计系统建立 | ⚠️ 原 `design-consultation` 已于 2026-06-14 归档;建议 `design-md-brand-kit` + `frontend-design` 组合 | `frontend-design` |
| 写代码 / 调试 | `coding-agent` | - |
| 代码审查 | `code-review` | - |
| 安全审查 | `cso` | - |
| 网站部署 | `land-and-deploy` | - |
| 性能基准 | `benchmark` | - |
| 设计审查（视觉 QA） | `design-review` | - |
| 视觉设计 | `advanced-xhs-visual-design` | - |

## 业务与战略类

| 任务 | 主路由 | 辅助 |
|---|---|---|
| 商业判断 / 战略决策 | `yizhou-thinking` | `insight` |
| 战略洞察（咨询师对话） | `insight` | - |
| 财务分析 | `finance-assistant` | - |
| 投资研究 | `us-stock-analysis` | - |
| AI 替代风险评估 | `AI-jobs-China` | - |
| 求职分析 | `jobradar` | - |
| 需求澄清（模糊任务） | `requirement-clarifier` | - |
| 项目方案审查 | `plan-ceo-review` / `plan-eng-review` / `plan-design-review` | - |

## 调研与学习类

| 任务 | 主路由 | 辅助 |
|---|---|---|
| 深度调研（多源验证） | `deep-research` | - |
| 笔记整理 / 学习 | `notes-research` | `knowledge-palace` |
| 看书 / 视频转录 | `video-transcribe` | `original-writing` |
| 知识问答 | `ima-knowledge` | - |
| 思考框架（karpathy） | `karpathy-guidelines` | - |
| 顶层思维 | `top-thinking` | - |

## 数据与媒体类

| 任务 | 主路由 | 辅助 |
|---|---|---|
| 数据分析 / 可视化 | `finance-assistant` | `us-stock-analysis` |
| 抓网页 / 抓数据 | `content-scraper` | `browser-automation` |
| 网页内容提取（纯文） | `defuddle` | - |
| 视频号分析 | `video-account-analysis` | - |
| 视频处理 | `video-transcribe` | `openmontage` |
| 跨平台追踪 | `social-media-tracker` | - |

## 技能治理类（元 skill）

| 任务 | 主路由 | 辅助 |
|---|---|---|
| 写新 Skill（从零） | `skill-creator` | - |
| 审查 / 精修 Skill | `skill-vetter` | `luban`（深度打磨） |
| 深度打磨 Skill | `luban` | - |
| 工作流编排 | `workflow-builder` | `autoplan` |
| 自动执行任务队列 | `bypass` | - |
| 主动执行（不问） | `active-agent` | - |

## 工具与浏览器

| 任务 | 主路由 | 辅助 |
|---|---|---|
| 调用外部 API | `api-gateway` | - |
| 浏览器自动化 | `browser-automation` | - |
| 浏览器 QA / dogfood | `browse` | - |
| 网页内容提取（纯文） | `defuddle` | - |
| 性能基准 | `benchmark` | - |
| 部署后监控 | `canary` | - |

## Obsidian / 知识管理

| 任务 | 主路由 | 辅助 |
|---|---|---|
| Obsidian 操作 | `obsidian-cli` | `obsidian-markdown` |
| Obsidian 模板/插件 | `obsidian-bases` / `obsidian-skills` / `obsidian-vault` | - |
| 笔记整理 | `capture` | `quick-note` |
| 想法捕捉 | `idea` | - |
| 记忆管理 | `memory-boost` | - |

## 其他

| 任务 | 主路由 | 辅助 |
|---|---|---|
| 时间/天气 | `weather-zh` | - |
| 自我改进（agent） | `self-improving-agent` | - |
| 主动行为 | `proactive-agent` | - |
| 办公时间 | `office-hours` | - |
| 静默模式 | `freeze` / `unfreeze` | - |
| 写 PPT | `yizhou-ppt` | - |
| 微信文章自动 | `wechat-mp-auto` | - |
| 小红书自动 | `xiaohongshu-auto` | - |
| 股票分析 | `us-stock-analysis` / `tokscale` | - |
| 复盘 | `retro` | - |
| 设置 | `setup-browser-cookies` / `setup-deploy` | - |
| 出海发布 | `ship` | - |
| 找 skill | `skill-finder` | - |
| 问答（CEO 视角） | `plan-ceo-review` | - |
| 人工审核 QA | `qa` / `qa-only` | - |

---

## 路由自检清单

输出分诊计划后自问：
- [ ] 每项任务都路由到具体 skill 了吗？
- [ ] 没路由回 requirement-clarifier（除非明确"重新澄清"）？
- [ ] 跨 skill 任务标了主+辅吗？
- [ ] 没找到合适 skill 的任务标"待开发"或"用通用 Agent"了吗？
- [ ] 用户能直接复制 skill 名去执行吗？
