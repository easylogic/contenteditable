---
id: scenario-ime-rtl-and-character-joining
title: IME RTL text direction and contextual character joining issues
description: "Languages that use right-to-left (RTL) text direction and contextual character joining (Arabic, Hebrew, etc.) may experience issues in contenteditable where text direction is not handled correctly, characters do not join properly, or caret movement is incorrect in RTL context."
category: ime
tags:
  - ime
  - composition
  - rtl
  - text-direction
  - character-joining
  - arabic
  - hebrew
status: draft
locale: en
---

Languages that use right-to-left (RTL) text direction and contextual character joining (where letters connect differently based on their position in a word) can experience issues in contenteditable elements. Both RTL direction and character joining can be problematic, especially when mixed with left-to-right (LTR) text.

## Observed Behavior

1. **RTL direction issues**: Text may display left-to-right instead of right-to-left
2. **Character disconnection**: Letters may not join correctly, appearing as separate characters instead of forming connected words
3. **Caret movement**: Caret may move incorrectly in RTL text
4. **Selection problems**: Text selection may not work correctly in RTL context
5. **Mixed direction**: When mixing RTL and LTR text, direction handling may be incorrect

## Language-Specific Manifestations

This issue primarily affects:

- **Arabic**: Letters may not join contextually, and RTL direction may not be handled correctly
- **Hebrew**: Similar RTL and character joining issues
- **Other RTL languages**: Similar issues may occur with other languages that use RTL direction

## Browser Comparison

- **Chrome/Edge**: Generally better RTL support, but character joining can still fail
- **Firefox**: RTL support is good, but some edge cases exist
- **Safari**: RTL and character joining can be inconsistent, especially on iOS

## Impact

- RTL text may be unreadable or difficult to read
- Users cannot reliably input correct RTL text
- Mixed-direction text (RTL + LTR) may display incorrectly

## Workaround

Ensure proper RTL direction and monitor character joining:

```javascript
// Set RTL direction for RTL content
element.setAttribute('dir', 'rtl');
element.style.direction = 'rtl';
element.style.textAlign = 'right';

element.addEventListener('compositionend', (e) => {
  const text = e.target.textContent;
  
  // Check if text contains RTL characters
  const arabicPattern = /[\u0600-\u06FF]/;
  const hebrewPattern = /[\u0590-\u05FF]/;
  
  if (arabicPattern.test(text) || hebrewPattern.test(text)) {
    // Ensure RTL direction is set
    if (getComputedStyle(e.target).direction !== 'rtl') {
      e.target.setAttribute('dir', 'rtl');
    }
    
    // Validate character joining
    // RTL letters should join contextually
    // This is complex to validate - browser should handle it, but may fail
  }
});

// Handle mixed direction text
element.addEventListener('input', (e) => {
  const text = e.target.textContent;
  const hasRTL = /[\u0590-\u05FF\u0600-\u06FF]/.test(text);
  const hasLatin = /[a-zA-Z]/.test(text);
  
  if (hasRTL && hasLatin) {
    // Mixed direction - may need bidirectional text handling
    // Use Unicode bidirectional algorithm (bidi)
    e.target.setAttribute('dir', 'auto'); // Let browser determine direction
  } else if (hasRTL) {
    e.target.setAttribute('dir', 'rtl');
  } else {
    e.target.setAttribute('dir', 'ltr');
  }
});
```

## References

- [HRCD: RTL Usability](https://hrcd.pubpub.org/pub/rtlusability) - RTL text direction guide
- [Wikipedia: Implicit directional marks](https://en.wikipedia.org/wiki/Implicit_directional_marks) - Bidirectional text handling
- [Stack Overflow: Right to left text HTML input](https://stackoverflow.com/questions/7524855/right-to-left-text-html-input) - RTL direction setup
- [CKEditor Issue #1151: RTL support](https://github.com/ckeditor/ckeditor5/issues/1151) - Editor RTL implementation
