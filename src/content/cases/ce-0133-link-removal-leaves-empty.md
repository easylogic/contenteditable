---
id: ce-0133
scenarioId: scenario-link-insertion
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Removing link leaves empty anchor tags in Firefox
description: "When removing a link (keeping the text) in Firefox, empty anchor tags may be left in the DOM. These empty <a> elements cause layout issues and bloat the HTML."
tags:
  - link
  - anchor
  - empty
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: '<a href="https://example.com">Link text</a>'
    description: "Link element"
  - label: "After Unlink (Bug)"
    html: '<a href="https://example.com"></a>Link text'
    description: "After link removal, empty anchor tag remains"
  - label: "✅ Expected"
    html: 'Link text'
    description: "Expected: After link removal, only text remains, no empty tags"
---

## Phenomenon

When removing a link (keeping the text) in Firefox, empty anchor tags may be left in the DOM. These empty `<a>` elements cause layout issues and bloat the HTML.

## Reproduction example

1. Create a link: `<a href="url">Link text</a>`
2. Remove the link (unlink operation)
3. Observe the DOM

## Observed behavior

- Empty `<a></a>` tags may remain
- Or `<a>` tags with only whitespace remain
- DOM becomes bloated
- Layout may have unexpected spacing

## Expected behavior

- Link should be removed cleanly
- Text should remain without link wrapper
- No empty anchor tags should remain
- DOM should be clean

## Browser Comparison

- **Chrome/Edge**: May leave empty anchors
- **Firefox**: More likely to leave empty anchors (this case)
- **Safari**: Most likely to leave empty structures

## Notes and possible direction for workarounds

- Intercept link removal
- Clean up empty anchor tags
- Unwrap link and preserve text content
- Normalize DOM after link operations

