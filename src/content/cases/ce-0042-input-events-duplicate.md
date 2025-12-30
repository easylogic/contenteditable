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
    description: "Basic text"
  - label: "After Typing 'W' (Bug)"
    html: 'HelloW'
    description: "Single character input triggers input event 2-3 times (double/triple processing)"
  - label: "✅ Expected"
    html: 'HelloW'
    description: "Expected: Single character input triggers input event only once"
---

## Phenomenon

In Edge on Windows, the `input` event may fire multiple times for a single keystroke, causing event handlers to execute more than expected. This can lead to performance issues and incorrect behavior.

## Reproduction example

1. Create a contenteditable div.
2. Add an event listener for the `input` event that logs each event.
3. Type a single character.
4. Observe how many times the `input` event fires.

## Observed behavior

- In Edge on Windows, the `input` event may fire 2-3 times for a single keystroke.
- Event handlers are executed multiple times unnecessarily.
- This can cause performance degradation and incorrect application behavior.

## Expected behavior

- The `input` event should fire exactly once per user input action.
- Event duplication should not occur.
- The event should accurately represent the actual input change.

