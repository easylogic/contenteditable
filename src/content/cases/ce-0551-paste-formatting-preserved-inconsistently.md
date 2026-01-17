---
id: ce-0551-paste-formatting-preserved-inconsistently
scenarioId: scenario-paste-formatting-preserved-inconsistently
locale: en
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: Latest
keyboard: US
caseTitle: Paste behavior preserves source formatting inconsistently across browsers
description: "Pasting content from external sources (Microsoft Word, web pages) often retains original formatting, leading to inconsistencies. Different browsers handle paste formatting differently."
tags:
  - paste
  - formatting
  - clipboard
  - cross-browser
status: draft
---

## Phenomenon

When pasting content from external sources (Microsoft Word, web pages, other applications) into a contenteditable element, the original formatting is often preserved inconsistently. Different browsers handle paste formatting differently, sometimes preserving all formatting, sometimes stripping it, and sometimes doing something else entirely.

## Reproduction example

1. Copy formatted text from Microsoft Word (with bold, italic, colors, fonts).
2. Paste into a contenteditable div in Chrome.
3. Observe the pasted content and its formatting.
4. Repeat the same paste operation in Firefox and Safari.
5. Compare the HTML structure and formatting in each browser.

## Observed behavior

- **Chrome**: Preserves most HTML structure and formatting from source.
- **Firefox**: May strip some formatting or convert it to different HTML structure.
- **Safari**: May preserve formatting but with different HTML representation.
- **Edge**: Behavior varies between Chromium and legacy versions.
- Pasted content may include unexpected styles, fonts, and formatting elements.
- HTML structure may differ significantly from the original contenteditable formatting.
- Undo operations after paste may not work as expected.

## Expected behavior

- Paste should either consistently preserve formatting or consistently strip it based on user preference or editor settings.
- Formatting should be normalized to match the editor's style system.
- HTML structure should be consistent and predictable.
- Undo should properly revert pasted content.

## Analysis

Browsers use different paste handlers and clipboard data parsers. The clipboard may contain multiple data formats (HTML, RTF, plain text), and each browser chooses which format to use and how to interpret it.

## Workarounds

- Intercept `paste` event and process clipboard data manually:
  ```javascript
  element.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  });
  ```
- Use `contenteditable="plaintext-only"` to strip all formatting (browser support varies).
- Sanitize pasted HTML on the backend before rendering.
- Implement custom paste handler that normalizes formatting.
- Use libraries that handle paste normalization automatically.
