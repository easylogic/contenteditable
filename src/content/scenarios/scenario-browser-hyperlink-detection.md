---
id: scenario-browser-hyperlink-detection
title: Browser automatically converts URLs and emails to links in contenteditable
description: "Browsers, especially Internet Explorer and legacy Edge, automatically detect URLs, email addresses, and phone numbers in contenteditable elements and convert them to clickable links. This auto-linking behavior can interfere with editing, cause cursor positioning issues, and create unwanted markup."
category: formatting
tags:
  - hyperlink
  - auto-link
  - url-detection
  - email-detection
  - internet-explorer
status: draft
locale: en
---

Browsers, especially Internet Explorer and legacy Edge, automatically detect URLs, email addresses, and phone numbers in `contenteditable` elements and convert them to clickable links. This auto-linking behavior can interfere with editing, cause cursor positioning issues, and create unwanted markup.

## Observed Behavior

- **Automatic link creation**: URLs, emails, phone numbers are automatically wrapped in `<a>` tags
- **Cursor positioning issues**: Cursor jumps when link markup is inserted
- **Non-editable links**: Parts of text become non-editable or behave differently
- **Undo/redo disruption**: Auto-linking creates implicit edits that corrupt undo history
- **Custom styling loss**: Custom styles inside links may be lost or overridden

## Browser Comparison

- **Internet Explorer**: Most aggressive auto-linking via `AutoUrlDetect` command
- **Legacy Edge**: Similar to IE, supports `AutoUrlDetect`
- **Chrome/Firefox/Safari**: Generally don't auto-link by default, but some editors do
- **Mobile Safari**: Uses data detectors for phone numbers and dates

## Impact

- **Unwanted links**: Links created when they shouldn't be (dates, IDs, etc.)
- **Editing interference**: Auto-linking disrupts typing and editing flow
- **DOM corruption**: Unexpected markup breaks editor functionality
- **User frustration**: Users must manually remove unwanted links

## Workarounds

### 1. Disable AutoUrlDetect (IE/Legacy Edge)

Use execCommand to disable:

```javascript
if (document.execCommand) {
  document.execCommand("AutoUrlDetect", false, false);
}
```

### 2. Use contenteditable="plaintext-only"

Disables all rich-text behaviors:

```html
<div contenteditable="plaintext-only">
  Plain text only, no auto-linking
</div>
```

Note: Firefox support is limited.

### 3. Intercept and Remove Links

Monitor and remove auto-created links:

```javascript
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.tagName === 'A' && node.href) {
        // Check if link was auto-created
        const text = node.textContent;
        if (text.match(/^(https?:\/\/|www\.|[\w.-]+@[\w.-]+)/)) {
          // Replace link with plain text
          const textNode = document.createTextNode(text);
          node.parentNode.replaceChild(textNode, node);
        }
      }
    });
  });
});

observer.observe(editableElement, {
  childList: true,
  subtree: true
});
```

### 4. Disable iOS Data Detectors

For mobile Safari:

```html
<head>
  <meta name="format-detection" content="telephone=no">
</head>

<div contenteditable="true" x-apple-data-detectors="false">
  Content without auto-linking
</div>
```

### 5. Post-Process Before Saving

Clean up links before submission:

```javascript
function removeAutoLinks(element) {
  const links = element.querySelectorAll('a');
  links.forEach(link => {
    const text = document.createTextNode(link.textContent);
    link.parentNode.replaceChild(text, link);
  });
}

// Before saving/submitting
removeAutoLinks(editableElement);
```

### 6. Use pointer-events: none

Disable link interaction while editing:

```css
[contenteditable="true"] a {
  pointer-events: none;
  text-decoration: none;
  color: inherit;
}
```

## References

- [Exchange Tuts: Disable AutoUrlDetect in IE](https://exchangetuts.com/index.php/disable-automatic-url-detection-for-elements-with-contenteditable-flag-in-ie-1641015003766163) - IE AutoUrlDetect command
- [MDN: contenteditable plaintext-only](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable) - plaintext-only mode
- [Stack Overflow: Disable auto URL detect in contenteditable](https://stackoverflow.com/questions/12346158/ckeditor-disable-default-linking-of-email-ids) - execCommand solution
- [Matheus Mello: Disable phone number linking in iOS Safari](https://www.matheusmello.io/posts/iphone-how-to-disable-phone-number-linking-in-mobile-safari) - iOS data detectors
- [Froala: Disable automatic link detection](https://froala.com/blog/general/how-to-disable-automatic-link-detection-in-a-visual-html-editor/) - Editor-specific solutions
- [MDN: interactivity CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/interactivity) - New CSS feature for disabling interaction
