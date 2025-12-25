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
    description: "Copied HTML entities"
  - label: "❌ After Paste (Bug - Decoded)"
    html: '<div>'
    description: "Entities decoded and inserted as actual HTML tags"
  - label: "❌ After Paste (Bug - Preserved)"
    html: '&lt;div&gt;'
    description: "Entities preserved as-is and displayed as text (inconsistent)"
  - label: "✅ Expected"
    html: '&lt;div&gt;'
    description: "Expected: Consistent entity handling (preserve or decode)"
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

