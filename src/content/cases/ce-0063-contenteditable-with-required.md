---
id: ce-0063
scenarioId: scenario-required-validation
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: required attribute is not supported for validation
tags:
  - required
  - validation
  - form
  - chrome
status: draft
---

### Phenomenon

The `required` attribute, which works on form inputs to indicate mandatory fields, is not supported on contenteditable regions. There is no built-in way to mark a contenteditable as required for form validation.

### Reproduction example

1. Create a contenteditable div with `required` attribute inside a form.
2. Try to submit the form without entering content.
3. Observe whether validation occurs.

### Observed behavior

- In Chrome on macOS, the `required` attribute is ignored on contenteditable.
- Form validation does not check contenteditable regions.
- No built-in validation exists.

### Expected behavior

- The `required` attribute should work on contenteditable.
- Form validation should check contenteditable regions.
- Or, there should be a standard way to validate contenteditable content.

