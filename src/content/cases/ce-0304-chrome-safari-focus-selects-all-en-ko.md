---
id: ce-0304-chrome-safari-focus-selects-all-en-ko
scenarioId: scenario-focus-selects-all
locale: ko
os: macOS
osVersion: "13-14"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome or Safari
browserVersion: "120+"
keyboard: US QWERTY
caseTitle: Programmatically focusing contenteditable div selects entire content in Chrome and Safari
description: "In Chrome and Safari, calling focus() on a contenteditable div can select the entire content instead of placing the cursor at the beginning, as observed in Firefox and IE."
tags:
  - focus
  - selection
  - chrome
  - safari
  - programmatic
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    <p>Some existing text content</p>
  </div>
domSteps:
  - label: "Before focus"
    html: '<div contenteditable="true"><p>Some existing text content</p></div>'
    description: "Contenteditable element with text"
  - label: "After focus() (Bug)"
    html: '<div contenteditable="true"><p>Some existing text content</p></div>'
    description: "All text is selected instead of cursor at beginning"
  - label: "✅ Expected"
    html: '<div contenteditable="true"><p>|Some existing text content</p></div>'
    description: "Expected: Cursor should be at beginning, not all text selected"
---

## Phenomenon

In Chrome and Safari, calling `focus()` on a `contenteditable` div can select the entire content instead of placing the cursor at the beginning, as observed in Firefox and IE.

## Reproduction example

1. Open Chrome or Safari browser on macOS.
2. Create a `contenteditable` element with some text content.
3. Programmatically call `focus()` on the element (e.g., `element.focus()`).
4. Observe that all text is selected instead of the cursor being placed at the beginning.

## Observed behavior

- Calling `focus()` selects all content
- Cursor is not placed at the beginning
- This differs from Firefox and IE behavior
- User must manually deselect to start typing

## Expected behavior

- Calling `focus()` should place cursor at the beginning
- Content should not be selected
- Behavior should be consistent with Firefox and IE

## Impact

- **User confusion**: Users may accidentally overwrite content
- **Poor UX**: Users must manually deselect before typing
- **Inconsistent behavior**: Different from other browsers

## Browser Comparison

- **Chrome**: All content is selected (this issue)
- **Safari**: All content is selected (this issue)
- **Firefox**: Cursor is placed at beginning
- **Edge**: Cursor is placed at beginning

## Notes and possible direction for workarounds

- **Manual selection**: After focus(), manually set cursor position using Selection API
- **Range manipulation**: Create a range at the beginning and set selection
- **Event handling**: Handle focus events to reset selection

## Code example

```javascript
const editor = document.querySelector('div[contenteditable]');

function focusEditor() {
  editor.focus();
  
  // Workaround: Set cursor at beginning
  const selection = window.getSelection();
  const range = document.createRange();
  
  // Find first text node or element
  const firstNode = getFirstTextNode(editor);
  if (firstNode) {
    range.setStart(firstNode, 0);
    range.setEnd(firstNode, 0);
  } else {
    range.selectNodeContents(editor);
    range.collapse(true);
  }
  
  selection.removeAllRanges();
  selection.addRange(range);
}

function getFirstTextNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node;
  }
  
  for (let child of node.childNodes) {
    const textNode = getFirstTextNode(child);
    if (textNode) {
      return textNode;
    }
  }
  
  return null;
}

// Use focusEditor() instead of editor.focus()
editor.addEventListener('click', () => {
  focusEditor();
});
```
