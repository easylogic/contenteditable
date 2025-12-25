---
id: ce-0023
scenarioId: scenario-double-line-break
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Pressing Enter inserts two line breaks in contenteditable
description: "In Chrome on macOS, pressing Enter in a contenteditable region inserts two line breaks (br elements) instead of one, causing unexpected spacing between paragraphs."
tags:
  - line-break
  - enter
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello'
    description: "첫 번째 줄"
  - label: "After Enter (Bug)"
    html: 'Hello<br><br>'
    description: "Enter 한 번으로 두 개의 &lt;br&gt; 요소 삽입 (Chrome macOS)"
  - label: "✅ Expected"
    html: 'Hello<br>'
    description: "정상: Enter 한 번으로 하나의 줄바꿈만 삽입"
---

### Phenomenon

In Chrome on macOS, pressing Enter in a contenteditable region inserts two line breaks (`<br>` elements) instead of one, causing unexpected spacing between paragraphs.

### Reproduction example

1. Create a contenteditable div.
2. Type some text.
3. Press Enter to create a new line.
4. Observe the DOM structure.

### Observed behavior

- In Chrome on macOS, pressing Enter creates two `<br>` elements.
- This results in double spacing between lines.
- The behavior is inconsistent with other browsers.

### Expected behavior

- Pressing Enter should insert a single line break or create a new paragraph element.
- The spacing should be consistent with standard text editing behavior.

