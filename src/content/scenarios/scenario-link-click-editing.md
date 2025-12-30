---
id: scenario-link-click-editing
title: Link clicks interfere with contenteditable editing
description: "When a link is inside a contenteditable element, clicking on the link may navigate away or trigger unexpected behavior instead of allowing text editing. The behavior varies across browsers and can make it difficult to edit link text or select links for deletion."
category: formatting
tags:
  - link
  - click
  - navigation
  - editing
status: draft
locale: en
---

When a link is inside a contenteditable element, clicking on the link may navigate away or trigger unexpected behavior instead of allowing text editing. The behavior varies across browsers and can make it difficult to edit link text or select links for deletion.

## Observed Behavior

### Scenario 1: Single click on a link
- **Chrome/Edge**: May navigate to the link URL or allow text selection, behavior inconsistent
- **Firefox**: May navigate immediately on click
- **Safari**: May navigate or allow editing, behavior varies

### Scenario 2: Double click on a link
- **Chrome/Edge**: Usually selects the link text for editing
- **Firefox**: May navigate or select text
- **Safari**: Behavior inconsistent

### Scenario 3: Right click on a link
- **Chrome/Edge**: Shows context menu with link options
- **Firefox**: Shows context menu
- **Safari**: Shows context menu, but behavior may differ

### Scenario 4: Selecting link text for editing
- **Chrome/Edge**: Can be difficult, may trigger navigation
- **Firefox**: May navigate before selection is complete
- **Safari**: Selection may be interrupted by navigation

## Impact

- Difficulty editing link text
- Accidental navigation when trying to edit
- Poor user experience when working with links in editors
- Need for workarounds to prevent navigation

## Browser Comparison

- **Chrome/Edge**: Generally better at allowing text selection, but navigation can still occur
- **Firefox**: More likely to navigate on click
- **Safari**: Behavior is inconsistent

## Workaround

Prevent default link behavior and handle clicks manually:

```javascript
element.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (link && e.target.closest('[contenteditable="true"]')) {
    // Prevent navigation
    e.preventDefault();
    
    // Allow text selection on single click
    if (e.detail === 1) {
      // Single click - allow selection
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(link);
      selection.removeAllRanges();
      selection.addRange(range);
    } else if (e.detail === 2) {
      // Double click - start editing
      link.contentEditable = 'true';
      link.focus();
    }
  }
});

// Also prevent navigation on Enter key when link is focused
element.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.tagName === 'A') {
    e.preventDefault();
    // Insert line break or create new paragraph
    insertLineBreak(e.target);
  }
});
```

