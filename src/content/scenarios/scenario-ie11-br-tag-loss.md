---
id: scenario-ie11-br-tag-loss
title: BR Tag Loss When Typing After Selected Line in Internet Explorer 11
description: "In Internet Explorer 11, typing after selecting a line of text in a contenteditable div can unexpectedly delete the BR tag, causing lines to merge."
tags:
  - internet-explorer
  - ie11
  - br-tag
  - line-break
  - selection
  - typing
  - line-merge
category: formatting
status: draft
locale: en
---

## Overview

In Internet Explorer 11, when a line of text is selected in a `contenteditable` div and the user types, the `<br>` tag at the end of the line can be unexpectedly deleted, causing lines to merge. This breaks the document structure and formatting.

## Impact

- **Line Break Loss**: BR tags are deleted unexpectedly
- **Line Merging**: Lines merge together, breaking document structure
- **Formatting Issues**: Document formatting is corrupted
- **Content Integrity**: Document content structure is damaged

## Technical Details

The issue occurs when:
1. A `contenteditable` div contains multiple lines separated by `<br>` tags
2. User selects an entire line of text
3. User types new text
4. The `<br>` tag at the end of the selected line is deleted
5. Lines merge together

## Browser Comparison

- **Internet Explorer 11**: This issue occurs
- **Chrome**: Not affected
- **Firefox**: Not affected
- **Safari**: Not affected
- **Edge**: Not affected (Edge uses Chromium)

## Workarounds

### Preserve BR Tags During Typing

```javascript
const editor = document.querySelector('[contenteditable]');

editor.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertText' || e.inputType === 'insertCompositionText') {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // Check if selection includes a BR tag
      const container = range.commonAncestorContainer;
      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: (node) => {
            if (node.tagName === 'BR' && range.intersectsNode(node)) {
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_REJECT;
          }
        },
        false
      );
      
      const brNodes = [];
      let node;
      while (node = walker.nextNode()) {
        brNodes.push(node);
      }
      
      // Store BR nodes to restore later
      if (brNodes.length > 0) {
        e.preventDefault();
        
        // Delete selected content
        range.deleteContents();
        
        // Insert new text
        const textNode = document.createTextNode(e.data || '');
        range.insertNode(textNode);
        
        // Restore BR tags after the inserted text
        brNodes.forEach(br => {
          const newBr = document.createElement('br');
          textNode.parentNode.insertBefore(newBr, textNode.nextSibling);
        });
        
        // Update selection
        range.setStartAfter(textNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }
});
```

### Normalize After Input

```javascript
editor.addEventListener('input', (e) => {
  // Normalize BR tags after input
  const lines = editor.innerHTML.split('<br>');
  const normalized = lines
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('<br>');
  
  if (normalized !== editor.innerHTML) {
    // Restore BR tags if they were lost
    editor.innerHTML = normalized;
  }
});
```

## Related Cases

- Case IDs will be added as cases are created for specific environment combinations

## References

- [Microsoft Support: contenteditable div loses br tag](https://support.microsoft.com/en-au/topic/contenteditable-div-loses-br-tag-when-you-type-after-selected-line-of-text-in-internet-explorer-11-af31d62f-b806-433a-025f-842261f27500) - Official Microsoft support article
- [MS16-063: Security update for Internet Explorer](https://support.microsoft.com/en-au/topic/contenteditable-div-loses-br-tag-when-you-type-after-selected-line-of-text-in-internet-explorer-11-af31d62f-b806-433a-025f-842261f27500) - Fix included in June 14, 2016 update
- Internet Explorer 11 specific bug with BR tag handling - Fixed in cumulative security updates
