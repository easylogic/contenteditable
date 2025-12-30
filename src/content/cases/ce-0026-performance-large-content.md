---
id: ce-0026
scenarioId: scenario-performance-large-content
locale: en
os: Any
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Typing becomes slow with large contenteditable content
description: "When a contenteditable region contains a large amount of content (thousands of DOM nodes), typing becomes noticeably slow. There is a visible lag between pressing keys and seeing characters appear."
tags:
  - performance
  - large-content
  - typing
  - chrome
status: draft
---

## Phenomenon

When a contenteditable region contains a large amount of content (thousands of DOM nodes), typing becomes noticeably slow. There is a visible lag between pressing keys and seeing characters appear.

## Reproduction example

1. Create a contenteditable div.
2. Insert a large amount of content (e.g., 10,000+ DOM nodes).
3. Place the caret at the end of the content.
4. Start typing rapidly.
5. Observe the delay between keypress and character appearance.

## Observed behavior

- In Chrome, typing becomes slow when the contenteditable contains many DOM nodes.
- There is a noticeable lag between keypress and character rendering.
- The browser may become unresponsive during rapid typing.

## Expected behavior

- Typing should remain responsive regardless of content size.
- The browser should optimize rendering for large contenteditable regions.
- Performance should degrade gracefully, not abruptly.

