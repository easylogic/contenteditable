---
id: ce-0079
scenarioId: scenario-contenteditable-inheritance
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable inheritance behavior is inconsistent
tags:
  - inheritance
  - nested
  - firefox
  - windows
status: draft
---

### Phenomenon

When a parent element has `contenteditable="true"` and a child element has `contenteditable="false"`, the inheritance behavior is inconsistent across browsers. Some browsers allow editing in the child, while others correctly prevent it. The behavior may also differ when the child has `contenteditable="inherit"` or no contenteditable attribute.

### Reproduction example

1. Create a parent div with `contenteditable="true"`.
2. Add a child element with `contenteditable="false"`.
3. Add another child with `contenteditable="inherit"`.
4. Add another child with no contenteditable attribute.
5. Try to edit each child and observe behavior.

### Observed behavior

- In Firefox on Windows, inheritance behavior is inconsistent.
- Children with `contenteditable="false"` may still be editable.
- Children with `contenteditable="inherit"` may not inherit correctly.
- Children without the attribute may or may not be editable.

### Expected behavior

- `contenteditable="false"` should always prevent editing.
- `contenteditable="inherit"` should inherit from parent.
- Children without the attribute should inherit from parent.
- Behavior should be consistent across browsers.

