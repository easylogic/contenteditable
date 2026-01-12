---
id: ce-0229
scenarioId: scenario-ime-composition-focus-change
locale: en
os: Windows
osVersion: "10/11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120+"
keyboard: Korean (IME) - Microsoft IME
caseTitle: Partial character commit when moving focus to another textbox during IME composition
description: "When composing Korean text with IME in a contenteditable element, moving focus to another textbox during composition causes the composition to not properly terminate, leaving partially committed jamo (consonant/vowel) characters in the original field or in an incomplete state."
tags:
  - composition
  - ime
  - focus
  - blur
  - korean
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
    description: "Only jamo 'ㅎ' remains in first field, focus move to second field fails"
  - label: "✅ Expected"
    html: '<div contenteditable="true">나</div>'
    description: "Composition completes, then focus moves to second field"
---

## Phenomenon

When composing text with Korean IME in a `contenteditable` element, moving focus to another textbox causes the composition to not properly terminate.

## Reproduction example

1. Focus the first contenteditable element.
2. Activate Korean IME.
3. Start composing a character (e.g., '나' = ㅎ + ㄴ).
4. Before composition completes (after typing initial consonant ㅎ), click the second textbox or move focus using a button.

## Observed behavior

- **compositionend event fires**: `compositionend` fires in the first field, but the composition is not fully cleaned up.
- **Partial jamo remains**: The jamo 'ㅎ' remains in the first field.
- **Second field focus fails**: Focus does not move to the second field, or if it does, the composition state does not continue properly.
- **Input continues**: Continuing to type in the new field behaves as if the previous composition completed, but the first field's state is not cleaned up.

## Expected behavior

- Composition should fully terminate and the final character ('나') should be committed to the first field.
- Focus should smoothly move to the second field.

## Notes and possible direction for workarounds

- **Detect compositionend**: Check if `compositionend` event has fired before moving focus.
- **setTimeout delay**: Add a small delay (100-200ms) to focus movement to give the IME time to clean up the composition.
- **Composition state flag**: Use `isComposing` flag to prevent focus movement during composition.
- **UI feedback**: Disable buttons that move focus to other fields during composition, or provide visual feedback.

## Code example

```javascript
let isComposing = false;

const editor1 = document.querySelector('div[contenteditable]:nth-child(1)');
const editor2 = document.querySelector('div[contenteditable]:nth-child(2)');

// Track composition state
editor1.addEventListener('compositionstart', () => {
  isComposing = true;
});

editor1.addEventListener('compositionend', () => {
  isComposing = false;
  // Move focus after composition completes
  setTimeout(() => {
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
