---
id: scenario-ime-combining-characters-composition
title: IME combining characters and diacritic composition issues
description: "Languages that use combining characters, diacritics, tone marks, or complex character compositions (Thai, Vietnamese, Hindi/Devanagari, etc.) may experience issues in contenteditable where these marks do not position correctly, combine incorrectly, or are lost during editing operations."
category: ime
tags:
  - ime
  - composition
  - combining-characters
  - diacritics
  - thai
  - vietnamese
  - hindi
  - devanagari
status: draft
---

Many languages use combining characters, diacritics, tone marks, or complex character compositions where base characters combine with marks in specific ways. In contenteditable elements, the positioning, ordering, and combination of these marks can fail, resulting in incorrectly displayed or unreadable text.

## Observed Behavior

1. **Mark misplacement**: Tone marks, vowel marks, or diacritics may appear in the wrong position relative to base characters
2. **Incorrect combination**: Marks may combine with the wrong base character
3. **Order issues**: Base characters and marks may be inserted in wrong order
4. **Visual rendering**: Text may appear correctly in the DOM but render incorrectly visually
5. **Backspace problems**: Deleting characters may not remove both base and combining marks correctly
6. **Mark loss**: Diacritics or marks may be lost during composition or editing

## Language-Specific Manifestations

This issue manifests differently across languages:

- **Thai**: Tone marks and vowel marks may not position correctly relative to consonants
- **Vietnamese**: Diacritic marks (accents) may be lost or combine incorrectly with base letters
- **Hindi/Devanagari**: Vowel signs (matras) may be misplaced, or conjunct characters may not form correctly
- **Other languages**: Similar issues may occur with any language using combining characters

## Browser Comparison

- **Chrome/Edge**: Generally better support, but combining character positioning can still fail
- **Firefox**: May have more issues with combining character positioning and formation
- **Safari**: Rendering can be inconsistent, especially on mobile devices

## Impact

- Text may be unreadable or difficult to read
- Users cannot reliably input correct text
- Text may appear correct in one browser but wrong in another
- Users must manually correct marks frequently

## Workaround

Handle combining characters carefully and validate text after composition:

```javascript
// Language-specific patterns
const thaiPattern = /[\u0E00-\u0E7F]+/;
const vietnamesePattern = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]/;
const devanagariPattern = /[\u0900-\u097F]/;

element.addEventListener('compositionend', (e) => {
  const text = e.target.textContent;
  
  // Check for proper character composition
  if (thaiPattern.test(text) || vietnamesePattern.test(text) || devanagariPattern.test(text)) {
    // Normalize to ensure proper character combination
    const normalized = text.normalize('NFC');
    if (normalized !== text) {
      // Text may need normalization
      console.warn('Text may need normalization');
    }
    
    // Validate combining character order
    // This is language-specific and complex
  }
});

// Monitor for visual rendering issues
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'characterData' || mutation.type === 'childList') {
      // Check if text rendering is correct
      // May need to trigger reflow or adjust styles
    }
  });
});

observer.observe(element, {
  characterData: true,
  childList: true,
  subtree: true
});

// Handle backspace carefully to preserve combining marks
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'deleteContentBackward' && e.isComposing) {
    // During composition, backspace behavior may be different
    // Allow IME to handle it
  }
});
```

