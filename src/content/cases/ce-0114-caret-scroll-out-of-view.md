---
id: ce-0114
scenarioId: scenario-caret-out-of-viewport
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Caret moves outside viewport during paste operations
description: "When pasting large content into a contenteditable element, the caret (cursor) may end up outside the visible viewport. Users cannot see where they are typing and must manually scroll to find the cursor."
tags:
  - caret
  - cursor
  - viewport
  - paste
  - chrome
status: draft
domSteps:
  - label: "Before Paste"
    html: 'Hello World'
    description: "Basic text, cursor at visible position"
  - label: "Clipboard"
    html: '[Large content: 100+ lines of text...]'
    description: "Large content copied"
  - label: "After Paste (Bug)"
    html: 'Hello World<br>[Large content...]<br>|'
    description: "After paste, cursor moves outside viewport (| = cursor)"
  - label: "✅ Expected"
    html: 'Hello World<br>[Large content...]<br>|'
    description: "Expected: Cursor maintained inside viewport or auto-scroll"
---

## Phenomenon

When pasting large content into a contenteditable element, the caret (cursor) may end up outside the visible viewport. Users cannot see where they are typing and must manually scroll to find the cursor.

## Reproduction example

1. Create a contenteditable element with some content
2. Scroll to a position where cursor is visible
3. Paste large content
4. Check cursor position

## Observed behavior

- Cursor ends up outside visible viewport
- User cannot see typing position
- Must manually scroll to find cursor
- Poor user experience

## Expected behavior

- Cursor should remain visible after paste
- Viewport should scroll to show cursor
- User should always see where they are typing
- Behavior should be automatic

## Browser Comparison

- **Chrome/Edge**: Caret may go out of view (this case)
- **Firefox**: More likely to lose caret position
- **Safari**: Caret position most unpredictable

## Notes and possible direction for workarounds

- Scroll caret into view after paste
- Use `scrollIntoView()` on selection
- Check if caret is in viewport
- Automatically scroll if needed
- Use `requestAnimationFrame` for smooth scrolling

