---
id: ce-0146
scenarioId: scenario-background-color-change
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Background color does not persist when typing after applying
description: "When applying a background color to selected text in Chrome and then continuing to type, the new text does not inherit the background color. The background formatting is lost for newly typed characters."
tags:
  - color
  - background
  - persistence
  - chrome
status: draft
---

### Phenomenon

When applying a background color to selected text in Chrome and then continuing to type, the new text does not inherit the background color. The background formatting is lost for newly typed characters.

### Reproduction example

1. Select some text in a contenteditable element
2. Apply a background color (e.g., yellow highlight)
3. Place cursor after the highlighted text
4. Type new text

### Observed behavior

- The newly typed text does not have background color
- Background formatting is not maintained for new text
- This differs from text color which may persist
- User must reapply background for each new text segment

### Expected behavior

- Newly typed text should inherit background color
- Or behavior should be consistent with text color
- Background formatting should persist until explicitly changed
- Behavior should be predictable

### Browser Comparison

- **Chrome/Edge**: Background does not persist (this case)
- **Firefox**: Similar behavior
- **Safari**: Background persistence varies

### Notes and possible direction for workarounds

- Intercept text insertion and apply background color
- Use `beforeinput` event to detect text insertion
- Apply background style to newly inserted text
- Maintain background color state for current typing position

