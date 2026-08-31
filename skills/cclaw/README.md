# Cclaw

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)

全球首个开源喜剧 AI —— 喜剧龙虾

一款面向全场景喜剧创作者的开源 AI 喜剧创作辅助工具，专注解决从灵感构思到完整喜剧稿件“从0到1”难题。

项目定位

Cclow，喜剧龙虾。
它不只是一个工具，更是一条路。
作为全链路喜剧创作孵化平台的开源核心，它以 AI 为笔，帮每一个有表达欲的人，将自身独特喜剧视角，写成能笑、能传、能站得住的喜剧文本。

我们不制造廉价的梗，我们搭建真正的喜剧发生机制。
AI 完成“从零到一”，人完成从一到无穷。

我们在解决什么

	•	普通人心里有戏，笔下无文，有情绪却不会成稿。

	•	市面上的 AI 只懂堆砌笑点，不懂喜剧章法，更不懂人。

	•	新人写了稿，没人改、没人教、没人指路子。

	•	喜剧这一行，长期缺一个真正好用、真正懂行的工具。

核心能力

	•	一事、一情、一念，即可生成完整喜剧文本，让氛围写作变成现实。

	•	内置脱口秀、段子、喜剧短视频、漫才、Sketch、喜剧短剧、喜剧演讲等全类型结构。

	•	语言口语、节奏利落、气质鲜明，适配线上传播，也适配喜剧舞台。

	•	尊重创作者风格，不模板化，不千人一面。

	•	轻巧、可用、可延展，向更多场景开放。

谁都能用

	•	脱口秀演员、喜剧编剧、真心热爱喜剧的普通人。

	•	抖音、快手、小红书、视频号等平台的喜剧内容创作者。

	•	深耕漫才、Sketch、喜剧短剧的团队与个人。

	•	需要幽默表达、年会文案、宣传稿件、喜剧化演讲的企业与机构。

	•	每一个想把生活讲成喜剧的人。

我们想做的事

做喜剧行业的基础设施。
用 AI 拆掉创作的门槛，用体系铺好成长的道路。
让每一个心怀欢喜的人，都能站上属于自己的喜剧舞台。


## 安装

```bash
# 方式一：SkillHub CLI（推荐）
skillhub install comedy-writer

# 方式二：从 GitHub Release 安装
skillhub install https://github.com/kreator666/comedy-writer/releases/latest/download/comedy-writer.skill

# 方式三：手动安装
# 将本仓库内容放入 OpenClaw 的 skills 目录：
# ~/.qclaw/skills/comedy-writer/
```

## 使用示例

```
用户：根据这条新闻写个脱口秀
用户：帮我把这篇文章改编成漫才
用户：写个讽刺文，主题是内卷
用户：用荒诞剧的形式表达沟通的不可能
```

## 许可证

本技能采用 **CC BY-NC 4.0**（知识共享署名-非商业性）许可证。

**允许：**
- ✅ 个人使用和研究
- ✅ 非商业目的的分享和改编（需署名）

**禁止：**
- ❌ 任何商业使用（包括嵌入产品/服务收费）
- ❌ 商业授权请联系：kreator666

详见 [LICENSE](./LICENSE) 文件。

## 架构

```
├── SKILL.md                     # 技能入口 + 工作流程
├── commands.md                  # 用户命令配置
├── knowledge/                   # 知识库
│   ├── theory/                 # 喜剧理论（哈希索引）
│   │   ├── eb7cb5ef.md        # 喜剧创作核心原理（必读）
│   │   ├── ac07d434.md        # 包袱结构与铺垫节奏
│   │   ├── 126b44e8.md        # 笑的心理学机制
│   │   └── 9d01e4da.md        # 喜剧类型速查 + 推荐手法
│   └── cases/                  # 案例库（可扩展）
│       ├── standup/
│       ├── sketch/
│       ├── manzai/
│       ├── script/
│       └── parody/
├── outputs/                     # 输出模板
│   ├── standup-template.md      # 脱口秀
│   ├── sketch-template.md       # 小品
│   ├── manzai-template.md       # 漫才
│   ├── script-template.md       # 剧本
│   ├── satire-template.md       # 讽刺文
│   ├── parody-template.md       # 仿讽
│   └── absurdist-template.md    # 荒诞剧
└── references/                  # 重定向索引
    ├── comedy-theory.md         # 理论文件索引
    └── comedy-templates.md      # 模板文件索引
```