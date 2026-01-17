---
id: ce-0311-ie11-br-tag-loss-en-ko
scenarioId: scenario-ie11-br-tag-loss
locale: ko
os: Windows
osVersion: "7-10"
device: Desktop
deviceVersion: Any
browser: Internet Explorer
browserVersion: "11"
keyboard: Any
caseTitle: BR tag deleted when typing after selected line
description: "In Internet Explorer 11, typing after selecting a line of text in a contenteditable div can unexpectedly delete the BR tag, causing lines to merge."
tags:
  - internet-explorer
  - ie11
  - br-tag
  - line-break
  - selection
  - typing
  - line-merge
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    Line 1<br>
    Line 2<br>
    Line 3
  </div>
domSteps:
  - label: "Before selection"
    html: '<div contenteditable="true">Line 1<br>Line 2<br>Line 3</div>'
    description: "Line 2 is selected"
  - label: "After typing (Bug)"
    html: '<div contenteditable="true">Line 1<br>New textLine 3</div>'
    description: "BR tag deleted, lines merged"
  - label: "Expected"
    html: '<div contenteditable="true">Line 1<br>New text<br>Line 3</div>'
    description: "BR tag should be preserved, lines should remain separate"
---

## Phenomenon

In Internet Explorer 11, when a line of text is selected in a `contenteditable` div and the user types, the `<br>` tag at the end of the line can be unexpectedly deleted, causing lines to merge together.

## Reproduction Steps

1. Open Internet Explorer 11 browser on Windows.
2. Create a `contenteditable` div with multiple lines separated by `<br>` tags.
3. Select an entire line of text (e.g., "Line 2").
4. Type new text to replace the selected line.
5. Observe the result.

## Observed Behavior

1. **BR Tag Deletion**: The `<br>` tag at the end of the selected line is deleted.
2. **Line Merging**: Lines merge together, breaking the document structure.
3. **Formatting Loss**: The line break is lost, causing formatting issues.
4. **IE11-Specific**: This issue is specific to Internet Explorer 11.

## Expected Behavior

- The `<br>` tag should be preserved when typing after a selected line.
- Lines should remain separate after typing.
- Document structure should not be corrupted.

## Impact

- **Line Break Loss**: BR tags are deleted unexpectedly.
- **Line Merging**: Lines merge together, breaking document structure.
- **Formatting Issues**: Document formatting is corrupted.
- **Content Integrity**: Document content structure is damaged.

## Browser Comparison

- **Internet Explorer 11**: This issue occurs.
- **Chrome**: Not affected.
- **Firefox**: Not affected.
- **Safari**: Not affected.
- **Edge**: Not affected (Edge uses Chromium).

## Notes and Possible Workarounds

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

## References

- [Microsoft Support: contenteditable div loses br tag](https://support.microsoft.com/en-au/topic/contenteditable-div-loses-br-tag-when-you-type-after-selected-line-of-text-in-internet-explorer-11-af31d62f-b806-433a-025f-842261f27500)
- Internet Explorer 11 specific bug with BR tag handling
