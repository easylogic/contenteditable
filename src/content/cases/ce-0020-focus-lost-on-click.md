---
id: ce-0020-focus-lost-on-click
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
description: "When a contenteditable region contains interactive elements (buttons, links, etc.), clicking on these elements causes the contenteditable to lose focus. This interrupts the editing flow and may cau"
tags:
  - focus
  - click
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: '<div contenteditable="true">Hello <button>Button</button> World|</div>'
    description: "Button inside contenteditable, cursor (|) after 'World'"
  - label: "After Click Button (Bug)"
    html: '<div contenteditable="true">Hello <button>Button</button> World</div>'
    description: "After button click, contenteditable focus lost, cursor disappears"
  - label: "✅ Expected"
    html: '<div contenteditable="true">Hello <button>Button</button> World|</div>'
    description: "Expected: contenteditable focus maintained after button click"
---

## Phenomenon

When a contenteditable region contains interactive elements (buttons, links, etc.), clicking on these elements causes the contenteditable to lose focus. This interrupts the editing flow and may cause the caret to disappear.

## Reproduction example

1. Create a contenteditable div.
2. Inside it, add a button or link element.
3. Start typing in the contenteditable.
4. Click on the button or link.
5. Observe that focus moves away from the contenteditable.

## Observed behavior

- In Firefox on Windows, clicking interactive elements removes focus from the contenteditable.
- The caret disappears.
- Typing no longer inserts text into the contenteditable.
- Focus must be manually restored.

## Expected behavior

- Interactive elements within contenteditable should be clickable without removing focus from the parent.
- Or, focus should be easily restorable after interacting with nested elements.
- The editing state should be preserved.

