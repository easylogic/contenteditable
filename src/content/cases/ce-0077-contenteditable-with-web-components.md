---
id: ce-0077-contenteditable-with-web-components
scenarioId: scenario-web-components-integration
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable behavior differs inside Web Components
description: "When a contenteditable element is inside a Web Component (custom element), its behavior may differ from when it's in standard HTML. Event handling, selection, and focus management may be affected by the Shadow DOM isolation."
tags:
  - web-components
  - custom-elements
  - chrome
  - windows
status: draft
---

## Phenomenon

When a contenteditable element is inside a Web Component (custom element), its behavior may differ from when it's in standard HTML. Event handling, selection, and focus management may be affected by the component's shadow DOM or encapsulation.

## Reproduction example

1. Create a custom Web Component.
2. Inside the component, create a contenteditable div.
3. Try to interact with the contenteditable (type, select, etc.).
4. Observe event handling and selection behavior.
5. Compare with a contenteditable outside the component.

## Observed behavior

- In Chrome on Windows, contenteditable behavior may differ inside Web Components.
- Events may not bubble correctly through shadow DOM boundaries.
- Selection may be affected by encapsulation.
- Focus management may be inconsistent.

## Expected behavior

- contenteditable should behave identically inside and outside Web Components.
- Events should work correctly across shadow DOM boundaries.
- Selection and focus should work consistently.

