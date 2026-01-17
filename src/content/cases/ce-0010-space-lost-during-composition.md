---
id: ce-0010-space-lost-during-composition
scenarioId: scenario-space-during-composition
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: Korean (IME)
caseTitle: Space key during composition is ignored or committed inconsistently
description: "While composing text with a Korean IME in a contenteditable element, pressing the Space key is either ignored or commits the composition in an inconsistent way compared to native text controls."
tags:
  - composition
  - ime
  - space
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한</span>'
    description: "Korean composition in progress"
  - label: "After Space (Bug)"
    html: 'Hello 한'
    description: "Space key ignored or composition unexpectedly committed"
  - label: "✅ Expected"
    html: 'Hello 한 '
    description: "Expected: Space key inserts space or commits composition"
---

## Phenomenon

While composing text with a Korean IME in a `contenteditable` element, pressing the Space key is
either ignored or commits the composition in an inconsistent way compared to native text controls.

## Reproduction example

1. Focus the editable area.
2. Activate a Korean IME.
3. Start composing a word but do not finalize it.
4. Press Space one or more times.

## Observed behavior

- The Space key sometimes does not insert a visible space.
- In some sequences, the composition is committed and a space is inserted, but the order of events
  differs from native controls.

## Expected behavior

- Space behaves consistently across `contenteditable` and native text inputs in the same
  environment, or any difference is clearly documented.

## Notes

- This behavior can affect how products interpret word boundaries and trigger autocomplete or
  suggestion features.


