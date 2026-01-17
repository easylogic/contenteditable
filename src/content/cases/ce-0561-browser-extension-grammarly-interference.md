---
id: ce-0561-browser-extension-grammarly-interference
scenarioId: scenario-browser-extension-interference
locale: en
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: Latest
keyboard: US
caseTitle: Grammarly extension interferes with contenteditable editing
description: "When the Grammarly browser extension is active, it injects DOM nodes and modifies styles in contenteditable elements, causing cursor positioning issues, DOM corruption, and performance problems. Text may disappear, layout may shift, and editing becomes unreliable."
tags:
  - browser-extension
  - grammarly
  - dom-injection
  - cursor
  - performance
status: draft
---

## Phenomenon

When the Grammarly browser extension is active, it injects DOM nodes and modifies styles in `contenteditable` elements, causing cursor positioning issues, DOM corruption, and performance problems.

## Reproduction example

1. Install and activate Grammarly browser extension
2. Open a page with a contenteditable editor
3. Start typing in the editor
4. Observe cursor positioning issues, disappearing text, or layout shifts

## Observed behavior

- **DOM injection**: Grammarly injects extra HTML markup (underlines, overlays) inside editable regions
- **Cursor positioning**: Cursor disappears or appears at wrong position after Grammarly modifications
- **Text disappearance**: Text may disappear or become corrupted
- **Layout shifts**: Grammarly loading fonts (like Inter) causes visible layout jumps
- **Performance degradation**: Input lag increases due to heavy processing on every keystroke

## Expected behavior

- Browser extensions should not interfere with contenteditable editing
- Cursor position should remain accurate
- DOM structure should remain stable
- Editing should remain responsive

## Analysis

Grammarly extension has elevated permissions and can inject scripts and styles after page load. The extension mutates the DOM in significant ways, affecting rich text editors and any component where the cursor lands.

## Workarounds

- Add `data-gramm="false"` attribute to contenteditable elements
- Use MutationObserver to detect and remove injected markup
- Warn users about extension interference
- Use EditContext API (Chrome/Edge) for better control
