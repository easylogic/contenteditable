---
id: scenario-contenteditable-false-cursor
title: Cursor disappears with contenteditable="false" elements
description: "When contenteditable='false' elements are placed inside a contenteditable container, the cursor may disappear or become invisible in certain browsers, making it difficult for users to determine the text insertion point."
category: selection
tags:
  - contenteditable-false
  - cursor
  - nested
  - selection
status: draft
locale: en
---

When `contenteditable="false"` elements are placed inside a `contenteditable` container, the cursor may disappear or become invisible in certain browsers, making it difficult for users to determine the text insertion point.

## Observed Behavior

1. **Cursor invisibility**: Cursor disappears when positioned after `contenteditable="false"` elements
2. **Focus issues**: Focus may be lost or unclear
3. **User confusion**: Users cannot see where text will be inserted
4. **Browser-specific**: This issue manifests differently across browsers

## Browser Comparison

- **Firefox**: Cursor disappears after `contenteditable="false"` elements
- **Chrome**: Cursor remains visible
- **Safari**: Cursor remains visible
- **Edge**: Cursor remains visible

## Impact

- **Poor user experience**: Users cannot see where they're typing
- **Confusion**: Users may think the editor is broken
- **Accessibility issues**: Screen reader users may have difficulty understanding cursor position
- **Workflow interruption**: Editing becomes difficult and frustrating

## Workarounds

### Zero-width spaces

Wrap non-editable elements with zero-width spaces to maintain cursor visibility:

```javascript
const nonEditableElements = editor.querySelectorAll('[contenteditable="false"]');
nonEditableElements.forEach((el) => {
  const zws = document.createTextNode('\u200B');
  if (el.nextSibling) {
    el.parentNode.insertBefore(zws, el.nextSibling);
  } else {
    el.parentNode.appendChild(zws);
  }
});
```

### Custom cursor indicator

Implement a custom visual indicator for cursor position when the native cursor is not visible.

### CSS workarounds

Use CSS to ensure cursor visibility:

```css
[contenteditable="true"] [contenteditable="false"]::after {
  content: '\u200B';
}
```

## References

- [ProseMirror Discuss: Firefox contenteditable false cursor bug](https://discuss.prosemirror.net/t/firefox-contenteditable-false-cursor-bug/5016) - Firefox cursor issues
- [CodeMirror Discuss: Firefox shadow DOM contenteditable bug](https://discuss.codemirror.net/t/firefox-shadow-dom-contenteditable-bug/4127) - Shadow DOM issues
- [Stack Overflow: contenteditable element loses cursor when empty](https://stackoverflow.com/questions/38492935/contenteditable-element-looses-cursor-as-soon-as-its-empty) - Empty element issues
- [Stack Overflow: contenteditable false in Firefox](https://stackoverflow.com/questions/52180335/contenteditable-false-in-firefox-browser) - Firefox-specific issues
- [Mozilla Support: Hide cursor when typing](https://support.mozilla.org/gl/questions/1435629) - Firefox settings
