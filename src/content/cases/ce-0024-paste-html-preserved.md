---
id: ce-0024
scenarioId: scenario-paste-formatting-loss
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: Pasting rich text preserves unwanted HTML structure
description: "When pasting content from external sources (like Word documents or web pages) into a contenteditable region in Safari, the HTML structure is preserved, including unwanted elements like span tags with inline styles."
tags:
  - paste
  - formatting
  - html
  - safari
status: draft
domSteps:
  - label: "Clipboard"
    html: '<span style="color: red; font-size: 14px;">Text</span>'
    description: "복사한 서식 있는 텍스트 (Word 문서 등)"
  - label: "❌ After Paste"
    html: '<span style="color: red; font-size: 14px;">Text</span>'
    description: "원치 않는 HTML 구조 보존 (span 태그, 인라인 스타일)"
  - label: "✅ Expected"
    html: '<strong>Text</strong>'
    description: "정상화된 HTML 구조 또는 선택 가능한 형식"
---

### Phenomenon

When pasting content from external sources (like Word documents or web pages) into a contenteditable region in Safari, the HTML structure is preserved, including unwanted elements like `<span>` tags with inline styles, `<div>` elements, and other formatting markup.

### Reproduction example

1. Copy formatted text from a Word document or web page.
2. Paste it into a contenteditable div in Safari.
3. Inspect the DOM structure of the pasted content.

### Observed behavior

- Safari preserves the full HTML structure from the source.
- Unwanted elements like `<span style="...">`, `<div>`, and other formatting tags are included.
- The pasted content may have inconsistent styling.

### Expected behavior

- The paste operation should normalize or clean the HTML structure.
- Or, there should be a way to control what gets pasted (plain text vs. formatted).

