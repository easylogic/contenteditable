---
id: scenario-browser-extension-interference
title: Browser extensions interfere with contenteditable editing
description: "Browser extensions, especially grammar checkers, spell checkers, and language tools, can interfere with contenteditable elements by injecting DOM nodes, intercepting keyboard events, or modifying styles. This causes cursor positioning issues, DOM corruption, and performance problems."
category: other
tags:
  - browser-extension
  - grammarly
  - spell-checker
  - dom-injection
  - performance
status: draft
locale: en
---

Browser extensions, especially grammar checkers, spell checkers, and language tools, can interfere with `contenteditable` elements by injecting DOM nodes, intercepting keyboard events, or modifying styles. This causes cursor positioning issues, DOM corruption, and performance problems.

## Observed Behavior

- **DOM injection**: Extensions inject extra HTML markup (underlines, overlays, popups) inside editable regions
- **Cursor/selection issues**: Cursor disappears or appears at wrong position after extension modifications
- **Key event interception**: Extensions override or delay keyboard events (keydown, beforeinput, input)
- **Style/layout changes**: Extensions load CSS/fonts or modify layout causing flickering
- **Undo/redo disruption**: Extension DOM manipulation corrupts browser's native undo history
- **Performance degradation**: Heavy processing on every keystroke causes input lag

## Common Extensions Causing Issues

- **Grammarly**: Frequently reported to interfere with editors, causing disappearing text and layout shifts
- **Language tools**: Various language learning and translation extensions
- **Password managers**: Can interfere with form-like contenteditable elements
- **Spell checkers**: Browser spell check extensions

## Browser Comparison

- **Chrome**: Most affected due to extension ecosystem
- **Edge**: Similar to Chrome
- **Firefox**: Also affected but different extension model
- **Safari**: Less affected due to stricter extension permissions

## Impact

- **Poor user experience**: Editing becomes unreliable and frustrating
- **DOM corruption**: Unexpected markup breaks editor functionality
- **Performance issues**: Input lag makes typing feel sluggish
- **Data loss risk**: Undo/redo stack corruption can cause data loss

## Workarounds

### 1. Disable Extensions for Specific Elements

Some extensions respect data attributes:

```html
<div 
  contenteditable="true"
  data-gramm="false"
  data-gramm_editor="false"
  data-enable-grammarly="false"
>
  Editable content
</div>
```

### 2. Use MutationObserver to Clean Up

Detect and remove injected markup:

```javascript
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      // Detect extension-injected nodes
      if (node.classList?.contains('grammarly-extension') ||
          node.getAttribute('data-gramm')) {
        node.remove();
      }
    }
  }
});

observer.observe(editableElement, {
  subtree: true,
  childList: true,
  attributes: true
});
```

### 3. Use EditContext API (Chrome/Edge)

Newer API that provides more control:

```javascript
const editContext = new EditContext();
editContext.addEventListener('textupdate', (e) => {
  // Handle text updates without DOM manipulation
});
```

### 4. Separate Editable and Non-editable UI

Avoid nesting interactive UI inside contenteditable:

```html
<div class="editor-container">
  <div contenteditable="true" id="editor"></div>
  <div class="toolbar" contenteditable="false">
    <!-- Toolbar buttons -->
  </div>
</div>
```

### 5. Warn Users

Detect extension presence and warn users:

```javascript
function detectGrammarly() {
  return document.querySelector('[data-gramm]') !== null ||
         window.grammarly !== undefined;
}

if (detectGrammarly()) {
  console.warn('Grammarly extension may interfere with editor');
  // Show user notification
}
```

## References

- [Medium: Why we parted ways with Grammarly](https://medium.com/kayako-engineering/why-we-parted-ways-with-grammarly-and-you-should-too-dea483bef823) - Grammarly interference issues
- [Stack Overflow: Stop extensions like Grammarly on contenteditable](https://stackoverflow.com/questions/37444906/how-to-stop-extensions-add-ons-like-grammarly-on-contenteditable-editors) - Prevention methods
- [ProseMirror Discuss: Firefox contenteditable false cursor bug](https://discuss.prosemirror.net/t/firefox-contenteditable-false-cursor-bug/5016) - Extension-related cursor issues
- [Chrome: Introducing EditContext API](https://developer.chrome.com/blog/introducing-editcontext-api) - Alternative API for better control
- [Reddit: Grammarly extension causes Inter font](https://www.reddit.com/r/Grammarly/comments/1hkdom5/bug_report_grammarly_extension_causes_inter_font) - Layout shift issues
- [Grammarly: Reducing text input lag](https://www.grammarly.com/blog/engineering/reducing-text-input-lag) - Performance optimization efforts
