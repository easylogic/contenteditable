---
id: ce-0577-android-first-word-duplication
scenarioId: scenario-ime-composition-duplicate-events
locale: en
os: Android
osVersion: "14.0"
device: Smartphone
deviceVersion: Any
browser: Chrome
browserVersion: "131.0"
keyboard: Gboard (English/Korean)
caseTitle: "Android: First word duplication after space + backspace"
description: "A chronic issue on Android where the IME's composition buffer incorrectly duplicates the first character or word of a sentence after a combination of space and backspace."
tags: ["android", "ime", "duplication", "composition", "chrome-131"]
status: confirmed
domSteps:
  - label: "Step 1: Type First Word"
    html: '<div contenteditable="true">Hello |</div>'
    description: "User types 'Hello' followed by a space."
  - label: "Step 2: Backspace and Re-type"
    html: '<div contenteditable="true">Hello|</div>'
    description: "User backspaces to delete the space and then tries to type again or delete more."
  - label: "Step 3: Bug Result"
    html: '<div contenteditable="true">HelloHello|</div>'
    description: "The IME buffer loses track of the previous word and re-submits it into the DOM, or duplicates the first character of the next word."
  - label: "✅ Expected"
    html: '<div contenteditable="true">Hello|</div>'
    description: "Expected: No duplication should occur. The IME should correctly map its internal buffer to the current DOM state."
---

## Phenomenon
One of the most elusive and frustrating behaviors on Android involves the "Ghost Buffer." When users perform a sequence of typing, spacing, and backspacing at the start of a block or after a specific punctuation, the Android IME (Gboard, Samsung Keyboard) often fails to synchronize its last-committed word with the browser's DOM. This results in the editor suddenly duplicating the last word or character when the user resumes typing.

## Reproduction Steps
1. Open a `contenteditable` editor on Android Chrome.
2. Type a word (e.g., "Hello").
3. Type a space.
4. Press Backspace to delete the space.
5. Immediately type another letter or another space.
6. Observe the duplication in the DOM.

## Observed Behavior
- **`input` event explosion**: The browser sends multiple `insertText` or `insertCompositionText` events in rapid succession.
- **Buffer Re-submission**: The IME sends the entire internal buffer (e.g., "Hello") again, even though it was already committed to the DOM.
- **Caret Displacement**: The caret often jumps to the end of the duplicated string, forcing the user to manually delete the extra text.

## Expected Behavior
The IME should maintain a strict 1:1 mapping with the DOM nodes. A backspace should correctly clear the internal buffer's "last character" state without triggering a re-submission of the entire preceding word.

## Impact
- **Severe Typing Resistance**: Users have to constantly stop and fix duplicated text, making long-form writing nearly impossible.
- **State Corruption**: If the editor uses a structured model, these "unauthorized" mutations can bypass the model's logic, leading to a de-sync between the UI and the data.

## Browser Comparison
- **Chrome for Android**: High frequency of occurrence across various Android versions.
- **Firefox for Android**: Generally more stable in buffer management but has its own "stutter" issues.
- **iOS Safari**: Almost never exhibits this specific buffer re-submission bug.

## References & Solutions
### Mitigation: Composition Locking
Many frameworks (Lexical, ProseMirror) implement a "mutation guard" that detects if the DOM has changed in a way that the model didn't authorize during a composition session, and if so, it forced-reconciles the DOM back to the model state.

```javascript
/* Conceptual Mitigation */
element.addEventListener('input', (e) => {
  if (isAndroid && e.inputType === 'insertCompositionText') {
    // Detect if the incoming text dramatically differs from the expected diff
    if (isLikelyDuplication(e.data, currentModel)) {
      e.stopImmediatePropagation();
      forceReconcileModelToDom();
    }
  }
});
```

- [Lexical Issue: Duplicate text on Android](https://github.com/facebook/lexical/issues/3348)
- [ProseMirror: Android composition madness](https://prosemirror.net/docs/guide/#view.android)
