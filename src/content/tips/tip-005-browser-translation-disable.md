---
id: tip-005-browser-translation-disable
title: Disabling browser translation
description: "How to prevent browser translation features from interfering with contenteditable editing"
category: browser-feature
tags:
  - browser-translation
  - google-translate
  - dom-manipulation
  - prevention
difficulty: beginner
relatedScenarios:
  - scenario-browser-translation
relatedCases:
  - ce-0562-browser-translation-breaks-editing
locale: en
---

## Problem

When Google Translate or other browser translation features are activated, they manipulate the DOM and break contenteditable functionality.

## Solution

### 1. Use translate="no" Attribute

Add attribute to disable translation on contenteditable elements.

```html
<div contenteditable="true" translate="no">
  Editable content that should not be translated
</div>
```

### 2. Use notranslate Class

Google Translate respects this class.

```html
<div contenteditable="true" class="notranslate">
  Editable content
</div>
```

### 3. Reapply Attributes with MutationObserver

Reapply contenteditable attributes after translation.

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

Detect editing mode and disable translation.

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

## Notes

- Not all translation tools respect attributes
- MutationObserver may have performance overhead
- Consider user experience when disabling translation

## Related Resources

- [Scenario: Browser translation](/scenarios/scenario-browser-translation)
- [Case: ce-0562](/cases/ce-0562-browser-translation-breaks-editing)
