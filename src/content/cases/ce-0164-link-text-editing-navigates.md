---
id: ce-0164
scenarioId: scenario-link-click-editing
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Editing link text triggers navigation in Safari
description: "When trying to edit link text in Safari, clicking or selecting the text may trigger navigation to the link URL. It's very difficult to edit link text without accidentally navigating."
tags:
  - link
  - click
  - navigation
  - editing
  - safari
status: draft
domSteps:
  - label: "Before"
    html: '<a href="https://example.com">Link text</a>'
    description: "Link element"
  - label: "After Click (Bug)"
    html: '[Navigated to https://example.com]'
    description: "Click immediately triggers navigation, text editing not possible"
  - label: "✅ Expected"
    html: '<a href="https://example.com">Link text</a>'
    description: "Expected: Click can select text, enter edit mode"
---

### Phenomenon

When trying to edit link text in Safari, clicking or selecting the text may trigger navigation to the link URL. It's very difficult to edit link text without accidentally navigating.

### Reproduction example

1. Create a link: `<a href="https://example.com">Link text</a>`
2. Try to click and select the text for editing

### Observed behavior

- Clicking triggers navigation immediately
- Text selection is interrupted
- Cannot edit link text easily
- Navigation happens before editing can occur

### Expected behavior

- Clicking should allow text selection
- Navigation should be prevented during editing
- Users should be able to edit link text
- Navigation should only occur on explicit activation

### Browser Comparison

- **Chrome/Edge**: May navigate but usually allows selection
- **Firefox**: More likely to navigate immediately
- **Safari**: Most likely to navigate on click (this case)

### Notes and possible direction for workarounds

- Prevent default link behavior on all clicks
- Allow text selection without navigation
- Only navigate on explicit activation (e.g., Ctrl+Click)
- Provide edit mode for links

