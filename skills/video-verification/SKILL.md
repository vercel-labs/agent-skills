---
name: video-verification
description: Use when a task requires visual verification of a UI flow over time with video, GIF, screen recording, screenshots, or frame-by-frame proof, especially loading-to-completion states, animations, streaming responses, browser-based QA, frontend UI changes, local app previews, responsive checks, rendered assets, canvas/video/3D output, or before/after proof for review. Guides Codex to run the target in a real browser or app surface, default to headless recording unless the user asks otherwise, record the relevant interaction, capture key screenshots or frames, inspect runtime signals, and report concrete evidence instead of relying on implementation-only claims.
---

# Video Verification

Use this skill when the user asks for video proof, GIF proof, screen recording, or verification of a UI state transition over time. This skill extends screenshot verification: video proves sequence and timing, while screenshots or extracted frames prove inspectable final states.

## Goal

Prove what the actual rendered UI does across time. A good verification includes:

- the exact target URL, app screen, route, or installed-app surface
- the viewport, device, browser, or app environment tested
- the fixture or seeded state used, if any
- the user action that starts the flow
- a video artifact covering start, loading/intermediate state, and completion
- key screenshots or extracted frames for the important states
- notable console, runtime, network, or rendering issues
- a pass/fail summary tied to the user's request

Treat video as evidence, not as the goal. If the recording shows the wrong surface, stale data, a blank screen, only a loading state, or misses the transition being verified, the verification is incomplete.

## Tool Selection

Choose the visual surface based on the target:

- For deterministic video capture, repeated viewport checks, canvas pixel checks, console capture, or CI-style verification, use Playwright from the terminal.
- For local web apps such as `localhost`, `127.0.0.1`, `file://`, or obvious local previews, use the in-app Browser plugin for quick inspection when helpful, but use Playwright when a video artifact is required.
- For authenticated remote pages, user-profile-dependent pages, or existing browser sessions, use Chrome automation when available. If a recording must be deterministic, reproduce the session with Playwright persistent context when feasible.
- For browser extensions, use Playwright persistent context with the built extension loaded, and record that context.
- For native mobile or desktop apps, use the relevant app testing toolchain instead of substituting a web preview.

Default to headless recording for browser-based video verification. Use a visible/headed browser only when the user explicitly asks for it, when an existing visible browser session is required, or when headless mode cannot reproduce the behavior. If you use headed mode, state why. If the user asks for headless recording, keep all browser automation headless and do not open a visible browser. If the user wants to manually upload artifacts, open only the artifact folder after recording.

Record the tools actually used. At minimum, note whether verification used Playwright, Browser plugin, Chrome automation, native app tooling, `ffmpeg`, `ffprobe`, local image inspection, database/API checks, or custom scripts. Include headless/headed mode and the browser channel when relevant.

Do not treat video of a different surface as proof. For example, an Expo web preview is not proof of an installed Android app.

## Workflow

1. Identify the visual or temporal claim.

   State what must be proven before opening the browser or app. Examples:

   - "The loading message appears, then the assistant answer arrives."
   - "The upload progress moves from pending to complete without layout shift."
   - "The animation runs and ends on the expected final card."
   - "The mobile modal remains usable while streaming content updates."

2. Run or locate the target.

   - If the app needs a dev server, start it and keep it running until verification is finished.
   - If a server is already running, reuse it when appropriate.
   - Record the final URL, route, screen, or app surface.
   - If the work happens in a git worktree and environment files are required, copy them from the source project before running.

3. Prepare and verify the state.

   Creating or modifying local test data is encouraged when it is the clearest way to verify the flow end to end.

   When using seeded, mocked, or manually adjusted data:

   - Record the fixture setup at a high level: account, route, relevant state, and expected visible result.
   - Verify the fixture before capture through the UI, API response, database read, or app state.
   - If the fixture does not match the intended case, fix the fixture before taking final recordings.
   - If the recording contradicts the intended fixture, treat it as a failed verification and investigate before reporting it as evidence.

4. Choose the capture plan.

   Pick the smallest viewport and state set that can prove the claim.

   Default web viewport set:

   - desktop: `1440x900`
   - mobile: `390x844`

   Add narrower mobile such as `320x720` when text overflow, dense mobile layout, long labels, localization, or Korean copy is relevant.

   For a flow recording, capture at least:

   - initial state before the triggering action
   - the action that starts the flow
   - loading, streaming, animation, or intermediate state
   - completed state or error state

   Prefer one complete recording over separate clips unless the flow is too long. Use screenshots or extracted frames to make important states easy to inspect.

5. Record the flow.

   With Playwright, prefer `recordVideo` and explicit durable waits instead of sleep-only logic. A durable wait is a UI condition, API response, database state, or app state that proves the flow reached the intended state.

   Useful Playwright pattern:

   ```js
   const context = await chromium.launchPersistentContext(userDataDir, {
     headless: true,
     viewport: { width: 1440, height: 900 },
     recordVideo: {
       dir: videoDir,
       size: { width: 1440, height: 900 },
     },
   });
   const page = await context.newPage();
   page.on('console', (msg) => consoleMessages.push(msg.text()));
   page.on('pageerror', (err) => pageErrors.push(err.message));
   page.on('requestfailed', (req) => failedRequests.push(req.url()));
   ```

   Guidelines:

   - Start recording before the initial state or immediately after opening the target.
   - Capture screenshots before send/action, during the key intermediate state, and after completion when useful.
   - Wait for the target completion criterion, such as "new assistant bubble count increased" or "loading role=status disappeared".
   - Preserve the important commands or script entrypoints used to capture and post-process artifacts.
   - Close the Playwright context before finalizing the video path; Playwright writes the video on close.
   - Save the original WebM. Convert to MP4 only when the user needs easier playback or upload.
   - Create a GIF only when the user specifically asks for an animated image or the clip is short enough to remain useful.

   If using `ffmpeg`, keep the original video and create derived artifacts next to it:

   - `*.mp4` for upload/playback compatibility
   - `frames/*-start.png`, `frames/*-loading.png`, `frames/*-final.png` for inspection
   - `*.gif` only for short clips or cropped proof

   When the verification uses a custom script, save a compact verification JSON next to the video when practical. Include the target URL, viewport, toolchain, browser mode, fixture summary, pass/fail checks, artifact paths, console/page errors, failed requests, and exact commands or script names that matter for reproducibility.

6. Inspect runtime signals.

   Check for:

   - console errors
   - failed network requests
   - missing images or assets
   - clipped, wrapped badly, or overlapping text
   - unintended horizontal scroll
   - blank canvas, video, iframe, or 3D scene
   - stuck loading, empty, or skeleton states
   - controls that shift layout on hover, focus, content updates, or streaming

   Classify runtime issues instead of merely listing them:

   - target-related: likely caused by the feature or screen being verified
   - ambient/pre-existing: unrelated app/dev-server issue observed while verifying
   - inconclusive: needs follow-up before assigning cause

   Mention all target-related and inconclusive issues in the final report. Ambient issues can be summarized briefly, but should not be silently ignored.

7. Inspect captured video and frames.

   After capture, inspect representative screenshots or extracted frames and confirm the expected visible text, state, rendered element, or visual condition is present.

   Check that each artifact is not:

   - the wrong route, user, app, or device surface
   - stale state from a previous case
   - only a loading, skeleton, or error overlay state when completion was required
   - contradicted by the fixture setup
   - blank, badly cropped, or too fast to understand

   For video artifacts, verify duration, file size, and at least the start and final frames. Use `ffprobe` when available to confirm duration and dimensions. Use local image viewing for extracted frames when visual inspection is needed.

8. Save artifacts.

   Save videos and screenshots under the task's artifact or output area. Prefer, in order:

   - the user-requested output directory
   - the current Codex workspace `outputs/` directory, if present
   - project-local artifact directories such as `artifacts/videos/` and `artifacts/screenshots/`
   - a temporary `work/` directory only for intermediate evidence

   Prefer descriptive names:

   - `checkout-loading-to-success.webm`
   - `checkout-loading-to-success.mp4`
   - `auto-compact-ko-loading-to-answer.webm`
   - `modal-mobile-loading-final.png`
   - `frames/checkout-final.png`
   - `checkout-video-verification.json`

   Do not hardcode a user-specific absolute path inside this skill. Resolve artifact paths from the current workspace, project, or explicit user instructions.

   Keep final artifacts separate from failed or intermediate captures. Preserve failing evidence when it helps explain a blocker, but label it clearly so it is not mistaken for successful proof.

9. Report evidence.

   In the final response, include:

   - what was tested
   - tools used, including commands or script names when they matter
   - fixture or seeded state used, if any
   - viewport, device, browser, and headless/headed mode
   - state sequence recorded
   - video artifact links or file paths
   - key screenshot or frame artifact links or file paths
   - notable runtime findings, classified as target-related, ambient/pre-existing, or inconclusive
   - pass/fail result and what was not verified, if anything

   When running in Codex desktop, prefer clickable artifact links for user-facing files. If the user wants to upload the video themselves, open the artifact folder and point to the exact file names.

## Pass Criteria

Video verification is complete only when:

- the target screen was opened in a real browser or real app surface
- the recording covers the requested sequence, not just a static state
- the start, intermediate, and completion states were captured or otherwise proven
- seeded or mocked state was verified when used
- captured screenshots or extracted frames were inspected
- tools used and important commands were recorded in the final report or verification artifact
- runtime errors and obvious rendering defects were checked
- video duration and final frame were checked
- the final answer references the artifacts
- any unverified scope is explicitly called out

## Failure Handling

If the browser cannot open, the app cannot start, credentials are missing, the target cannot be reached, or the completion state never occurs:

- state the blocker concretely
- include the command, URL, route, or tool step that failed
- preserve partial evidence such as logs, failed videos, or screenshots of the failing state
- label partial artifacts clearly as failed or inconclusive
- do not claim video verification succeeded

## Review Mindset

For UI review tasks, prioritize concrete temporal and visual regressions over aesthetic preference. Look especially for:

- loading states that never resolve
- streaming or async answers that fail to append
- transitions that skip the expected intermediate state
- layout overflow during dynamic content updates
- inaccessible controls during loading
- clipped labels or unreadable text
- broken responsive behavior
- incorrect data displayed
- screenshots or videos that prove the wrong surface
