---
id: ce-0025
scenarioId: scenario-caret-movement-with-emoji
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: US
caseTitle: Arrow keys skip over emoji in contenteditable
description: "In Edge on Windows, when navigating with arrow keys through text containing emoji, the caret position behaves unexpectedly. The arrow keys may skip over emoji characters or position the caret incor"
tags:
  - emoji
  - caret
  - arrow-keys
  - edge
status: draft
domSteps:
  - label: "Before"
    html: 'Hello| 👋 world 🌍'
    description: "텍스트와 이모지, 커서(|)가 'Hello' 뒤"
  - label: "After Right Arrow (Bug)"
    html: 'Hello 👋| world 🌍'
    description: "오른쪽 화살표로 이모지를 건너뛰어 이동"
  - label: "✅ Expected"
    html: 'Hello |👋 world 🌍'
    description: "정상: 오른쪽 화살표로 한 글자씩 이동 (이모지 포함)"
---

### Phenomenon

In Edge on Windows, when navigating with arrow keys through text containing emoji, the caret position behaves unexpectedly. The arrow keys may skip over emoji characters or position the caret incorrectly.

### Reproduction example

1. Create a contenteditable div.
2. Type some text with emoji, for example: "Hello 👋 world 🌍".
3. Use the left and right arrow keys to move the caret through the text.
4. Observe the caret position relative to the emoji.

### Observed behavior

- In Edge on Windows, arrow keys may skip over emoji characters.
- The caret may jump past emoji instead of moving character by character.
- The visual position of the caret may not match the actual text position.

### Expected behavior

- Arrow keys should move the caret one character at a time, including emoji.
- The caret should be positioned correctly relative to emoji characters.
- Navigation should be predictable and consistent.

