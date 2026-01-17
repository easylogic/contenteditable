---
id: scenario-code-block-editing
title: Code block editing behavior varies across browsers
description: "Editing text within code blocks (<pre><code>) in contenteditable elements behaves inconsistently across browsers. Line breaks, indentation, whitespace preservation, and formatting may be handled differently, making it difficult to maintain code formatting."
category: formatting
tags:
  - code
  - pre
  - whitespace
  - formatting
status: draft
locale: en
---

Editing text within code blocks (`<pre><code>`) in contenteditable elements behaves inconsistently across browsers. Line breaks, indentation, whitespace preservation, and formatting may be handled differently, making it difficult to maintain code formatting.

## Observed Behavior

### Scenario 1: Line breaks in code blocks
- **Chrome/Edge**: Line breaks may be preserved or converted to `<br>` tags
- **Firefox**: Similar behavior but may handle differently
- **Safari**: May not preserve line breaks correctly

### Scenario 2: Indentation and spaces
- **Chrome/Edge**: Multiple spaces may be collapsed despite `<pre>` tag
- **Firefox**: Similar whitespace handling issues
- **Safari**: Whitespace preservation inconsistent

### Scenario 3: Typing in code blocks
- **Chrome/Edge**: Text may be inserted but formatting may be lost
- **Firefox**: Similar issues
- **Safari**: Behavior varies

### Scenario 4: Pasting code into code blocks
- **Chrome/Edge**: May preserve or lose formatting
- **Firefox**: More likely to lose formatting
- **Safari**: Most inconsistent behavior

## Impact

- Difficulty maintaining code formatting
- Loss of indentation and whitespace
- Inconsistent code block editing experience
- Need for workarounds to preserve code structure

## Browser Comparison

- **Chrome/Edge**: Generally better code block handling
- **Firefox**: More likely to lose formatting
- **Safari**: Most inconsistent behavior

## Workaround

Implement custom code block handling:

```javascript
element.addEventListener('input', (e) => {
  const codeBlocks = element.querySelectorAll('pre code, code');
  codeBlocks.forEach(code => {
    // Preserve whitespace
    if (!code.style.whiteSpace) {
      code.style.whiteSpace = 'pre';
    }
    
    // Prevent formatting inside code
    code.addEventListener('beforeinput', (e) => {
      if (e.inputType.startsWith('format')) {
        e.preventDefault();
      }
    });
  });
});

// Handle paste in code blocks
element.addEventListener('paste', (e) => {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  const code = range.startContainer.closest('code, pre');
  
  if (code) {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    
    // Preserve whitespace and line breaks
    const lines = text.split('\n');
    const fragment = document.createDocumentFragment();
    
    lines.forEach((line, index) => {
      fragment.appendChild(document.createTextNode(line));
      if (index < lines.length - 1) {
        fragment.appendChild(document.createElement('br'));
      }
    });
    
    range.deleteContents();
    range.insertNode(fragment);
  }
});
```

## References

- [BomberBot: Preserving formatting with HTML pre tag](https://www.bomberbot.com/html/preserving-formatting-with-the-html-pre-tag/) - pre tag behavior
- [Stack Overflow: HTML newline char in div contenteditable](https://stackoverflow.com/questions/19038070/html-newline-char-in-div-content-editable) - white-space values
- [Stack Overflow: Dealing with line breaks on contenteditable div](https://stackoverflow.com/questions/6023307/dealing-with-line-breaks-on-contenteditable-div) - Enter key handling
- [Stack Overflow: Preserve whitespace indentation in pre tags](https://stackoverflow.com/questions/4631646/how-to-preserve-whitespace-indentation-of-text-enclosed-in-html-pre-tags-exclu) - Indentation issues
- [PrinceXML Forum: Preserving whitespace in pre code blocks](https://www.princexml.com/forum/topic/2949/preserving-whitespace-in-pre-code-blocks) - tab-size property
