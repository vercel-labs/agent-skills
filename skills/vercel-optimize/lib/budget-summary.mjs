// Checkpoint between gate and deep-dive. Asks only when budget was default AND >=1 candidate got skipped — every question is a tax on the user.

import { createHash } from 'node:crypto';
import { formatCandidateLine } from './display-labels.mjs';

const TOP_INVESTIGATING_PREVIEW = 5;
const MAX_FULL_INVESTIGATING_PREVIEW = 10;
export function buildBudgetSummary(gate) {
  const toLaunch = Array.isArray(gate?.toLaunch) ? gate.toLaunch : [];
  const gated = Array.isArray(gate?.gated) ? gate.gated : [];
  const budgetSource = gate?.budget?.source ?? 'default';
  const currentBudget =
    typeof gate?.budget?.maxCandidates === 'number'
      ? gate.budget.maxCandidates
      : (gate?.budget?.maxCandidates === 'all' ? Infinity : 6);

  // Only budget skips can be reached by raising the budget; disqualified/coveredBy can't.
  const skippedByBudget = gated.filter((g) =>
    typeof g.gatedReason === 'string' && g.gatedReason.startsWith('skippedByBudget')
  );
  const skipped = skippedByBudget.length;
  const totalPassed = toLaunch.length + skipped;

  const reasonParts = [];
  if (budgetSource !== 'default') reasonParts.push(`user pre-set budget via ${budgetSource}`);
  if (skipped === 0) reasonParts.push('no candidates skipped by budget');
  const shouldAsk = budgetSource === 'default' && skipped > 0;
  const reason = shouldAsk
    ? `default budget skipped ${skipped} candidate(s); ask user whether to expand`
    : reasonParts.join('; ') || 'no expansion possible';

  const summarize = (c) => ({
    kind: c.kind,
    route: c.route ?? c.hostname ?? null,
    displayRoute: c.displayRoute ?? null,
    o11ySignal: c.o11ySignal ?? null,
    priority: c.priority ?? null,
  });

  const investigatingPreviewCount = typeof currentBudget === 'number' && currentBudget <= MAX_FULL_INVESTIGATING_PREVIEW
    ? currentBudget
    : TOP_INVESTIGATING_PREVIEW;
  const topInvestigating = toLaunch.slice(0, investigatingPreviewCount).map(summarize);
  const topSkipped = skippedByBudget.map(summarize);
  const options = buildOptions(toLaunch.length, skipped);
  const questionText = buildQuestionText({ shouldAsk, totalPassed, currentBudget });
  const printContract = shouldAsk
    ? 'Print chatPreview verbatim by copying exactChatMessage.body as a chat message before asking questionText. Do not summarize, truncate, reorder, shorten, or rewrite options.'
    : null;
  const questionPayload = shouldAsk ? buildQuestionPayload(questionText, options) : null;
  const chatPreview = buildChatPreview({ shouldAsk, totalPassed, currentBudget, skipped, topInvestigating, topSkipped, reason });
  const exactChatMessage = buildExactChatMessage(chatPreview);
  return {
    shouldAsk,
    reason,
    totalPassed,
    currentBudget: currentBudget === Infinity ? 'all' : currentBudget,
    budgetSource,
    skipped,
    topInvestigating,
    topSkipped,
    options,
    printContract,
    chatPreview,
    exactChatMessage,
    printCheck: shouldAsk ? buildPrintCheck({ exactChatMessage, skipped }) : null,
    questionText,
    questionPayload,
  };
}

function buildChatPreview({ shouldAsk, totalPassed, currentBudget, skipped, topInvestigating, topSkipped, reason }) {
  if (!shouldAsk) return `Budget checkpoint: no question — ${reason}.`;
  const lines = [];
  lines.push(`Budget checkpoint: ${totalPassed} metric signals met the investigation threshold. Default investigates ${currentBudget} candidates with the strongest observed signals while keeping coverage across issue types. ${skipped} would be left for a larger run.`);
  lines.push(`These are first-pass signals. Follow-up metrics can still remove mismatches before source investigation.`);
  if (topInvestigating.length > 0) {
    lines.push('');
    lines.push(`Investigating by default${topInvestigating.length < currentBudget ? ` (${topInvestigating.length} shown)` : ''}:`);
    topInvestigating.forEach((c, i) => lines.push(`  ${i + 1}. ${formatCandidateLine(c)}`));
  }
  if (topSkipped.length > 0) {
    lines.push('');
    lines.push(`Skipped by budget (all ${topSkipped.length}; next highest-priority candidates):`);
    topSkipped.forEach((c, i) => lines.push(`  ${i + 1}. ${formatCandidateLine(c)}`));
  }
  return lines.join('\n');
}

function buildExactChatMessage(body) {
  return {
    body,
    lineCount: body.split('\n').length,
    sha256: createHash('sha256').update(body).digest('hex'),
  };
}

function buildPrintCheck({ exactChatMessage, skipped }) {
  return {
    bodyField: 'exactChatMessage.body',
    sameAs: 'chatPreview',
    requiredLineCount: exactChatMessage.lineCount,
    requiredSha256: exactChatMessage.sha256,
    requiredSkippedRows: skipped,
    requiredSkippedHeading: `Skipped by budget (all ${skipped}; next highest-priority candidates):`,
    forbiddenSummaryPatterns: [
      '\\btop skipped\\b',
      '\\bmore (?:candidate|candidates|routes|entries|items|in gated list)\\b',
      '\\b\\d+\\s*[-–—]\\s*\\d+\\.\\s+\\d+\\s+more\\b',
      '\\betc\\.\\b',
    ],
    instruction: 'The budget message is valid only when every line from exactChatMessage.body is preserved exactly. If you cannot verify that, print exactChatMessage.body again before asking the question.',
  };
}

function buildQuestionText({ shouldAsk, totalPassed, currentBudget }) {
  if (!shouldAsk) return '';
  return `Keep the default ${currentBudget}, investigate all ${totalPassed}, or pick a specific number?`;
}

function buildOptions(currentCount, skippedCount) {
  if (skippedCount === 0) return [];
  const total = currentCount + skippedCount;
  return [
    {
      label: `Keep default ${currentCount}`,
      value: currentCount,
      recommended: true,
      description: 'Investigates the strongest signals first while keeping coverage across issue types.',
      rationale: 'investigates the strongest signals first while keeping coverage across issue types',
    },
    {
      label: `Investigate all ${total}`,
      value: 'all',
      recommended: false,
      description: 'Investigates every signal that met the threshold; follow-up metrics can still remove mismatches before source investigation.',
      rationale: 'investigates every signal that met the threshold; follow-up metrics can still remove mismatches before source investigation',
    },
    {
      label: 'Pick a specific N',
      value: 'custom',
      recommended: false,
      description: `Expand the next highest-priority signals without going to the full ${total}.`,
      rationale: `expands the next highest-priority signals without going to the full ${total}`,
    },
  ];
}

function buildQuestionPayload(questionText, options) {
  return {
    questions: [{
      question: questionText,
      header: 'Budget',
      multiSelect: false,
      options: options.map((o) => ({
        label: o.label,
        description: o.description ?? o.rationale,
      })),
    }],
  };
}

export function renderBudgetSummaryMarkdown(s) {
  const lines = [];
  lines.push(`## Budget checkpoint`);
  lines.push('');
  if (!s.shouldAsk) {
    lines.push(`_No question needed — ${s.reason}._`);
    return lines.join('\n');
  }
  for (const ln of s.chatPreview.split('\n')) lines.push(ln);
  lines.push('');
  lines.push('### Options');
  lines.push('');
  for (const o of s.options) {
    const tag = o.recommended ? ' (recommended)' : '';
    lines.push(`- **${o.label}${tag}** — ${o.rationale}`);
  }
  lines.push('');
  lines.push(`**Question:** ${s.questionText}`);
  return lines.join('\n');
}
