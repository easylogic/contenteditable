---
id: ce-0190
scenarioId: scenario-ime-composition-escape-key
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: Korean (IME)
caseTitle: Korean IME composition cancelled by Escape key in Edge
description: "When composing Korean text with IME in a contenteditable element, pressing Escape cancels the composition and loses the composed text. This can interfere with UI interactions that use Escape for cancellation."
tags:
  - composition
  - ime
  - escape
  - korean
  - edge
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한글</span>'
    description: "Korean composition in progress"
  - label: "After Escape (Bug)"
    html: 'Hello '
    description: "Escape key cancels composition, composition text lost"
  - label: "✅ Expected"
    html: 'Hello 한글'
    description: "Expected: Composition handled gracefully or preserved"
---

## Phenomenon

When composing Korean text with IME in a `contenteditable` element, pressing Escape cancels the composition and loses the composed text. This can interfere with UI interactions that use Escape for cancellation or closing dialogs.

## Reproduction example

1. Focus the editable area (e.g., in a modal dialog or dropdown).
2. Activate Korean IME.
3. Start composing Korean text (e.g., type "한글").
4. Press Escape to close the dialog or cancel an action.

## Observed behavior

- The compositionend event fires with incomplete data
- The composed text is lost
- Escape may trigger both composition cancellation and other UI actions
- No recovery mechanism for lost composition

## Expected behavior

- Composition should be handled gracefully when Escape is pressed
- Composed text should not be lost
- Escape key behavior should be consistent and predictable

## Browser Comparison

- **Edge**: Escape may cancel composition
- **Chrome**: Similar to Edge
- **Firefox**: May have different Escape key behavior during composition
- **Safari**: Not applicable on Windows

## Notes and possible direction for workarounds

- Prevent Escape during active composition if composition preservation is critical
- Consider committing composition before allowing Escape
- Handle Escape key events carefully during composition, especially in modal contexts

