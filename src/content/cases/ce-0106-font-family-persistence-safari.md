---
id: ce-0106
scenarioId: scenario-font-family-change
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Font family does not persist when typing after applying in Safari
description: "When applying a font family to selected text in Safari and then continuing to type, the new text does not inherit the font family. The font formatting is lost for newly typed characters."
tags:
  - font
  - typography
  - safari
status: draft
domSteps:
  - label: "Before"
    html: '<span style="font-family: Arial;">Hello</span>|'
    description: "Text with Arial font applied, cursor (|) at the end"
  - label: "After Typing (Bug)"
    html: '<span style="font-family: Arial;">Hello</span>World'
    description: "Newly typed text uses default font (Arial not inherited)"
  - label: "✅ Expected"
    html: '<span style="font-family: Arial;">HelloWorld</span>'
    description: "Expected: Newly typed text also inherits Arial font"
---

### Phenomenon

When applying a font family to selected text in Safari and then continuing to type, the new text does not inherit the font family. The font formatting is lost for newly typed characters.

### Reproduction example

1. Select some text in a contenteditable element
2. Apply a font family (e.g., "Arial")
3. Place cursor after the formatted text
4. Type new text

### Observed behavior

- The newly typed text uses the default font, not the applied font
- Font formatting is not maintained for new text
- This differs from Chrome/Edge where font persists
- User must reapply font for each new text segment

### Expected behavior

- Newly typed text should inherit the font family
- Font formatting should persist until explicitly changed
- Behavior should be consistent with Chrome/Edge

### Browser Comparison

- **Chrome/Edge**: Font family persists for new text
- **Firefox**: Font persistence may be less reliable
- **Safari**: Font does not persist (this case)

### Notes and possible direction for workarounds

- Intercept text insertion and apply font formatting
- Use `beforeinput` event to detect text insertion
- Apply font style to newly inserted text
- Maintain font state for current typing position

