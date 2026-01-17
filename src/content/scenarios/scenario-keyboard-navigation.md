---
id: scenario-keyboard-navigation
title: Keyboard navigation accessibility issues in contenteditable
description: "Keyboard navigation in contenteditable elements must comply with WCAG 2.1.1 (Keyboard) and 2.1.2 (No Keyboard Trap) requirements. The Tab key typically moves focus out of contenteditable, while arrow keys move the caret. Custom keyboard handling must ensure all functionality is keyboard-operable and focus remains visible."
category: accessibility
tags:
  - keyboard
  - accessibility
  - wcag
  - tab
  - arrow-keys
  - focus
status: draft
locale: en
---

Keyboard navigation in `contenteditable` elements must comply with WCAG 2.1.1 (Keyboard) and 2.1.2 (No Keyboard Trap) requirements. The Tab key typically moves focus out of contenteditable, while arrow keys move the caret. Custom keyboard handling must ensure all functionality is keyboard-operable and focus remains visible.

## Observed Behavior

- **Tab moves focus**: Tab key moves focus out of contenteditable by default
- **Arrow keys move caret**: Arrow keys navigate caret position within content
- **No tab character insertion**: Tab doesn't insert tab character by default
- **Focus visibility**: Focus must be visually distinguishable
- **Keyboard traps**: Custom Tab handling can create keyboard traps

## WCAG Requirements

- **WCAG 2.1.1 Keyboard (Level A)**: All functionality must be operable through keyboard
- **WCAG 2.1.2 No Keyboard Trap (Level A)**: Users must be able to exit any component using keyboard
- **WCAG 2.4.7 Focus Visible (Level AA)**: Focus indicator must be visible
- **WCAG 2.4.3 Focus Order (Level A)**: Logical tab order must be maintained

## Browser Comparison

- **All browsers**: Tab moves focus out by default
- **All browsers**: Arrow keys move caret within content
- **All browsers**: Focus visibility depends on CSS
- **All browsers**: Keyboard trap prevention is developer responsibility

## Impact

- **Accessibility compliance**: Must meet WCAG requirements
- **User experience**: Keyboard-only users must be able to use editor
- **Legal compliance**: May be required for accessibility standards
- **Development overhead**: Requires careful keyboard handling

## Workarounds

### 1. Make Tab Insert Indent

Intercept Tab and insert tab character:

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

Provide escape mechanism:

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

Ensure focus is visible:

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

Use proper ARIA for complex widgets:

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

For toolbars or menus:

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

## References

- [WCAG 2.1.1: Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html) - Keyboard accessibility requirement
- [WCAG 2.1.2: No Keyboard Trap](https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap.html) - Keyboard trap prevention
- [ARIA Authoring Practices: Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/) - Keyboard navigation patterns
- [Stack Overflow: Make Tab insert tab character](https://stackoverflow.com/questions/2237497/make-the-tab-key-insert-a-tab-character-in-a-contenteditable-div-and-not-blur) - Tab handling
- [ARIA Practices: Grid pattern](https://www.w3.org/TR/2021/NOTE-wai-aria-practices-1.2-20211129/) - Keyboard navigation in grids
- [Test Party: Keyboard navigation testing](https://testparty.ai/blog/keyboard-navigation-testing) - Testing guidelines
