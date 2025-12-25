---
id: ce-0187
scenarioId: scenario-ime-composition-focus-blur
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Korean (IME)
caseTitle: Korean IME composition lost when focus changes in Chrome
description: "When composing Korean text with IME in a contenteditable element, clicking elsewhere or programmatically changing focus causes the composition to be cancelled and the composed text to be lost. This differs from native input fields where composition may be preserved."
tags:
  - composition
  - ime
  - focus
  - blur
  - korean
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한</span>'
    description: "Korean composition in progress"
  - label: "After Blur (Bug)"
    html: 'Hello '
    description: "Focus change cancels composition, text lost"
  - label: "✅ Expected"
    html: 'Hello 한'
    description: "Expected: Composition preserved or handled gracefully"
---

### Phenomenon

When composing Korean text with IME in a `contenteditable` element, clicking elsewhere or programmatically changing focus causes the composition to be cancelled and the composed text to be lost. This differs from native input fields where composition may be preserved or handled more gracefully.

### Reproduction example

1. Focus the editable area.
2. Activate Korean IME.
3. Start composing Korean text (e.g., type "한").
4. Click elsewhere or programmatically blur the element before completing composition.

### Observed behavior

- The compositionend event fires with incomplete data
- The composed text is lost
- The blur event may fire before or after compositionend
- No recovery mechanism for lost composition

### Expected behavior

- Composition should be preserved or gracefully handled when focus changes
- Composed text should not be lost
- Event sequence should be predictable and consistent

### Browser Comparison

- **Chrome**: Composition may be lost on blur
- **Edge**: Similar to Chrome
- **Firefox**: May have different behavior
- **Safari**: Not applicable on Windows

### Notes and possible direction for workarounds

- Monitor blur and compositionend events to detect composition loss
- Consider storing pending composition text for recovery
- Prevent programmatic blur during active composition if possible

