---
id: ce-0104
scenarioId: scenario-line-break-element-type
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Enter key creates div elements instead of paragraphs in Chrome
description: "When pressing Enter in a contenteditable element in Chrome, a new <div> element is created instead of a <p> paragraph. This differs from Firefox which creates <p> elements, and can cause CSS styling differences."
tags:
  - line-break
  - div
  - paragraph
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<div>Hello</div>'
    description: "Basic text"
  - label: "After Enter (Bug)"
    html: '<div>Hello</div><div><br></div>'
    description: "Enter creates &lt;div&gt; element (Firefox uses &lt;p&gt;)"
  - label: "✅ Expected (Normalized)"
    html: '<p>Hello</p><p></p>'
    description: "Expected: Consistent element type used (all &lt;p&gt; or all &lt;div&gt;)"
---

## Phenomenon

When pressing Enter in a contenteditable element in Chrome, a new `<div>` element is created instead of a `<p>` paragraph. This differs from Firefox which creates `<p>` elements, and can cause CSS styling differences.

## Reproduction example

1. Focus a contenteditable element
2. Type some text
3. Press Enter

## Observed behavior

- A new `<div>` element is created (e.g., `<div><br></div>`)
- Firefox creates `<p>` elements instead
- CSS default margins differ between `<div>` and `<p>`
- DOM structure is inconsistent across browsers

## Expected behavior

- Either `<div>` or `<p>` should be used consistently
- Or behavior should be configurable
- CSS styling should account for element type differences

## Browser Comparison

- **Chrome/Edge**: Creates `<div>` elements (this case)
- **Firefox**: Creates `<p>` elements
- **Safari**: May create `<div>`, `<p>`, or `<br>` depending on context

## Notes and possible direction for workarounds

- Normalize DOM structure after Enter key
- Convert all `<div>` elements to `<p>` for consistency
- Or convert all `<p>` to `<div>` to match Chrome
- Use CSS to normalize margins regardless of element type

