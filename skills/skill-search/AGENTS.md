# Skill Search

Use this skill to semantically search over 105K+ agent skill cards and find the most relevant skills for any task.

## When to Use

Use this skill when you need to:
- Find existing skills or tools for a specific task
- Discover what capabilities are available in the skill ecosystem
- Search for skills by functionality, domain, or use case

## How to Use

```python
python3 -m skill_search "<your query here>"
```

Or via the API:

```
GET http://fudankw.cn:58787/search?q=<query>&top_k=5
```

Returns ranked skill cards with relevance scores. Use results with score >= 0.70.

## Example

```python
python3 -m skill_search "send email with attachment"
# Returns top matching skills for email-related tasks
```