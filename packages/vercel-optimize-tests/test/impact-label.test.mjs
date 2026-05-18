import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeImpactLabel } from '../../../skills/vercel-optimize/lib/impact-label.mjs';

test('computeImpactLabel: explicit impact labels win', () => {
  const rec = {
    impactLabel: { performance: 'Reduce checkout p95 from observed 900ms by removing a sequential fetch.' },
    impactTier: 'high',
    o11ySignal: 'inv=1000,p95=900ms',
  };
  assert.equal(computeImpactLabel(rec), rec.impactLabel.performance);
});

test('computeImpactLabel: estimated savings uses magnitude, not precise dollars', () => {
  const label = computeImpactLabel({ estimatedSavingsUsd: 800, impactTier: 'high' });
  assert.match(label, /dollars per month|month/);
  assert.doesNotMatch(label, /\$800/);
});

test('computeImpactLabel: p95 fallback compares observed value to threshold', () => {
  const label = computeImpactLabel({
    impactTier: 'high',
    o11ySignal: 'inv=84004,p95=4609ms',
  });
  assert.match(label, /current 95th percentile duration is 4,609ms across 84,004 function invocations in this window/);
  assert.match(label, /9\.2x the 500ms slow-route threshold/);
  assert.doesNotMatch(label, /target p95/);
});

test('computeImpactLabel: cache fallback compares observed hit rate to gate threshold', () => {
  const label = computeImpactLabel({
    impactTier: 'medium',
    o11ySignal: 'inv=5000,p95=1200ms,cache=12%',
  });
  assert.equal(label, 'medium impact — current cache hit rate is 12% across 5,000 requests in this window; the gate fires below 50%.');
});

test('computeImpactLabel: cache fallback does not claim above-threshold hit rates tripped the low-cache gate', () => {
  const label = computeImpactLabel({
    impactTier: 'high',
    o11ySignal: 'inv=154825,p95=1650ms,cache=53%',
  });
  assert.equal(label, 'high impact — current 95th percentile duration is 1,650ms across 154,825 function invocations in this window (3.3x the 500ms slow-route threshold).');
  assert.doesNotMatch(label, /below 50%/);
});

test('computeImpactLabel: ISR fallback uses write/read units before p95', () => {
  const label = computeImpactLabel({
    impactTier: 'high',
    o11ySignal: 'writes=1493226,reads=115823,w/r=12.89,p95=1028ms',
  });
  assert.equal(label, 'high impact — 1,493,226 ISR write units vs 115,823 read units in this window (12.89 writes per read).');
  assert.doesNotMatch(label, /p95|slow-route/);
});

test('computeImpactLabel: cold-start fallback compares observed share to gate threshold', () => {
  const label = computeImpactLabel({
    impactTier: 'medium',
    o11ySignal: 'cold=45%,inv=10000',
  });
  assert.equal(label, 'medium impact — current cold-start share is 45%; the gate fires above 40%.');
});

test('computeImpactLabel: CWV and reliability labels stay threshold-grounded', () => {
  assert.match(
    computeImpactLabel({ impactTier: 'medium', o11ySignal: 'LCP=3200ms,INP=250ms,CLS=0.18' }),
    /bring LCP below 2,500ms .* INP below 200ms .* CLS below 0\.1/,
  );
  assert.match(
    computeImpactLabel({ impactTier: 'high', o11ySignal: 'errs=300,rate=1.2%' }),
    /cut 5xx rate by ~92% to get below 0\.1%/,
  );
});

test('computeImpactLabel: build-minute candidates get cost-share framing', () => {
  const label = computeImpactLabel({
    candidateRef: 'build_minutes_fanout:<account>',
    impactTier: 'high',
    o11ySignal: 'build_minutes_share=49% scanner_findings=2',
  });
  assert.equal(label, 'high impact — Build CPU Minutes account for 49% of observed billed cost in this window.');
  assert.doesNotMatch(label, /no impact framing recorded|follow-up metrics/);
});

test('computeImpactLabel: build-minute candidates can synthesize from grounded why text', () => {
  const label = computeImpactLabel({
    candidateRef: 'build_minutes_fanout:<account>#turbo.json',
    impactTier: 'high',
    why: 'The observability signal is build_minutes_share=44% scanner_findings=2.',
  });
  assert.equal(label, 'high impact — Build CPU Minutes account for 44% of observed billed cost in this window.');
});
