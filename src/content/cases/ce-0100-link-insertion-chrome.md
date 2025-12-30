---
id: ce-0100
scenarioId: scenario-link-insertion
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Creating link from selected text works but may create nested links in Chrome
description: "When creating a link from selected text in Chrome, the link is created successfully, but if the selection is already inside a link, nested links may be created, which is invalid HTML."
tags:
  - link
  - anchor
  - nested
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<a href="url1">Link text</a>'
    description: "Existing link"
  - label: "After New Link (Bug)"
    html: '<a href="url1"><a href="url2">Link text</a></a>'
    description: "Nested link created (invalid HTML)"
  - label: "✅ Expected"
    html: '<a href="url2">Link text</a>'
    description: "Expected: Existing link removed then new link created"
---

## Phenomenon

When creating a link from selected text in Chrome, the link is created successfully, but if the selection is already inside a link, nested links may be created, which is invalid HTML.

## Reproduction example

1. Create a link: `<a href="url1">Link text</a>`
2. Select part of "Link text"
3. Create a new link (Ctrl+K or programmatically)

## Observed behavior

- A nested link structure may be created: `<a href="url1"><a href="url2">Link text</a></a>`
- This is invalid HTML (links cannot be nested)
- Browser may render it incorrectly
- DOM structure becomes malformed

## Expected behavior

- Existing link should be removed first
- New link should replace the old one
- No nested links should be created
- HTML structure should remain valid

## Browser Comparison

- **Chrome/Edge**: May create nested links (this case)
- **Firefox**: More likely to create nested links
- **Safari**: May create unexpected structures

## Notes and possible direction for workarounds

- Check if selection is inside an existing link before creating new one
- Remove existing link structure first
- Use `closest('a')` to find parent link
- Unwrap existing link before creating new one

