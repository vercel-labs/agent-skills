// Regression: fixture-site audit found BotID rec dropping at quality=0.43 because
// the default grounding rubric expected file:line; account-scope axis must let
// magnitude-grounded recs survive the floor.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gradeRecommendation } from '../../../skills/vercel-optimize/lib/grade-recommendation.mjs';

const botidRec = {
  what: 'Enable BotID with deep analysis on the account to challenge non-human traffic.',
  why: 'Bot traffic represents 49% of Fast Data Transfer bytes on this account, with 15.4M requests in the window. Without BotID, that bandwidth is paid for but un-verified — the WAF can\'t differentiate verified humans from sophisticated bots.',
  fix: '1. Enable BotID Deep Analysis in the dashboard under Firewall → BotID. 2. Pair with a managed Bot Filter WAF rule set to "challenge" for non-verified traffic.',
  bucket: 'cost',
  effort: 'low',
  affectedFiles: [],
  candidateRef: 'platform_bot_protection:<account>',
  scope: 'account',
  o11ySignal: 'edge_cost=97445,bot_protection=disabled,bot_fdt_pct=49%,requests=15.4M',
  citations: [
    'https://vercel.com/docs/security/bot-protection',
    'https://vercel.com/docs/security/botid',
  ],
  verify: 'Watch Fast Data Transfer GB and bot_category breakdown in the firewall events drain after 24h.',
  impactTier: 'high',
};

test('gradeRecommendation: account-scope recs are detected via candidateRef OR scope', () => {
  const viaRef = gradeRecommendation({ ...botidRec, scope: undefined });
  const viaScope = gradeRecommendation({ ...botidRec, candidateRef: undefined, scope: 'account' });
  assert.equal(viaRef.scope, 'account');
  assert.equal(viaScope.scope, 'account');
});

test('gradeRecommendation: BotID-shaped account-scope rec clears the 0.55 quality floor', () => {
  const q = gradeRecommendation(botidRec);
  assert.equal(q.scope, 'account');
  assert.ok(q.overall >= 0.55, `expected >=0.55, got ${q.overall} (axes: ${JSON.stringify({ g: q.grounding, e: q.evidence, s: q.specificity, a: q.actionability })})`);
  assert.notEqual(q.grade, 'Poor');
});

test('gradeRecommendation: route-scope rec with zero evidence stays Poor (no regression)', () => {
  const empty = {
    what: 'Speed up /api/x.',
    fix: 'Just make it faster.',
    bucket: 'performance',
    candidateRef: 'slow_route:/api/x',
    affectedFiles: [],
    citations: [],
  };
  const q = gradeRecommendation(empty);
  assert.equal(q.scope, 'route');
  assert.ok(q.overall < 0.55, `route-scope empty rec should be below floor (got ${q.overall})`);
});

test('gradeRecommendation: account-scope grounding rewards o11ySignal magnitude quoting', () => {
  const withMagnitude = gradeRecommendation(botidRec);
  const withoutMagnitude = gradeRecommendation({
    ...botidRec,
    why: 'Bots are bad.',
    fix: 'Enable BotID.',
    verify: 'Check the dashboard.',
    o11ySignal: undefined,
  });
  assert.ok(
    withMagnitude.grounding > withoutMagnitude.grounding,
    `magnitude-quoting rec should score higher (with: ${withMagnitude.grounding}, without: ${withoutMagnitude.grounding})`
  );
});

test('gradeRecommendation: account-scope rec with no magnitude evidence is correctly Poor', () => {
  const vague = {
    what: 'Turn on BotID.',
    fix: 'Click the toggle.',
    bucket: 'cost',
    candidateRef: 'platform_bot_protection:<account>',
    scope: 'account',
    citations: [],
  };
  const q = gradeRecommendation(vague);
  assert.ok(q.overall < 0.55, `vague account-scope rec should be below floor (got ${q.overall})`);
});
