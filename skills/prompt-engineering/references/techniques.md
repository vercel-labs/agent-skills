# Prompt Technique Reference for Agentic Systems

Reference guide for prompting techniques used in agentic systems. Each technique includes when to use it, why it works for agents, and potential risks.

## Zero-Shot

**Use when**: Simple, clear tasks that are well-defined

**Why it works for agents**: Minimal overhead, fastest execution

**Risk**: Ambiguity if task is underspecified

**Example**:
```
You are a notification dispatcher. Send the alert to all subscribers.
```

---

## Few-Shot

**Use when**: Enforcing structure, tone, or behavioral patterns

**Why it works for agents**: Pattern learning from examples establishes consistent behavior

**Risk**: Inconsistent examples degrade output quality

**Variations**:
- **Positive examples**: Show desired outputs
- **Negative examples**: Show what NOT to output (especially valuable for avoiding common mistakes)

**Example (with negative examples)**:
```
You are a data validator. Check inputs for validity:

Valid examples:
Input: "user@example.com"
Output: {"valid": true, "reason": "proper email format"}

Input: "user.name@company.co.uk"
Output: {"valid": true, "reason": "proper email format"}

Invalid examples (what NOT to accept):
Input: "user@.com"
Output: {"valid": false, "reason": "invalid domain format"}

Input: "@example.com"
Output: {"valid": false, "reason": "missing local part"}

Input: "user example.com"
Output: {"valid": false, "reason": "missing @ symbol"}

Now validate: {input}
```

**When to include negative examples**:
- When agents frequently make specific errors
- When edge cases are common
- When you need to explicitly forbid certain patterns

---

## Chain of Thought (Implicit)

**Use when**: Single-path reasoning, logical deduction required

**Why it works for agents**: Improves logical accuracy by making reasoning explicit

**Risk**: Overuse increases cost and latency

**Example**:
```
You are a route optimizer. Think step-by-step to find the shortest path:

1. List all possible routes
2. Calculate distance for each
3. Select the minimum
```

---

## Structured Thinking Protocol

**Use when**: Complex problem-solving requiring systematic analysis, strategic planning, or when you want the agent to show explicit reasoning layers

**Why it works for agents**: Forces thinking in explicit phases (Understand → Analyze → Strategize → Execute), reducing jumping to conclusions and ensuring comprehensive analysis

**Risk**: Higher latency; overkill for simple or well-defined problems

**Template**:
```markdown
Before answering, complete these steps:

[UNDERSTAND]
- Restate the problem in your own words
- Identify what's actually being asked

[ANALYZE]
- Break down into sub-components
- Note any assumptions or constraints

[STRATEGIZE]
- Outline 2-3 potential approaches
- Evaluate trade-offs

[EXECUTE]
- Provide your final answer
- Explain your reasoning

Question: [your question]
```

**Example**:
```markdown
Before answering, complete these steps:

[UNDERSTAND]
- Restate the problem in your own words
- Identify what's actually being asked

[ANALYZE]
- Break down into sub-components
- Note any assumptions or constraints

[STRATEGIZE]
- Outline 2-3 potential approaches
- Evaluate trade-offs

[EXECUTE]
- Provide your final answer
- Explain your reasoning

Question: Should I use microservices or monolith for a 5-person startup building a B2B SaaS with 1000 expected users in year one?

[UNDERSTAND]
The question is asking for an architectural recommendation (microservices vs monolith) for a specific context: small team (5 people), B2B SaaS product, moderate scale (1000 users).

[ANALYZE]
Sub-components:
- Team size constraints (5 people = limited cognitive bandwidth)
- User scale (1000 users = moderate, not massive)
- Business type (B2B SaaS = likely needs reliability and iteration speed)
- Development speed vs. operational complexity trade-off
Assumptions:
- Team has full-stack capabilities
- Time-to-market is important for startup

[STRATEGIZE]
Approach 1: Monolith
- Pros: Faster development, simpler deployment, easier debugging with small team
- Cons: Harder to scale individual components later
Approach 2: Microservices
- Pros: Independent scaling, technology flexibility
- Cons: High operational overhead, distributed complexity, network latency
Approach 3: Modular monolith
- Pros: Best of both - structure of microservices without operational complexity
- Cons: Requires disciplined architecture

[EXECUTE]
Recommendation: Start with modular monolith
Reasoning: With 5 people and 1000 users, microservices add unnecessary complexity. A well-structured monolith allows you to move fast while keeping the option to extract services later if specific components need independent scaling.
```

**When to use Structured Thinking vs Chain of Thought**:
- Structured Thinking: For complex decisions requiring multiple approaches and trade-off analysis
- Chain of Thought: For straightforward logical reasoning or step-by-step problem solving

---

## Tree of Thoughts

**Use when**: Planning, strategy, or exploring multiple solution branches

**Why it works for agents**: Explores alternatives before committing, enables backtracking

**Risk**: Unnecessary for deterministic problems, higher cost

**Example**:
```
You are a strategic planner. Generate 3 possible approaches, evaluate each, then select the best:

Approach 1: [description]
Pros: ...
Cons: ...

Approach 2: [description]
Pros: ...
Cons: ...

Approach 3: [description]
Pros: ...
Cons: ...

Selected: Approach X because...
```

---

## Self-Consistency

**Use when**: High-stakes correctness, verification required

**Why it works for agents**: Multiple reasoning paths reduce errors through majority voting

**Risk**: Higher latency and cost (multiple generations)

**Example**:
```
You are a safety validator. Reason through the problem three times independently:

Reasoning 1: ...
Conclusion: ...

Reasoning 2: ...
Conclusion: ...

Reasoning 3: ...
Conclusion: ...

Final answer: [most frequent conclusion]
```

---

## Chain-of-Verification (CoVe)

**Use when**: Reducing hallucinations, ensuring factual accuracy, fact-checking critical information

**Why it works for agents**: The model generates an answer, then generates verification questions, answers them, and refines the original response. Models are more accurate at answering simpler verification questions than complex original queries.

**Risk**: Higher latency and cost; requires multiple passes through the problem

**Template**:
```markdown
Task: [your question]

Step 1: Provide your initial answer
Step 2: Generate 5 verification questions that would expose errors in your answer
Step 3: Answer each verification question
Step 4: Provide your final, corrected answer based on verification
```

**Example**:
```markdown
Task: Explain how transformers handle long-context windows

Step 1: Provide your initial answer
[Model generates initial explanation...]

Step 2: Generate 5 verification questions that would expose errors in your answer
1. What is the maximum context window size for GPT-4?
2. How do attention mechanisms scale with sequence length?
3. What techniques are used to extend context windows beyond training length?
4. What are the computational limitations of long contexts?
5. How do caching strategies affect long-context performance?

Step 3: Answer each verification question
[Model answers each question factually...]

Step 4: Provide your final, corrected answer based on verification
[Model refines original answer with verified facts...]
```

**When to use CoVe instead of Self-Consistency**:
- CoVe: For factual accuracy and hallucination reduction
- Self-Consistency: For reasoning consistency and logical correctness

---

## Confidence-Weighted Prompting

**Use when**: Uncertainty quantification is important, decision-making under uncertainty, or when you need the agent to acknowledge limitations

**Why it works for agents**: Forces the model to explicitly rate confidence, state assumptions, and provide alternatives—reducing overconfidence and improving decision quality

**Risk**: Slightly higher latency; may cause agents to be overly cautious

**Template**:
```markdown
Answer this question: [question]

For your answer, provide:
1. Your primary answer
2. Confidence level (0-100%)
3. Key assumptions you're making
4. What would change your answer
5. Alternative answer if you're <80% confident
```

**Example**:
```markdown
Answer this question: Will Rust replace C++ in systems programming by 2030?

For your answer, provide:
1. Your primary answer
2. Confidence level (0-100%)
3. Key assumptions you're making
4. What would change your answer
5. Alternative answer if you're <80% confident

1. Primary answer: Rust will significantly increase adoption but NOT fully replace C++ by 2030. C++ will remain dominant in legacy systems and performance-critical domains.

2. Confidence level: 65%

3. Key assumptions:
   - C++ standard continues evolving (C++26, C++29)
   - Rust's ecosystem matures butInterop challenges persist
   - Major tech companies continue gradual migration, not wholesale replacement
   - No breakthrough in C++ memory safety without performance trade-offs

4. What would change my answer:
   - If Rust adds seamless C++ interop at zero cost
   - If a major security vulnerability forces C++ rewrites
   - If Rust becomes mandatory in government/security contracts

5. Alternative answer (since <80% confident): Rust becomes the default for NEW systems programming projects while C++ maintains dominance in existing codebases. Coexistence becomes the norm with clear boundaries: Rust for greenfield, C++ for brownfield.
```

---

## Context Injection with Boundaries

**Use when**: Working with proprietary documentation, internal APIs, or any scenario where you must prevent hallucinations from external knowledge

**Why it works for agents**: Injects massive context while setting clear boundaries on what matters—eliminating hallucinations when working with proprietary systems

**Risk**: Requires high-quality context; poor context leads to "Insufficient information" responses

**Template**:
```markdown
[CONTEXT]
[paste your documentation, code, research paper]

[FOCUS]
Only use information from CONTEXT to answer. If the answer isn't in CONTEXT, say "Insufficient information in provided context."

[TASK]
[your specific question]

[CONSTRAINTS]
- Cite specific sections when referencing CONTEXT
- Do not use general knowledge outside CONTEXT
- If multiple interpretations exist, list all
```

**Example**:
```markdown
[CONTEXT]
[paste your company's 50-page API documentation]

[FOCUS]
Only use information from CONTEXT to answer. If the answer isn't in CONTEXT, say "Insufficient information in provided context."

[TASK]
How do I implement rate limiting with retry logic for the /users endpoint?

[CONSTRAINTS]
- Cite specific sections when referencing CONTEXT
- Do not use general knowledge outside CONTEXT
- If multiple interpretations exist, list all
```

**When to use Context Injection instead of RAG**:
- Context Injection: For bounded, specific tasks with clear documentation
- RAG: For open-ended queries across large, dynamic knowledge bases

---

## Iterative Refinement Loop

**Use when**: Creating high-quality content, refining outputs, or when production-ready quality is required

**Why it works for agents**: Chains prompts to refine outputs through multiple passes, each iteration addressing weaknesses from the previous one

**Risk**: Higher latency and cost (multiple passes); overkill for simple tasks

**Template**:
```markdown
[ITERATION 1]
Create a [draft/outline/initial version] of [task]

[ITERATION 2]
Review the above output. Identify 3 weaknesses or gaps.

[ITERATION 3]
Rewrite the output addressing all identified weaknesses.

[ITERATION 4]
Final review: Is this production-ready? If not, what's missing?
```

**Example**:
```markdown
[ITERATION 1]
Create a draft sales email for reaching out to engineering VPs at Series B startups about our CI/CD optimization tool

[ITERATION 2]
Review the above output. Identify 3 weaknesses or gaps.
[Model identifies: generic opening, unclear value proposition, weak call-to-action]

[ITERATION 3]
Rewrite the output addressing all identified weaknesses.
[Model produces refined email with specific pain points, metrics, and clear CTA]

[ITERATION 4]
Final review: Is this production-ready? If not, what's missing?
[Model evaluates and makes final polish or declares production-ready]
```

**When to use Iterative Refinement vs single-pass generation**:
- Iterative Refinement: For content quality, copywriting, or when multiple review cycles are needed
- Single-pass: For straightforward tasks, internal drafts, or when speed is priority

---

## Constraint-First Prompting

**Use when**: Technical implementation with strict requirements, or when you need to prevent "technically correct but practically useless" answers

**Why it works for agents**: Google Brain researchers found that stating constraints FIRST forces the model to plan within boundaries before generating—avoiding solutions that look good but violate critical requirements

**Risk**: Over-constraining may limit creative solutions; ensure constraints are truly necessary

**Template**:
```markdown
HARD CONSTRAINTS (cannot be violated):
- [constraint 1]
- [constraint 2]
- [constraint 3]

SOFT PREFERENCES (optimize for these):
- [preference 1]
- [preference 2]

TASK: [your actual request]

Confirm you understand all constraints before proceeding.
```

**Example**:
```markdown
HARD CONSTRAINTS (cannot be violated):
- Must be written in Rust
- Cannot use any external dependencies
- Must compile on stable Rust 1.75+
- Maximum binary size: 5MB

SOFT PREFERENCES (optimize for these):
- Fast compilation time
- Minimal memory allocation

TASK: Write a CLI tool that parses 10GB CSV files and outputs JSON with schema validation

Confirm you understand all constraints before proceeding.
```

**When to use Constraint-First vs standard task-first prompting**:
- Constraint-First: For technical tasks with non-negotiable requirements (language, dependencies, performance, size)
- Task-First: For exploratory tasks where constraints emerge during discussion

---

## Multi-Perspective Prompting

**Use when**: Complex decision-making, reducing bias, or when you need comprehensive analysis from multiple angles

**Why it works for agents**: Forces analysis through multiple viewpoints (technical, business, UX, security, etc.)—reducing single-perspective bias and improving decision quality

**Risk**: Higher latency; may produce conflicting recommendations requiring resolution

**Template**:
```markdown
Analyze [topic/problem] from these perspectives:

[PERSPECTIVE 1: Technical Feasibility]
[specific lens]

[PERSPECTIVE 2: Business Impact]
[specific lens]

[PERSPECTIVE 3: User Experience]
[specific lens]

[PERSPECTIVE 4: Risk/Security]
[specific lens]

SYNTHESIS:
Integrate all perspectives into a final recommendation with trade-offs clearly stated.
```

**Example**:
```markdown
Analyze "Should we move from monolith to microservices?" from these perspectives:

[PERSPECTIVE 1: Technical Feasibility]
- Current team size: 5 engineers
- Expertise: Full-stack generalists
- Infrastructure: Basic Docker, no Kubernetes
- Assessment: Low feasibility—team lacks distributed systems experience

[PERSPECTIVE 2: Business Impact]
- Time to market: Critical (3 months to MVP)
- Scale: 1000 users expected in year 1
- Cost: Microservices increase operational costs by 3-5x
- Assessment: Negative impact—delays MVP, increases burn rate

[PERSPECTIVE 3: User Experience]
- Performance: Current monolith handles 1000 users easily
- Reliability: Microservices add network failure points
- Assessment: Neutral/negative—no user benefit, more failure modes

[PERSPECTIVE 4: Risk/Security]
- Complexity: Microservices increase attack surface
- Monitoring: Need distributed tracing (not budgeted)
- Assessment: Higher risk—security and observability gaps

SYNTHESIS:
Recommendation: Stay with monolith for now
Trade-offs:
- Sacrifice: Independent scaling (not needed at 1000 users)
- Gain: Faster time-to-market, lower operational cost
- Future: Modular monolith allows extraction later when scale justifies it
```

**When to use Multi-Perspective vs single-perspective analysis**:
- Multi-Perspective: For strategic decisions, architecture choices, or when bias reduction is critical
- Single-perspective: For well-scoped technical problems or when speed is priority

---

## Role Prompting

**Use when**: Domain expertise, specific perspective, or bounded authority required

**Why it works for agents**: Narrows reasoning space, establishes scope and boundaries

**Risk**: Vague roles (e.g., "expert") reduce effectiveness

**Example**:
```
You are a senior security analyst with 10 years of incident response experience.
Your scope is limited to web application vulnerabilities.
You must NOT make infrastructure or network-level recommendations.
```

---

## Instruction Tuning

**Use when**: Procedural workflows, step-by-step execution required

**Why it works for agents**: Structured, numbered instructions ensure predictable execution

**Risk**: Rigid behavior, reduced adaptability

**Example**:
```
You are a data processor. Execute these steps in order:

1. Validate input format
2. Remove duplicates
3. Normalize timestamps
4. Output as JSON

Do not skip steps or reorder.
```

---

## ReAct (Reasoning + Acting)

**Use when**: Tool-using agents that need to reason about actions

**Why it works for agents**: Couples reasoning and action in a loop, enables autonomous tool use

**Risk**: MUST NOT be used without real tools available

**Example**:
```
You are a research agent. Use the available tools to gather information:

Thought: I need to find recent papers on the topic.
Action: search(query="recent papers LLM agents")
Observation: [tool output]

Thought: The results are too broad. I should narrow the search.
Action: search(query="LLM agents 2024 arxiv")
Observation: [tool output]

Thought: I have enough information. I'll now summarize.
Action: finish(summary="...")
```

---

## Meta-Prompting (The Nuclear Option)

**Use when**: Complex tasks where you're unsure how to structure the prompt, or when you want the AI to optimize its own instructions

**Why it works for agents**: The AI analyzes what would make the perfect prompt for the goal, writes it, then executes it—like having a prompt engineer working in real-time

**Risk**: Higher latency (two-step process); requires capable model

**Template**:
```markdown
I need to accomplish: [high-level goal]

Your task:
1. Analyze what would make the PERFECT prompt for this goal
2. Consider: specificity, context, constraints, output format, examples needed
3. Write that perfect prompt
4. Then execute it and provide the output

[GOAL]: [your actual objective]
```

**Example**:
```markdown
I need to accomplish: Build a Python script that scrapes Twitter threads, converts them to blog posts with proper formatting, and auto-generates SEO meta descriptions

Your task:
1. Analyze what would make the PERFECT prompt for this goal
2. Consider: specificity, context, constraints, output format, examples needed
3. Write that perfect prompt
4. Then execute it and provide the output

[GOAL]: Twitter thread to blog post converter with SEO optimization

[AI generates optimized prompt, then executes it]
```

**When to use Meta-Prompting vs direct prompting**:
- Meta-Prompting: For complex, open-ended tasks where prompt structure is unclear
- Direct prompting: For well-defined tasks where you know what you need
