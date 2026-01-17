---
id: ce-0231-korean-ime-focus-blur-safari
scenarioId: scenario-ime-composition-focus-change
locale: en
os: macOS
osVersion: "13+"
device: Desktop (Mac)
deviceVersion: Any
browser: Safari
browserVersion: "17+"
keyboard: Korean (IME) - macOS Korean Input Method
caseTitle: Unexpected behavior when moving focus to another textbox during IME composition (Safari)
description: "In Safari, when composing Korean text with IME and moving focus to another textbox during composition, partially uncommitted jamo may remain, similar to Chrome/Firefox, or WebKit-specific focus/selection issues may occur."
tags:
  - composition
  - ime
  - focus
  - blur
  - korean
  - safari
  - webkit
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; margin-bottom: 10px;">
    First input field.
  </div>
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; margin-bottom: 10px;">
    Second input field.
  </div>
  <div style="margin-top: 20px;">
    <button onclick="document.querySelector('div[contenteditable]').focus()">Focus First</button>
    <button onclick="document.querySelectorAll('div[contenteditable]')[1].focus()">Focus Second</button>
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true">ㅎ</div>'
    description: "Composing '나' with Korean IME"
  - label: "❌ After (Bug)"
    html: '<div contenteditable="true">ㅎ</div><div contenteditable="true">ㅎ</div>'
    description: "Jamo 'ㅎ' remains in first field and also appears in second field"
  - label: "✅ Expected"
    html: '<div contenteditable="true">나</div>'
    description: "Composition completes, cursor exists only in second field"
---

## Phenomenon

In Safari, when composing text with Korean IME, moving focus to another textbox causes the composition to not properly terminate, and WebKit-specific issues may occur.

## Reproduction example

1. Focus the first contenteditable element.
2. Activate macOS Korean IME.
3. Start composing a character (e.g., '나' = ㅎ + ㄴ).
4. Before composition completes (after typing initial consonant ㅎ), click the second textbox or move focus using a button.

## Observed behavior

- **Jamo transfer phenomenon**: The jamo 'ㅎ' may appear not only in the first field but also in the second field.
- **WebKit focus issues**: WebKit tends to maintain focus even after external clicks, so focus may not properly move.
- **selection addRange failures**: In Safari, `selection.addRange()` may not work as intended (related scenario: selection-addrange-safari-fail).
- **compositionend uncertainty**: `compositionend` event fires, but the composition state is not fully cleaned up.

## Expected behavior

- Composition should fully terminate and the final character ('나') should be committed only to the first field.
- Focus should cleanly move to the second field.
- The composition state in the first field should be completely cleaned up.

## Notes and possible direction for workarounds

- **Understand WebKit focus quirks**: Recognize that Safari/WebKit focus management may differ from other browsers.
- **Use forced blur**: Explicitly call `editor1.blur()` before moving focus to force IME state termination.
- **Check CSS user-select**: Verify that `-webkit-user-select: text;` is properly set (related scenario: user-select-breaks-safari).
- **Selection API caution**: Safari may have issues with `selection.addRange()`, so consider alternative selection setting methods.

## Code example

```javascript
let isComposing = false;

const editor1 = document.querySelector('div[contenteditable]:nth-child(1)');
const editor2 = document.querySelector('div[contenteditable]:nth-child(2)');

editor1.addEventListener('compositionstart', () => {
  isComposing = true;
});

editor1.addEventListener('compositionend', () => {
  isComposing = false;
  // Safari-specific: force blur to terminate IME state
  setTimeout(() => {
    editor1.blur();
    editor2.focus();
  }, 150);
});

// On button click
document.querySelector('button').addEventListener('click', () => {
  if (!isComposing) {
    editor2.focus();
  } else {
    alert('IME input in progress. Please wait for completion.');
  }
});
```
