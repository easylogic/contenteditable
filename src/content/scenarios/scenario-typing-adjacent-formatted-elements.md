---
id: scenario-typing-adjacent-formatted-elements
title: Typing adjacent to formatted elements causes unexpected behavior
description: "When typing text next to formatted elements (links, bold, italic, etc.) in contenteditable, the input events may include the formatted element's text in event.data, selection ranges may include the formatted element, and text may be inserted into the formatted element instead of after it. This occurs across different browsers and input methods."
category: formatting
tags:
  - formatting
  - link
  - anchor
  - bold
  - italic
  - selection
  - event.data
  - beforeinput
  - input
status: draft
locale: en
---

When typing text next to formatted elements (links, bold, italic, etc.) in `contenteditable`, the input events may include the formatted element's text in `event.data`, selection ranges may include the formatted element, and text may be inserted into the formatted element instead of after it. This occurs across different browsers and input methods.

## Problem Overview

When users type text immediately after formatted elements like links, bold text, or italic text, several issues can occur:

1. **Combined `event.data`**: `event.data` contains both the formatted element's text and the newly typed text
2. **Selection includes formatted element**: Selection ranges include the formatted element instead of just the insertion point
3. **Text inserted into formatted element**: Text may be inserted inside the formatted element instead of after it
4. **Incorrect formatting inheritance**: Newly typed text may inherit formatting from adjacent elements

## Observed Behavior

### Scenario 1: Typing Next to Links

When typing after an anchor link:

```html
<div contenteditable="true">
  <a href="https://example.com">Link text</a> [cursor here]
</div>
```

```javascript
element.addEventListener('beforeinput', (e) => {
  // Expected: e.data === 'Hello'
  // Actual: e.data === 'LinktextHello' (combined)
  
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  // range.startContainer may be the <a> element
  // range includes link text
});
```

### Scenario 2: Typing Next to Bold Text

When typing after bold text:

```html
<div contenteditable="true">
  <strong>Bold text</strong> [cursor here]
</div>
```

```javascript
element.addEventListener('beforeinput', (e) => {
  // event.data may include 'Bold text' + typed text
  // Selection may include the <strong> element
});
```

### Scenario 3: Typing Next to Italic Text

When typing after italic text:

```html
<div contenteditable="true">
  <em>Italic text</em> [cursor here]
</div>
```

Similar issues occur as with bold text and links.

## Impact

- **Incorrect text extraction**: Cannot extract only the typed text from `event.data`
- **Wrong insertion position**: Text may be inserted at wrong location
- **Formatting corruption**: Formatted elements may be corrupted or nested incorrectly
- **Selection tracking issues**: Selection ranges don't accurately represent cursor position
- **Undo/redo problems**: Undo/redo stacks may record incorrect operations

## Browser Comparison

- **Chrome/Edge**: Generally better behavior, but issues can occur with text prediction or IME
- **Firefox**: May have more frequent issues with formatted elements
- **Safari**: Behavior can be inconsistent, especially on iOS
- **Android Chrome**: Higher likelihood of issues, especially with Samsung keyboard text prediction

## Workarounds

### 1. Normalize Selection to Exclude Formatted Elements

```javascript
function normalizeSelectionForFormattedElements(range) {
  if (!range) return null;
  
  let container = range.startContainer;
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement;
  }
  
  // Check if inside or at boundary of formatted element
  const link = container.closest('a');
  const bold = container.closest('b, strong');
  const italic = container.closest('i, em');
  const formattedElement = link || bold || italic;
  
  if (formattedElement) {
    // If selection is inside formatted element and at end, move after
    if (range.collapsed) {
      if (range.startContainer === formattedElement) {
        // Selection is the formatted element itself
        const normalized = document.createRange();
        try {
          normalized.setStartAfter(formattedElement);
          normalized.collapse(true);
          return normalized;
        } catch (e) {
          return range;
        }
      }
      
      // Check if at end of formatted element's text
      const textNode = range.startContainer;
      if (textNode.nodeType === Node.TEXT_NODE) {
        const parent = textNode.parentElement;
        if (parent === formattedElement && 
            range.startOffset === textNode.textContent.length) {
          // At end of formatted element's text, move after
          const normalized = document.createRange();
          try {
            normalized.setStartAfter(formattedElement);
            normalized.collapse(true);
            return normalized;
          } catch (e) {
            return range;
          }
        }
      }
    }
  }
  
  return range.cloneRange();
}

element.addEventListener('beforeinput', (e) => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const normalized = normalizeSelectionForFormattedElements(range);
    // Use normalized range
  }
});
```

### 2. Extract Actual Input Text from Combined Data

```javascript
function extractActualInputText(combinedData, range, formattedElement) {
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
  
  // If formatted text is in the middle, try to extract
  const index = combinedData.indexOf(formattedText);
  if (index > 0) {
    // Text before formatted text is the actual input
    return combinedData.slice(0, index);
  }
  
  // Fallback: return as-is
  return combinedData;
}

element.addEventListener('beforeinput', (e) => {
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
      const actualInputText = extractActualInputText(
        e.data, 
        range, 
        formattedElement
      );
      // Use actualInputText instead of e.data
      handleInput(actualInputText, range);
    } else {
      // No formatted element, use e.data as-is
      handleInput(e.data, range);
    }
  }
});
```

### 3. Ensure Text is Inserted After Formatted Element

```javascript
function ensureInsertionAfterFormattedElement(range, text) {
  let container = range.startContainer;
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement;
  }
  
  const link = container.closest('a');
  const bold = container.closest('b, strong');
  const italic = container.closest('i, em');
  const formattedElement = link || bold || italic;
  
  if (formattedElement) {
    // Find or create text node after formatted element
    let afterElement = formattedElement.nextSibling;
    
    // Look for text node
    while (afterElement && afterElement.nodeType !== Node.TEXT_NODE) {
      afterElement = afterElement.nextSibling;
    }
    
    if (afterElement) {
      // Append to existing text node
      afterElement.textContent += text;
      
      // Move cursor to end
      const newRange = document.createRange();
      newRange.setStart(afterElement, afterElement.textContent.length);
      newRange.collapse(true);
      
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      // Create new text node after formatted element
      const textNode = document.createTextNode(text);
      formattedElement.parentNode.insertBefore(textNode, formattedElement.nextSibling);
      
      // Move cursor to end
      const newRange = document.createRange();
      newRange.setStart(textNode, textNode.textContent.length);
      newRange.collapse(true);
      
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  } else {
    // No formatted element, insert normally
    range.insertNode(document.createTextNode(text));
  }
}

element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertText' && e.data) {
    e.preventDefault();
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      ensureInsertionAfterFormattedElement(range, e.data);
    }
  }
});
```

### 4. Compare DOM State to Determine Actual Changes

```javascript
let domState = null;

element.addEventListener('beforeinput', (e) => {
  // Store DOM state before input
  domState = {
    html: element.innerHTML,
    text: element.textContent,
    selection: window.getSelection()?.getRangeAt(0)?.cloneRange()
  };
});

element.addEventListener('input', (e) => {
  if (domState) {
    const domAfter = {
      html: element.innerHTML,
      text: element.textContent
    };
    
    // Compare to find actual inserted text
    const actualInserted = findInsertedText(domState, domAfter);
    
    // Process with actual inserted text
    handleInput(actualInserted);
    
    domState = null;
  }
});

function findInsertedText(before, after) {
  // Simple text-based comparison
  // More sophisticated implementations would use diff algorithms
  
  const beforeText = before.text;
  const afterText = after.text;
  
  if (afterText.length > beforeText.length) {
    // Find where text was inserted
    let start = 0;
    while (start < beforeText.length && 
           beforeText[start] === afterText[start]) {
      start++;
    }
    
    // Find end of inserted text
    let end = afterText.length;
    let beforeEnd = beforeText.length;
    while (end > start && beforeEnd > start &&
           beforeText[beforeEnd - 1] === afterText[end - 1]) {
      end--;
      beforeEnd--;
    }
    
    return afterText.slice(start, end);
  }
  
  return '';
}
```

### 5. Prevent Text from Being Inserted into Formatted Elements

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertText' && e.data) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // Check if selection is inside formatted element
      let container = range.startContainer;
      if (container.nodeType === Node.TEXT_NODE) {
        container = container.parentElement;
      }
      
      const link = container.closest('a');
      const bold = container.closest('b, strong');
      const italic = container.closest('i, em');
      
      if (link || bold || italic) {
        // Prevent default and insert after formatted element
        e.preventDefault();
        
        const formattedElement = link || bold || italic;
        insertTextAfterElement(formattedElement, e.data);
      }
    }
  }
});

function insertTextAfterElement(element, text) {
  // Find or create text node after element
  let afterNode = element.nextSibling;
  
  while (afterNode && afterNode.nodeType !== Node.TEXT_NODE) {
    afterNode = afterNode.nextSibling;
  }
  
  if (afterNode) {
    afterNode.textContent += text;
    
    // Move cursor
    const range = document.createRange();
    range.setStart(afterNode, afterNode.textContent.length);
    range.collapse(true);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    // Create new text node
    const textNode = document.createTextNode(text);
    element.parentNode.insertBefore(textNode, element.nextSibling);
    
    // Move cursor
    const range = document.createRange();
    range.setStart(textNode, textNode.textContent.length);
    range.collapse(true);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
```

## Best Practices

1. **Normalize selections**: Always normalize selection ranges to exclude formatted elements when appropriate
2. **Extract actual input**: When `event.data` includes formatted text, extract only the typed text
3. **Prevent insertion into formatted elements**: Ensure text is inserted after formatted elements, not inside them
4. **Compare DOM state**: When event data is unreliable, compare DOM before and after to find actual changes
5. **Handle gracefully**: Have fallback logic that doesn't depend on specific event properties
6. **Test with different formatted elements**: Test with links, bold, italic, and other formatting
7. **Test across browsers**: Behavior varies significantly by browser and input method

## Related Cases

- `ce-0295`: insertCompositionText event and selection mismatch when typing next to a link with Samsung keyboard text prediction ON
- General issues with formatting and text insertion

## References

- [MDN: Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection) - Official documentation
- [MDN: Range API](https://developer.mozilla.org/en-US/docs/Web/API/Range) - Official documentation
- [W3C Input Events Level 2 Specification](https://www.w3.org/TR/input-events-2/) - Official specification
- [W3C Input Events Level 1 Specification](https://www.w3.org/TR/2016/WD-input-events-20160928/) - Legacy specification
