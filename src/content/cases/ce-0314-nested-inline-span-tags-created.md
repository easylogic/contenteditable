---
id: ce-0314-nested-inline-span-tags-created
scenarioId: scenario-nested-inline-span-tags-created
locale: en
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: Latest
keyboard: US
caseTitle: Unwanted span tags with inline styles created when removing line breaks
description: "In Chrome, using backspace to remove line breaks can result in the insertion of <span> tags with inline styles, interfering with subsequent styling efforts."
tags:
  - span
  - inline-styles
  - backspace
  - chrome
  - formatting
status: draft
---

## Phenomenon

In Chrome, when using the backspace key to remove line breaks in a contenteditable element, the browser may insert unwanted `<span>` tags with inline styles. This behavior can interfere with subsequent styling efforts and create unnecessary HTML structure.

## Reproduction example

1. Create a contenteditable div with multiple paragraphs or line breaks.
2. Place cursor at the beginning of a line (after a line break).
3. Press backspace to remove the line break.
4. Inspect the HTML to see if `<span>` tags with inline styles were inserted.
5. Observe the structure of the resulting HTML.

## Observed behavior

- **Span tags inserted**: `<span>` elements are created during backspace operations.
- **Inline styles**: Spans may contain inline styles like `style="font-weight: normal;"` or similar.
- **Unnecessary structure**: HTML structure becomes more complex than needed.
- **Styling interference**: Inline styles in spans can override intended formatting.
- **Chrome-specific**: This behavior is more common in Chrome than other browsers.

## Expected behavior

- Backspace should remove line breaks without inserting unnecessary HTML elements.
- No inline styles should be added unless explicitly applied by user.
- HTML structure should remain clean and minimal.
- Formatting should not be affected by structural changes.

## Analysis

Chrome's contenteditable implementation may insert spans to preserve formatting state when removing structural elements. The browser tries to maintain style information, which can result in unwanted span tags.

## Workarounds

- Monitor `input` event and remove unnecessary spans:
  ```javascript
  element.addEventListener('input', () => {
    const spans = element.querySelectorAll('span');
    spans.forEach(span => {
      if (!span.attributes.length || 
          (span.attributes.length === 1 && span.hasAttribute('style') && !span.style.cssText.trim())) {
        const parent = span.parentNode;
        while (span.firstChild) {
          parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
        parent.normalize();
      }
    });
  });
  ```
- Sanitize HTML after editing operations.
- Use libraries that normalize HTML structure automatically.
- Implement custom backspace handling to prevent span insertion.
