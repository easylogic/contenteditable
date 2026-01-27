---
id: scenario-content-normalization
title: "Content Normalization: Paste, Whitespace, and Entities"
description: "Technical guide for ensuring predictable DOM output after external interactions like pasting and drag-drop."
category: "paste"
tags: ["paste", "normalization", "whitespace", "nbsp", "plaintext-only"]
status: "confirmed"
locale: "en"
---

## Overview
Incoming content from the clipboard or external drags is inherently "dirty." Modern browsers provide `plaintext-only` modes, but internal normalization logic varies wildly regarding whitespace collapsing and HTML entities.

## Critical Normalization Patterns

### 1. The 'nbsp' Infection
Chromium (especially v121) often converts standard U+0020 spaces into non-breaking spaces (`&nbsp;`) during pastes to preserve indentation.
- **Problem**: This prevents natural line-wrapping in narrow containers, breaking responsive design.

### 2. Trailing Whitespace Stripping
Firefox historically trims trailing whitespaces at the end of a block upon pasting or Enter, which can break code formatting or precise text alignment.
- **Solution**: Use `white-space: pre-wrap` or `-moz-pre-space` to force the engine to respect the tail.

### 3. Native vs programmatic insertion
Using `document.execCommand('insertText')` often produces different DOM structures (e.g., `<br>` tags) compared to native `contenteditable="plaintext-only"` behavior (which might use `<div>` separators).

## Recommended Sanitization Pipeline

```javascript
/* Standard Normalization Hook */
element.addEventListener('paste', (e) => {
    // 1. Intercept to enforce plain text if needed
    if (editorMode === 'plain') {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        
        // 2. Immediate Sanitization (Enforce U+0020)
        const cleanText = text.replace(/\u00A0/g, ' ');
        
        // 3. Normalized Insertion
        insertAtCaret(cleanText);
    }
});
```

## Related Cases
- [ce-0572: plaintext-only paste leaves trailing &nbsp;](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0572-plaintext-only-nbsp-layout-broken.md)
- [ce-0302: firefox trailing whitespace paste](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0302-firefox-trailing-whitespace-paste-en-ko.md)
---
id: scenario-content-normalization
title: "Content Normalization: Paste, Whitespace, and Entities"
description: "Technical guide for ensuring predictable DOM output after external interactions like pasting and drag-drop."
category: "paste"
tags: ["paste", "normalization", "whitespace", "nbsp", "plaintext-only"]
status: "confirmed"
locale: "en"
---

## Overview
Incoming content from the clipboard or external drags is inherently "dirty." Modern browsers provide `plaintext-only` modes, but internal normalization logic varies wildly regarding whitespace collapsing and HTML entities.

## Critical Normalization Patterns

### 1. The 'nbsp' Infection
Chromium (especially v121) often converts standard U+0020 spaces into non-breaking spaces (`&nbsp;`) during pastes to preserve indentation.
- **Problem**: This prevents natural line-wrapping in narrow containers, breaking responsive design.

### 2. Trailing Whitespace Stripping
Firefox historically trims trailing whitespaces at the end of a block upon pasting or Enter, which can break code formatting or precise text alignment.
- **Solution**: Use `white-space: pre-wrap` or `-moz-pre-space` to force the engine to respect the tail.

### 3. Native vs programmatic insertion
Using `document.execCommand('insertText')` often produces different DOM structures (e.g., `<br>` tags) compared to native `contenteditable="plaintext-only"` behavior (which might use `<div>` separators).

## Recommended Sanitization Pipeline

```javascript
/* Standard Normalization Hook */
element.addEventListener('paste', (e) => {
    // 1. Intercept to enforce plain text if needed
    if (editorMode === 'plain') {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        
        // 2. Immediate Sanitization (Enforce U+0020)
        const cleanText = text.replace(/\u00A0/g, ' ');
        
        // 3. Normalized Insertion
        insertAtCaret(cleanText);
    }
});
```

## Related Cases
- [ce-0572: plaintext-only paste leaves trailing &nbsp;](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0572-plaintext-only-nbsp-layout-broken.md)
- [ce-0302: firefox trailing whitespace paste](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0302-firefox-trailing-whitespace-paste-en-ko.md)
