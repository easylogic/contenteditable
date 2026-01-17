---
id: ce-0546-samsung-text-prediction-link-adjacent-en
scenarioId: scenario-samsung-keyboard-text-prediction
locale: en
os: Android
osVersion: "10-14"
device: Mobile (Samsung Galaxy series)
deviceVersion: Any
browser: Chrome for Android
browserVersion: "120+"
keyboard: Korean (IME) - Samsung Keyboard with Text Prediction ON
caseTitle: insertCompositionText event and selection mismatch when typing next to a link with Samsung keyboard text prediction ON
description: "On Android Chrome with Samsung keyboard text prediction enabled, typing next to an anchor link causes both beforeinput and input events to fire as insertCompositionText. beforeinput's getTargetRanges() is missing, and the selection differs between beforeinput and input. beforeinput's selection includes the link text with different start/end positions, and event.data contains all characters combined instead of just the typed text."
tags:
  - samsung-keyboard
  - text-prediction
  - link
  - anchor
  - insertCompositionText
  - getTargetRanges
  - selection
  - android
  - chrome
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    <a href="https://example.com">Link text</a> Type here
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true"><a href="https://example.com">Link text</a> </div>'
    description: "Cursor positioned after a link"
  - label: "Step 1: Type text next to link"
    html: '<div contenteditable="true"><a href="https://example.com">Link text</a> Hello</div>'
    description: "Attempting to type 'Hello' next to link"
  - label: "beforeinput event (Bug)"
    html: '<div contenteditable="true"><a href="https://example.com">Link text</a> </div>'
    description: "beforeinput: inputType='insertCompositionText', getTargetRanges() missing, selection includes link text, data='LinktextHello' (combined)"
  - label: "input event (Bug)"
    html: '<div contenteditable="true"><a href="https://example.com">Link text</a> Hello</div>'
    description: "input: inputType='insertCompositionText', selection differs from beforeinput"
  - label: "✅ Expected"
    html: '<div contenteditable="true"><a href="https://example.com">Link text</a> Hello</div>'
    description: "Expected: beforeinput and input selections match, data contains only typed text"
---

## Phenomenon

On Android Chrome with Samsung keyboard text prediction enabled, typing next to an anchor link in a `contenteditable` element causes the following issues:

1. Both `beforeinput` and `input` events fire as `insertCompositionText`
2. `beforeinput`'s `getTargetRanges()` is missing (undefined or returns empty array)
3. The selection differs between `beforeinput` and `input`
4. `beforeinput`'s selection includes the anchor link text with different start/end positions
5. `event.data` contains all characters combined (not just the typed text)

## Reproduction example

1. Open Chrome browser on an Android device (Samsung Galaxy series, etc.).
2. Enable text prediction feature in Samsung keyboard.
3. Prepare HTML with an anchor link inside a `contenteditable` element (e.g., `<a href="https://example.com">Link text</a>`).
4. Position the cursor right next to (after) the anchor link.
5. Type text (e.g., "Hello").
6. Observe `beforeinput` and `input` events in the browser console or event log.

## Observed behavior

When typing text next to an anchor link:

1. **beforeinput event**:
   - `inputType: 'insertCompositionText'` (always)
   - `isComposing: true`
   - `getTargetRanges()` is missing (undefined or returns empty array)
   - `window.getSelection()` includes the anchor link text
   - Selection's start and end positions are in an unexpected format
   - `event.data` contains combined text including both link text and typed text (e.g., "LinktextHello")

2. **input event**:
   - `inputType: 'insertCompositionText'` (always)
   - `isComposing: true`
   - `window.getSelection()` differs from `beforeinput`'s selection
   - The typed text is correctly inserted into the DOM

3. **Result**:
   - Cannot use `getTargetRanges()` to determine exact insertion position
   - `beforeinput`'s selection information is inaccurate, causing event handlers to reference wrong positions
   - `event.data` contains combined text, making it difficult to accurately identify the typed text
   - Selection mismatch between `beforeinput` and `input` can cause state synchronization issues

## Expected behavior

- `beforeinput`'s `getTargetRanges()` should return the exact insertion position
- `beforeinput`'s selection should accurately reflect the actual cursor position
- `event.data` should contain only the typed text (not combined with link text)
- Selections in `beforeinput` and `input` should match
- Should fire with appropriate `inputType` instead of always `insertCompositionText` (for non-prediction typing)

## Impact

This can lead to:

- **Inaccurate insertion position detection**: Cannot determine exact insertion position without `getTargetRanges()`
- **Incorrect selection reference**: `beforeinput`'s selection is inaccurate, causing event handlers to reference wrong positions
- **Incorrect text extraction**: `event.data` contains combined text, making it difficult to accurately identify typed text
- **State synchronization issues**: Selection mismatch between `beforeinput` and `input` causes application state to be inconsistent with DOM state
- **Failure to handle link-adjacent input**: Difficulty in accurately processing input next to links

## Browser Comparison

- **Android Chrome + Samsung Keyboard (Text Prediction ON)**: This issue occurs
- **Android Chrome + Samsung Keyboard (Text Prediction OFF)**: Works normally
- **Android Chrome + Gboard**: Works normally
- **Android Chrome + SwiftKey**: Works normally
- **iOS Safari**: Different behavior pattern (text prediction works differently)

## Notes and possible direction for workarounds

- **getTargetRanges() alternative**: When `getTargetRanges()` is missing, use `window.getSelection()` but verify actual cursor position is not inside link:
  ```javascript
  element.addEventListener('beforeinput', (e) => {
    if (e.inputType === 'insertCompositionText') {
      const targetRanges = e.getTargetRanges?.() || [];
      
      if (targetRanges.length === 0) {
        // Alternative when getTargetRanges() is missing
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0).cloneRange();
          
          // Verify actual cursor position is not inside link
          let container = range.startContainer;
          if (container.nodeType === Node.TEXT_NODE) {
            container = container.parentElement;
          }
          
          // Find position outside link element
          const link = container.closest('a');
          if (link) {
            // Adjust to position after link
            const afterLink = document.createRange();
            afterLink.setStartAfter(link);
            afterLink.collapse(true);
            // Use afterLink for processing
          } else {
            // Use range as-is
          }
        }
      } else {
        // Use targetRanges
      }
    }
  });
  ```

- **event.data sanitization**: Extract only the actually typed text from combined text:
  ```javascript
  element.addEventListener('beforeinput', (e) => {
    if (e.inputType === 'insertCompositionText' && e.data) {
      // Determine actual text to be inserted by checking DOM state
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const beforeText = getTextBeforeCursor(range);
        const afterText = getTextAfterCursor(range);
        
        // Extract actually typed text from event.data
        // (Implementation may require DOM state comparison)
      }
    }
  });
  ```

- **Selection normalization**: Normalize selections in `beforeinput` and `input` to match:
  ```javascript
  let beforeInputSelection = null;
  
  element.addEventListener('beforeinput', (e) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      beforeInputSelection = normalizeSelection(selection.getRangeAt(0));
    }
  });
  
  element.addEventListener('input', (e) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const inputSelection = normalizeSelection(selection.getRangeAt(0));
      
      // Compare beforeInputSelection and inputSelection
      if (!selectionsMatch(beforeInputSelection, inputSelection)) {
        // Handle mismatch
        handleSelectionMismatch(beforeInputSelection, inputSelection);
      }
    }
    beforeInputSelection = null;
  });
  
  function normalizeSelection(range) {
    // Normalize to actual cursor position outside link
    let container = range.startContainer;
    if (container.nodeType === Node.TEXT_NODE) {
      container = container.parentElement;
    }
    
    const link = container.closest('a');
    if (link && range.startContainer === link) {
      // Adjust to position after link
      const normalized = document.createRange();
      normalized.setStartAfter(link);
      normalized.collapse(true);
      return normalized;
    }
    
    return range.cloneRange();
  }
  ```

- **DOM state comparison**: Store DOM state at `beforeinput` and compare with `input` to identify actual changes:
  ```javascript
  let domBefore = null;
  let selectionBefore = null;
  
  element.addEventListener('beforeinput', (e) => {
    if (e.inputType === 'insertCompositionText') {
      domBefore = element.innerHTML;
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        selectionBefore = selection.getRangeAt(0).cloneRange();
      }
    }
  });
  
  element.addEventListener('input', (e) => {
    if (e.inputType === 'insertCompositionText') {
      const domAfter = element.innerHTML;
      const actualChange = compareDOM(domBefore, domAfter, selectionBefore);
      // Process based on actual changes
      handleActualChange(actualChange);
    }
    domBefore = null;
    selectionBefore = null;
  });
  ```

- **Text prediction detection and handling**: Detect when text prediction is active and apply special handling:
  ```javascript
  let isTextPredictionActive = false;
  
  // Detect text prediction activation (via user agent or event pattern)
  function detectTextPrediction() {
    // Detect pattern where insertCompositionText always fires
    // Or check user agent
    const ua = navigator.userAgent;
    return /Samsung/i.test(ua) && /Android/i.test(ua);
  }
  
  element.addEventListener('beforeinput', (e) => {
    if (e.inputType === 'insertCompositionText' && detectTextPrediction()) {
      isTextPredictionActive = true;
      // Special handling for text prediction
      handleTextPredictionInput(e);
    }
  });
  ```

## Code example

```javascript
const editor = document.querySelector('div[contenteditable]');
let beforeInputState = null;

editor.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertCompositionText') {
    // Store state at beforeinput
    const selection = window.getSelection();
    const range = selection && selection.rangeCount > 0 
      ? selection.getRangeAt(0).cloneRange() 
      : null;
    
    beforeInputState = {
      targetRanges: e.getTargetRanges?.() || [],
      selection: range,
      data: e.data,
      domBefore: editor.innerHTML,
      timestamp: Date.now()
    };
    
    // Alternative handling when getTargetRanges() is missing
    if (beforeInputState.targetRanges.length === 0 && range) {
      // Check and normalize link-adjacent position
      const normalizedRange = normalizeRangeForLinkAdjacent(range);
      beforeInputState.normalizedRange = normalizedRange;
    }
    
    // Sanitize event.data (extract actual typed text from combined text)
    if (e.data) {
      const actualInputText = extractActualInputText(e.data, range);
      beforeInputState.actualInputText = actualInputText;
    }
  }
});

editor.addEventListener('input', (e) => {
  if (e.inputType === 'insertCompositionText' && beforeInputState) {
    const selection = window.getSelection();
    const range = selection && selection.rangeCount > 0 
      ? selection.getRangeAt(0).cloneRange() 
      : null;
    
    // Compare selections between beforeinput and input
    if (range && beforeInputState.selection) {
      const selectionsMatch = compareSelections(
        beforeInputState.selection, 
        range
      );
      
      if (!selectionsMatch) {
        console.warn('Selection mismatch between beforeinput and input');
        // Handle mismatch
      }
    }
    
    // Verify actual DOM changes
    const domAfter = editor.innerHTML;
    const actualChange = compareDOM(
      beforeInputState.domBefore, 
      domAfter, 
      beforeInputState.normalizedRange || beforeInputState.selection
    );
    
    // Process based on actual changes
    handleCompositionInput(actualChange, beforeInputState);
    
    beforeInputState = null;
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
      // No text node may exist after link
      return range;
    }
  }
  
  return range;
}

function extractActualInputText(combinedText, range) {
  // Extract only the actually typed text from combined text
  // This may require DOM state comparison
  // Simple example: remove link text (actual implementation needs more sophisticated logic)
  const link = range?.startContainer?.parentElement?.closest('a');
  if (link && combinedText.startsWith(link.textContent)) {
    return combinedText.slice(link.textContent.length);
  }
  return combinedText;
}

function compareSelections(range1, range2) {
  if (!range1 || !range2) return false;
  
  const pos1 = {
    container: range1.startContainer,
    offset: range1.startOffset
  };
  const pos2 = {
    container: range2.startContainer,
    offset: range2.startOffset
  };
  
  return pos1.container === pos2.container && pos1.offset === pos2.offset;
}

function compareDOM(domBefore, domAfter, range) {
  // Analyze DOM changes
  // Actual implementation may be more complex
  return {
    inserted: extractInsertedText(domBefore, domAfter, range),
    deleted: extractDeletedText(domBefore, domAfter, range)
  };
}

function handleCompositionInput(actualChange, beforeInputState) {
  // Process based on actual changes
  console.log('Actual change:', actualChange);
  console.log('Input text:', beforeInputState.actualInputText);
  // Update editor state, manage undo/redo stack, etc.
}
```

## Related Issues and References

### Web Standards and Documentation

- **MDN: InputEvent.getTargetRanges()**: https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/getTargetRanges
  - `getTargetRanges()` is an experimental technology that works in `contenteditable` elements but returns empty arrays for `<input>` and `<textarea>` elements
  - Supported in Chrome 60+ but may return empty arrays in certain scenarios on Android Chrome

- **W3C Input Events Specification**: https://www.w3.org/TR/2016/WD-input-events-20160928/
  - `insertCompositionText` events are non-cancelable and may fire multiple times during IME composition

### Known Issues

1. **getTargetRanges() Empty Array Issue**
   - Reported issue in Chrome 77 where `getTargetRanges()` consistently returned empty arrays
   - Stack Overflow: https://stackoverflow.com/questions/58892747/inputevent-gettargetranges-always-empty
   - Particularly occurs with `insertCompositionText` events on Android Chrome

2. **Samsung Keyboard and contenteditable Compatibility Issues**
   - Substance Editor issue: Key events don't work correctly with Samsung keyboard on Android Chrome
     - GitHub: https://github.com/substance/substance/issues/982
   - Obsidian community: Cursor positioning issues with Samsung keyboard text prediction
     - Forum: https://forum.obsidian.md/t/cursor-ends-up-before-the-letter-on-android-samsung-keyboard/78185

3. **Chromium Code Reviews - Samsung Keyboard Related**
   - Backspace keycode handling: Samsung keyboard sends backspace key events during composition
     - Code Review: https://codereview.chromium.org/1126203013
   - IME Adapter selection updates: Improvements to prevent redundant updates
     - Code Review: https://codereview.chromium.org/13105005/patch/4003/6002

4. **insertCompositionText Handling Issues on Android**
   - Unexpected text insertion on focus change
   - Enter and Backspace keys triggering `insertCompositionText` events
   - Medium Article: https://pubuzhixing.medium.com/web-rich-text-editor-compatible-with-android-device-input-c26d4ba57058

5. **Link Selection Issues in contenteditable**
   - Anchor tags included in selection when selecting text containing links
   - contenteditable focus issues on Android
   - Ionic Forum: https://forum.ionicframework.com/t/cant-focus-into-contenteditable-on-android-when-setting-html-content/8704

### React and Framework Issues

- **React beforeinput Event Support**: `beforeinput` event not supported in Firefox before version 87
  - GitHub: https://github.com/facebook/react/issues/11211

### Solutions and Recommendations

1. **Guide Users to Disable Text Prediction**
   - Instruct users to disable text prediction in Samsung keyboard settings
   - Settings > General Management > Samsung Keyboard Settings > Predictive text OFF

2. **Recommend Alternative Keyboards**
   - Suggest using alternative keyboards like Gboard or Microsoft SwiftKey

3. **Feature Detection and Fallback Implementation**
   - Detect `getTargetRanges()` availability before use
   - Use `window.getSelection()` when empty array is returned
   - Determine actual changes through DOM state comparison
