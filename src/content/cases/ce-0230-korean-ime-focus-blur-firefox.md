---
id: ce-0230
scenarioId: scenario-ime-composition-focus-change
locale: en
os: Windows
osVersion: "10/11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120+"
keyboard: Korean (IME) - Microsoft IME
caseTitle: Jamo remains when moving focus to another textbox during IME composition (Firefox)
description: "In Firefox, when composing Korean text with IME and moving focus to another textbox during composition, partially uncommitted jamo remains in the original field, similar to Chrome. However, Firefox-specific selection issues may also occur."
tags:
  - composition
  - ime
  - focus
  - blur
  - korean
  - firefox
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
    description: "Composing '나' with Korean IME (after typing ㅎ, before typing ㄴ)"
  - label: "❌ After (Bug)"
    html: '<div contenteditable="true">ㅎ</div>'
    description: "Jamo 'ㅎ' remains in first field, focus moves to second field"
  - label: "✅ Expected"
    html: '<div contenteditable="true">나</div>'
    description: "Composition completes, then focus moves to second field"
---

## Phenomenon

In Firefox, when composing text with Korean IME, moving focus to another textbox causes the composition to not properly terminate.

## Reproduction example

1. Focus the first contenteditable element.
2. Activate Korean IME.
3. Start composing a character (e.g., '나' = ㅎ + ㄴ).
4. Before composition completes (after typing initial consonant ㅎ), click the second textbox or move focus using a button.

## Observed behavior

- **compositionend fires but jamo remains**: `compositionend` event fires, but the jamo 'ㅎ' remains in the first field.
- **Second field focus**: Focus moves to the second field.
- **Selection instability**: Firefox may also have selection-related issues, where the jamo in the first field may not be properly selected.
- **Input disabled state**: Attempting to type in the second field may cause the jamo in the first field to disappear or behave unexpectedly.

## Expected behavior

- Composition should fully terminate and the final character ('나') should be committed to the first field.
- Focus should smoothly move to the second field.
- The cursor state in the first field should be cleaned up.

## Notes and possible direction for workarounds

- **Wait for compositionend**: Wait for `compositionend` event to fully process before moving focus.
- **Selection API caution**: Firefox's selection API may behave differently from other browsers, so caution is needed.
- **Use clearSelection**: After moving focus, explicitly call `selection.removeAllRanges()` to clean up existing selection.

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
  // Firefox-specific: clear selection
  setTimeout(() => {
    document.getSelection()?.removeAllRanges();
    editor2.focus();
  }, 100);
});

// Safely move focus on button click
document.querySelector('button').addEventListener('click', () => {
  if (!isComposing) {
    editor2.focus();
  } else {
    alert('IME input in progress. Please wait for completion.');
  }
});
```
