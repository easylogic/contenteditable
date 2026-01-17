---
id: scenario-paste-link-behavior
title: Link pasting behavior differs across browsers
description: "When pasting links into contenteditable elements, different browsers handle the link data differently. Some browsers paste only the URL, while others preserve the link title and HTML structure."
category: paste
tags:
  - paste
  - link
  - clipboard
  - url
status: draft
locale: en
---

When pasting links into `contenteditable` elements, different browsers handle the link data differently. Some browsers paste only the URL, while others preserve the link title and HTML structure.

## Observed Behavior

1. **URL only**: Some browsers paste only the URL as plain text
2. **Link structure lost**: Link title and HTML structure are not preserved
3. **Inconsistent behavior**: Different browsers handle link pasting differently
4. **Context loss**: Important link context (title) is lost

## Browser Comparison

- **Safari**: Only URL is pasted (this issue)
- **Chrome**: Link with title and URL is pasted correctly
- **Firefox**: Link with title and URL is pasted correctly
- **Edge**: Link with title and URL is pasted correctly

## Impact

- **Loss of context**: Link titles provide important context that is lost
- **Manual work**: Users must manually recreate links with titles
- **Inconsistent behavior**: Different from other browsers, causing confusion
- **User frustration**: Users expect links to be pasted with titles

## Workarounds

### Clipboard API

Use Clipboard API to read link data and manually create link elements:

```javascript
editor.addEventListener('paste', async (e) => {
  e.preventDefault();
  
  const clipboardData = e.clipboardData || window.clipboardData;
  const pastedText = clipboardData.getData('text/plain');
  
  // Check if pasted text is a URL
  const urlPattern = /^https?:\/\/.+/;
  if (urlPattern.test(pastedText.trim())) {
    // Try to get link title from clipboard
    let linkTitle = pastedText;
    
    try {
      const htmlData = clipboardData.getData('text/html');
      if (htmlData) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlData, 'text/html');
        const link = doc.querySelector('a');
        if (link) {
          linkTitle = link.textContent || link.href;
        }
      }
    } catch (err) {
      // Fallback to URL
    }
    
    // Create link element
    const link = document.createElement('a');
    link.href = pastedText.trim();
    link.textContent = linkTitle;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // Insert link at cursor position
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(link);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
});
```

### Fallback detection

Detect plain URL pastes and convert them to links:

```javascript
function isUrl(text) {
  const urlPattern = /^https?:\/\/.+/;
  return urlPattern.test(text.trim());
}

function convertUrlToLink(url) {
  const link = document.createElement('a');
  link.href = url;
  link.textContent = url;
  return link;
}
```

## References

- [Orion Feedback: Copy link HTML format](https://orionfeedback.org/d/2730-right-click-copy-link-appears-to-copy-link-in-an-html-format-rather-than-copying-the-link-as-text) - Link copy behavior
- [Apple Stack Exchange: Copy URL and page title](https://apple.stackexchange.com/questions/63765/can-safari-copy-both-the-url-and-page-title-during-a-drag-and-drop) - Drag and drop link behavior
- [Reddit: Safari copy link behavior](https://www.reddit.com/r/narwhalapp/comments/1imh2j0) - iOS link copying
- [Reddit: Safari URL only paste](https://www.reddit.com//r/Safari/comments/1c5wtge) - URL paste solutions
- [Stack Overflow: Force browser to paste URL and not page title](https://stackoverflow.com/questions/67560944/how-to-force-browser-to-paste-url-and-not-page-title-in-edge) - Paste handling