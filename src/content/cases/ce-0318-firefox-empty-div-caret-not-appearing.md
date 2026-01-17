---
id: ce-0318-firefox-empty-div-caret-not-appearing
scenarioId: scenario-firefox-empty-div-caret-not-appearing
locale: en
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: Latest
keyboard: US
caseTitle: Caret does not appear in empty contenteditable div in Firefox
description: "In Firefox, when focusing on an empty contenteditable div, the caret may not appear until the user starts typing, making it unclear that the element is ready for input."
tags:
  - firefox
  - caret
  - empty
  - focus
status: draft
---

## Phenomenon

In Firefox, when focusing on an empty `contenteditable` div, the text caret may not appear until the user starts typing. This can be confusing for users, as they might not realize the element is ready for input. The caret remains invisible even though the element has focus.

## Reproduction example

1. Create an empty contenteditable div: `<div contenteditable="true"></div>`
2. Click on or focus the div in Firefox.
3. Observe that the caret does not appear.
4. Start typing to see if input is accepted and caret appears.

## Observed behavior

- **Caret not visible**: Text cursor does not appear in empty contenteditable div.
- **Focus state unclear**: Element may have focus but no visual indication.
- **Input accepted**: Text input is still accepted when typing.
- **Caret appears on input**: Caret becomes visible once typing begins.
- **Firefox-specific**: This issue is specific to Firefox.

## Expected behavior

- Caret should be visible immediately when contenteditable element gains focus.
- Focus state should be clearly indicated to users.
- Empty elements should show caret to indicate editability.

## Analysis

Firefox's rendering engine may not display the caret in empty contenteditable elements because there's no text node to position it within. The browser waits for content before showing the caret.

## Workarounds

- Insert zero-width space or non-breaking space in empty element:
  ```html
  <div contenteditable="true">&#x200B;</div>
  <!-- or -->
  <div contenteditable="true">&nbsp;</div>
  ```
- Use CSS `::before` pseudo-element to show cursor indicator (but be careful as it can cause positioning issues).
- Add placeholder text that disappears on focus.
- Programmatically insert and remove zero-width space on focus/blur:
  ```javascript
  element.addEventListener('focus', () => {
    if (!element.textContent.trim()) {
      element.innerHTML = '&#x200B;';
    }
  });
  ```
