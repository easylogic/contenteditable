---
id: ce-0261-korean-ime-crash-firefox-en
scenarioId: scenario-ime-korean-crash-firefox
locale: en
os: Windows
osVersion: "10"
device: Desktop
deviceVersion: Any
browser: Firefox
browserVersion: "120+"
keyboard: Korean (IME) - Microsoft IME
caseTitle: Korean IME composition causes Firefox editor crash
description: "On Firefox with Windows 10 and Korean IME, specific key combination (Ctrl+Shift+Home) during IME composition causes the editor to crash unexpectedly. JavaScript execution stops."
tags:
  - composition
  - ime
  - korean
  - firefox
  - crash
  - windows
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    Type Korean text here.
    <br><br>
    Reproduction sequence:<br>
    1. Enable Korean IME<br>
    2. Type 'ㅀ' (press 'f', then 'g' on QWERTY keyboard)<br>
    3. Press Enter to confirm composition<br>
    4. Press Ctrl+Shift+Home (crash trigger)
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true"></div>'
    description: "Empty editor"
  - label: "Step 1: Type 'ㅀ'"
    html: '<div contenteditable="true">ㅀ</div>'
    description: "Typing 'ㅀ' with Korean IME"
  - label: "Step 2: Press Enter"
    html: '<div contenteditable="true">ㅀ</div>'
    description: "Composition confirmed"
  - label: "Step 3: Press Ctrl+Shift+Home"
    html: '<div contenteditable="true">ㅀ</div>'
    description: "❌ Crash! Browser becomes unresponsive"
  - label: "✅ Expected"
    html: '<div contenteditable="true">ㅀ</div>'
    description: "Expected: Editor continues without crashing"
---

## 현상

On Firefox with Windows 10 and Korean IME, specific key combination sequences during IME composition can cause the contenteditable editor to crash unexpectedly.

## 재현 예시

1. Focus on contenteditable element.
2. Enable Korean IME (Microsoft IME on Windows).
3. Type 'ㅀ' (press 'f', then 'g' on QWERTY keyboard).
4. Press Enter to confirm composition.
5. Press Ctrl+Shift+Home.
6. ❌ Editor crashes and becomes unresponsive.
7. User must reload the page.

## 관찰된 동작

- **Specific key combination crash**: Ctrl+Shift+Home triggers editor crash
- **JavaScript execution stops**: Browser completely halts when crash occurs
- **Page unresponsive**: No user interaction possible until reload
- **Firefox specific**: Issue only affects Firefox

## 예상 동작

- Editor should handle key combinations without crashing
- IME composition should complete or be interrupted gracefully
- JavaScript execution should continue normally

## 참고사항 및 가능한 해결 방향

- **Block dangerous combinations during IME**: Prevent Ctrl+Shift+Home during composition
- **Try-catch error handling**: Wrap critical operations in try-catch blocks
- **Error reporting**: Log errors and inform user gracefully
- **Graceful recovery**: Implement fallback mechanisms when errors occur

## 코드 예시

```javascript
const editor = document.querySelector('div[contenteditable]');
let isComposing = false;

// Track IME state
editor.addEventListener('compositionstart', () => {
  isComposing = true;
});

editor.addEventListener('compositionend', () => {
  isComposing = false;
});

// Block dangerous key combination
editor.addEventListener('keydown', (e) => {
  if (isComposing && e.ctrlKey && e.shiftKey && e.key === 'Home') {
    e.preventDefault();
    console.warn('Dangerous key combination blocked during IME composition:', e.key);
  }
});

// Prevent crash with error handling
editor.addEventListener('input', (e) => {
  try {
    // Input handling logic
  } catch (error) {
    console.error('Input error:', error);
    // Graceful recovery
    alert('An error occurred during input. Please reload the page.');
  }
});
```
