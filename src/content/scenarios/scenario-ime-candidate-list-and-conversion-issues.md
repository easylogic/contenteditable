---
id: scenario-ime-candidate-list-and-conversion-issues
title: IME candidate list display and conversion issues across languages
description: "When using IMEs that require character conversion (Japanese, Chinese, etc.) in contenteditable, the candidate list may not display correctly, arrow key navigation may interfere with editing, or the conversion process may be delayed, interrupted, or produce incorrect results. This affects multiple languages including Japanese, Chinese, and others that use phonetic-to-character conversion."
category: ime
tags:
  - ime
  - composition
  - candidate-list
  - conversion
  - japanese
  - chinese
status: draft
locale: en
---

IMEs that convert phonetic input to characters (such as Japanese romaji-to-kanji, Chinese Pinyin-to-characters) display candidate lists for user selection. In contenteditable elements, this conversion process can be disrupted, causing the candidate list to not appear, disappear prematurely, or interfere with normal editing operations. The conversion may also be delayed, interrupted, or produce incorrect results.

## Observed Behavior

1. **Candidate list not displaying**: The IME candidate list may fail to appear when expected
2. **Arrow key conflicts**: Arrow keys used to navigate candidates may move the caret instead of navigating the candidate list
3. **Premature cancellation**: The conversion process may be cancelled when clicking or interacting with the page
4. **Conversion delay**: Characters may take longer to convert than expected
5. **Partial conversion**: Only part of the input may be converted while the rest remains as phonetic text
6. **Incorrect characters**: Wrong characters may be inserted during conversion
7. **Interruption**: Conversion may be cancelled by clicking, arrow keys, or other interactions

## Language-Specific Manifestations

This issue manifests differently across languages:

- **Japanese IME**: Kanji conversion candidate list may not appear, or arrow keys may move caret instead of navigating candidates
- **Chinese IME**: Pinyin-to-character conversion may be delayed, partial, or interrupted
- **Other conversion-based IMEs**: Similar issues may occur with other languages that use phonetic-to-character conversion

## Browser Comparison

- **Chrome/Edge**: Generally better support, but candidate list positioning can be inconsistent, and delays can occur with complex phrases
- **Firefox**: May have issues with candidate list display, arrow key handling, and conversion accuracy
- **Safari**: Candidate list behavior and conversion timing can be inconsistent, especially on iOS

## Impact

- Users cannot reliably convert phonetic input to characters
- Workflow is disrupted when candidate selection fails
- Text may contain mixed phonetic and character text unintentionally
- Inconsistent behavior across browsers creates confusion

## Workaround

Handle arrow key events during composition and monitor conversion state:

```javascript
let isComposing = false;
let candidateListActive = false;
let conversionState = {
  isActive: false,
  pendingConversion: false,
  lastInput: ''
};

element.addEventListener('compositionstart', () => {
  isComposing = true;
  conversionState.isActive = true;
  conversionState.pendingConversion = true;
});

element.addEventListener('compositionupdate', (e) => {
  // Check if candidate list is likely active
  candidateListActive = e.data && e.data.length > 0;
  conversionState.lastInput = e.data;
  
  // Track if conversion is in progress (phonetic text still present)
  if (e.data && e.data.match(/[a-z]+/i)) {
    conversionState.pendingConversion = true;
  }
});

element.addEventListener('keydown', (e) => {
  if (isComposing && candidateListActive) {
    // Allow arrow keys for candidate navigation
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      // Optionally prevent default to avoid caret movement
      // e.preventDefault();
    }
  }
});

element.addEventListener('compositionend', (e) => {
  isComposing = false;
  candidateListActive = false;
  conversionState.isActive = false;
  conversionState.pendingConversion = false;
  
  // Verify conversion completed correctly
  if (e.data && e.data.match(/[a-z]+/i)) {
    // Still contains phonetic text - conversion may have failed
    console.warn('Conversion may have failed:', e.data);
  }
});

// Prevent interruptions during conversion
element.addEventListener('click', (e) => {
  if (conversionState.pendingConversion) {
    // Optionally delay click handling
    setTimeout(() => {
      // Handle click after conversion completes
    }, 100);
  }
});
```

## References

- [W3C UI Events: Composition events](https://w3c.github.io/uievents/split/composition-events.html) - Composition event specification
- [Chromium Blink Dev: Event ordering discussion](https://groups.google.com/a/chromium.org/g/blink-dev/c/spwtbdODC3Q) - beforeinput and composition event order
- [W3C DOM Level 3 Events](https://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105/) - Event cancelability
- [MDN: compositionstart event](https://devdoc.net/web/developer.mozilla.org/en-US/docs/DOM/DOM_event_reference/compositionstart.html) - Composition event documentation
