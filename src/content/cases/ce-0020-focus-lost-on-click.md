---
id: ce-0020
scenarioId: scenario-focus-management
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Focus is lost when clicking on certain elements within contenteditable
tags:
  - focus
  - click
  - firefox
status: draft
---

### Phenomenon

When a contenteditable region contains interactive elements (buttons, links, etc.), clicking on these elements causes the contenteditable to lose focus. This interrupts the editing flow and may cause the caret to disappear.

### Reproduction example

1. Create a contenteditable div.
2. Inside it, add a button or link element.
3. Start typing in the contenteditable.
4. Click on the button or link.
5. Observe that focus moves away from the contenteditable.

### Observed behavior

- In Firefox on Windows, clicking interactive elements removes focus from the contenteditable.
- The caret disappears.
- Typing no longer inserts text into the contenteditable.
- Focus must be manually restored.

### Expected behavior

- Interactive elements within contenteditable should be clickable without removing focus from the parent.
- Or, focus should be easily restorable after interacting with nested elements.
- The editing state should be preserved.

