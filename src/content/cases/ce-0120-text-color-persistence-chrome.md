---
id: ce-0120-text-color-persistence-chrome
scenarioId: scenario-text-color-change
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Text color persists when typing after applying in Chrome
description: "When applying a text color to selected text in Chrome and then continuing to type, the new text inherits the color. This is the expected behavior and works correctly in Chrome/Edge."
tags:
  - color
  - text
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<span style="color: red;">Hello</span>|'
    description: "Red text, cursor (|) at the end"
  - label: "After Typing"
    html: '<span style="color: red;">HelloWorld</span>'
    description: "Newly typed text also inherits red color (normal behavior)"
  - label: "✅ Expected"
    html: '<span style="color: red;">HelloWorld</span>'
    description: "Expected: Newly typed text also inherits color (current behavior is correct)"
---

## Phenomenon

When applying a text color to selected text in Chrome and then continuing to type, the new text inherits the color. This is the expected behavior and works correctly in Chrome/Edge.

## Reproduction example

1. Select some text in a contenteditable element
2. Apply a text color (e.g., red)
3. Place cursor after the colored text
4. Type new text

## Observed behavior

- The newly typed text inherits the applied color
- Color formatting persists for new text
- This is the correct and expected behavior
- Works consistently in Chrome/Edge

## Expected behavior

- Newly typed text should inherit the color (current behavior is correct)
- Color formatting should persist until explicitly changed
- Behavior should be consistent (which it is in Chrome/Edge)

## Browser Comparison

- **Chrome/Edge**: Color persists correctly (this case - correct behavior)
- **Firefox**: Color persistence may be less reliable
- **Safari**: Color may not persist

## Notes and possible direction for workarounds

- This behavior is correct and expected
- May need to handle color removal explicitly
- Consider if color should persist across paragraphs
- Document expected behavior for users

