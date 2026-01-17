---
id: scenario-nested-list-behavior
title: Nested list editing behavior is inconsistent
description: "When editing nested lists (lists within list items), the behavior of Enter, Backspace, Delete, and Tab keys varies significantly across browsers. Creating, editing, and deleting nested list items can result in unexpected DOM structures or lost formatting."
category: formatting
tags:
  - list
  - nested
  - indentation
  - tab
  - enter
status: draft
locale: en
---

When editing nested lists (lists within list items), the behavior of Enter, Backspace, Delete, and Tab keys varies significantly across browsers. Creating, editing, and deleting nested list items can result in unexpected DOM structures or lost formatting.

## Observed Behavior

### Scenario 1: Pressing Enter in a nested list item
- **Chrome/Edge**: Creates a new list item at the same nesting level
- **Firefox**: May create a new list item or paragraph, behavior inconsistent
- **Safari**: May create unexpected nesting levels

### Scenario 2: Pressing Tab to indent a list item
- **Chrome/Edge**: May create a nested list structure or use CSS indentation
- **Firefox**: Behavior varies, may not support Tab indentation
- **Safari**: May create nested lists or unexpected structures

### Scenario 3: Pressing Backspace at the beginning of a nested list item
- **Chrome/Edge**: May unindent the list item or delete it
- **Firefox**: May delete the nested list or create malformed HTML
- **Safari**: Behavior can be unpredictable

### Scenario 4: Deleting a nested list
- **Chrome/Edge**: May merge with parent list item or create empty list items
- **Firefox**: May delete the entire nested structure unexpectedly
- **Safari**: May create broken HTML structures

## Impact

- Difficult to implement consistent nested list editing
- Users experience different behavior across browsers
- Risk of creating malformed HTML
- Loss of list structure when editing nested items

## Browser Comparison

- **Chrome/Edge**: Generally better support for nested lists, but behavior can still be inconsistent
- **Firefox**: Less predictable nested list behavior
- **Safari**: Most inconsistent, often creates unexpected structures

## Workaround

Implement custom handling for nested list operations:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertParagraph') {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const listItem = range.startContainer.closest('li');
    
    if (listItem) {
      // Check if we're in a nested list
      const parentList = listItem.closest('ul, ol');
      const parentListItem = parentList?.parentElement;
      
      if (parentListItem?.tagName === 'LI') {
        e.preventDefault();
        // Implement custom nested list item creation
        handleNestedListItemInsertion(listItem, range);
      }
    }
  }
  
  // Handle Tab for indentation
  if (e.inputType === 'insertText' && e.data === '\t') {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const listItem = range.startContainer.closest('li');
    
    if (listItem) {
      e.preventDefault();
      // Implement custom indentation logic
      handleListIndentation(listItem);
    }
  }
});
```

## References

- [Stack Overflow: Prevent deletion of all li tags in contenteditable ul](https://stackoverflow.com/questions/24188565/prevent-deletion-of-all-li-tags-in-a-content-editable-ul) - List deletion issues
- [Stack Overflow: contenteditable in Firefox creates 2 newlines](https://stackoverflow.com/questions/52817606/contenteditable-in-firefox-creates-2-newlines-instead-of-1) - Firefox Enter behavior
- [Stack Overflow: contenteditable div outdent](https://stackoverflow.com/questions/21263875/contenteditable-div-outdent) - Tab/Shift+Tab behavior
- [Stack Overflow: contenteditable nested browser differences](https://stackoverflow.com/questions/9913710/contenteditable-nested-browser-differences) - Nested contenteditable issues
- [Stack Overflow: Prevent contenteditable adding div on Enter](https://stackoverflow.com/questions/18552336/prevent-contenteditable-adding-div-on-enter-chrome) - execCommand behavior
- [WHATWG Lists: contenteditable default behaviors](https://lists.whatwg.org/pipermail/whatwg-whatwg.org/2009-December/024627.html) - Spec recommendations
