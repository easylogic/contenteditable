---
id: ce-0036-arrow-keys-move-by-word
scenarioId: scenario-caret-movement-granularity
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Arrow keys move by word instead of character when modifier is not pressed
description: "In Chrome on Windows, arrow keys may move the caret by word instead of by character, even when no modifier keys are pressed. This makes precise cursor positioning difficult."
tags:
  - arrow-keys
  - caret
  - navigation
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello| World Test'
    description: "Text, cursor (|) after 'Hello'"
  - label: "After Right Arrow (Bug)"
    html: 'Hello World| Test'
    description: "Right arrow moves by word (expected: one character at a time)"
  - label: "✅ Expected"
    html: 'Hello |World Test'
    description: "Expected: Right arrow moves one character at a time"
---

## Phenomenon

In Chrome on Windows, arrow keys may move the caret by word instead of by character, even when no modifier keys are pressed. This makes precise cursor positioning difficult.

## Reproduction example

1. Create a contenteditable div.
2. Type some text with multiple words.
3. Use the left and right arrow keys to move the caret.
4. Observe the caret movement granularity.

## Observed behavior

- In Chrome on Windows, arrow keys may jump by word instead of character.
- The behavior is inconsistent and may depend on text content or formatting.
- Precise character-by-character navigation is difficult.

## Expected behavior

- Arrow keys should move the caret one character at a time by default.
- Word-level movement should only occur with modifier keys (e.g., Ctrl+Arrow).
- The behavior should be consistent and predictable.

