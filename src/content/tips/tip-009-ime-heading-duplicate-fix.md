---
id: tip-009-ime-heading-duplicate-fix
title: Fixing IME duplicate text in heading elements
description: "How to prevent duplicate Pinyin text when using IME composition in heading elements (H1-H6) in WebKit browsers"
category: ime
tags:
  - ime
  - composition
  - heading
  - webkit
  - chinese
  - duplicate-text
  - safari
difficulty: intermediate
relatedScenarios:
  - scenario-ime-duplicate-text-heading
relatedCases:
  - ce-0232-chinese-ime-pinyin-heading-safari-ko
  - ce-0233-chinese-ime-pinyin-heading-chrome-en
locale: en
---

## Problem

When using IME (Input Method Editor) for Chinese or other CJK languages in heading elements (`<h1>`-`<h6>`) in WebKit browsers (Safari, Chrome), pressing Space to confirm composition causes both the raw Pinyin buffer (e.g., "nihao") and the confirmed characters (e.g., "你好") to appear together. This results in duplicate text like "nihao 你好" instead of just "你好".

This issue only occurs in heading elements and does not affect paragraph or div elements. Firefox handles this correctly and does not exhibit the bug.

## Solution

### 1. Clean Up DOM After Composition

Remove the Pinyin buffer after composition completes using the `compositionend` event:

```javascript
const heading = document.querySelector('h2[contenteditable]');
let isComposing = false;

heading.addEventListener('compositionstart', () => {
  isComposing = true;
});

heading.addEventListener('compositionend', () => {
  isComposing = false;
  // Clean up Pinyin text after composition completes
  setTimeout(() => {
    const text = heading.textContent;
    // Remove lowercase letters (Pinyin buffer)
    const cleaned = text.replace(/[a-z]+\s*/g, '').trim();
    if (cleaned !== text) {
      heading.textContent = cleaned;
      // Restore cursor position
      const range = document.createRange();
      range.selectNodeContents(heading);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, 0);
});
```

### 2. Intercept Space Key During Composition

Prevent the Space key from being processed during composition to let the IME handle it naturally:

```javascript
const heading = document.querySelector('h2[contenteditable]');
let isComposing = false;

heading.addEventListener('compositionstart', () => {
  isComposing = true;
});

heading.addEventListener('compositionend', () => {
  isComposing = false;
});

heading.addEventListener('keydown', (e) => {
  if (isComposing && e.key === ' ') {
    e.preventDefault();
    e.stopPropagation();
    // Let IME complete composition naturally
    return false;
  }
});
```

### 3. Use Paragraphs Instead of Headings

Replace semantic heading elements with styled paragraphs to avoid the WebKit bug entirely:

```html
<!-- Instead of <h2> -->
<p class="heading-2" contenteditable="true">Type here</p>

<style>
.heading-2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 1rem 0;
}
</style>
```

### 4. Combined Approach with Robust Cleanup

Combine multiple strategies for a more robust solution:

```javascript
class HeadingIMEHandler {
  constructor(element) {
    this.element = element;
    this.isComposing = false;
    this.caretPosition = null;
    
    this.init();
  }
  
  init() {
    this.element.addEventListener('compositionstart', this.handleCompositionStart.bind(this));
    this.element.addEventListener('compositionupdate', this.handleCompositionUpdate.bind(this));
    this.element.addEventListener('compositionend', this.handleCompositionEnd.bind(this));
    this.element.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  
  handleCompositionStart() {
    this.isComposing = true;
    this.saveCaretPosition();
  }
  
  handleCompositionUpdate(e) {
    // Track composition state
  }
  
  handleCompositionEnd() {
    this.isComposing = false;
    // Clean up after a short delay to ensure DOM is updated
    setTimeout(() => {
      this.cleanupPinyin();
      this.restoreCaretPosition();
    }, 10);
  }
  
  handleKeyDown(e) {
    if (this.isComposing && e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }
  
  saveCaretPosition() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      this.caretPosition = {
        startContainer: range.startContainer,
        startOffset: range.startOffset
      };
    }
  }
  
  restoreCaretPosition() {
    if (!this.caretPosition) return;
    
    try {
      const range = document.createRange();
      range.setStart(this.caretPosition.startContainer, this.caretPosition.startOffset);
      range.collapse(true);
      
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (e) {
      // Fallback: move cursor to end
      const range = document.createRange();
      range.selectNodeContents(this.element);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  
  cleanupPinyin() {
    const text = this.element.textContent;
    // Remove lowercase Pinyin patterns (e.g., "nihao", "wo", "ni")
    // Keep CJK characters and other content
    const cleaned = text.replace(/[a-z]+\s*/g, '').trim();
    
    if (cleaned !== text) {
      this.element.textContent = cleaned;
    }
  }
  
  dispose() {
    this.element.removeEventListener('compositionstart', this.handleCompositionStart);
    this.element.removeEventListener('compositionupdate', this.handleCompositionUpdate);
    this.element.removeEventListener('compositionend', this.handleCompositionEnd);
    this.element.removeEventListener('keydown', this.handleKeyDown);
  }
}

// Usage
const heading = document.querySelector('h2[contenteditable]');
const handler = new HeadingIMEHandler(heading);
```

## Notes

- This bug is specific to WebKit-based browsers (Safari, Chrome) and does not occur in Firefox
- The issue only affects heading elements (`<h1>`-`<h6>`), not paragraph or div elements
- The cleanup approach may interfere with legitimate use cases where you want to keep both Pinyin and characters
- Using paragraphs instead of headings may impact SEO and accessibility, so consider using proper heading semantics with ARIA attributes if needed
- Test thoroughly with different IMEs (Chinese, Japanese, Korean) as behavior may vary
- The `setTimeout` delay in cleanup is necessary because the DOM update happens asynchronously after `compositionend`

## Related Resources

- [Scenario: IME duplicate text in headings](/scenarios/scenario-ime-duplicate-text-heading)
- [Case: ce-0232](/cases/ce-0232-chinese-ime-pinyin-heading-safari-ko)
- [Case: ce-0233](/cases/ce-0233-chinese-ime-pinyin-heading-chrome-en)
