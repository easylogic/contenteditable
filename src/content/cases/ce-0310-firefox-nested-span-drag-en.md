---
id: ce-0310-firefox-nested-span-drag-en
scenarioId: scenario-firefox-drag-drop-issues
locale: en
os: Any
osVersion: Any
device: Desktop
deviceVersion: Any
browser: Firefox
browserVersion: "90+"
keyboard: Any
caseTitle: Nested span generated when dragging text within contenteditable span
description: "In Firefox, dragging and dropping text within a span contenteditable element generates a new nested span around the dragged text, leading to unintended nesting."
tags:
  - firefox
  - drag-drop
  - nested-elements
  - span
  - dom-corruption
status: draft
initialHtml: |
  <span contenteditable="true" style="padding: 20px; border: 1px solid #ccc; display: block; min-height: 100px;">
    Select and drag this text within the span
  </span>
domSteps:
  - label: "Before drag"
    html: '<span contenteditable="true">Select and drag this text</span>'
    description: "Text selected within span"
  - label: "After drop in Firefox (Bug)"
    html: '<span contenteditable="true">Select and drag <span>this text</span></span>'
    description: "Nested span generated around dragged text"
  - label: "Expected"
    html: '<span contenteditable="true">Select and drag this text</span>'
    description: "No nested span should be generated"
---

## Phenomenon

In Firefox, when dragging and dropping text within a `<span contenteditable>` element, a new nested `<span>` is generated around the dragged text, leading to unintended nesting and DOM structure corruption.

## Reproduction Steps

1. Open Firefox browser.
2. Create a `<span contenteditable="true">` element with some text.
3. Select text within the span.
4. Drag the selected text to another position within the same span.
5. Drop the text.
6. Inspect the DOM structure.

## Observed Behavior

1. **Nested Span Generation**: A new `<span>` element is generated around the dragged text.
2. **DOM Corruption**: The DOM structure becomes nested unnecessarily.
3. **Unintended Nesting**: The nesting is not intended and corrupts the document structure.
4. **Firefox-Specific**: This issue is specific to Firefox.

## Expected Behavior

- No nested span should be generated.
- The text should move to the new position without creating new elements.
- The DOM structure should remain clean and flat.

## Impact

- **DOM Corruption**: Unnecessary nested elements are created.
- **Styling Issues**: Nested spans may cause unexpected styling behavior.
- **Document Structure**: The document structure becomes corrupted.
- **Editor Reliability**: Rich text editors may fail to handle the corrupted structure.

## Browser Comparison

- **Firefox**: This issue occurs.
- **Chrome**: Not affected.
- **Safari**: Not affected.
- **Edge**: Not affected.

## Notes and Possible Workarounds

### Prevent Drag and Drop

```javascript
const editor = document.querySelector('span[contenteditable]');

// Disable drag and drop entirely
editor.addEventListener('dragstart', (e) => {
  e.preventDefault();
});
```

### Normalize Nested Spans After Drop

```javascript
function normalizeNestedSpans(element) {
  const spans = element.querySelectorAll('span');
  spans.forEach(span => {
    // Check if span is nested unnecessarily
    if (span.parentElement.tagName === 'SPAN' && 
        span.parentElement.getAttribute('contenteditable') === 'true') {
      // Unwrap the nested span
      const parent = span.parentElement;
      while (span.firstChild) {
        parent.insertBefore(span.firstChild, span);
      }
      parent.removeChild(span);
    }
  });
}

editor.addEventListener('drop', (e) => {
  // ... handle drop ...
  normalizeNestedSpans(editor);
});
```

### Manual Text Movement

```javascript
editor.addEventListener('mousedown', (e) => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    // Store selected text
    editor.dataset.draggedText = selectedText;
    editor.dataset.dragStart = true;
  }
});

editor.addEventListener('mouseup', (e) => {
  if (editor.dataset.dragStart === 'true') {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const draggedText = editor.dataset.draggedText;
      
      // Delete original text
      const originalRange = /* get original range */;
      originalRange.deleteContents();
      
      // Insert at new position
      range.insertNode(document.createTextNode(draggedText));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    delete editor.dataset.draggedText;
    delete editor.dataset.dragStart;
  }
});
```

## References

- [Bugzilla: Firefox nested span generation](https://bugzilla.mozilla.org/show_bug.cgi?id=1930277)
- Firefox-specific issue with drag and drop within contenteditable spans
