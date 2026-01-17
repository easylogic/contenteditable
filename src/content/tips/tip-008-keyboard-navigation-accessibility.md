---
id: tip-008-keyboard-navigation-accessibility
title: Implementing keyboard navigation accessibility in contenteditable
description: "How to implement WCAG-compliant keyboard navigation in contenteditable elements"
category: accessibility
tags:
  - keyboard
  - accessibility
  - wcag
  - tab
  - arrow-keys
  - focus
difficulty: intermediate
relatedScenarios:
  - scenario-keyboard-navigation
relatedCases: []
locale: en
---

## Problem

Keyboard navigation in contenteditable elements must comply with WCAG 2.1.1 (Keyboard) and 2.1.2 (No Keyboard Trap) requirements. The Tab key typically moves focus out of contenteditable, while arrow keys move the caret.

## Solution

### 1. Make Tab Insert Indent

Intercept Tab and insert tab character.

```javascript
editableElement.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && !e.shiftKey) {
    e.preventDefault();
    document.execCommand('insertText', false, '\t');
  }
  // Shift+Tab should still move focus backward
});
```

### 2. Ensure Focus Exit

Provide escape mechanism.

```javascript
editableElement.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && !e.shiftKey) {
    // If at end of content, allow Tab to move focus
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const isAtEnd = range.collapsed && 
                    range.startOffset === range.endContainer.textContent.length;
    
    if (isAtEnd) {
      // Allow default Tab behavior to move focus
      return;
    }
    
    e.preventDefault();
    document.execCommand('insertText', false, '\t');
  }
  
  if (e.key === 'Escape') {
    editableElement.blur();
  }
});
```

### 3. Visible Focus Indicator

Ensure focus is visible.

```css
[contenteditable="true"]:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

[contenteditable="true"]:focus-visible {
  outline: 2px solid #0066cc;
}
```

### 4. ARIA Roles and Properties

Use proper ARIA for complex widgets.

```html
<div 
  contenteditable="true"
  role="textbox"
  aria-label="Editor"
  aria-multiline="true"
  tabindex="0"
>
  Editable content
</div>
```

### 5. Roving Tabindex for Composite Widgets

For toolbars or menus.

```javascript
class Toolbar {
  constructor(items) {
    this.items = items;
    this.activeIndex = 0;
    this.setupKeyboard();
  }
  
  setupKeyboard() {
    this.items.forEach((item, index) => {
      item.tabIndex = index === 0 ? 0 : -1;
      item.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          this.moveFocus(1);
        } else if (e.key === 'ArrowLeft') {
          this.moveFocus(-1);
        }
      });
    });
  }
  
  moveFocus(direction) {
    this.items[this.activeIndex].tabIndex = -1;
    this.activeIndex = (this.activeIndex + direction + this.items.length) % this.items.length;
    this.items[this.activeIndex].tabIndex = 0;
    this.items[this.activeIndex].focus();
  }
}
```

## WCAG Requirements

- **WCAG 2.1.1 Keyboard (Level A)**: All functionality must be operable through keyboard
- **WCAG 2.1.2 No Keyboard Trap (Level A)**: Users must be able to exit any component using keyboard
- **WCAG 2.4.7 Focus Visible (Level AA)**: Focus indicator must be visible
- **WCAG 2.4.3 Focus Order (Level A)**: Logical tab order must be maintained

## Notes

- When overriding Tab behavior, always provide escape mechanism
- Arrow keys move caret by default, so don't override unless necessary
- For composite widgets, set ARIA roles and states correctly

## Related Resources

- [Scenario: Keyboard navigation](/scenarios/scenario-keyboard-navigation)
