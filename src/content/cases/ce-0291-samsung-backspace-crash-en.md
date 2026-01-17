---
id: ce-0291-samsung-backspace-crash-en
scenarioId: scenario-samsung-backspace-crash
locale: en
os: Android
osVersion: "10-14"
device: Mobile (Samsung Galaxy S9, Note series, etc.)
deviceVersion: Any
browser: Chrome for Android
browserVersion: "120+"
keyboard: English (QWERTY)
caseTitle: Samsung Keyboard backspace causes crash
description: "On Android with Samsung Keyboard, holding backspace key causes contenteditable editor to crash. Gboard and other keyboards work correctly. This case demonstrates the Samsung-specific crash."
tags:
  - backspace
  - crash
  - android
  - samsung
  - working-correctly
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    Type text here.
    <br><br>
    Try holding backspace key (Samsung Keyboard may cause crash).
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true">Hello World</div>'
    description: "Empty editor"
  - label: "Step 1: Type text"
    html: '<div contenteditable="true">Hello World</div>'
    description: "Text entered"
  - label: "Step 2: Hold backspace to delete"
    html: '<div contenteditable="true">Hello World</div>'
    description: "❌ Crash! Editor becomes unresponsive with Samsung Keyboard"
  - label: "Observation"
    html: '<div contenteditable="true">Hello World</div>'
    description: "Samsung Keyboard issue: holding backspace causes crash, Gboard works correctly"
  - label: "✅ Expected"
    html: '<div contenteditable="true">Hello Worl|d</div>'
    description: "Expected: Text deleted smoothly without crash"
---

## 현상

On Android with Samsung Keyboard, holding backspace key causes contenteditable editor to crash.

## 재현 예시

1. Use Samsung Galaxy device with Samsung Keyboard.
2. Open Chrome for Android.
3. Type text in contenteditable editor (e.g., "Hello World").
4. Hold backspace key to delete characters.

## 관찰된 동작

- **Editor crashes**: Complete crash when backspace is held
- **JavaScript stops**: All script execution halts
- **Page unresponsive**: Browser doesn't respond
- **Samsung specific**: Gboard, SwiftKey do NOT cause this crash
- **Rate-related**: Rapid backspace events trigger the crash

## 참고사항

This case demonstrates that Samsung Keyboard has a specific backspace handling bug that causes editor crashes, while other keyboards work correctly.

Workarounds recommended:
- Rate-limit backspace events
- Use try-catch error handling
- Debounce backspace handling
- Recommend alternative keyboards (Gboard, SwiftKey)
