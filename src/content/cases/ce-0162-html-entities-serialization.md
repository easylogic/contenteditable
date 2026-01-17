---
id: ce-0162-html-entities-serialization
scenarioId: scenario-html-entity-encoding
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: HTML entities are encoded inconsistently when serializing
description: "When serializing contenteditable content (e.g., using innerHTML) in Chrome, special characters may be encoded as HTML entities or kept as actual characters inconsistently. This makes it difficult to predict the output format."
tags:
  - html
  - entity
  - encoding
  - serialization
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<div>Test</div>'
    description: "Content with special characters"
  - label: "After innerHTML (Bug - Encoded)"
    html: '&lt;div&gt;Test&lt;/div&gt;'
    description: "When serializing, encoded as HTML entities"
  - label: "After innerHTML (Bug - Not Encoded)"
    html: '<div>Test</div>'
    description: "When serializing, kept as-is (inconsistent)"
  - label: "✅ Expected"
    html: '<div>Test</div>'
    description: "Expected: Consistent encoding handling"
---

## Phenomenon

When serializing contenteditable content (e.g., using `innerHTML`) in Chrome, special characters may be encoded as HTML entities or kept as actual characters inconsistently. This makes it difficult to predict the output format.

## Reproduction example

1. Insert text with special characters: `<div>Test</div>`
2. Serialize using `element.innerHTML`
3. Observe the output

## Observed behavior

- Characters may be encoded: `&lt;div&gt;Test&lt;/div&gt;`
- Or characters may be kept as-is: `<div>Test</div>`
- Encoding is inconsistent
- Output format is unpredictable

## Expected behavior

- Entity encoding should be consistent
- Or encoding should be predictable
- Special characters should be handled correctly
- Output format should be reliable

## Browser Comparison

- **Chrome/Edge**: Encoding inconsistent (this case)
- **Firefox**: Similar encoding inconsistency
- **Safari**: Encoding behavior varies

## Notes and possible direction for workarounds

- Normalize entity encoding after serialization
- Use consistent encoding strategy
- Document expected encoding behavior
- Handle special characters explicitly

