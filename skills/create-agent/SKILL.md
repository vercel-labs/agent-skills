---
name: create-agent
description: Build and deploy durable AI agents on Vercel. Use this skill when the user wants to create an AI agent, build a production agent, make a durable agent, deploy an agent to Vercel, or needs help with Workflow DevKit, DurableAgent, or AI Gateway integration.
license: MIT
metadata:
  author: vercel-labs
  version: "1.0.0"
---

# Create Agent

Build and deploy production-ready AI agents on Vercel — durable, reliable, and observable.

## When This Skill Applies

This skill activates when the user:
- Wants to create or build an AI agent
- Needs a durable, long-running agent
- Asks about Vercel Workflow or DurableAgent
- Wants to deploy an agent to Vercel

## How It Works

1. **Gather Requirements** — Ask what the agent should do
2. **Clone Template** — Start from `vercel-labs/lead-agent`
3. **Customize** — Modify workflow, tools, and prompts for use case
4. **Deploy** — Build and deploy to Vercel

## Phase 1: Gather Requirements

Before starting, understand what the agent needs to do:

- **Purpose**: What task does this agent handle?
- **Triggers**: How is it invoked? (form, API, webhook, scheduled)
- **Tools needed**: What external services? (search, database, email, Slack)
- **Human approval**: Does it need human-in-the-loop gates?
- **Integrations**: Slack, email, CRM, other systems?

## Phase 2: Clone and Setup

Clone the lead-agent template as a starting point:

```bash
git clone https://github.com/vercel-labs/lead-agent.git [agent-name]
cd [agent-name]
rm -rf .git
git init
pnpm install
```

### Template Structure

```
[agent-name]/
├── app/
│   ├── api/
│   │   ├── submit/route.ts      # Trigger endpoint
│   │   └── slack/route.ts       # Approval webhooks
│   └── page.tsx                 # UI (optional)
├── workflows/
│   └── inbound/                 # Main workflow
├── lib/
│   ├── services.ts              # AI prompts & logic
│   └── types.ts                 # TypeScript schemas
├── components/
│   └── lead-form.tsx            # Input form
└── .env.example                 # Required env vars
```

### Environment Variables

Create `.env.local` with:

```bash
# Required
AI_GATEWAY_API_KEY=            # Vercel AI Gateway key

# Optional (if using Slack approval)
SLACK_BOT_TOKEN=               # Slack bot credentials
SLACK_SIGNING_SECRET=          # Webhook validation
SLACK_CHANNEL_ID=              # Approval channel

# Optional (if using web search)
EXA_API_KEY=                   # Exa.ai for research
```

## Phase 3: Customize the Agent

### 3.1 Define the Workflow

Edit `workflows/inbound/index.ts` to define your agent's steps:

```typescript
import { defineWorkflow } from 'workflow';

export const myAgentWorkflow = defineWorkflow({
  id: 'my-agent',
  async run(input: MyInput) {
    'use workflow';

    // Step 1: Research/gather context
    const context = await gatherContext(input);

    // Step 2: Process with AI
    const result = await processWithAI(context);

    // Step 3: Human approval (optional)
    const approved = await requestApproval(result);

    if (approved) {
      // Step 4: Take action
      await executeAction(result);
    }

    return result;
  },
});
```

### 3.2 Create Tools (Steps)

Each external call should be a step for durability. Edit `lib/services.ts`:

```typescript
export async function gatherContext(input: MyInput) {
  'use step';

  // Call external APIs, databases, search
  const data = await fetch('https://api.example.com/...');
  return data.json();
}

export async function processWithAI(context: Context) {
  'use step';

  const { text } = await generateText({
    model: 'anthropic/claude-sonnet-4',
    system: `You are a [role]. Your task is to [task description].`,
    prompt: `Process this: ${JSON.stringify(context)}`,
  });

  return text;
}

export async function executeAction(result: Result) {
  'use step';

  // Send email, update CRM, post to Slack, etc.
  await sendEmail(result);
}
```

### 3.3 Define Types

Edit `lib/types.ts` for structured outputs:

```typescript
import { z } from 'zod';

export const resultSchema = z.object({
  category: z.enum(['ACTION_A', 'ACTION_B', 'NEEDS_REVIEW']),
  reasoning: z.string(),
  confidence: z.number().min(0).max(1),
  suggestedAction: z.string(),
});

export type Result = z.infer<typeof resultSchema>;
```

Use with AI SDK for structured output:

```typescript
import { generateObject } from 'ai';
import { resultSchema } from './types';

const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4',
  schema: resultSchema,
  prompt: '...',
});
```

### 3.4 Add Human-in-the-Loop (Optional)

Use hooks for approval gates:

```typescript
import { defineHook } from 'workflow';

const approvalHook = defineHook<{
  approved: boolean;
  feedback?: string;
}>();

export async function requestApproval(result: Result) {
  'use step';

  // Send to Slack for approval
  await sendSlackMessage({
    channel: process.env.SLACK_CHANNEL_ID,
    blocks: [
      { type: 'section', text: { type: 'mrkdwn', text: `*Review needed*\n${result.suggestedAction}` }},
      { type: 'actions', elements: [
        { type: 'button', text: { type: 'plain_text', text: 'Approve' }, action_id: 'approve' },
        { type: 'button', text: { type: 'plain_text', text: 'Reject' }, action_id: 'reject' },
      ]},
    ],
  });

  // Wait for response
  const events = approvalHook.create({ token: result.id });
  for await (const event of events) {
    return event.approved;
  }
}
```

Handle Slack callback in `app/api/slack/route.ts`:

```typescript
export async function POST(req: Request) {
  const payload = await parseSlackPayload(req);

  if (payload.actions[0].action_id === 'approve') {
    await approvalHook.resume(payload.token, { approved: true });
  } else {
    await approvalHook.resume(payload.token, { approved: false });
  }

  return Response.json({ ok: true });
}
```

### 3.5 Update the Trigger

Edit `app/api/submit/route.ts` or create a new trigger:

```typescript
import { myAgentWorkflow } from '@/workflows/inbound';

export async function POST(req: Request) {
  const input = await req.json();

  // Start the workflow (returns immediately)
  const { runId } = await myAgentWorkflow.start(input);

  return Response.json({ runId, status: 'started' });
}
```

## Phase 4: Deploy

### Local Testing

```bash
pnpm dev
```

Test at `http://localhost:3000`

### Deploy to Vercel

```bash
# Initialize git repo
git add -A
git commit -m "Initial agent setup"

# Deploy
npx vercel --prod --yes
```

### Configure Environment Variables

In Vercel dashboard or via CLI:

```bash
vercel env add AI_GATEWAY_API_KEY
vercel env add SLACK_BOT_TOKEN      # if using Slack
vercel env add SLACK_SIGNING_SECRET # if using Slack
vercel env add SLACK_CHANNEL_ID     # if using Slack
```

## Example Customizations

### Research Agent

```typescript
const tools = {
  webSearch: async (query: string) => {
    'use step';
    const exa = new Exa(process.env.EXA_API_KEY);
    return exa.search(query);
  },

  summarize: async (content: string) => {
    'use step';
    const { text } = await generateText({
      model: 'anthropic/claude-sonnet-4',
      prompt: `Summarize: ${content}`,
    });
    return text;
  },
};
```

### Customer Support Agent

```typescript
const tools = {
  lookupCustomer: async (email: string) => {
    'use step';
    return db.customers.findByEmail(email);
  },

  searchKnowledgeBase: async (query: string) => {
    'use step';
    return vectorStore.search(query);
  },

  createTicket: async (data: TicketData) => {
    'use step';
    return zendesk.tickets.create(data);
  },

  escalateToHuman: async (ticketId: string) => {
    'use step';
    await slack.postMessage({
      channel: '#support-escalations',
      text: `Ticket ${ticketId} needs human attention`,
    });
  },
};
```

### Scheduled Agent (Cron)

Add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/scheduled",
    "schedule": "0 9 * * *"
  }]
}
```

Create `app/api/scheduled/route.ts`:

```typescript
export async function GET() {
  await dailyReportWorkflow.start({
    date: new Date().toISOString(),
  });
  return Response.json({ ok: true });
}
```

## Monitoring

View workflow runs in Vercel dashboard:

1. Go to your project
2. Navigate to **AI** → **Workflows**
3. See runs, steps, inputs/outputs, errors

## Technology Reference

| Component | Purpose | Docs |
|-----------|---------|------|
| Workflow DevKit | Durability, retries, state | [useworkflow.dev](https://useworkflow.dev) |
| AI SDK | LLM integration | [ai-sdk.dev](https://ai-sdk.dev) |
| AI Gateway | 100+ models, single API | [vercel.com/ai-gateway](https://vercel.com/ai-gateway) |

## Output

Return:
1. Agent description and capabilities
2. Files created/modified
3. **Live Vercel URL**
