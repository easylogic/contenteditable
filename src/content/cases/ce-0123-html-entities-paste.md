---
id: ce-0123
scenarioId: scenario-html-entity-encoding
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: HTML entities are decoded inconsistently when pasting
description: "When pasting content that contains HTML entities (&lt;, &gt;, &amp;, etc.), the entities may be decoded to actual characters or preserved as entities inconsistently. This causes issues with special characters."
tags:
  - html
  - entity
  - encoding
  - paste
  - chrome
status: draft
domSteps:
  - label: "Clipboard"
    html: '&lt;div&gt;'
    description: "복사한 HTML 엔티티"
  - label: "❌ After Paste (Bug - Decoded)"
    html: '<div>'
    description: "엔티티가 디코딩되어 실제 HTML 태그로 삽입됨"
  - label: "❌ After Paste (Bug - Preserved)"
    html: '&lt;div&gt;'
    description: "엔티티가 그대로 보존되어 텍스트로 표시됨 (일관성 없음)"
  - label: "✅ Expected"
    html: '&lt;div&gt;'
    description: "정상: 일관된 엔티티 처리 (보존 또는 디코딩)"
---

### Phenomenon

When pasting content that contains HTML entities (`&lt;`, `&gt;`, `&amp;`, etc.), the entities may be decoded to actual characters or preserved as entities inconsistently. This causes issues with special characters.

### Reproduction example

1. Copy text containing HTML entities (e.g., `&lt;div&gt;`)
2. Paste into contenteditable element
3. Observe the DOM

### Observed behavior

- Entities may be decoded: `<div>` appears in DOM
- Or entities may be preserved: `&lt;div&gt;` in DOM
- Behavior is inconsistent
- Special characters may be lost or changed

### Expected behavior

- Entity handling should be consistent
- Or behavior should be predictable
- Special characters should be preserved correctly
- Encoding/decoding should be explicit

### Browser Comparison

- **Chrome/Edge**: Entity handling inconsistent (this case)
- **Firefox**: Similar inconsistent behavior
- **Safari**: Entity handling varies

### Notes and possible direction for workarounds

- Normalize entity encoding after paste
- Decode or encode entities explicitly
- Handle special characters carefully
- Document expected entity behavior

