---
id: ce-0074-contenteditable-with-content-security-policy
scenarioId: scenario-csp-restrictions
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Content Security Policy may restrict contenteditable behavior
description: "When a page has a strict Content Security Policy (CSP), certain contenteditable operations may be restricted. Pasting content, executing scripts, or inserting HTML may be blocked depending on the CSP configuration."
tags:
  - csp
  - security
  - chrome
  - windows
status: draft
---

## Phenomenon

When a page has a strict Content Security Policy (CSP), certain contenteditable operations may be restricted. Pasting content, executing scripts, or inserting HTML may be blocked depending on the CSP directives.

## Reproduction example

1. Create a page with a strict CSP header (e.g., `default-src 'self'`).
2. Create a contenteditable div on the page.
3. Try to paste content from clipboard.
4. Try to insert HTML programmatically.
5. Observe any CSP violations or blocked operations.

## Observed behavior

- In Chrome on Windows, CSP may block certain contenteditable operations.
- Pasting may be restricted if `unsafe-inline` is not allowed.
- Script execution within contenteditable may be blocked.
- CSP violations may be logged in the console.

## Expected behavior

- CSP should not interfere with basic contenteditable editing.
- Pasting should work within CSP constraints.
- Or, there should be clear documentation on CSP and contenteditable interaction.

