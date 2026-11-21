---
id: build-machine-right-sizing
title: Build machine right-sizing
status: active
candidateKinds: ["build_machine_oversized"]
frameworks: ["*"]
priority: 90
citations: ["https://vercel.com/docs/builds/managing-builds", "https://vercel.com/docs/pricing#builds"]
maxBriefChars: 900
---

## Investigation Brief
Build CPU Minutes are billed duration times vCPUs. A pinned Enhanced or Turbo machine pays off only when it cuts build time by at least the vCPU ratio. Compare the median billed duration with the break-even on the next smaller machine.

## Evidence To Check
Confirm the selection is fixed and the sample ran on the pinned machine. Look for out-of-memory failures or memory-heavy steps before suggesting a smaller machine.

## Do Not Recommend When
Skip when builds ran out of memory on a smaller machine before, or the sample is small. On Enterprise, do not recommend a change the contract sets; point to the account manager.

## Verification
Recommend Elastic first. Quote the build count, median billed minutes, vCPUs, and CPU minutes per build; give the break-even as context, and suggest comparing billed duration over an equal window afterward. Never quote savings.
