---
id: ce-0142
scenarioId: scenario-link-click-editing
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Double-click on link selects text but may still navigate
description: "When double-clicking on a link in a contenteditable element in Chrome, the link text is selected for editing, but the link may still navigate if the double-click is too fast or timing is off."
tags:
  - link
  - click
  - double-click
  - navigation
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<a href="https://example.com">Link text</a>'
    description: "Link element"
  - label: "After Double-Click (Bug)"
    html: '[Navigated to https://example.com]'
    description: "Double click selects text but also triggers navigation"
  - label: "✅ Expected"
    html: '<a href="https://example.com">Link text</a>'
    description: "Expected: Double click only selects text, no navigation"
---

## Phenomenon

When double-clicking on a link in a contenteditable element in Chrome, the link text is selected for editing, but the link may still navigate if the double-click is too fast or timing is off.

## Reproduction example

1. Create a link: `<a href="https://example.com">Link text</a>`
2. Double-click on the link text quickly

## Observed behavior

- Link text is selected
- But navigation may still occur
- Timing is critical
- Behavior is inconsistent

## Expected behavior

- Double-click should select text without navigation
- Navigation should be prevented during editing
- Behavior should be consistent
- Users should be able to edit link text easily

## Browser Comparison

- **Chrome/Edge**: May navigate on double-click (this case)
- **Firefox**: More likely to navigate
- **Safari**: Navigation behavior inconsistent

## Notes and possible direction for workarounds

- Prevent default link behavior on all clicks
- Handle double-click explicitly
- Allow text selection without navigation
- Only navigate on explicit activation

