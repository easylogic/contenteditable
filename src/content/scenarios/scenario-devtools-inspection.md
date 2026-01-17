---
id: scenario-devtools-inspection
title: Developer tools inspection causes focus and selection loss
description: "When inspecting contenteditable elements with browser developer tools, the element may lose focus, causing blur events to fire and UI elements (like tooltips or dropdowns) to disappear. Selection inside contenteditable may also be reset when the editor loses focus, especially in Safari/WebKit browsers."
category: other
tags:
  - devtools
  - debugging
  - focus
  - selection
  - safari
status: draft
locale: en
---

When inspecting `contenteditable` elements with browser developer tools, the element may lose focus, causing blur events to fire and UI elements (like tooltips or dropdowns) to disappear. Selection inside contenteditable may also be reset when the editor loses focus.

## Observed Behavior

- **Focus loss on DevTools click**: Clicking into DevTools triggers blur events
- **Elements disappear**: UI elements that hide on blur vanish before inspection
- **Selection reset**: Selection inside contenteditable is lost in Safari/WebKit
- **document.activeElement incorrect**: Focus detection may be inaccurate
- **Typing continues after blur**: In some cases, typing still inserts content after focus loss

## Browser Comparison

- **Safari/WebKit**: Most affected - selection is lost when editor is blurred
- **Chrome**: Also affected but has "Emulate a focused page" feature
- **Firefox**: Similar issues with focus detection
- **Edge**: Similar to Chrome

## Impact

- **Debugging difficulty**: Cannot inspect elements that disappear on blur
- **Development overhead**: Makes debugging contenteditable issues challenging
- **Testing problems**: Hard to test focus-related functionality
- **User experience**: Similar issues can affect real users

## Workarounds

### 1. Use "Emulate a Focused Page" (Chrome)

Prevents blur events when DevTools is active:

1. Open Chrome DevTools
2. Go to Rendering panel (or use `:hov` menu)
3. Enable "Emulate a focused page"
4. Elements won't disappear when clicking in DevTools

### 2. Pause JavaScript Execution

Freeze UI at the moment you need to inspect:

1. Press F8 to pause execution
2. Element won't be hidden/removed yet
3. Inspect the element while paused

### 3. Use Event Breakpoints

Interrupt execution when blur is about to occur:

```javascript
// In DevTools Console
debugger; // Set breakpoint
editableElement.addEventListener('blur', () => {
  debugger; // Pause here
});
```

### 4. DOM Breakpoints

Set breakpoints for subtree modifications:

1. Right-click element in Elements panel
2. Select "Break on" → "Subtree modifications"
3. Element removal will pause execution

### 5. Temporary CSS Override

Keep elements visible:

```css
/* In DevTools Styles panel */
.tooltip,
.dropdown {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}
```

### 6. Prevent Blur During Inspection

Temporarily disable blur handlers:

```javascript
// In DevTools Console
const originalBlur = editableElement.onblur;
editableElement.onblur = null;

// Inspect element...

// Restore
editableElement.onblur = originalBlur;
```

## References

- [Stack Overflow: Examine element removed on blur](https://stackoverflow.com/questions/24287721/examine-element-that-is-removed-onblur) - Common debugging issue
- [ProseMirror Discuss: Selection lost on Safari when editor is blurred](https://discuss.prosemirror.net/t/selection-is-lost-on-safari-when-editor-is-blured/3001) - Safari-specific issues
- [Chrome DevTools: Emulate a focused page](https://developer.chrome.com/docs/devtools/rendering/apply-effects/) - Focus emulation feature
- [jQuery Bug #12648: :focus selector incorrect for contenteditable](https://bugs.jquery.com/ticket/12648) - Focus detection issues
- [Stack Overflow: Contenteditable loose focus but writes anyway](https://stackoverflow.com/questions/27111414/contenteditable-loose-focus-but-writes-anyway) - Focus behavior quirks
- [Tutorial Pedia: Inspect disappearing elements](https://www.tutorialpedia.org/blog/how-can-i-inspect-html-element-that-disappears-from-dom-on-lost-focus/) - Debugging techniques
