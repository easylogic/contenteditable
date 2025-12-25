---
id: ce-0132
scenarioId: scenario-html-entity-encoding
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: HTML entities are encoded inconsistently when copying
description: "When copying content that contains special characters from a contenteditable element, the characters may be encoded as HTML entities or copied as actual characters inconsistently. This causes issues when pasting elsewhere."
tags:
  - html
  - entity
  - encoding
  - copy
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<div>Test</div>'
    description: "특수 문자 포함 콘텐츠"
  - label: "Clipboard (Bug - Encoded)"
    html: '&lt;div&gt;Test&lt;/div&gt;'
    description: "복사 시 HTML 엔티티로 인코딩됨"
  - label: "Clipboard (Bug - Not Encoded)"
    html: '<div>Test</div>'
    description: "복사 시 그대로 복사됨 (일관성 없음)"
  - label: "✅ Expected"
    html: '<div>Test</div>'
    description: "정상: 일관된 인코딩 처리"
---

### Phenomenon

When copying content that contains special characters from a contenteditable element, the characters may be encoded as HTML entities or copied as actual characters inconsistently. This causes issues when pasting elsewhere.

### Reproduction example

1. Create content with special characters: `<div>Test</div>`
2. Select and copy the content
3. Check clipboard data

### Observed behavior

- Characters may be encoded: `&lt;div&gt;Test&lt;/div&gt;`
- Or characters may be copied as-is: `<div>Test</div>`
- Behavior is inconsistent
- Pasting elsewhere may show different results

### Expected behavior

- Entity encoding should be consistent
- Or behavior should be predictable
- Special characters should be preserved correctly
- Copy/paste should work reliably

### Browser Comparison

- **Chrome/Edge**: Entity encoding inconsistent (this case)
- **Firefox**: Similar inconsistent behavior
- **Safari**: Entity handling varies

### Notes and possible direction for workarounds

- Normalize entity encoding before copy
- Use Clipboard API to control encoding
- Handle special characters explicitly
- Document expected copy behavior

