---
id: ce-0066
scenarioId: scenario-disabled-attribute
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: disabled attribute does not disable contenteditable
tags:
  - disabled
  - editing
  - safari
status: draft
---

### Phenomenon

The `disabled` attribute, which disables form inputs, does not work on contenteditable regions in Safari. The contenteditable remains editable and interactive even when `disabled` is set.

### Reproduction example

1. Create a contenteditable div with `disabled` attribute.
2. Try to focus and edit the content.
3. Observe whether the element is disabled.

### Observed behavior

- In Safari on macOS, the `disabled` attribute does not disable contenteditable.
- The element remains editable and focusable.
- The attribute is ignored.

### Expected behavior

- The `disabled` attribute should disable contenteditable.
- The element should not be editable or focusable when disabled.
- Behavior should match standard input elements.

