---
id: ce-0549-typing-adjacent-formatted-elements-en
scenarioId: scenario-typing-adjacent-formatted-elements
locale: en
os: Android
osVersion: "10-14"
device: Mobile (Samsung Galaxy series)
deviceVersion: Any
browser: Chrome for Android
browserVersion: "120+"
keyboard: Korean (IME) - Samsung Keyboard with Text Prediction ON
caseTitle: event.data contains combined text when typing adjacent to formatted elements
description: "On Android Chrome with Samsung keyboard text prediction enabled, typing text next to formatted elements like links or bold text causes beforeinput event's event.data to contain both the formatted element's text and the typed text combined."
tags:
  - formatting
  - link
  - bold
  - event.data
  - beforeinput
  - samsung-keyboard
  - text-prediction
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
    description: "Cursor positioned after link"
  - label: "beforeinput event (Bug)"
    html: '<div contenteditable="true"><a href="https://example.com">Link text</a> </div>'
    description: "beforeinput: event.data='LinktextHello' (combined), difficult to extract only typed text"
  - label: "input event"
    html: '<div contenteditable="true"><a href="https://example.com">Link text</a> Hello</div>'
    description: "input: Text is inserted correctly but event.data is combined"
  - label: "✅ Expected"
    html: '<div contenteditable="true"><a href="https://example.com">Link text</a> Hello</div>'
    description: "Expected: event.data should contain only typed text ('Hello')"
---

## Phenomenon

On Android Chrome with Samsung keyboard text prediction enabled, typing text next to formatted elements like links or bold text in a `contenteditable` element causes `beforeinput` event's `event.data` to contain both the formatted element's text and the typed text combined.

## Reproduction example

1. Open Chrome browser on an Android device (Samsung Galaxy series, etc.).
2. Enable text prediction feature in Samsung keyboard.
3. Prepare HTML with a link or bold text inside a `contenteditable` element (e.g., `<a href="https://example.com">Link text</a>` or `<strong>Bold text</strong>`).
4. Position the cursor right next to (after) the formatted element.
5. Type text (e.g., "Hello").
6. Check `beforeinput` event's `event.data` in the browser console.

## Observed behavior

When typing text next to formatted elements:

1. **beforeinput event**:
   - `e.data` contains both formatted element's text and typed text combined
   - Example: If link text is "Link text" and user types "Hello", `e.data === 'LinktextHello'`
   - Difficult to extract only the typed text

2. **Result**:
   - Cannot accurately determine the actual typed text from `event.data`
   - Text extraction logic may fail
   - Change tracking systems may record incorrect changes

## Expected behavior

- `event.data` should contain only the typed text
- Formatted element's text should not be included
- Example: Typing "Hello" should result in `e.data === 'Hello'`

## Impact

- **Incorrect text extraction**: Cannot extract only the typed text from `event.data`
- **Change tracking failure**: Change tracking systems record incorrect changes
- **Undo/redo problems**: Undo/redo stacks may record incorrect text

## Browser Comparison

- **Android Chrome + Samsung Keyboard (Text Prediction ON)**: This issue occurs
- **Android Chrome + Samsung Keyboard (Text Prediction OFF)**: Works normally
- **Android Chrome + Gboard**: Works normally
- **Other browsers**: Similar issues may occur with other text prediction features

## Notes and possible direction for workarounds

- **Compare DOM state**: When `event.data` is unreliable, compare DOM state to determine actual changes
- **Text extraction logic**: Implement logic to extract only the typed text from combined text
- **Check adjacent elements**: Check and remove adjacent formatted element's text

## Code example

```javascript
const editor = document.querySelector('div[contenteditable]');

editor.addEventListener('beforeinput', (e) => {
  if (e.data) {
    const selection = window.getSelection();
    const range = selection?.rangeCount > 0 
      ? selection.getRangeAt(0) 
      : null;
    
    // Find adjacent formatted element
    let container = range?.startContainer;
    if (container?.nodeType === Node.TEXT_NODE) {
      container = container.parentElement;
    }
    
    const link = container?.closest('a');
    const bold = container?.closest('b, strong');
    const italic = container?.closest('i, em');
    const formattedElement = link || bold || italic;
    
    if (formattedElement) {
      // Extract actual input text from combined text
      const actualInputText = extractActualInputText(
        e.data, 
        formattedElement
      );
      
      // Process with actual input text
      handleInput(actualInputText, range);
    } else {
      // No formatted element, use e.data as-is
      handleInput(e.data, range);
    }
  }
});

function extractActualInputText(combinedData, formattedElement) {
  if (!formattedElement || !combinedData) {
    return combinedData;
  }
  
  const formattedText = formattedElement.textContent;
  
  // Check if combined data starts with formatted text
  if (combinedData.startsWith(formattedText)) {
    return combinedData.slice(formattedText.length);
  }
  
  // Check if combined data ends with formatted text
  if (combinedData.endsWith(formattedText)) {
    return combinedData.slice(0, -formattedText.length);
  }
  
  // Fallback: return as-is
  return combinedData;
}
```
