---
id: ce-0251-mac-accent-menu-composition-en
scenarioId: scenario-mac-accent-menu-composition
locale: en
os: macOS
osVersion: "13+"
device: Desktop (Mac)
deviceVersion: Any
browser: Safari
browserVersion: "17+"
keyboard: English (QWERTY)
caseTitle: Mac accent menu composition events inconsistent
description: "On macOS, using accent menu (holding vowel key for accented character, or option+key combinations) does NOT consistently trigger standard IME composition events. This makes it difficult to distinguish accent menu input from IME input or regular keyboard input."
tags:
  - composition
  - ime
  - macos
  - accent-menu
  - keyboard
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    Type text here. Try using the accent menu (hold vowel key or press option+key) to enter special characters like é, ü, or other accented characters, and observe if composition events fire.
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true"></div>'
    description: "Empty editor"
  - label: "Step 1: Use accent menu for 'é'"
    html: '<div contenteditable="true">é</div>'
    description: "Accent menu 'é' inserted (may not fire composition events)"
  - label: "Step 2: Type more characters"
    html: '<div contenteditable="true">éHello</div>'
    description: "Continue typing"
  - label: "Observation"
    html: '<div contenteditable="true">éHello</div>'
    description: "compositionstart event may not fire, inconsistent behavior"
  - label: "✅ Expected"
    html: '<div contenteditable="true">Hello</div>'
    description: "Expected: When using full IME, composition events should fire"
---

## 현상

On macOS, when using the accent menu to insert accented characters or special symbols, standard IME composition events do not fire consistently. This affects distinguishing accent menu input from IME input.

## 재현 예시

1. Focus on contenteditable element.
2. Use accent menu (hold vowel key + option) to enter special character (e.g., 'é').
3. Continue typing with regular keyboard.

## 관찰된 동작

- **compositionstart missing**: `compositionstart` event may not fire when using accent menu
- **compositionupdate inconsistent**: `compositionupdate` may not fire or fires at unexpected times
- **compositionend missing/delayed**: `compositionend` may not fire or fires with delay
- **Difficult to distinguish**: Hard to tell if user is using accent menu or full IME programmatically

## 예상 동작

- Accent menu usage should trigger composition events consistently
- Should be able to distinguish from regular keyboard input
- Composition events should follow standard sequence

## 참고사항 및 가능한 해결 방향

- **Use beforeinput inputType**: Check `inputType = 'insertCompositionText'` to detect IME input
- **Track keyboard state**: Monitor keydown/keyup events as fallback
- **Alternative state management**: Use additional state flags
- **macOS specific understanding**: Understand how accent menu works at system level

## 코드 예시

```javascript
const editor = document.querySelector('div[contenteditable]');
let isComposing = false;
let lastInputType = '';
let keyDownCount = 0;
let keyUpCount = 0;

editor.addEventListener('beforeinput', (e) => {
  lastInputType = e.inputType || '';
  if (e.inputType === 'insertCompositionText') {
    // IME composition
    isComposing = true;
  } else if (e.inputType === 'insertText') {
    // Regular keyboard input
    if (isComposing && lastInputType !== 'insertCompositionText') {
      // insertText without prior compositionstart = likely accent menu
      console.warn('Potential accent menu usage without composition events');
    }
  }
});

editor.addEventListener('compositionstart', () => {
  isComposing = true;
  console.log('Composition started');
});

editor.addEventListener('compositionupdate', (e) => {
  console.log('Composition update:', e.data);
});

editor.addEventListener('compositionend', () => {
  isComposing = false;
  console.log('Composition ended');
});

// Detect accent menu as alternative
editor.addEventListener('keydown', (e) => {
  keyDownCount++;
  
  const isAccentMenu = e.altKey || isVowelKey(e.key) || isLongKeyPress();
  
  if (isAccentMenu) {
    console.log('Potential accent menu usage detected');
  }
});

editor.addEventListener('keyup', (e) => {
  keyUpCount++;
});

function isVowelKey(key) {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  return vowels.includes(key.toLowerCase());
}

function isLongKeyPress() {
  return keyDownCount > keyUpCount + 1;
}
```
