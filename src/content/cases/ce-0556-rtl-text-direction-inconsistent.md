---
id: ce-0556-rtl-text-direction-inconsistent
scenarioId: scenario-rtl-text-direction-inconsistent
locale: en
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: Latest
keyboard: Arabic
caseTitle: RTL text direction not respected consistently in contenteditable
description: "When using contenteditable with right-to-left (RTL) text, some browsers may not respect the text direction consistently, leading to incorrect text display and editing behavior."
tags:
  - rtl
  - text-direction
  - arabic
  - hebrew
  - cross-browser
status: draft
---

## Phenomenon

When using contenteditable elements with right-to-left (RTL) text languages (Arabic, Hebrew, etc.), some browsers may not respect the text direction consistently. The `dir` attribute may not be properly applied, leading to incorrect text display, cursor movement, and editing behavior.

## Reproduction example

1. Create a contenteditable div with `dir="rtl"` attribute.
2. Type Arabic or Hebrew text.
3. Observe text direction and cursor movement.
4. Mix RTL and LTR text in the same element.
5. Test in different browsers (Chrome, Firefox, Safari).

## Observed behavior

- **Text direction**: RTL text may display left-to-right in some browsers.
- **Cursor movement**: Cursor may move in wrong direction for RTL text.
- **Mixed content**: RTL and LTR text mixed together may display incorrectly.
- **dir attribute**: `dir="rtl"` may not be consistently respected.
- **Browser differences**: Behavior varies significantly between browsers.

## Expected behavior

- `dir="rtl"` should always be respected.
- RTL text should display right-to-left.
- Cursor should move correctly for RTL text.
- Mixed RTL/LTR content should be handled correctly using appropriate `dir` attributes on spans.

## Analysis

Browsers handle text direction differently, especially in contenteditable contexts. The `dir` attribute may need to be explicitly set and maintained, and some browsers may override it based on content detection.

## Workarounds

- Explicitly set `dir="rtl"` on contenteditable element:
  ```html
  <div contenteditable="true" dir="rtl">Arabic text</div>
  ```
- Use `<span>` elements with `dir` attribute for mixed content:
  ```html
  <p>
    <span dir="ltr">123</span>
    <span dir="rtl">مرحبا</span>
    <span dir="ltr">456</span>
  </p>
  ```
- Apply CSS: `direction: rtl;` in addition to HTML attribute.
- Use `text-align: right;` for RTL text alignment.
- Test RTL behavior across all target browsers.
- Handle bidirectional text carefully with proper `dir` attributes.
