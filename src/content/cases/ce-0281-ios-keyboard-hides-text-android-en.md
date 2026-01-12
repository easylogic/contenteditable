---
id: ce-0281
scenarioId: scenario-ios-keyboard-hides-text
locale: en
os: Android
osVersion: "10-14"
device: Mobile (Samsung, Pixel, etc.)
deviceVersion: Any
browser: Chrome for Android
browserVersion: "120+"
keyboard: English (QWERTY) or Virtual Keyboard
caseTitle: Android auto-scrolls to keep text visible
description: "On Android with Chrome for Android, when entering text or pressing return multiple times in a contenteditable element, the page automatically scrolls to keep the text insertion point visible. This serves as a control case demonstrating that the issue is iOS-specific."
tags:
  - android
  - chrome
  - keyboard
  - mobile
  - auto-scroll
  - working-correctly
status: confirmed
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 200px;">
    Type text here. Press return multiple times to create multiple lines.
    <br><br>
    On Android, the page automatically scrolls to keep text visible.
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true"></div>'
    description: "Empty editor"
  - label: "Step 1: Type text"
    html: '<div contenteditable="true">Hello</div>'
    description: "Text entered"
  - label: "Step 2: Press Enter multiple times"
    html: '<div contenteditable="true">Hello<br><br>World<br><br>Test</div>'
    description: "✅ Correct: Page auto-scrolls to keep insertion point visible"
  - label: "Observation"
    html: '<div contenteditable="true">Hello<br><br>World<br><br>Test</div>'
    description: "Expected: Insertion point remains visible above keyboard"
---

## 현상

On Android with Chrome for Android, when entering text or pressing return multiple times in a contenteditable element, the page automatically scrolls to keep the text insertion point visible.

## 재현 예시

1. Open Chrome for Android on Android device.
2. Focus on contenteditable element.
3. Type text (e.g., "Hello").
4. Press Enter key multiple times to create multiple lines.

## 관찰된 동작

- **Auto-scroll works**: Page automatically scrolls to keep insertion point visible
- **Text always visible**: User can always see text being typed
- **Keyboard doesn't hide**: Keyboard doesn't cover the insertion point
- **Works correctly**: Android handles keyboard and scrolling properly

## 참고사항

This is a **control case** demonstrating that the issue is iOS-specific and Android works correctly with auto-scroll.
