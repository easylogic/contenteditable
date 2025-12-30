---
id: ce-0015
scenarioId: scenario-accessibility-announcements
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: Screen readers do not announce changes in contenteditable regions
description: "When content changes in a contenteditable region (text is typed, deleted, or formatted), screen readers do not announce these changes to users. This makes it difficult for users relying on assistive technologies to understand what is happening in the editor."
tags:
  - accessibility
  - screen-reader
  - aria
  - safari
status: draft
---

## Phenomenon

When content changes in a contenteditable region (text is typed, deleted, or formatted), screen readers do not announce these changes to users. This makes it difficult for users relying on assistive technologies to understand what is happening in the editor.

## Reproduction example

1. Create a contenteditable div with appropriate ARIA attributes.
2. Enable VoiceOver (macOS) or NVDA (Windows).
3. Focus the contenteditable region.
4. Type some text or delete text.
5. Observe what the screen reader announces.

## Observed behavior

- In Safari with VoiceOver, changes to contenteditable regions are not announced.
- The screen reader may not indicate when formatting is applied or removed.
- Selection changes may not be announced.

## Expected behavior

- Screen readers should announce when text is inserted or deleted.
- Formatting changes should be announced.
- Selection changes should be announced.
- The current state of the editor should be accessible to screen reader users.

