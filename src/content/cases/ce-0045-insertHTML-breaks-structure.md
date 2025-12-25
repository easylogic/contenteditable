---
id: ce-0045
scenarioId: scenario-insertHTML-behavior
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: insertHTML breaks DOM structure and formatting
description: "When using document.execCommand('insertHTML', ...) to insert HTML content into a contenteditable region, the DOM structure may be broken or reformatted unexpectedly. Nested elements may be flattened or reformatted."
tags:
  - insertHTML
  - dom
  - formatting
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello World'
    description: "기본 텍스트"
  - label: "Insert HTML"
    html: '<p><strong>Bold text</strong></p>'
    description: "insertHTML로 삽입할 HTML"
  - label: "❌ After insertHTML (Bug)"
    html: 'Hello <strong>Bold text</strong> World'
    description: "DOM 구조 손상, &lt;p&gt; 태그 손실, 중첩 구조 평탄화"
  - label: "✅ Expected"
    html: 'Hello <p><strong>Bold text</strong></p> World'
    description: "정상: HTML 구조 보존, 중첩 요소 유지"
---

### Phenomenon

When using `document.execCommand('insertHTML', ...)` to insert HTML content into a contenteditable region, the DOM structure may be broken or reformatted unexpectedly. Nested elements may be flattened or reorganized.

### Reproduction example

1. Create a contenteditable div.
2. Select a position within it.
3. Use `document.execCommand('insertHTML', false, '<p><strong>Bold text</strong></p>')`.
4. Inspect the resulting DOM structure.

### Observed behavior

- In Chrome on Windows, `insertHTML` may break the DOM structure.
- Nested elements may be flattened or reorganized.
- Formatting may be lost or changed unexpectedly.

### Expected behavior

- `insertHTML` should preserve the HTML structure as provided.
- Nested elements should remain nested.
- Formatting should be maintained.

