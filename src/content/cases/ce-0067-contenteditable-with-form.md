---
id: ce-0067-contenteditable-with-form
scenarioId: scenario-form-integration
locale: en
os: macOS
osVersion: "14.0"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable content is not included in form submission
description: "When a contenteditable element is placed inside a <form>, its content is not automatically included in the FormData or submitted with the form, unlike standard <input> or <textarea> elements."
tags: ["form", "submission", "data-loss", "chrome"]
status: confirmed
---

## Phenomenon
Standard HTML forms do not recognize `contenteditable` regions as valid input fields. When the form is submitted via a standard submit button, the value within the editor is ignored, leading to data loss unless handled programmatically.

## Reproduction Steps
1. Place a `<div contenteditable="true">` inside a `<form>`.
2. Add a `<button type="submit">`.
3. Type text into the div and click submit.
4. Observe that the submitted request payload contains no key/value for the editor content.

## Observed Behavior
- Browsers only include elements with a `name` attribute that are part of the "Form-associated elements" category.
- `contenteditable` is a global attribute and does not turn an element into a form-associated one.

## Expected Behavior
The editor content should be treatable as a form value, ideally via an internal hidden field or the `ElementInternals` API.

## Solution
Use a hidden input field that syncs on every `input` event:
```javascript
const editor = document.querySelector('[contenteditable]');
const hiddenInput = document.querySelector('input[name="editor-content"]');
editor.addEventListener('input', () => {
   hiddenInput.value = editor.innerHTML;
});
```
