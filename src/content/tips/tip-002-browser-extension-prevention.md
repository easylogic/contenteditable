---
id: tip-002-browser-extension-prevention
title: Preventing browser extension interference
description: "How to prevent browser extensions like Grammarly from interfering with contenteditable editing"
category: browser-feature
tags:
  - browser-extension
  - grammarly
  - dom-injection
  - prevention
difficulty: beginner
relatedScenarios:
  - scenario-browser-extension-interference
relatedCases:
  - ce-0561-browser-extension-grammarly-interference
locale: en
---

## Problem

Browser extensions like Grammarly inject DOM nodes and modify styles in contenteditable elements, causing editing interference.

## Solution

### 1. Disable Extensions with Data Attributes

Some extensions respect specific data attributes.

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

### 2. Remove Injected Markup with MutationObserver

Detect and remove markup injected by extensions.

```javascript
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      // Detect extension-injected nodes
      if (node.classList?.contains('grammarly-extension') ||
          node.getAttribute('data-gramm') ||
          node.querySelector?.('[data-gramm]')) {
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

### 3. Warn Users

Detect extension presence and warn users.

```javascript
function detectGrammarly() {
  return document.querySelector('[data-gramm]') !== null ||
         window.grammarly !== undefined ||
         document.querySelector('.grammarly-extension') !== null;
}

if (detectGrammarly()) {
  console.warn('Grammarly extension may interfere with editor');
  // Show user notification
  showNotification('Browser extensions may interfere with editing.');
}
```

### 4. Use EditContext API (Chrome/Edge)

Use a newer API that provides better control.

```javascript
const editContext = new EditContext();
editContext.addEventListener('textupdate', (e) => {
  // Handle text updates without DOM manipulation
  const text = e.text;
  // Process logic
});
```

## Notes

- Not all extensions respect data attributes
- MutationObserver may have performance overhead
- EditContext API is still experimental with limited browser support

## Related Resources

- [Scenario: Browser extension interference](/scenarios/scenario-browser-extension-interference)
- [Case: ce-0561](/cases/ce-0561-browser-extension-grammarly-interference)
