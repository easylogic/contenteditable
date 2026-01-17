---
id: scenario-browser-translation
title: Browser translation breaks contenteditable editing
description: "When browser translation features (like Google Translate) are activated, they manipulate the DOM by replacing text content and injecting elements. This can break contenteditable functionality, causing cursor positioning issues, event handling problems, and IME composition failures."
category: other
tags:
  - browser-translation
  - google-translate
  - dom-manipulation
  - ime
  - composition
status: draft
locale: en
---

When browser translation features (like Google Translate) are activated, they manipulate the DOM by replacing text content and injecting elements. This can break `contenteditable` functionality, causing cursor positioning issues, event handling problems, and IME composition failures.

## Observed Behavior

- **DOM manipulation**: Translation replaces node text content and injects `<span>` or `<div>` elements
- **Cursor positioning**: Cursor won't move or appears at wrong position after translation
- **Input failures**: Pasted content doesn't insert correctly, key events act incorrectly
- **IME composition**: Translation resets or interferes with composition buffers
- **Event listeners**: Event subscriptions may be detached during DOM manipulation
- **Selection issues**: Selection and caret behavior becomes unreliable

## Browser Comparison

- **Chrome**: Google Translate integration most likely to cause issues
- **Edge**: Similar translation features with similar problems
- **Firefox**: Less affected but still has issues
- **Safari**: Native translation features may cause different issues

## Impact

- **Editing becomes impossible**: Users cannot edit content after translation
- **Data loss risk**: Translation may corrupt content structure
- **IME failures**: Composition input becomes unreliable
- **Poor user experience**: Users must disable translation to edit

## Workarounds

### 1. Disable Translation for Specific Elements

Use `translate="no"` attribute:

```html
<div contenteditable="true" translate="no">
  Editable content that should not be translated
</div>
```

### 2. Use "notranslate" Class

Google Translate respects this class:

```html
<div contenteditable="true" class="notranslate">
  Editable content
</div>
```

### 3. Reapply contenteditable After Translation

Use MutationObserver to restore attributes:

```javascript
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'attributes' && 
        mutation.attributeName === 'contenteditable') {
      // Reapply contenteditable if removed
      if (!mutation.target.hasAttribute('contenteditable')) {
        mutation.target.setAttribute('contenteditable', 'true');
      }
    }
  }
});

observer.observe(editableElement, {
  attributes: true,
  attributeFilter: ['contenteditable']
});
```

### 4. Disable Translation During Editing

Detect editing mode and disable translation:

```javascript
let isEditing = false;

editableElement.addEventListener('focus', () => {
  isEditing = true;
  document.documentElement.setAttribute('translate', 'no');
});

editableElement.addEventListener('blur', () => {
  isEditing = false;
  document.documentElement.removeAttribute('translate');
});
```

### 5. Use Controlled Editor Components

Use robust editor libraries that handle DOM mutations better:

- **Quill**: Handles DOM mutations more robustly
- **ProseMirror**: Better at detecting and handling translation changes
- **Slate**: More resilient to external DOM manipulation

## References

- [Stefan Judis: Non-translatable HTML elements](https://www.stefanjudis.com/blog/non-translatable-html-elements/) - translate attribute usage
- [Daddy Design: Disable Google Translate for specific content](https://www.daddydesign.com/wordpress/how-to-disable-google-translate-from-translating-specific-words-or-content-blocks/) - notranslate class
- [contenteditable.lab](https://contenteditable.realerror.com/) - IME and composition issues reference
