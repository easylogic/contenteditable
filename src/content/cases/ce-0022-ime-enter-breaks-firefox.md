---
id: ce-0022-ime-enter-breaks-firefox
scenarioId: scenario-ime-enter-breaks
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: Korean IME
caseTitle: Composition is cancelled when pressing Enter inside contenteditable
description: "When using a Korean IME (Input Method Editor) in Firefox on Windows, pressing Enter during composition cancels the composition instead of committing it. This breaks the expected IME workflow."
tags:
  - ime
  - composition
  - enter
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한</span>'
    description: "Korean composition in progress"
  - label: "After Enter (Bug)"
    html: 'Hello '
    description: "Enter key cancels composition, composition text lost"
  - label: "✅ Expected"
    html: 'Hello 한<br>'
    description: "Expected: Line break after composition commits"
---

## Phenomenon

When using a Korean IME (Input Method Editor) in Firefox on Windows, pressing Enter during composition cancels the composition instead of committing it. This breaks the expected IME workflow.

## Reproduction example

1. Create a contenteditable div.
2. Switch to Korean IME.
3. Start typing Korean characters (e.g., "한글").
4. While the composition is active (characters are still being composed), press Enter.

## Observed behavior

- In Firefox on Windows with Korean IME, pressing Enter cancels the composition.
- The partially composed characters are lost.
- The Enter key does not commit the composition as expected.

## Expected behavior

- Pressing Enter during IME composition should commit the composed characters.
- The composition should complete and the characters should be inserted into the contenteditable.

