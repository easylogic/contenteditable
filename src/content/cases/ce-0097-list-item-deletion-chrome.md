---
id: ce-0097
scenarioId: scenario-list-item-deletion
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Backspace at beginning of list item converts to paragraph in Chrome
description: "When pressing Backspace at the beginning of the first list item in Chrome, the list item is deleted and converted to a paragraph element. This behavior differs from Firefox and Safari, which may delete the entire list or create unexpected structures."
tags:
  - list
  - deletion
  - backspace
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<ul><li>Item 1</li><li>Item 2</li></ul>'
    description: "리스트, 첫 번째 항목 시작 위치에 커서"
  - label: "After Backspace (Bug)"
    html: '<p>Item 1</p><ul><li>Item 2</li></ul>'
    description: "Backspace로 첫 번째 항목이 리스트에서 제거되고 paragraph로 변환됨"
  - label: "✅ Expected"
    html: '<ul><li>Item 2</li></ul>'
    description: "정상: 첫 번째 항목만 삭제되고 리스트 구조 유지"
---

### Phenomenon

When pressing Backspace at the beginning of the first list item in Chrome, the list item is deleted and converted to a paragraph element. This behavior differs from Firefox and Safari, which may delete the entire list or create unexpected structures.

### Reproduction example

1. Create a list with at least one item: `<ul><li>Item 1</li><li>Item 2</li></ul>`
2. Place cursor at the very beginning of "Item 1" (before the text)
3. Press Backspace

### Observed behavior

- The first list item is removed from the list
- The list item content is converted to a `<p>` paragraph element
- The remaining list items stay in the list structure
- If it was the only item, the list may be removed entirely

### Expected behavior

- The list item should be deleted and merged with previous content (if any)
- Or the list item should be removed while maintaining list structure
- Behavior should be consistent across browsers

### Browser Comparison

- **Chrome/Edge**: Converts list item to paragraph
- **Firefox**: May delete entire list or create nested structures
- **Safari**: May create empty list items or unexpected structures

### Notes and possible direction for workarounds

- Intercept `beforeinput` events with `inputType: 'deleteContentBackward'`
- Check if cursor is at the beginning of a list item
- Implement custom deletion logic that maintains expected behavior
- Consider converting to paragraph only if there's previous content to merge with

