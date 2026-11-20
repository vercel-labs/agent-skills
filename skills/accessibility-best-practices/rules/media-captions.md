---
title: Provide Captions and Transcripts for Video and Audio
impact: CRITICAL
impactDescription: Deaf and hard-of-hearing users cannot access audio content without captions
tags: media, captions, video, audio, deaf, transcripts
wcag: "1.2.1 Level A, 1.2.2 Level A"
---

## Provide Captions and Transcripts for Video and Audio

**Impact: CRITICAL (Deaf and hard-of-hearing users cannot access audio content without captions)**

All video with audio must have synchronized captions. All audio-only content (podcasts) must have transcripts. Pre-recorded video-only content (animations) needs audio descriptions or text alternatives.

**Incorrect (video without captions or transcript):**

```tsx
function VideoPlayer({ src }) {
  return (
    <video controls>
      <source src={src} type="video/mp4" />
    </video>
  )
}
```

**Correct (video with captions track and transcript link):**

```tsx
function VideoPlayer({ src, captionsSrc, transcriptUrl, title }) {
  return (
    <div>
      <video controls aria-label={title}>
        <source src={src} type="video/mp4" />
        <track
          kind="captions"
          src={captionsSrc}
          srcLang="en"
          label="English captions"
          default
        />
      </video>
      <a href={transcriptUrl}>Read full transcript</a>
    </div>
  )
}
```

For auto-generated captions, always review and correct them — automated captions frequently misrepresent technical terms, names, and context. Use the `<track>` element with WebVTT format for caption files.

Reference: [WCAG 1.2.2 Captions (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html)
