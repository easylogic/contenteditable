---
id: ce-0554-firefox-drag-drop-textarea-en
scenarioId: scenario-firefox-drag-drop-issues
locale: en
os: Any
osVersion: Any
device: Desktop
deviceVersion: Any
browser: Firefox
browserVersion: "90+"
keyboard: Any
caseTitle: Text does not move when dragging from textarea to contenteditable
description: "In Firefox, dragging text from a textarea to a contenteditable div results in no action, whereas in browsers like Chrome and Internet Explorer, the text is moved as expected."
tags:
  - firefox
  - drag-drop
  - textarea
  - text-move
status: draft
initialHtml: |
  <textarea id="source" style="width: 100%; height: 100px; margin-bottom: 10px;">
    Select and drag this text
  </textarea>
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    Drop text here
  </div>
domSteps:
  - label: "Before drag"
    html: '<textarea>Select and drag this text</textarea><div contenteditable="true">Drop text here</div>'
    description: "Text selected in textarea"
  - label: "After drop in Firefox (Bug)"
    html: '<textarea>Select and drag this text</textarea><div contenteditable="true">Drop text here</div>'
    description: "Text does not move, remains in textarea"
  - label: "Expected"
    html: '<textarea></textarea><div contenteditable="true">Drop text hereSelect and drag this text</div>'
    description: "Text should move from textarea to contenteditable"
---

## Phenomenon

In Firefox, dragging text from a `textarea` to a `contenteditable` div results in no action. The text does not move from the textarea to the contenteditable element. This works correctly in Chrome and Internet Explorer.

## Reproduction Steps

1. Open Firefox browser.
2. Create a `textarea` element with some text.
3. Create a `contenteditable` div element.
4. Select text in the textarea.
5. Drag the selected text to the contenteditable div.
6. Observe the result.

## Observed Behavior

1. **No Text Movement**: The text does not move from the textarea to the contenteditable element.
2. **Text Remains**: The text remains in the textarea after the drag operation.
3. **No Drop Effect**: The drop operation appears to have no effect.
4. **Firefox-Specific**: This issue is specific to Firefox.

## Expected Behavior

- The text should move from the textarea to the contenteditable element.
- The textarea should be empty after the drag operation.
- The contenteditable element should contain the dragged text.

## Impact

- **Drag and Drop Failure**: Text cannot be moved from textarea to contenteditable in Firefox.
- **User Experience**: Users cannot use drag and drop functionality as expected.
- **Workflow Disruption**: Users must use copy-paste instead of drag and drop.

## Browser Comparison

- **Firefox**: This issue occurs.
- **Chrome**: Works correctly.
- **Safari**: Works correctly.
- **Edge**: Works correctly.
- **Internet Explorer**: Works correctly.

## Notes and Possible Workarounds

### Manual Drop Handling

```javascript
const textarea = document.getElementById('source');
const editor = document.querySelector('[contenteditable]');

editor.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
});

editor.addEventListener('drop', (e) => {
  e.preventDefault();
  const text = e.dataTransfer.getData('text/plain');
  
  if (text) {
    // Insert text at cursor position
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    // Clear textarea if text was dragged from it
    if (textarea.value === text) {
      textarea.value = '';
    }
  }
});
```

### Use Clipboard API as Alternative

```javascript
// Use copy-paste as alternative to drag and drop
textarea.addEventListener('copy', (e) => {
  const selectedText = textarea.value.substring(
    textarea.selectionStart,
    textarea.selectionEnd
  );
  e.clipboardData.setData('text/plain', selectedText);
  e.preventDefault();
});

editor.addEventListener('paste', (e) => {
  const text = e.clipboardData.getData('text/plain');
  // Insert text at cursor position
  // ... (similar to drop handler)
});
```

## References

- [Stack Overflow: Drag and drop into contenteditable div in Firefox](https://stackoverflow.com/questions/9063111/drag-and-drop-into-contenteditable-div-in-firefox)
- Firefox-specific issue with drag and drop from textarea to contenteditable
