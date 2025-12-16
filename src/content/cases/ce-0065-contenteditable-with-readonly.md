---
id: ce-0065
scenarioId: scenario-readonly-attribute
locale: en
os: Linux
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: readonly attribute does not prevent editing in contenteditable
tags:
  - readonly
  - editing
  - firefox
status: draft
---

### Phenomenon

The `readonly` attribute, which should prevent editing on form inputs, does not work on contenteditable regions in Firefox. Users can still edit the content even when `readonly` is set.

### Reproduction example

1. Create a contenteditable div with `readonly` attribute.
2. Try to edit the content.
3. Observe whether editing is prevented.

### Observed behavior

- In Firefox on Linux, the `readonly` attribute does not prevent editing.
- Users can still modify content.
- The attribute is ignored.

### Expected behavior

- The `readonly` attribute should prevent editing on contenteditable.
- Content should be view-only when `readonly` is set.
- Behavior should match standard input elements.

