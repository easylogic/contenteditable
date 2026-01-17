---
id: ce-0300-firefox-drag-drop-duplicate-elements-en-ko
scenarioId: scenario-drag-drop-duplicate
locale: ko
os: Windows
osVersion: "10-11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120+"
keyboard: US QWERTY
caseTitle: Dragging contenteditable="false" elements causes duplication in Firefox
description: "In Firefox, dragging elements with contenteditable='false' within a contenteditable container can result in duplicate elements upon dropping. This issue is not observed in Chrome."
tags:
  - drag-drop
  - contenteditable-false
  - firefox
  - duplicate
  - nested
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    <p>Text before</p>
    <span contenteditable="false" draggable="true" style="background: #fef08a; padding: 2px 4px; cursor: move;">Draggable element</span>
    <p>Text after</p>
  </div>
domSteps:
  - label: "Before drag"
    html: '<div contenteditable="true"><p>Text before</p><span contenteditable="false" draggable="true">Draggable</span><p>Text after</p></div>'
    description: "Single draggable element"
  - label: "After drop (Bug)"
    html: '<div contenteditable="true"><p>Text before</p><span contenteditable="false" draggable="true">Draggable</span><span contenteditable="false" draggable="true">Draggable</span><p>Text after</p></div>'
    description: "Element is duplicated after drag and drop"
  - label: "✅ Expected"
    html: '<div contenteditable="true"><p>Text before</p><span contenteditable="false" draggable="true">Draggable</span><p>Text after</p></div>'
    description: "Expected: Element should be moved, not duplicated"
---

## Phenomenon

In Firefox, dragging elements with `contenteditable="false"` within a `contenteditable` container can result in duplicate elements upon dropping. This issue is not observed in Chrome.

## Reproduction example

1. Open Firefox browser on Windows.
2. Create a `contenteditable` element containing a `contenteditable="false"` element with `draggable="true"`.
3. Drag the non-editable element to a new position within the container.
4. Drop the element.
5. Observe that the element is duplicated instead of moved.

## Observed behavior

- Dragging a `contenteditable="false"` element creates a duplicate
- The original element remains in its position
- A copy is created at the drop location
- This only occurs in Firefox

## Expected behavior

- Dragging should move the element, not duplicate it
- The original element should be removed from its position
- Behavior should be consistent with other browsers

## Impact

- **Data integrity**: Unintended element duplication
- **User confusion**: Users may not understand why elements are duplicated
- **Content corruption**: Multiple duplicates can accumulate over time

## Browser Comparison

- **Firefox**: Elements are duplicated (this issue)
- **Chrome**: Elements are moved correctly
- **Safari**: Elements are moved correctly
- **Edge**: Elements are moved correctly

## Notes and possible direction for workarounds

- **Prevent default behavior**: Call `event.preventDefault()` in drag event handlers
- **Manual cleanup**: Remove the original element after drop
- **Custom drag handler**: Implement custom drag-and-drop logic to control behavior

## Code example

```javascript
const editor = document.querySelector('div[contenteditable]');
const draggableElements = editor.querySelectorAll('[contenteditable="false"][draggable="true"]');

draggableElements.forEach((el) => {
  let draggedElement = null;
  
  el.addEventListener('dragstart', (e) => {
    draggedElement = el;
    // Set drag data to prevent default behavior
    e.dataTransfer.setData('text/plain', ' ');
    e.dataTransfer.effectAllowed = 'move';
  });
  
  el.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  });
  
  el.addEventListener('drop', (e) => {
    e.preventDefault();
    
    if (draggedElement && draggedElement !== el) {
      // Get drop position
      const selection = window.getSelection();
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      
      if (range) {
        // Clone element
        const clone = draggedElement.cloneNode(true);
        
        // Insert at drop position
        range.insertNode(clone);
        range.collapse(false);
        
        // Remove original element (Firefox workaround)
        if (draggedElement.parentNode) {
          draggedElement.parentNode.removeChild(draggedElement);
        }
        
        // Update selection
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    
    draggedElement = null;
  });
});
```
