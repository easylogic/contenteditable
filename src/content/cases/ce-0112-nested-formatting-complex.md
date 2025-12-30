---
id: ce-0112
scenarioId: scenario-nested-formatting
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Applying multiple formatting creates deeply nested structures
description: "When applying multiple formatting operations (bold, italic, underline) to text, deeply nested HTML structures are created (e.g., <b><i><u>text</u></i></b>). This makes the DOM complex and hard to manage."
tags:
  - formatting
  - nested
  - bold
  - italic
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Text'
    description: "Basic text"
  - label: "After Bold"
    html: '<b>Text</b>'
    description: "Bold formatting applied"
  - label: "After Italic (Bug)"
    html: '<b><i>Text</i></b>'
    description: "Italic formatting applied, nested structure created"
  - label: "After Underline (Bug)"
    html: '<b><i><u>Text</u></i></b>'
    description: "Underline formatting applied, deep nested structure created"
  - label: "✅ Expected (Normalized)"
    html: '<span style="font-weight: bold; font-style: italic; text-decoration: underline;">Text</span>'
    description: "Expected: Consolidated into style attribute, nesting minimized"
---

## Phenomenon

When applying multiple formatting operations (bold, italic, underline) to text, deeply nested HTML structures are created (e.g., `<b><i><u>text</u></i></b>`). This makes the DOM complex and hard to manage.

## Reproduction example

1. Select some text
2. Apply bold formatting
3. Apply italic formatting
4. Apply underline formatting
5. Observe the DOM structure

## Observed behavior

- Deeply nested structure: `<b><i><u>text</u></i></b>`
- Or different nesting order depending on application sequence
- DOM becomes complex and bloated
- Difficult to manage formatting state

## Expected behavior

- Formatting should be applied efficiently
- Nesting should be minimized where possible
- Structure should be normalized
- Formatting state should be easy to query

## Browser Comparison

- **Chrome/Edge**: Creates nested structures (this case)
- **Firefox**: Similar nesting behavior
- **Safari**: Most complex nesting

## Notes and possible direction for workarounds

- Normalize formatting structure after operations
- Merge same-type formatting elements
- Use consistent nesting order
- Consider using data attributes instead of nested elements

