---
id: ce-0069
scenarioId: scenario-autofocus-behavior
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: autofocus attribute does not work on contenteditable
description: "The autofocus attribute, which automatically focuses form inputs on page load, does not work on contenteditable elements. There is no built-in way to automatically focus a contenteditable region on page load."
tags:
  - autofocus
  - focus
  - chrome
  - windows
status: draft
---

### Phenomenon

The `autofocus` attribute, which automatically focuses form inputs on page load, does not work on contenteditable elements. There is no built-in way to automatically focus a contenteditable region when a page loads.

### Reproduction example

1. Create a contenteditable div with `autofocus` attribute.
2. Load the page.
3. Observe whether the contenteditable receives focus automatically.

### Observed behavior

- In Chrome on Windows, the `autofocus` attribute is ignored on contenteditable.
- The contenteditable does not receive focus automatically.
- Manual JavaScript focus() call is required.

### Expected behavior

- The `autofocus` attribute should work on contenteditable.
- Or, there should be a standard way to auto-focus contenteditable regions.
- Focus should be handled consistently with form inputs.

