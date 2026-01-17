---
id: ce-0170-code-block-indentation-lost
scenarioId: scenario-code-block-indentation-lost
locale: en
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: Latest
keyboard: US
caseTitle: Code block loses indentation when typing in contenteditable pre tag
description: "When using a <pre> tag with contenteditable to create an editable code block, pressing Enter inserts <br> tags instead of preserving newline characters, and indentation is lost."
tags:
  - code-block
  - pre
  - indentation
  - whitespace
status: draft
---

## Phenomenon

When using a `<pre>` tag with the `contenteditable` attribute to create an editable code block, pressing Enter often inserts `<br>` tags instead of preserving newline characters (`\n`). This behavior disrupts the intended formatting of code, and indentation may be lost when users type.

## Reproduction example

1. Create a `<pre contenteditable="true">` element with code content.
2. Place cursor in the middle of a line.
3. Press Enter to create a new line.
4. Inspect the HTML to see if `<br>` tags were inserted.
5. Type code with indentation and observe if indentation is preserved.

## Observed behavior

- **Enter key**: Inserts `<br>` tags instead of newline characters.
- **Indentation lost**: Whitespace and indentation may not be preserved.
- **Wrapping elements**: Some browsers may wrap new lines in `<div>` or `<p>` tags.
- **Formatting disruption**: Code formatting is broken by unexpected HTML structure.
- **Whitespace collapse**: Multiple spaces may be collapsed into single spaces.

## Expected behavior

- Pressing Enter should insert newline characters (`\n`), not `<br>` tags.
- Indentation should be preserved when typing.
- Whitespace should be maintained as entered.
- Code formatting should remain intact.

## Analysis

Browsers treat contenteditable `<pre>` elements similarly to other contenteditable elements, applying HTML formatting rules that don't preserve code-specific formatting. The browser's default Enter behavior inserts HTML elements rather than preserving plain text newlines.

## Workarounds

- Intercept Enter key to insert newline character:
  ```javascript
  preElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.execCommand('insertText', false, '\n');
    }
  });
  ```
- Sanitize content after input to replace `<br>` with `\n`:
  ```javascript
  function sanitizePreContent(preElement) {
    let content = preElement.innerHTML;
    content = content.replace(/<br>/g, '\n');
    content = content.replace(/<\/?div>/g, '');
    preElement.textContent = content;
  }
  ```
- Use `white-space: pre-wrap;` CSS to preserve whitespace.
- Consider alternative approaches like overlaying syntax-highlighted `<pre>` over hidden `<textarea>`.
