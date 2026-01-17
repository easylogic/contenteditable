---
id: ce-0323-accessibility-screen-reader-role-textbox-ko
scenarioId: scenario-accessibility-screen-reader-role-textbox
locale: ko
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: Latest
keyboard: US
caseTitle: Contenteditable not recognized as editable by screen readers without ARIA
description: "By default, contenteditable elements are not automatically recognized as editable text fields by screen readers. ARIA attributes like role='textbox' are needed for proper accessibility."
tags:
  - accessibility
  - screen-reader
  - aria
  - role
  - textbox
status: draft
---

## Phenomenon

By default, elements with `contenteditable="true"` are not automatically recognized as editable text fields by assistive technologies like screen readers. Without proper ARIA attributes, screen reader users may not understand that the element is editable or how to interact with it.

## Reproduction example

1. Create a contenteditable div without ARIA attributes.
2. Test with a screen reader (NVDA, JAWS, VoiceOver).
3. Observe that screen reader may not announce it as editable.
4. Add `role="textbox"` and other ARIA attributes.
5. Test again to see improved announcements.

## Observed behavior

- **Not announced as editable**: Screen readers may not identify contenteditable as input field.
- **No label**: Without `aria-label` or `aria-labelledby`, purpose is unclear.
- **Keyboard navigation**: May not be properly focusable without `tabindex`.
- **Multiline not indicated**: Screen readers may not know it supports multiple lines.
- **Read-only state**: Cannot indicate read-only state without `aria-readonly`.

## Expected behavior

- Screen readers should announce contenteditable as an editable text field.
- Element should be properly focusable via keyboard.
- Purpose and capabilities should be clearly communicated.
- Multiline support should be indicated when applicable.

## Analysis

Contenteditable is a generic HTML attribute that doesn't carry semantic meaning for assistive technologies. ARIA attributes are needed to provide the necessary context and behavior information.

## Workarounds

- Add `role="textbox"` to identify as text input:
  ```html
  <div contenteditable="true" role="textbox"></div>
  ```
- Add `tabindex="0"` for keyboard focusability.
- Provide accessible name with `aria-label` or `aria-labelledby`:
  ```html
  <div id="label">Enter comments:</div>
  <div contenteditable="true" role="textbox" aria-labelledby="label"></div>
  ```
- Indicate multiline with `aria-multiline="true"`:
  ```html
  <div contenteditable="true" role="textbox" aria-multiline="true"></div>
  ```
- Use `aria-readonly="true"` for read-only state.
- Test with multiple screen readers to ensure compatibility.
