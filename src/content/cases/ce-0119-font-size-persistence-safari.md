---
id: ce-0119
scenarioId: scenario-font-size-change
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Font size does not persist when typing after applying in Safari
description: "When applying a font size to selected text in Safari and then continuing to type, the new text does not inherit the font size. The size formatting is lost for newly typed characters."
tags:
  - font
  - size
  - safari
status: draft
domSteps:
  - label: "Before"
    html: 'Hello World'
    description: "Basic text"
  - label: "After Font Size"
    html: 'Hello <span style="font-size: 18px;">World</span>'
    description: "18px font size applied"
  - label: "After Typing (Bug)"
    html: 'Hello <span style="font-size: 18px;">World</span> New'
    description: "Newly typed text does not have font size applied"
  - label: "✅ Expected"
    html: 'Hello <span style="font-size: 18px;">World New</span>'
    description: "Expected: Newly typed text also inherits font size"
---

## Phenomenon

When applying a font size to selected text in Safari and then continuing to type, the new text does not inherit the font size. The size formatting is lost for newly typed characters.

## Reproduction example

1. Select some text in a contenteditable element
2. Apply a font size (e.g., 18px)
3. Place cursor after the formatted text
4. Type new text

## Observed behavior

- The newly typed text uses the default font size
- Font size formatting is not maintained for new text
- This differs from Chrome/Edge where size persists
- User must reapply font size for each new text segment

## Expected behavior

- Newly typed text should inherit the font size
- Font size formatting should persist until explicitly changed
- Behavior should be consistent with Chrome/Edge

## Browser Comparison

- **Chrome/Edge**: Font size persists for new text
- **Firefox**: Size persistence may be less reliable
- **Safari**: Font size does not persist (this case)

## Notes and possible direction for workarounds

- Intercept text insertion and apply font size
- Use `beforeinput` event to detect text insertion
- Apply font size style to newly inserted text
- Maintain font size state for current typing position

