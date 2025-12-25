---
id: ce-0116
scenarioId: scenario-list-formatting-persistence
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: List structure is lost when pasting formatted content
description: "When pasting formatted content (with bold, italic, etc.) into a list item, the list structure may be broken and list items may be converted to paragraphs. The formatting is preserved but the list structure is lost."
tags:
  - list
  - formatting
  - paste
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<ul><li>Item 1</li><li>Item 2</li></ul>'
    description: "리스트 구조"
  - label: "Clipboard"
    html: '<strong>Bold Text</strong>'
    description: "복사한 서식 있는 텍스트"
  - label: "❌ After Paste"
    html: '<p>Item 1</p><p><strong>Bold Text</strong></p><p>Item 2</p>'
    description: "리스트 구조 손실, &lt;li&gt;가 &lt;p&gt;로 변환됨"
  - label: "✅ Expected"
    html: '<ul><li>Item 1</li><li><strong>Bold Text</strong></li><li>Item 2</li></ul>'
    description: "리스트 구조 유지, 서식 적용"
---

### Phenomenon

When pasting formatted content (with bold, italic, etc.) into a list item, the list structure may be broken and list items may be converted to paragraphs. The formatting is preserved but the list structure is lost.

### Reproduction example

1. Create a list: `<ul><li>Item 1</li><li>Item 2</li></ul>`
2. Copy formatted text from elsewhere (e.g., bold text)
3. Paste into a list item

### Observed behavior

- List items may be converted to paragraphs
- List structure is broken
- Formatting is preserved but list is lost
- DOM structure becomes: `<p>Item 1</p><p>Item 2</p>` instead of list

### Expected behavior

- List structure should be maintained
- Formatting should be applied within list items
- List items should remain as `<li>` elements
- Structure should not break

### Browser Comparison

- **Chrome/Edge**: May break list structure (this case)
- **Firefox**: More likely to break structure
- **Safari**: Most likely to break structure

### Notes and possible direction for workarounds

- Intercept paste event in list context
- Strip block-level elements from pasted content
- Preserve list structure
- Apply formatting within list items only

