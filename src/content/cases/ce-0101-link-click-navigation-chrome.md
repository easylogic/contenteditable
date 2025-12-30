---
id: ce-0101
scenarioId: scenario-link-click-editing
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Single click on link navigates instead of allowing text selection in Chrome
description: "When clicking on a link inside a contenteditable element in Chrome, a single click may navigate to the link URL instead of allowing text selection for editing. This makes it difficult to edit link text."
tags:
  - link
  - click
  - navigation
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<a href="https://example.com">Link text</a>'
    description: "Link element, before click"
  - label: "After Single Click (Bug)"
    html: '<a href="https://example.com">Link text</a>'
    description: "Single click navigates to link URL (text selection not possible)"
  - label: "✅ Expected"
    html: '<a href="https://example.com">Link text</a>'
    description: "Expected: Single click can select text, editing possible"
---

## Phenomenon

When clicking on a link inside a contenteditable element in Chrome, a single click may navigate to the link URL instead of allowing text selection for editing. This makes it difficult to edit link text.

## Reproduction example

1. Create a link in contenteditable: `<a href="https://example.com">Link text</a>`
2. Single click on the link text

## Observed behavior

- Browser may navigate to the link URL
- Or text selection may be allowed (behavior inconsistent)
- Double-click usually selects text for editing
- Right-click shows context menu

## Expected behavior

- Single click should select text for editing (not navigate)
- Navigation should only occur on explicit link activation
- Behavior should be consistent
- Users should be able to edit link text easily

## Browser Comparison

- **Chrome/Edge**: May navigate on single click (this case)
- **Firefox**: More likely to navigate immediately
- **Safari**: Behavior inconsistent

## Notes and possible direction for workarounds

- Prevent default link behavior on click
- Use `e.preventDefault()` in click handler
- Allow text selection on single click
- Only navigate on explicit activation (e.g., Ctrl+Click or dedicated button)

