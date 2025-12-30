---
id: ce-0076
scenarioId: scenario-cors-restrictions
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: MacBook Pro
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: CORS restrictions may affect contenteditable in cross-origin iframes
description: "When a contenteditable element is inside a cross-origin iframe, CORS restrictions may prevent certain operations. Accessing the contenteditable from the parent frame may be blocked, and some editin"
tags:
  - cors
  - iframe
  - security
  - safari
  - macos
status: draft
---

## Phenomenon

When a contenteditable element is inside a cross-origin iframe, CORS restrictions may prevent certain operations. Accessing the contenteditable from the parent frame may be blocked, and some editing operations may be restricted.

## Reproduction example

1. Create a page with a cross-origin iframe.
2. Inside the iframe, create a contenteditable div.
3. Try to access the contenteditable from the parent frame.
4. Try to programmatically modify the content.
5. Observe any CORS-related errors or restrictions.

## Observed behavior

- In Safari on macOS, CORS restrictions apply to cross-origin iframes.
- Accessing contenteditable content from parent frame may be blocked.
- Some operations may be restricted due to same-origin policy.
- Error messages may not be clear.

## Expected behavior

- CORS restrictions should be clearly documented.
- Or, there should be a standard way to work with cross-origin contenteditable.
- Error messages should be helpful.

