---
id: ce-0052
scenarioId: scenario-paste-event-handling
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: preventDefault on paste event does not prevent default paste behavior
description: "In Chrome on Windows, calling preventDefault() on the paste event does not always prevent the default paste behavior. Content may still be pasted despite the prevention."
tags:
  - paste
  - events
  - preventDefault
  - chrome
status: draft
---

## Phenomenon

In Chrome on Windows, calling `preventDefault()` on the `paste` event does not always prevent the default paste behavior. Content may still be pasted despite the prevention.

## Reproduction example

1. Create a contenteditable div.
2. Add a `paste` event listener that calls `event.preventDefault()`.
3. Copy some text.
4. Paste into the contenteditable.
5. Observe whether the paste is prevented.

## Observed behavior

- In Chrome on Windows, `preventDefault()` on `paste` may not work.
- Content may still be pasted.
- The default behavior is not consistently prevented.

## Expected behavior

- `preventDefault()` on `paste` should prevent the default paste behavior.
- No content should be pasted when prevented.
- The behavior should be consistent and reliable.

