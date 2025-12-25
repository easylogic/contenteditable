---
id: ce-0168
scenarioId: scenario-line-break-element-type
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Enter key creates paragraph elements in Firefox
description: "When pressing Enter in a contenteditable element in Firefox, a new <p> paragraph element is created instead of a <div>. This differs from Chrome which creates <div> elements, and can cause CSS styling differences."
tags:
  - line-break
  - paragraph
  - div
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: '<div>Hello</div>'
    description: "첫 번째 줄"
  - label: "After Enter (Firefox)"
    html: '<div>Hello</div><p><br></p>'
    description: "Enter 키로 &lt;p&gt; 요소 생성 (Firefox)"
  - label: "After Enter (Chrome)"
    html: '<div>Hello</div><div><br></div>'
    description: "Enter 키로 &lt;div&gt; 요소 생성 (Chrome)"
  - label: "✅ Expected"
    html: '<div>Hello</div><div><br></div>'
    description: "정상: 일관된 요소 타입 사용 (또는 선택 가능)"
---

### Phenomenon

When pressing Enter in a contenteditable element in Firefox, a new `<p>` paragraph element is created instead of a `<div>`. This differs from Chrome which creates `<div>` elements, and can cause CSS styling differences.

### Reproduction example

1. Focus a contenteditable element
2. Type some text
3. Press Enter

### Observed behavior

- A new `<p>` element is created (e.g., `<p><br></p>`)
- Chrome creates `<div>` elements instead
- CSS default margins differ between `<p>` and `<div>`
- DOM structure is inconsistent across browsers

### Expected behavior

- Either `<div>` or `<p>` should be used consistently
- Or behavior should be configurable
- CSS styling should account for element type differences
- DOM structure should be normalized

### Browser Comparison

- **Chrome/Edge**: Creates `<div>` elements
- **Firefox**: Creates `<p>` elements (this case)
- **Safari**: May create `<div>`, `<p>`, or `<br>` depending on context

### Notes and possible direction for workarounds

- Normalize DOM structure after Enter key
- Convert all `<p>` elements to `<div>` for consistency with Chrome
- Or convert all `<div>` to `<p>` to match Firefox
- Use CSS to normalize margins regardless of element type

