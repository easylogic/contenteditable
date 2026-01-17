---
id: tip-014-caret-invisible-relative-fix
title: Fixing invisible caret on position:relative elements
description: "How to make the text caret visible when editing content inside elements with position:relative CSS property"
category: selection
tags:
  - caret
  - cursor
  - css
  - position-relative
  - webkit
  - safari
  - chrome
  - visibility
difficulty: beginner
relatedScenarios:
  - scenario-caret-invisible-relative
relatedCases:
  - ce-0271-caret-invisible-relative-safari-ko
  - ce-0272-caret-invisible-relative-chrome-macos-en
locale: en
---

## Problem

When editing content inside an element with `position:relative` CSS property, the text caret (cursor) becomes completely invisible. Text can be typed and appears in the editor, but there's no visual feedback showing where the insertion point is located. This makes editing difficult as users cannot see where the next character will be inserted.

This issue affects all major browsers (Safari, Chrome, Firefox) when contenteditable elements are nested inside or have `position:relative` styling.

## Solution

### 1. Remove or Change position:relative

The simplest solution is to avoid `position:relative` on the contenteditable element or its immediate parent:

```css
/* Instead of */
.editable-container {
  position: relative;
}

/* Use */
.editable-container {
  position: static; /* or remove position property entirely */
}
```

Or restructure your HTML:

```html
<!-- Instead of -->
<div class="container" style="position: relative;">
  <div contenteditable="true">Editable content</div>
</div>

<!-- Use -->
<div class="container">
  <div contenteditable="true">Editable content</div>
</div>
```

### 2. Move position:relative to Ancestor Element

If you need `position:relative` for layout purposes, move it to an ancestor element:

```html
<div class="wrapper" style="position: relative;">
  <div class="editable-container" style="position: static;">
    <div contenteditable="true">Editable content</div>
  </div>
</div>
```

```css
.wrapper {
  position: relative; /* For layout/positioning context */
}

.editable-container {
  position: static; /* Allows caret to render */
}

.editable-container[contenteditable="true"] {
  /* Editable element itself should not have position:relative */
}
```

### 3. Use caret-color Property

Try using the `caret-color` CSS property to force caret visibility (may work in some browsers):

```css
[contenteditable="true"] {
  caret-color: #000; /* Black caret */
  /* Or */
  caret-color: currentColor; /* Use text color */
}
```

Note: This may not fully solve the issue in all browsers, but it's worth trying.

### 4. Create Custom Caret Indicator

Implement a custom caret element that shows the insertion point:

```javascript
class CustomCaret {
  constructor(editor) {
    this.editor = editor;
    this.caretElement = null;
    this.init();
  }
  
  init() {
    this.createCaretElement();
    this.editor.addEventListener('focus', this.showCaret.bind(this));
    this.editor.addEventListener('blur', this.hideCaret.bind(this));
    this.editor.addEventListener('input', this.updateCaret.bind(this));
    this.editor.addEventListener('keyup', this.updateCaret.bind(this));
    this.editor.addEventListener('mouseup', this.updateCaret.bind(this));
  }
  
  createCaretElement() {
    this.caretElement = document.createElement('span');
    this.caretElement.className = 'custom-caret';
    this.caretElement.style.cssText = `
      position: absolute;
      width: 2px;
      height: 1.2em;
      background: currentColor;
      pointer-events: none;
      animation: blink 1s infinite;
      z-index: 1000;
    `;
    
    // Add blink animation
    if (!document.getElementById('custom-caret-style')) {
      const style = document.createElement('style');
      style.id = 'custom-caret-style';
      style.textContent = `
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  showCaret() {
    this.updateCaret();
  }
  
  hideCaret() {
    if (this.caretElement && this.caretElement.parentNode) {
      this.caretElement.parentNode.removeChild(this.caretElement);
    }
  }
  
  updateCaret() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
      this.hideCaret();
      return;
    }
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const editorRect = this.editor.getBoundingClientRect();
    
    // Calculate position relative to editor
    const top = rect.top - editorRect.top + this.editor.scrollTop;
    const left = rect.left - editorRect.left + this.editor.scrollLeft;
    
    // Position caret element
    this.caretElement.style.top = `${top}px`;
    this.caretElement.style.left = `${left}px`;
    this.caretElement.style.height = `${rect.height || 1.2}em`;
    
    // Insert into editor if not already there
    if (!this.caretElement.parentNode) {
      this.editor.style.position = 'relative';
      this.editor.appendChild(this.caretElement);
    }
  }
  
  dispose() {
    this.hideCaret();
    this.editor.removeEventListener('focus', this.showCaret);
    this.editor.removeEventListener('blur', this.hideCaret);
    this.editor.removeEventListener('input', this.updateCaret);
    this.editor.removeEventListener('keyup', this.updateCaret);
    this.editor.removeEventListener('mouseup', this.updateCaret);
  }
}

// Usage
const editor = document.querySelector('div[contenteditable]');
const customCaret = new CustomCaret(editor);
```

### 5. Use CSS Transform Instead of position:relative

If you need positioning for layout, use CSS transforms instead:

```css
/* Instead of */
.container {
  position: relative;
  top: 10px;
  left: 20px;
}

/* Use */
.container {
  transform: translate(20px, 10px);
}
```

Transforms don't affect caret rendering.

### 6. Restructure with Absolute Positioning

Use absolute positioning on child elements instead of relative on the container:

```html
<div class="container">
  <div class="absolute-child" style="position: absolute; top: 10px; left: 20px;">
    <div contenteditable="true">Editable content</div>
  </div>
</div>
```

```css
.container {
  /* No position:relative here */
  position: static;
}

.absolute-child {
  position: absolute;
  /* Child can be absolutely positioned without affecting caret */
}
```

### 7. Comprehensive Solution

A complete solution that handles all cases:

```javascript
class CaretVisibilityFix {
  constructor(editor) {
    this.editor = editor;
    this.originalPosition = window.getComputedStyle(editor).position;
    this.init();
  }
  
  init() {
    // Check if editor or parent has position:relative
    if (this.hasRelativePosition(this.editor)) {
      // Try to fix by changing position
      this.fixPosition();
    }
    
    // Add caret-color as backup
    this.editor.style.caretColor = 'currentColor';
    
    // Monitor for position changes
    this.observePositionChanges();
  }
  
  hasRelativePosition(element) {
    const style = window.getComputedStyle(element);
    if (style.position === 'relative') {
      return true;
    }
    
    // Check parent elements
    let parent = element.parentElement;
    while (parent && parent !== document.body) {
      const parentStyle = window.getComputedStyle(parent);
      if (parentStyle.position === 'relative') {
        return true;
      }
      parent = parent.parentElement;
    }
    
    return false;
  }
  
  fixPosition() {
    // Try changing to static
    if (this.editor.style.position === 'relative' || 
        window.getComputedStyle(this.editor).position === 'relative') {
      this.editor.style.position = 'static';
    }
  }
  
  observePositionChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          // Position might have changed, check again
          if (this.hasRelativePosition(this.editor)) {
            this.fixPosition();
          }
        }
      });
    });
    
    observer.observe(this.editor, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    // Also observe parent changes
    let parent = this.editor.parentElement;
    while (parent) {
      observer.observe(parent, {
        attributes: true,
        attributeFilter: ['style', 'class']
      });
      parent = parent.parentElement;
    }
  }
  
  dispose() {
    // Restore original position if needed
    if (this.originalPosition) {
      this.editor.style.position = this.originalPosition;
    }
  }
}

// Usage
const editor = document.querySelector('div[contenteditable]');
const fix = new CaretVisibilityFix(editor);
```

## Notes

- This issue affects all major browsers when `position:relative` is used
- The simplest fix is to avoid `position:relative` on contenteditable elements
- If you must use `position:relative` for layout, move it to an ancestor element
- CSS transforms can often replace `position:relative` for layout purposes
- Custom caret indicators are complex but provide full control
- The `caret-color` property may help but doesn't fully solve the issue
- Test in all browsers as behavior may vary
- Consider using CSS Grid or Flexbox for layout instead of positioning

## Related Resources

- [Scenario: Caret invisible on position:relative](/scenarios/scenario-caret-invisible-relative)
- [Case: ce-0271](/cases/ce-0271-caret-invisible-relative-safari-ko)
- [Case: ce-0272](/cases/ce-0272-caret-invisible-relative-chrome-macos-en)
