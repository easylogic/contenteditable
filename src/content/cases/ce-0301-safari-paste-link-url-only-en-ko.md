---
id: ce-0301-safari-paste-link-url-only-en-ko
scenarioId: scenario-paste-link-behavior
locale: ko
os: macOS
osVersion: "13-14"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "16+"
keyboard: US QWERTY
caseTitle: Pasting link from right-click context menu pastes only URL in Safari
description: "In Safari, copying a link via right-click and then pasting it into a contenteditable area may result in only the URL being pasted, without the link's title or other associated HTML. This behavior contrasts with Chrome and Firefox."
tags:
  - paste
  - link
  - safari
  - clipboard
  - url
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    <p>Paste link here</p>
  </div>
domSteps:
  - label: "Before paste"
    html: '<div contenteditable="true"><p>Paste link here</p></div>'
    description: "Empty contenteditable area"
  - label: "After paste (Bug)"
    html: '<div contenteditable="true"><p>Paste link here https://example.com</p></div>'
    description: "Only URL is pasted as plain text, no link formatting"
  - label: "✅ Expected"
    html: '<div contenteditable="true"><p>Paste link here <a href="https://example.com">Link Title</a></p></div>'
    description: "Expected: Link should be pasted with title and href"
---

## Phenomenon

In Safari, copying a link via right-click and then pasting it into a `contenteditable` area may result in only the URL being pasted, without the link's title or other associated HTML. This behavior contrasts with Chrome and Firefox, where both the link's title and URL are typically preserved.

## Reproduction example

1. Open Safari browser on macOS.
2. Right-click on a link on any webpage and select "Copy Link".
3. Focus a `contenteditable` element.
4. Paste the link (Cmd+V).
5. Observe that only the URL is pasted as plain text.

## Observed behavior

- Only the URL is pasted as plain text
- Link title is lost
- No HTML link structure is created
- Link formatting is not preserved

## Expected behavior

- Link should be pasted with both title and URL
- HTML `<a>` element should be created with proper `href` attribute
- Link formatting should be preserved
- Behavior should be consistent with other browsers

## Impact

- **Loss of context**: Link titles provide important context that is lost
- **Manual work**: Users must manually recreate links with titles
- **Inconsistent behavior**: Different from other browsers, causing confusion

## Browser Comparison

- **Safari**: Only URL is pasted (this issue)
- **Chrome**: Link with title and URL is pasted correctly
- **Firefox**: Link with title and URL is pasted correctly
- **Edge**: Link with title and URL is pasted correctly

## Notes and possible direction for workarounds

- **Clipboard API**: Use Clipboard API to read link data and manually create link elements
- **Paste event handling**: Intercept paste events and reconstruct links from clipboard data
- **Fallback detection**: Detect plain URL pastes and convert them to links

## Code example

```javascript
const editor = document.querySelector('div[contenteditable]');

editor.addEventListener('paste', async (e) => {
  e.preventDefault();
  
  const clipboardData = e.clipboardData || window.clipboardData;
  const pastedText = clipboardData.getData('text/plain');
  
  // Check if pasted text is a URL
  const urlPattern = /^https?:\/\/.+/;
  if (urlPattern.test(pastedText.trim())) {
    // Try to get link title from clipboard
    let linkTitle = pastedText;
    
    // Try to read HTML from clipboard
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
      // Fallback to URL if HTML parsing fails
    }
    
    // Create link element
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const link = document.createElement('a');
      link.href = pastedText.trim();
      link.textContent = linkTitle;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      range.insertNode(link);
      range.collapse(false);
      
      selection.removeAllRanges();
      selection.addRange(range);
    }
  } else {
    // Not a URL, paste as normal text
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(pastedText));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
});
```
