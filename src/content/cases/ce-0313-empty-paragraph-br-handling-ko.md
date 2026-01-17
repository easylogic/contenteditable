---
id: ce-0313-empty-paragraph-br-handling-ko
scenarioId: scenario-empty-paragraph-br-handling
locale: ko
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: Latest
keyboard: US
caseTitle: Empty paragraphs handled differently across browsers
description: "Browsers handle empty paragraphs within contenteditable elements differently. Modern browsers insert <br> tags, while IE may use non-breaking spaces, leading to inconsistencies."
tags:
  - empty-elements
  - paragraph
  - br
  - cross-browser
status: draft
---

## Phenomenon

Browsers handle empty paragraphs (`<p>`) within contenteditable elements differently. Modern browsers (Chrome, Firefox) often insert a `<br>` tag within empty paragraphs to maintain their visibility and editability. Internet Explorer 7-8 may show empty paragraphs as if they contain a non-breaking space (`&nbsp;`), even when they don't, leading to inconsistencies in content representation.

## Reproduction example

1. Create a contenteditable div.
2. Create an empty paragraph: `<p></p>`
3. Inspect the HTML in different browsers.
4. Check if `<br>` tags or `&nbsp;` are inserted.
5. Try to place cursor in empty paragraph and observe behavior.

## Observed behavior

- **Chrome/Firefox**: Insert `<br>` tag in empty paragraphs: `<p><br></p>`
- **IE 9**: Allows empty paragraphs without content, yet they remain editable.
- **IE 7-8**: Empty paragraphs may appear to contain `&nbsp;` even when `innerHTML` shows they're empty.
- **Safari**: Behavior similar to Chrome, inserts `<br>` tags.
- **Editability**: Empty paragraphs remain editable in all browsers but with different internal structure.

## Expected behavior

- Empty paragraphs should be handled consistently across browsers.
- Empty paragraphs should remain editable.
- Internal structure should be predictable and consistent.
- Content representation should match actual content.

## Analysis

Browsers insert placeholder content in empty paragraphs to maintain their editability. Without some content, empty elements may collapse or become uneditable. Different browsers choose different placeholder strategies.

## Workarounds

- Normalize empty paragraphs after editing:
  ```javascript
  function normalizeEmptyParagraphs(element) {
    const paragraphs = element.querySelectorAll('p');
    paragraphs.forEach(p => {
      if (!p.textContent.trim() && !p.querySelector('br')) {
        p.innerHTML = '<br>';
      }
    });
  }
  ```
- Use consistent placeholder strategy across browsers.
- Test empty element handling in all target browsers.
- Consider using `<div>` instead of `<p>` if paragraph semantics aren't needed.
