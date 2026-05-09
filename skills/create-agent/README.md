# Create Agent Skill

Build and deploy durable AI agents on Vercel using Workflow DevKit, AI SDK 6, and AI Gateway.

## What It Does

This skill guides you through creating production-ready AI agents that are:

- **Durable** — Survive crashes, deployments, and network failures
- **Resumable** — Pause for minutes or months, resume exactly where stopped
- **Observable** — Full visibility in Vercel dashboard
- **Scalable** — Serverless execution with Vercel Functions

## Technology Stack

- **Workflow DevKit** — Durability, state persistence, automatic retries
- **AI SDK 6** — DurableAgent, unified AI interface
- **AI Gateway** — Access 100+ LLMs through single endpoint
- **Vercel Functions & Queues** — Reliable serverless execution

## Installation

**Claude Code:**
```bash
npx skills add vercel-labs/agent-skills --skill create-agent
```

**Manual:**
```bash
cp -r skills/create-agent ~/.claude/skills/
```

## When to Use

This skill activates when you:
- Want to create or build an AI agent
- Need a durable, long-running agent
- Ask about Vercel Workflow or DurableAgent
- Want to deploy an agent to Vercel
- Need AI Gateway integration

## Quick Example

```typescript
import { DurableAgent } from '@workflow/ai/agent';
import { getWritable } from 'workflow';

export async function myAgentWorkflow(input: string) {
  'use workflow';

  const agent = new DurableAgent({
    model: 'anthropic/claude-sonnet-4',
    system: 'You are a helpful assistant.',
    tools: { /* your tools */ },
  });

  return agent.generate({
    prompt: input,
    writable: getWritable(),
  });
}
```

## Resources

- [Workflow DevKit Docs](https://useworkflow.dev)
- [AI SDK Documentation](https://ai-sdk.dev)
- [AI Gateway](https://vercel.com/ai-gateway)

## License

MIT
