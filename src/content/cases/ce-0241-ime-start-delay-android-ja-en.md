---
id: ce-0241-ime-start-delay-android-ja-en
scenarioId: scenario-ime-start-delay-android
locale: en
os: Android
osVersion: "10-14"
device: Mobile (Samsung Galaxy Tab S9)
deviceVersion: Any
browser: Chrome for Android
browserVersion: "120+"
keyboard: Japanese (IME) - Gboard or Samsung IME
caseTitle: Selecting all text delays IME start on Android (Japanese)
description: "On Android virtual keyboards, after selecting all text in a contenteditable element (Ctrl+A), typing a letter to start IME composition does not trigger IME until second letter is typed. The first letter is inserted as plain text, and only from second letter does IME composition begin."
tags:
  - ime
  - composition
  - android
  - mobile
  - japanese
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    Type some text here. For example, type "こんにちは" and then select all (Ctrl+A), then try to start new input with a letter to observe the IME behavior.
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true">こんにちは</div>'
    description: "Text already entered"
  - label: "Step 1: Select All (Ctrl+A)"
    html: '<div contenteditable="true">こんにちは</div>'
    description: "All text selected"
  - label: "Step 2: Type first letter 'あ'"
    html: '<div contenteditable="true">こんにちはあ</div>'
    description: "❌ Bug: First letter 'あ' inserted as plain text, no IME candidates"
  - label: "Step 3: Type second letter 'い'"
    html: '<div contenteditable="true">こんにちはあい</div>'
    description: "IME composition starts from second letter 'い'"
  - label: "✅ Expected"
    html: '<div contenteditable="true">あい</div>'
    description: "Expected: IME composition should start from first letter"
---

## 현상

On Android virtual keyboards, after selecting all text in a contenteditable element, typing a letter does not immediately start IME composition. The first letter is inserted as plain text, and IME composition only starts from second letter.

## 재현 예시

1. Type text in contenteditable element (e.g., "こんにちは").
2. Press Ctrl+A to select all text.
3. Type first letter (e.g., "あ").

## 관찰된 동작

- **First letter plain text**: 'あ' is inserted as plain text (not part of IME composition)
- **Selection remains**: The "Select All" selection stays visible
- **IME starts delayed**: IME composition (candidate window) only appears after typing second letter
- **Result**: First letter appears as plain text, then IME composition replaces from second letter

## 예상 동작

- IME composition should start immediately when first letter is typed
- The entire selection should be replaced with IME composition

## 참고사항 및 가능한 해결 방향

- **Clear selection before typing**: Remove selection before user starts new input
- **Detect and handle first letter separately**: Check if plain text is inserted before composition starts
- **Use beforeinput event**: Monitor `inputType = 'insertText'` to detect plain text insertion
- **User education**: Add UI hint to clear selection before starting new IME input

## 코드 예시

```javascript
const editor = document.querySelector('div[contenteditable]');
let imeStarted = false;
let wasSelectAll = false;

// Detect select all
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'a') {
    wasSelectAll = true;
  }
});

// Track composition start
editor.addEventListener('compositionstart', () => {
  imeStarted = true;
  // Clear selection if it exists
  const selection = window.getSelection();
  if (selection.rangeCount > 0 && !selection.isCollapsed) {
    selection.removeAllRanges();
  }
});

// Distinguish plain text vs IME
editor.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertText' && !imeStarted && wasSelectAll) {
    // Plain text was inserted before IME started
    console.warn('Plain text inserted before IME started:', e.data);
  }
});

editor.addEventListener('keydown', (e) => {
  if (wasSelectAll) {
    // First letter after select all detected
    console.log('First letter after select all:', e.key);
    // Optionally add cleanup logic
  }
});
```
