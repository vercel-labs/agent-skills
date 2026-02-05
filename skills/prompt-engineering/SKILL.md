---
name: prompt-engineering
description: Guide for generating effective prompts when building agentic systems. Use when the user asks to create, generate, or design prompts for AI agents, especially for tool-using agents, planning agents, or autonomous systems.
---

# Prompt Engineering for Agentic Systems

Generate optimized prompts for agentic systems with clear rationale for technique selection.

## Workflow

When the user requests a prompt for an agent (e.g., "create a prompt for my email processing agent"):

1. **Analyze the request** - Identify agent type, task complexity, tools available
2. **Select techniques** - Use the decision tree to choose appropriate prompting techniques
3. **Generate the prompt** - Build from the canonical template
4. **Explain the rationale** - Detail why each technique was chosen, including trade-offs

## Quick Decision Tree

For fast technique selection:

| Agent Characteristic | Recommended Technique |
|---------------------|----------------------|
| Uses tools autonomously | ReAct |
| Planning/strategy with alternatives | Tree of Thoughts |
| High-stakes correctness | Self-Consistency |
| Factual accuracy, hallucination reduction | Chain-of-Verification (CoVe) |
| Single-path complex reasoning | Chain of Thought |
| Complex decisions with trade-offs | Structured Thinking Protocol |
| Reducing bias, multiple viewpoints | Multi-Perspective Prompting |
| Uncertainty quantification | Confidence-Weighted Prompting |
| Proprietary documentation, prevent hallucinations | Context Injection with Boundaries |
| High-quality content refinement | Iterative Refinement Loop |
| Strict technical requirements | Constraint-First Prompting |
| Requires consistent format/tone | Few-Shot (supports negative examples) |
| Simple, well-defined task | Zero-Shot |
| Domain-specific expertise | Role Prompting |
| Procedural workflow | Instruction Tuning |

For the full decision tree with detailed branching logic, see [decision-tree.md](references/decision-tree.md).

## Technique Reference

All available techniques with examples, use cases, and risks: [techniques.md](references/techniques.md)

Key techniques:
- **ReAct** - For tool-using agents (reasoning + acting loop)
- **Chain of Thought** - For complex reasoning tasks
- **Chain-of-Verification (CoVe)** - For reducing hallucinations and ensuring factual accuracy
- **Few-Shot** - For enforcing patterns and format (supports negative examples)
- **Role Prompting** - For defining agent scope and expertise
- **Tree of Thoughts** - For planning and strategy
- **Self-Consistency** - For high-stakes verification
- **Zero-Shot** - For simple, well-defined tasks
- **Instruction Tuning** - For procedural workflows
- **Structured Thinking Protocol** - For complex decisions with Understand → Analyze → Strategize → Execute
- **Multi-Perspective Prompting** - For reducing bias through multiple viewpoints
- **Confidence-Weighted Prompting** - For uncertainty quantification
- **Context Injection with Boundaries** - For proprietary documentation to prevent hallucinations
- **Iterative Refinement Loop** - For high-quality content through multiple passes
- **Constraint-First Prompting** - For strict technical requirements
- **Meta-Prompting** - The nuclear option: AI generates its own perfect prompt, then executes it

## Anti-Patterns

Common mistakes to avoid: [anti-patterns.md](references/anti-patterns.md)

Critical warnings:
- Do NOT use ReAct without tools available
- Do NOT use Tree of Thoughts for deterministic problems
- Do NOT use vague roles ("expert" without scope)
- Do NOT omit stop conditions or error handling

## Canonical Template

Use this template as the foundation for all generated prompts: [template.md](references/template.md)

## Rationale Template

When explaining the generated prompt, use this structure:

```markdown
## Generated Prompt for [Agent Name/Type]

[prompt in code block]

## Rationale

**Agent Type**: [e.g., Tool-using, Planner, Conversational]

**Task Complexity**: [Simple / Multi-step / Planning-heavy]

**Techniques Used**:
- [Technique]: Why it works for this agent/use case
- [Technique]: Why it works for this agent/use case

**Expected Behavior**: [What the agent will do]

**Trade-offs**: [Cost, latency, flexibility considerations]

**Considerations**: [Edge cases, limitations, or risks]
```

## Guardrail Rule

If a prompt increases latency, token usage, or operational cost, this MUST be stated explicitly in the rationale section under "Trade-offs".
