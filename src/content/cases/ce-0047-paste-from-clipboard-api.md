---
id: ce-0047-paste-from-clipboard-api
scenarioId: scenario-clipboard-api
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Clipboard API paste does not work in contenteditable
description: "When using the Clipboard API (navigator.clipboard.readText() or navigator.clipboard.read()) to programmatically paste content into a contenteditable region, the paste operation may fail or not trigger paste events."
tags:
  - clipboard
  - api
  - paste
  - chrome
status: draft
---

## Phenomenon

When using the Clipboard API (`navigator.clipboard.readText()` or `navigator.clipboard.read()`) to programmatically paste content into a contenteditable region, the paste operation may fail or not work as expected.

## Reproduction example

1. Create a contenteditable div.
2. Copy some text to the clipboard.
3. Use JavaScript to read from clipboard: `await navigator.clipboard.readText()`.
4. Try to insert the text into the contenteditable.
5. Observe whether the paste works correctly.

## Observed behavior

- In Chrome on macOS, Clipboard API operations may fail in contenteditable contexts.
- Permission errors may occur.
- The paste may not trigger expected events or behaviors.

## Expected behavior

- Clipboard API should work reliably in contenteditable contexts.
- Permissions should be handled correctly.
- Paste operations should trigger appropriate events.

