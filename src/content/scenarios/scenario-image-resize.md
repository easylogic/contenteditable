---
id: scenario-image-resize
title: Image resizing in contenteditable is limited or inconsistent
description: "Resizing images within contenteditable elements is limited or behaves inconsistently across browsers. Some browsers support native resize handles, while others require manual implementation. The resize behavior may also affect the DOM structure unexpectedly."
category: formatting
tags:
  - image
  - resize
  - drag
  - dimensions
status: draft
locale: en
---

Resizing images within contenteditable elements is limited or behaves inconsistently across browsers. Some browsers support native resize handles, while others require manual implementation. The resize behavior may also affect the DOM structure unexpectedly.

## Observed Behavior

### Scenario 1: Native resize handles
- **Chrome/Edge**: May show resize handles on selected images, but behavior inconsistent
- **Firefox**: Limited or no native resize support
- **Safari**: May have different resize behavior

### Scenario 2: Resizing via CSS
- **Chrome/Edge**: Width/height attributes may be added or removed during resize
- **Firefox**: Similar behavior
- **Safari**: May handle attributes differently

### Scenario 3: Aspect ratio preservation
- **Chrome/Edge**: May or may not preserve aspect ratio
- **Firefox**: Behavior varies
- **Safari**: May have different aspect ratio handling

### Scenario 4: Resize events and DOM changes
- **Chrome/Edge**: Resize may trigger unexpected DOM mutations
- **Firefox**: Similar issues
- **Safari**: May have different mutation behavior

## Impact

- Difficulty implementing consistent image resizing
- Unexpected DOM structure changes
- Loss of image attributes during resize
- Need for custom resize implementation

## Browser Comparison

- **Chrome/Edge**: Some native support but inconsistent
- **Firefox**: Limited native support
- **Safari**: Different behavior, may require custom implementation

## Workaround

Implement custom resize handles:

```javascript
function addResizeHandles(img) {
  const handle = document.createElement('div');
  handle.className = 'resize-handle';
  handle.style.cssText = `
    position: absolute;
    width: 10px;
    height: 10px;
    background: blue;
    cursor: se-resize;
    bottom: 0;
    right: 0;
  `;
  
  let isResizing = false;
  let startX, startY, startWidth, startHeight;
  
  handle.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = img.offsetWidth;
    startHeight = img.offsetHeight;
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    img.style.width = (startWidth + deltaX) + 'px';
    img.style.height = (startHeight + deltaY) + 'px';
  });
  
  document.addEventListener('mouseup', () => {
    isResizing = false;
  });
  
  // Position handle relative to image
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  wrapper.style.display = 'inline-block';
  img.parentNode.insertBefore(wrapper, img);
  wrapper.appendChild(img);
  wrapper.appendChild(handle);
}
```

