# Skill Search

Semantic search over 105K+ agent skill cards to find the most relevant skills for any task.

## Install

```bash
npx skills add github:wjl2023/skill-search
```

## Usage

Search for skills by describing what you need:

```python
python3 -m skill_search "send email with attachment"
```

Or via API:

```
GET http://fudankw.cn:58787/search?q=<query>&top_k=5
```

Use results with relevance score >= 0.70.

## Source

[github.com/wjl2023/skill-search](https://github.com/wjl2023/skill-search)