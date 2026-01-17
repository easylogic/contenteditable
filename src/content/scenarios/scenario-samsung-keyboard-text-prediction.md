---
id: scenario-samsung-keyboard-text-prediction
title: Samsung Keyboard Text Prediction Issues in contenteditable
description: "Samsung keyboard's text prediction feature causes various input event handling issues in contenteditable elements on Android Chrome, including insertCompositionText events, missing getTargetRanges(), selection mismatches, and combined event.data when typing adjacent to links or formatted elements."
category: mobile
tags:
  - samsung-keyboard
  - text-prediction
  - android
  - chrome
  - insertCompositionText
  - getTargetRanges
  - selection
  - link
  - anchor
status: draft
locale: en
---

Samsung keyboard's text prediction feature (also called "phrase suggestion" or "predictive text") causes various input event handling issues in `contenteditable` elements on Android Chrome. These issues manifest when text prediction is enabled and users type text, especially when typing adjacent to links or other formatted elements.

## Problem Overview

When Samsung keyboard's text prediction is enabled on Android Chrome, several problems occur:

1. **All input events fire as `insertCompositionText`**: Both `beforeinput` and `input` events fire with `inputType: 'insertCompositionText'` even for regular typing
2. **Missing `getTargetRanges()`**: `beforeinput.getTargetRanges()` returns empty array or undefined
3. **Selection mismatches**: Selection in `beforeinput` differs from selection in `input`
4. **Combined `event.data`**: `event.data` contains combined text including adjacent link text, not just the typed text
5. **Incorrect selection ranges**: Selection includes adjacent link text with unexpected start/end positions

## Specific Issues

### Issue 1: insertCompositionText for All Input

**Problem**: When text prediction is enabled, all text input triggers `insertCompositionText` events instead of `insertText`.

**Observed Behavior**:
```javascript
// Normal typing should fire:
beforeinput: { inputType: 'insertText', data: 'H' }
input: { inputType: 'insertText', data: 'H' }

// With Samsung keyboard text prediction ON:
beforeinput: { inputType: 'insertCompositionText', data: 'Hello', isComposing: true }
input: { inputType: 'insertCompositionText', data: 'Hello', isComposing: true }
```

**Impact**:
- Cannot distinguish between actual IME composition and text prediction
- Event handlers expecting `insertText` don't fire correctly
- Composition state management becomes confused

### Issue 2: Missing getTargetRanges()

**Problem**: `beforeinput.getTargetRanges()` returns empty array or undefined when text prediction is active.

**Observed Behavior**:
```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertCompositionText') {
    const ranges = e.getTargetRanges?.() || [];
    // ranges is [] or undefined
    // Cannot determine exact insertion position
  }
});
```

**Impact**:
- Cannot determine exact text insertion position
- Must rely on `window.getSelection()` which may be inaccurate
- Difficult to implement precise text insertion logic

### Issue 3: Selection Mismatch Between beforeinput and input

**Problem**: The selection in `beforeinput` event differs from the selection in `input` event.

**Observed Behavior**:
```javascript
let beforeInputSelection = null;
let inputSelection = null;

element.addEventListener('beforeinput', (e) => {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    beforeInputSelection = sel.getRangeAt(0).cloneRange();
    // beforeInputSelection.startContainer may include link text
  }
});

element.addEventListener('input', (e) => {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    inputSelection = sel.getRangeAt(0).cloneRange();
    // inputSelection differs from beforeInputSelection
  }
});
```

**Impact**:
- State synchronization issues between `beforeinput` and `input` handlers
- Incorrect position tracking
- Undo/redo stack inconsistencies

### Issue 4: Combined event.data When Typing Next to Links

**Problem**: When typing next to an anchor link, `event.data` contains combined text including the link text, not just the typed text.

**Observed Behavior**:
```html
<div contenteditable="true">
  <a href="https://example.com">Link text</a> 
</div>
<!-- User types "Hello" after the link -->
```

```javascript
element.addEventListener('beforeinput', (e) => {
  // Expected: e.data === 'Hello'
  // Actual: e.data === 'LinktextHello' (combined)
});
```

**Impact**:
- Cannot extract actual typed text from `event.data`
- Text extraction logic fails
- Change tracking systems record incorrect changes

### Issue 5: Selection Includes Adjacent Link Text

**Problem**: When typing next to a link, the selection range includes the link text with unexpected start/end positions.

**Observed Behavior**:
```javascript
// User positions cursor after link and types
element.addEventListener('beforeinput', (e) => {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  
  // range.startContainer may be the link element
  // range.startOffset and range.endOffset may include link text
  // Cannot determine actual cursor position
});
```

**Impact**:
- Incorrect cursor position detection
- Text inserted at wrong location
- Link structure may be corrupted

## Affected Browsers and Devices

- **Chrome for Android** (with Samsung Keyboard) - Issue confirmed
- **Samsung Internet Browser** - Likely affected (Chromium-based)
- **Other Android browsers** - May be affected if using Samsung Keyboard
- **Other keyboards** - Gboard, SwiftKey, etc. do NOT exhibit these issues

## Affected Devices

- **Samsung Galaxy** devices (S9, S10, Note series, etc.)
- **Other Android devices** with Samsung Keyboard installed

## Root Causes

1. **Samsung Keyboard's text prediction implementation**: The keyboard's predictive text feature uses IME composition APIs internally, causing all input to be treated as composition
2. **Browser IME adapter issues**: Chrome's IME adapter may not properly handle Samsung keyboard's text prediction events
3. **Selection range calculation**: Browser may incorrectly calculate selection ranges when text prediction is active
4. **Event data aggregation**: Text prediction may aggregate adjacent text when determining what to suggest

## Workarounds

### 1. Detect and Handle insertCompositionText

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertCompositionText') {
    // Check if this is actual composition or text prediction
    const isTextPrediction = detectTextPrediction(e);
    
    if (isTextPrediction) {
      // Handle as regular text input
      handleTextPredictionInput(e);
    } else {
      // Handle as actual IME composition
      handleCompositionInput(e);
    }
  }
});

function detectTextPrediction(e) {
  // Heuristics to detect text prediction:
  // 1. isComposing is true but no actual composition started
  // 2. event.data contains full phrases
  // 3. getTargetRanges() is empty
  const ranges = e.getTargetRanges?.() || [];
  return ranges.length === 0 && e.data && e.data.length > 1;
}
```

### 2. Use window.getSelection() as Fallback

```javascript
element.addEventListener('beforeinput', (e) => {
  const targetRanges = e.getTargetRanges?.() || [];
  
  if (targetRanges.length === 0) {
    // Fallback to window.getSelection()
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0).cloneRange();
      
      // Normalize range to exclude link text
      const normalizedRange = normalizeRangeForLinkAdjacent(range);
      handleInputWithRange(normalizedRange, e);
    }
  } else {
    // Use targetRanges
    handleInputWithRange(targetRanges[0], e);
  }
});

function normalizeRangeForLinkAdjacent(range) {
  let container = range.startContainer;
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement;
  }
  
  const link = container.closest('a');
  if (link) {
    // Adjust to position after link
    const normalized = document.createRange();
    try {
      normalized.setStartAfter(link);
      normalized.collapse(true);
      return normalized;
    } catch (e) {
      return range;
    }
  }
  
  return range;
}
```

### 3. Extract Actual Input Text from Combined Data

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertCompositionText' && e.data) {
    // Store DOM state before input
    const domBefore = element.innerHTML;
    const selection = window.getSelection();
    const range = selection && selection.rangeCount > 0 
      ? selection.getRangeAt(0).cloneRange() 
      : null;
    
    // Extract actual input text
    const actualInputText = extractActualInputText(e.data, range, domBefore);
    
    // Use actualInputText instead of e.data
    handleInput(actualInputText, range);
  }
});

function extractActualInputText(combinedText, range, domBefore) {
  // Method 1: Check if combined text starts with adjacent link text
  if (range) {
    const link = range.startContainer?.parentElement?.closest('a');
    if (link && combinedText.startsWith(link.textContent)) {
      return combinedText.slice(link.textContent.length);
    }
  }
  
  // Method 2: Compare DOM before and after (requires storing state)
  // This is more accurate but requires async handling
  
  // Method 3: Use heuristics based on text length
  // If combined text is much longer than expected, extract last N characters
  // This is less reliable
  
  return combinedText; // Fallback: return as-is
}
```

### 4. Normalize Selections Between Events

```javascript
let beforeInputState = null;

element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertCompositionText') {
    const selection = window.getSelection();
    const range = selection && selection.rangeCount > 0 
      ? selection.getRangeAt(0).cloneRange() 
      : null;
    
    beforeInputState = {
      selection: normalizeSelection(range),
      data: e.data,
      domBefore: element.innerHTML,
      timestamp: Date.now()
    };
  }
});

element.addEventListener('input', (e) => {
  if (e.inputType === 'insertCompositionText' && beforeInputState) {
    const selection = window.getSelection();
    const range = selection && selection.rangeCount > 0 
      ? selection.getRangeAt(0).cloneRange() 
      : null;
    
    const inputSelection = normalizeSelection(range);
    
    // Compare normalized selections
    if (!selectionsMatch(beforeInputState.selection, inputSelection)) {
      // Handle mismatch
      handleSelectionMismatch(beforeInputState.selection, inputSelection);
    }
    
    beforeInputState = null;
  }
});

function normalizeSelection(range) {
  if (!range) return null;
  
  let container = range.startContainer;
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement;
  }
  
  const link = container.closest('a');
  if (link && range.startContainer === link) {
    // Adjust to position after link
    const normalized = document.createRange();
    try {
      normalized.setStartAfter(link);
      normalized.collapse(true);
      return normalized;
    } catch (e) {
      return range;
    }
  }
  
  return range.cloneRange();
}

function selectionsMatch(range1, range2) {
  if (!range1 || !range2) return false;
  
  return range1.startContainer === range2.startContainer &&
         range1.startOffset === range2.startOffset;
}
```

### 5. Compare DOM State to Determine Actual Changes

```javascript
let domState = null;

element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertCompositionText') {
    domState = {
      html: element.innerHTML,
      text: element.textContent,
      selection: window.getSelection()?.getRangeAt(0)?.cloneRange()
    };
  }
});

element.addEventListener('input', (e) => {
  if (e.inputType === 'insertCompositionText' && domState) {
    const domAfter = {
      html: element.innerHTML,
      text: element.textContent
    };
    
    // Compare to determine actual changes
    const actualChange = compareDOM(domState, domAfter);
    
    // Process based on actual changes
    handleActualChange(actualChange);
    
    domState = null;
  }
});

function compareDOM(before, after) {
  // Simple text-based comparison
  const beforeText = before.text;
  const afterText = after.text;
  
  // Find inserted text (simplified)
  if (afterText.length > beforeText.length) {
    const inserted = afterText.slice(beforeText.length);
    return { type: 'insert', text: inserted };
  }
  
  // More sophisticated comparison would use diff algorithms
  return { type: 'unknown' };
}
```

### 6. User Education

```javascript
// Detect Samsung keyboard and show warning
function detectSamsungKeyboard() {
  const ua = navigator.userAgent;
  return /Samsung/i.test(ua) && /Android/i.test(ua);
}

if (detectSamsungKeyboard()) {
  // Show optional warning to users
  showKeyboardWarning();
}

function showKeyboardWarning() {
  const warning = document.createElement('div');
  warning.className = 'keyboard-warning';
  warning.innerHTML = `
    <p>If you experience input issues, try disabling text prediction:</p>
    <p>Settings > General Management > Samsung Keyboard Settings > Predictive text OFF</p>
    <p>Or use an alternative keyboard like Gboard or SwiftKey.</p>
  `;
  // Add to UI
}
```

## Best Practices

1. **Always check `getTargetRanges()` availability**: Don't assume it will always return valid ranges
2. **Normalize selections**: Always normalize selection ranges to exclude adjacent link text when needed
3. **Store state between events**: Store DOM state and selection in `beforeinput` for use in `input`
4. **Compare DOM states**: When event data is unreliable, compare DOM before and after
5. **Handle gracefully**: Have fallback logic that doesn't depend on specific event properties
6. **Test with text prediction ON and OFF**: Ensure your editor works in both scenarios

## Related Cases

- `ce-0295`: insertCompositionText event and selection mismatch when typing next to a link with Samsung keyboard text prediction ON
- `ce-0290`: Samsung keyboard backspace crash
- General text prediction issues in `insertText` and `insertReplacementText` input types

## References

- [MDN: InputEvent.getTargetRanges()](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/getTargetRanges) - Official documentation
- [W3C Input Events Level 2 Specification](https://www.w3.org/TR/input-events-2/) - Official specification
- [W3C Input Events Level 1 Specification](https://www.w3.org/TR/2016/WD-input-events-20160928/) - Legacy specification
- [ProseMirror Discuss: Samsung keyboard within Android WebView causes spam of new lines](https://discuss.prosemirror.net/t/samsung-keyboard-within-android-webview-causes-a-spam-of-new-lines/5246) - Detailed discussion and workarounds
- [Chromium Code Review: Samsung Keyboard Backspace Handling](https://codereview.chromium.org/1126203013) - Related code review
