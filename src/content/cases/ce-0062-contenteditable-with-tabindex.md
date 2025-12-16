---
id: ce-0062
scenarioId: scenario-tabindex-behavior
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: US
caseTitle: tabindex attribute does not control focus order correctly
tags:
  - tabindex
  - focus
  - keyboard-navigation
  - edge
status: draft
---

### Phenomenon

When multiple contenteditable regions have `tabindex` attributes, the tab order may not follow the `tabindex` values correctly in Edge. The focus order may be inconsistent or incorrect.

### Reproduction example

1. Create multiple contenteditable divs with different `tabindex` values:
   ```html
   <div contenteditable tabindex="3">Third</div>
   <div contenteditable tabindex="1">First</div>
   <div contenteditable tabindex="2">Second</div>
   ```
2. Use Tab key to navigate.
3. Observe the focus order.

### Observed behavior

- In Edge on Windows, `tabindex` may not control focus order correctly.
- The focus may skip elements or follow an unexpected order.
- Keyboard navigation is inconsistent.

### Expected behavior

- `tabindex` should control focus order as specified.
- Elements should be focused in the order of their `tabindex` values.
- Keyboard navigation should be predictable and accessible.

