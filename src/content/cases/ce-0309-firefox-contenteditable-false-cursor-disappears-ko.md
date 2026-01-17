---
id: ce-0309-firefox-contenteditable-false-cursor-disappears-ko
scenarioId: scenario-firefox-contenteditable-false-cursor-disappears
locale: ko
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: Latest
keyboard: US
caseTitle: Cursor disappears when clicking on contenteditable with non-editable children in Firefox
description: "In Firefox, embedding non-editable elements (contenteditable='false') within editable content can cause cursor visibility issues, where the cursor may disappear or not render correctly."
tags:
  - firefox
  - cursor
  - contenteditable-false
  - nested
status: draft
---

## Phenomenon

In Firefox, when a contenteditable element contains child elements with `contenteditable="false"`, clicking on or near these non-editable elements can cause the text cursor to disappear. The cursor may not render correctly, leaving users uncertain about the input focus state.

## Reproduction example

1. Create a contenteditable div.
2. Add a child element with `contenteditable="false"` inside it.
3. Click on the editable area near the non-editable element.
4. Observe whether the cursor appears and remains visible.
5. Try typing to see if input is accepted.

## Observed behavior

- **Cursor disappears**: Text cursor may not appear when clicking near non-editable elements.
- **Focus state unclear**: Element may have focus but cursor is not visible.
- **Input acceptance**: Text input may still be accepted even without visible cursor.
- **Selection issues**: Text selection may not work correctly near non-editable boundaries.
- **Firefox-specific**: This issue is specific to Firefox and does not occur in Chrome or Safari.

## Expected behavior

- Cursor should always be visible when contenteditable element has focus.
- Cursor should render correctly even near non-editable elements.
- Focus state should be clearly indicated to the user.
- Text input and selection should work normally.

## Analysis

Firefox's rendering engine handles cursor display differently when non-editable elements are present. The browser may have difficulty determining the correct cursor position near contenteditable boundaries.

## Workarounds

- Avoid nesting non-editable elements directly in contenteditable areas.
- Use CSS to visually distinguish non-editable regions instead of `contenteditable="false"`.
- Implement custom cursor indicators using CSS or JavaScript.
- Ensure proper focus management and cursor positioning after clicks.
- Test cursor visibility across different Firefox versions.
