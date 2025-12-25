---
id: ce-0042
scenarioId: scenario-input-event-duplication
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: US
caseTitle: Input events fire multiple times for single keystroke
description: "In Edge on Windows, the input event may fire multiple times for a single keystroke, causing event handlers to execute more than expected. This can lead to performance issues and incorrect behavior."
tags:
  - input
  - events
  - duplication
  - edge
status: draft
domSteps:
  - label: "Before"
    html: 'Hello'
    description: "기본 텍스트"
  - label: "After Typing 'W' (Bug)"
    html: 'HelloW'
    description: "한 글자 입력 시 input 이벤트가 2-3번 발생 (이중/삼중 처리)"
  - label: "✅ Expected"
    html: 'HelloW'
    description: "정상: 한 글자 입력 시 input 이벤트가 한 번만 발생"
---

### Phenomenon

In Edge on Windows, the `input` event may fire multiple times for a single keystroke, causing event handlers to execute more than expected. This can lead to performance issues and incorrect behavior.

### Reproduction example

1. Create a contenteditable div.
2. Add an event listener for the `input` event that logs each event.
3. Type a single character.
4. Observe how many times the `input` event fires.

### Observed behavior

- In Edge on Windows, the `input` event may fire 2-3 times for a single keystroke.
- Event handlers are executed multiple times unnecessarily.
- This can cause performance degradation and incorrect application behavior.

### Expected behavior

- The `input` event should fire exactly once per user input action.
- Event duplication should not occur.
- The event should accurately represent the actual input change.

