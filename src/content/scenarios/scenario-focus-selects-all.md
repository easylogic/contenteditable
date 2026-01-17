---
id: scenario-focus-selects-all
title: Programmatic focus selects all content
description: "In Chrome and Safari, calling focus() on a contenteditable div can select the entire content instead of placing the cursor at the beginning, as observed in Firefox and IE."
category: focus
tags:
  - focus
  - selection
  - programmatic
status: draft
locale: en
---

In Chrome and Safari, calling `focus()` on a `contenteditable` div can select the entire content instead of placing the cursor at the beginning, as observed in Firefox and IE.

## Observed Behavior

1. **All content selected**: Calling `focus()` selects all content
2. **Cursor not at beginning**: Cursor is not placed at the beginning
3. **Browser-specific**: This differs from Firefox and IE behavior
4. **User must deselect**: User must manually deselect to start typing

## Browser Comparison

- **Chrome**: All content is selected (this issue)
- **Safari**: All content is selected (this issue)
- **Firefox**: Cursor is placed at beginning
- **Edge**: Cursor is placed at beginning

## Impact

- **User confusion**: Users may accidentally overwrite content
- **Poor UX**: Users must manually deselect before typing
- **Inconsistent behavior**: Different from other browsers
- **Workflow interruption**: Users must take extra steps to start typing

## Workarounds

### Manual selection

After `focus()`, manually set cursor position using Selection API:

```javascript
function focusEditor() {
  editor.focus();
  
  const selection = window.getSelection();
  const range = document.createRange();
  
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
```

### Range manipulation

Create a range at the beginning and set selection:

```javascript
editor.addEventListener('focus', () => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
});
```

### Event handling

Handle focus events to reset selection:

```javascript
editor.addEventListener('focus', (e) => {
  // Reset selection to beginning
  setTimeout(() => {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }, 0);
});
```

## References

- [Stack Overflow: contenteditable focus in Chrome Safari](https://stackoverflow.com/questions/3904149/contenteditable-focus-in-chrome-safari) - Focus behavior differences
- [ProseMirror Discuss: Selection lost on Safari when editor is blurred](https://discuss.prosemirror.net/t/selection-is-lost-on-safari-when-editor-is-blured/3001) - Safari selection issues
- [Stack Overflow: Select all text in contenteditable when it focus](https://stackoverflow.com/questions/3805852/select-all-text-in-contenteditable-div-when-it-focus-click) - Timing considerations
