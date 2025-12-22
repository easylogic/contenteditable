---
id: ce-0056
scenarioId: scenario-placeholder-behavior
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: Placeholder text disappears when contenteditable receives focus
description: "When using CSS ::before or ::after pseudo-elements to create placeholder text for a contenteditable region, the placeholder disappears immediately when the element receives focus, even if the content is empty."
tags:
  - placeholder
  - focus
  - safari
status: draft
---

### Phenomenon

When using CSS `::before` or `::after` pseudo-elements to create placeholder text for a contenteditable region, the placeholder disappears immediately when the element receives focus, even if the content is empty. This differs from `<input>` and `<textarea>` behavior.

### Reproduction example

1. Create a contenteditable div with placeholder styling:
   ```css
   [contenteditable]:empty::before {
     content: "Type here...";
     color: #999;
   }
   ```
2. Focus the contenteditable.
3. Observe whether the placeholder disappears.

### Observed behavior

- In Safari on macOS, the placeholder disappears on focus even if content is empty.
- This differs from standard input elements where placeholder persists until text is entered.
- The behavior is inconsistent with user expectations.

### Expected behavior

- Placeholder should persist when focused if content is empty.
- It should disappear only when content is actually entered.
- Behavior should match standard input elements.

