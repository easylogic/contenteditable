---
id: ce-0124
scenarioId: scenario-list-formatting-persistence
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Bold formatting is lost when pressing Enter in list item in Firefox
description: "When applying bold formatting to text in a list item and then pressing Enter to create a new list item, the bold formatting is lost. The new list item does not have bold formatting."
tags:
  - list
  - formatting
  - bold
  - enter
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: '<ul><li><b>Bold item</b></li></ul>'
    description: "굵은 텍스트가 있는 리스트 항목, 커서가 끝에 위치"
  - label: "After Enter (Bug)"
    html: '<ul><li><b>Bold item</b></li><li></li></ul>'
    description: "Enter로 새 항목 생성, 굵은 서식이 새 항목에 적용되지 않음"
  - label: "✅ Expected"
    html: '<ul><li><b>Bold item</b></li><li><b></b></li></ul>'
    description: "정상: 새 항목에도 굵은 서식이 상속됨"
---

### Phenomenon

When applying bold formatting to text in a list item and then pressing Enter to create a new list item, the bold formatting is lost. The new list item does not have bold formatting.

### Reproduction example

1. Create a list: `<ul><li><b>Bold item</b></li></ul>`
2. Place cursor at the end of "Bold item"
3. Press Enter

### Observed behavior

- New list item is created
- Bold formatting is not applied to new item
- Formatting is lost
- User must reapply formatting

### Expected behavior

- Bold formatting should persist in new list item
- Or formatting should be explicitly cleared
- Behavior should be consistent
- User should understand when formatting persists

### Browser Comparison

- **Chrome/Edge**: Formatting may persist or be lost inconsistently
- **Firefox**: Formatting is lost (this case)
- **Safari**: Formatting behavior most inconsistent

### Notes and possible direction for workarounds

- Intercept Enter key in list items
- Preserve formatting when creating new items
- Or explicitly clear formatting if desired
- Document formatting persistence behavior

