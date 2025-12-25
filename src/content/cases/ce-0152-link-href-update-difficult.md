---
id: ce-0152
scenarioId: scenario-link-insertion
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Updating link href is difficult without custom implementation
description: "When a link already exists in contenteditable, updating the href attribute is difficult. There's no native way to edit the URL, and programmatic updates may not be reflected in the DOM immediately."
tags:
  - link
  - href
  - update
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<a href="url1">Link text</a>'
    description: "기존 링크"
  - label: "After Programmatic Update (Bug)"
    html: '<a href="url1">Link text</a>'
    description: "프로그래밍 방식으로 href 업데이트 시도, DOM에 반영 안 됨"
  - label: "✅ Expected"
    html: '<a href="url2">Link text</a>'
    description: "정상: href 업데이트가 DOM에 즉시 반영됨"
---

### Phenomenon

When a link already exists in contenteditable, updating the href attribute is difficult. There's no native way to edit the URL, and programmatic updates may not be reflected in the DOM immediately.

### Reproduction example

1. Create a link: `<a href="url1">Link text</a>`
2. Try to update the href to a different URL
3. Observe the DOM

### Observed behavior

- No native way to edit href
- Programmatic updates may not work
- Or updates may not be reflected
- Difficult to modify existing links

### Expected behavior

- Should be able to edit link URL easily
- Or programmatic updates should work reliably
- Changes should be reflected immediately
- Link editing should be intuitive

### Browser Comparison

- **All browsers**: No native href editing
- Custom implementation needed for link editing

### Notes and possible direction for workarounds

- Provide UI for editing link href
- Intercept link clicks to show edit dialog
- Update href programmatically
- Ensure changes are reflected in DOM

