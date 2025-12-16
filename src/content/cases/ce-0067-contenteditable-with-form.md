---
id: ce-0067
scenarioId: scenario-form-integration
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable content is not included in form submission
tags:
  - form
  - submission
  - chrome
status: draft
---

### Phenomenon

When a contenteditable region is inside a `<form>`, its content is not automatically included in form submission. Unlike `<input>` and `<textarea>`, contenteditable content must be manually extracted and added to the form data.

### Reproduction example

1. Create a form with a contenteditable div inside it.
2. Enter some content in the contenteditable.
3. Submit the form.
4. Inspect the form data to see if contenteditable content is included.

### Observed behavior

- In Chrome on Windows, contenteditable content is not included in form submission.
- The content must be manually extracted and added.
- No automatic form integration exists.

### Expected behavior

- Contenteditable content should be included in form submission.
- Or, there should be a standard way to associate contenteditable with form fields.
- Form integration should work seamlessly.

