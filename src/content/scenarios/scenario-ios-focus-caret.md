---
id: scenario-ios-focus-caret
title: contenteditable focus and caret issues on iOS
description: "On iOS, contenteditable elements may become non-selectable or non-editable. Tapping on the element doesn't display the caret, preventing text input."
category: mobile
tags:
  - ios
  - focus
  - caret
  - mobile
status: draft
locale: en
---

On iOS, `contenteditable` elements may become non-selectable or non-editable. Tapping on the element doesn't display the caret, preventing text input.

## Observed Behavior

1. **Caret invisibility**: Tapping the element doesn't display the caret
2. **Keyboard doesn't appear**: Virtual keyboard doesn't appear
3. **Text input blocked**: Text input is not possible
4. **Focus issues**: Focus events may not fire properly

## Browser Comparison

- **iOS Safari**: Caret may not be visible (this issue)
- **Android Chrome**: Works correctly
- **Desktop browsers**: Work correctly

## Impact

- **Poor user experience**: Editing functionality doesn't work
- **Accessibility issues**: Screen reader users may have difficulty recognizing the editable area
- **Feature loss**: Editing functionality cannot be used on mobile
- **User frustration**: Users cannot edit content on iOS devices

## Workarounds

### CSS user-select

Add `-webkit-user-select: text` and `user-select: text` properties:

```css
[contenteditable="true"] {
  -webkit-user-select: text;
  user-select: text;
}
```

### Focus handling

Explicitly set focus using JavaScript:

```javascript
const editor = document.querySelector('div[contenteditable]');

editor.style.webkitUserSelect = 'text';
editor.style.userSelect = 'text';

editor.addEventListener('touchstart', (e) => {
  e.preventDefault();
  editor.focus();
  
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(editor);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}, { passive: false });

editor.addEventListener('click', () => {
  editor.focus();
});
```

### Touch event handling

Force focus in touch event handlers:

```javascript
editor.addEventListener('touchstart', (e) => {
  e.preventDefault();
  editor.focus();
  // Set cursor position
}, { passive: false });
```

## References

- [Algolia Support: Autocomplete input focus on iPhone](https://support.algolia.com/hc/en-us/articles/15445252263057-Why-doesn-t-Autocomplete-input-get-focus-or-open-the-keyboard-when-entering-detached-mode-on-iPhone-iOS) - User gesture requirements
- [ProseMirror Discuss: Can't focus on iOS](https://discuss.prosemirror.net/t/cant-focus-on-ios/3372) - iOS focus issues
- [TipTap Issue #2629: iOS Safari caret visibility](https://github.com/ueberdosis/tiptap/issues/2629) - Caret visibility problems
- [GitHub Gist: Trigger focus with soft keyboard dynamically](https://gist.github.com/azaek/a52ffe350ff408f5932ffb228f0ca4e4) - Dummy input workaround
- [Reddit: iOS Safari contenteditable focus issues](https://www.reddit.com/r/web_design/comments/xaksrk) - Fixed positioning problems
