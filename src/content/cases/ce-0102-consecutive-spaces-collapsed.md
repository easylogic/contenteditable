---
id: ce-0102
scenarioId: scenario-consecutive-spaces
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Multiple consecutive spaces are collapsed to single space
description: "When typing multiple consecutive spaces in a contenteditable element, all browsers collapse them into a single space by default (following HTML whitespace rules). This differs from native text inputs and can be unexpected for users."
tags:
  - whitespace
  - space
  - html
  - all-browsers
status: draft
domSteps:
  - label: "Before"
    html: 'Hello'
    description: "Basic text"
  - label: "After 5 Spaces (Bug)"
    html: 'Hello '
    description: "5 Space key presses, only one space remains in DOM (HTML whitespace collapse rule)"
  - label: "✅ Expected (with CSS)"
    html: 'Hello     '
    description: "Expected: Multiple spaces preserved when using white-space: pre-wrap"
---

## Phenomenon

When typing multiple consecutive spaces in a contenteditable element, all browsers collapse them into a single space by default (following HTML whitespace rules). This differs from native text inputs and can be unexpected for users.

## Reproduction example

1. Focus a contenteditable element
2. Type multiple spaces (e.g., press Space 5 times)
3. Observe the DOM

## Observed behavior

- All consecutive spaces are collapsed to a single space in the DOM
- This follows HTML whitespace collapsing rules
- Visual appearance shows only one space
- Different from `<input>` and `<textarea>` behavior

## Expected behavior

- Multiple spaces should be preserved (if needed)
- Or behavior should be clearly documented
- Users should understand why spaces are collapsed

## Browser Comparison

- **All browsers**: Collapse consecutive spaces (HTML standard)
- **Workaround**: Use `white-space: pre-wrap` CSS or `&nbsp;` entities

## Notes and possible direction for workarounds

- Use CSS `white-space: pre-wrap` to preserve spaces
- Intercept space insertion and use `&nbsp;` for multiple spaces
- Document this behavior for users
- Consider if preserving spaces is necessary for the use case

