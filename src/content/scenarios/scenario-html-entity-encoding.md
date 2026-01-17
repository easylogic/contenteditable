---
id: scenario-html-entity-encoding
title: HTML entity encoding and decoding is inconsistent
description: "Special characters in contenteditable elements may be encoded as HTML entities (&lt;, &gt;, &amp;, etc.) or decoded to their actual characters inconsistently across browsers. This can cause issues when copying, pasting, or serializing content."
category: formatting
tags:
  - html
  - entity
  - encoding
  - special-characters
status: draft
locale: en
---

Special characters in contenteditable elements may be encoded as HTML entities (`&lt;`, `&gt;`, `&amp;`, etc.) or decoded to their actual characters inconsistently across browsers. This can cause issues when copying, pasting, or serializing content.

## Observed Behavior

### Scenario 1: Typing special characters
- **Chrome/Edge**: Characters may be stored as entities or actual characters
- **Firefox**: Similar inconsistent behavior
- **Safari**: May encode/decode differently

### Scenario 2: Copying content with entities
- **Chrome/Edge**: May copy as entities or decoded characters
- **Firefox**: Similar behavior
- **Safari**: Encoding in clipboard varies

### Scenario 3: Pasting content with entities
- **Chrome/Edge**: May decode entities or preserve them
- **Firefox**: Similar behavior
- **Safari**: Entity handling inconsistent

### Scenario 4: Serializing content (innerHTML)
- **Chrome/Edge**: May encode or decode entities
- **Firefox**: Similar behavior
- **Safari**: Encoding behavior varies

## Impact

- Inconsistent character representation
- Issues when copying/pasting special characters
- Problems with content serialization
- Difficulty maintaining exact character representation

## Browser Comparison

- **Chrome/Edge**: Generally more consistent encoding
- **Firefox**: May encode/decode differently
- **Safari**: Most inconsistent behavior

## Workaround

Normalize entity encoding:

```javascript
function normalizeEntities(element) {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );
  
  let node;
  while (node = walker.nextNode()) {
    // Decode common entities to actual characters
    node.textContent = node.textContent
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }
}

// Normalize on input
element.addEventListener('input', () => {
  normalizeEntities(element);
});

// Handle paste
element.addEventListener('paste', (e) => {
  e.preventDefault();
  const text = e.clipboardData.getData('text/plain');
  const html = e.clipboardData.getData('text/html');
  
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    
    if (html) {
      // Decode entities in HTML
      const temp = document.createElement('div');
      temp.innerHTML = html;
      normalizeEntities(temp);
      range.insertNode(document.createRange().createContextualFragment(temp.innerHTML));
    } else {
      range.insertNode(document.createTextNode(text));
    }
  }
});
```

## References

- [CodeShack: HTML entity encoder decoder](https://codeshack.io/html-entity-encoder-decoder/) - Entity encoding basics
- [MiniWebTool: HTML entity encoder decoder](https://miniwebtool.com/html-entity-encoder-decoder/) - Entity reference
- [MDN: contenteditable global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable) - contenteditable documentation
- [XJavaScript: innerHTML without HTML encoding](https://www.xjavascript.com/blog/javascript-using-innerhtml-to-output-strings-without-html-encoded-special-characters/) - innerHTML handling
- [Drupal: Mercury editor entity encoding](https://www.drupal.org/project/mercury_editor_live_edit/issues/3502573) - Double encoding issues
- [GitHub Gist: HTML entity encoding](https://gist.github.com/yidas/797c9e6d5c856158cffd685b8a8b4ee4) - Encoding helpers
- [GitHub: he library](https://github.com/mathiasbynens/he) - Robust entity encoding library
- [CSS Script: HTML entity encoder](https://www.cssscript.com/encode-decode-html-entities/) - Entity libraries
