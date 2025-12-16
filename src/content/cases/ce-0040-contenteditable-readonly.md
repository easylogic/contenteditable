---
id: ce-0040
scenarioId: scenario-contenteditable-readonly
locale: en
os: Any
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable="false" on child elements is not respected consistently
tags:
  - readonly
  - nested
  - contenteditable
  - chrome
status: draft
---

### Phenomenon

When a contenteditable region contains child elements with `contenteditable="false"`, the behavior is inconsistent. Some browsers allow editing within these elements, while others correctly prevent it.

### Reproduction example

1. Create a contenteditable div.
2. Inside it, add a child element with `contenteditable="false"`:
   ```html
   <div contenteditable="true">
     <p>Editable text</p>
     <p contenteditable="false">This should not be editable</p>
   </div>
   ```
3. Try to edit the text in the child element with `contenteditable="false"`.
4. Observe whether editing is prevented.

### Observed behavior

- In Chrome, child elements with `contenteditable="false"` may still be editable.
- The attribute is not consistently respected.
- Selection and editing may work within elements that should be read-only.

### Expected behavior

- Elements with `contenteditable="false"` should not be editable.
- The attribute should be respected regardless of parent element state.
- Selection within read-only elements should be allowed, but editing should be prevented.

