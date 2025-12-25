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
description: "When a contenteditable region contains interactive elements (buttons, links, etc.), clicking on these elements causes the contenteditable to lose focus. This interrupts the editing flow and may cau"
tags:
  - focus
  - click
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: '<div contenteditable="true">Hello <button>Button</button> World|</div>'
    description: "contenteditable 내부에 버튼, 커서(|)가 'World' 뒤"
  - label: "After Click Button (Bug)"
    html: '<div contenteditable="true">Hello <button>Button</button> World</div>'
    description: "버튼 클릭 후 contenteditable 포커스 손실, 커서 사라짐"
  - label: "✅ Expected"
    html: '<div contenteditable="true">Hello <button>Button</button> World|</div>'
    description: "정상: 버튼 클릭 후에도 contenteditable 포커스 유지"
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

