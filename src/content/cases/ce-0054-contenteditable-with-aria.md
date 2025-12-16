---
id: ce-0054
scenarioId: scenario-accessibility-aria
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: ARIA attributes on contenteditable are not properly announced
tags:
  - accessibility
  - aria
  - screen-reader
  - safari
status: draft
---

### Phenomenon

When ARIA attributes (like `role`, `aria-label`, `aria-describedby`) are applied to contenteditable regions, screen readers may not properly announce them in Safari. The accessibility information is lost.

### Reproduction example

1. Create a contenteditable div with ARIA attributes:
   ```html
   <div contenteditable role="textbox" aria-label="Editor" aria-describedby="help-text">
     Content here
   </div>
   ```
2. Enable VoiceOver.
3. Navigate to the contenteditable.
4. Observe what is announced.

### Observed behavior

- In Safari on macOS, ARIA attributes may not be announced by screen readers.
- The role and label information is lost.
- Users relying on screen readers may not understand the purpose of the element.

### Expected behavior

- ARIA attributes should be properly announced by screen readers.
- Role, label, and description should be communicated.
- The element should be accessible to assistive technologies.

