---
id: ce-0057
scenarioId: scenario-maxlength-behavior
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: maxlength attribute is not supported on contenteditable
description: "The maxlength attribute, which works on input and textarea elements, is not supported on contenteditable regions. There is no built-in way to limit the amount of content that can be entered."
tags:
  - maxlength
  - validation
  - chrome
status: draft
---

### Phenomenon

The `maxlength` attribute, which works on `<input>` and `<textarea>` elements, is not supported on contenteditable regions. There is no built-in way to limit the amount of content that can be entered.

### Reproduction example

1. Create a contenteditable div with `maxlength="100"`.
2. Try to type more than 100 characters.
3. Observe whether the input is limited.

### Observed behavior

- In Chrome on Windows, the `maxlength` attribute is ignored on contenteditable.
- Users can enter unlimited content.
- No built-in validation or limitation exists.

### Expected behavior

- The `maxlength` attribute should be supported on contenteditable.
- Input should be limited to the specified length.
- Or, there should be a standard way to limit content length.

