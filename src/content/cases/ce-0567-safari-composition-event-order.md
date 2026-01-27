---
id: ce-0567-safari-composition-event-order
scenarioId: scenario-composition-events
locale: en
os: macOS
osVersion: "15.0"
device: Desktop
deviceVersion: Any
browser: Safari
browserVersion: "18.0"
keyboard: Japanese IME
caseTitle: "compositionend fires before keydown on Enter"
description: "In Safari, confirming an IME composition with the Enter key triggers 'compositionend' before the 'keydown' event, leading to premature processing of the Enter key by applications."
tags: ["ime", "composition", "events", "safari", "order-mismatch"]
status: confirmed
domSteps:
  - label: "Step 1: Composition Session"
    html: '<div contenteditable="true">あ|</div>'
    description: "User is composing 'あ' (Japanese IME). Composition session is active."
  - label: "Step 2: Press Enter"
    html: '<div contenteditable="true">あ|</div>'
    description: "User presses Enter to confirm. Browser should finalize composition then send keydown."
  - label: "Step 3: Bug Order"
    html: '<div contenteditable="true">あ\n|</div>'
    description: "compositionend fires first (isComposing becomes false). Then keydown fires. App sees Enter with isComposing=false and inserts a newline incorrectly."
  - label: "✅ Expected"
    html: '<div contenteditable="true">あ|</div>'
    description: "Expected: keydown(isComposing: true) -> compositionend. App ignores Enter during composition."
---

## Phenomenon
A long-standing but actively documented (as of Sept 2025) bug in Safari causes a reversal of the expected event sequence during IME commit. According to UI Events specifications, the `keydown` event for the Enter key used to commit a composition should have `isComposing: true` and occur *before* the `compositionend` event. Safari incorrectly dispatches `compositionend` first, followed by a `keydown` where `isComposing` is `false`.

## Reproduction Steps
1. Open a `contenteditable` region in Safari (macOS or iOS).
2. Start an IME composition (e.g., Japanese, Korean, or Chinese).
3. Type some characters so a composition underline appears.
4. Press the **Enter** key once to finalize the composition.
5. Log the sequence of `keydown`, `compositionupdate`, and `compositionend`.

## Observed Behavior
1. **`compositionend`**: Fires immediately upon pressing Enter. Internal "composing" state is set to `false`.
2. **`keydown`**: Fires *afterwards*.
   - `e.key`: "Enter"
   - `e.isComposing`: **`false`** (Mismatch!)
3. **Result**: Applications that listen for "Enter" to perform actions (like sending a chat message or creating a new line) will execute that action because they believe the composition is already finished, even though this specific Enter press was intended only to *finish* the composition.

## Expected Behavior
The `keydown` event should fire first with `isComposing: true`, allowing the application to call `preventDefault()` or ignore the keypress. Then, `compositionend` should fire to mark the end of the session.

## Impact
- **Premature Submission**: Chat apps send an empty or incomplete message when the user only wanted to confirm a character.
- **Double Newlines**: The editor inserts a newline immediately after the committed text.
- **State Corruption**: Frameworks that expect a certain lifecycle are thrown off by the sudden termination of the composition session before the key event.

## Browser Comparison
- **Safari (all versions including 18.0)**: Exhibits the out-of-order behavior.
- **Chrome / Firefox**: Correctly fires `keydown(isComposing: true)` before `compositionend`.

## References & Solutions
### Mitigation: keyCode 229 or Debouncing
Since `isComposing` is unreliable in Safari, developers often check for the special `keyCode: 229` (IME process) or use a "lock" mechanism.

```javascript
let isSafariIME = false;

element.addEventListener('compositionstart', () => { isSafariIME = true; });
element.addEventListener('compositionend', () => {
  // Delay unlocking to catch the trailing keydown in Safari
  setTimeout(() => { isSafariIME = false; }, 50);
});

element.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.isComposing || isSafariIME || e.keyCode === 229)) {
    // Correctly identifies this Enter as a commit action
    e.preventDefault();
  }
});
```

- [WebKit Bugzilla #165231](https://bugs.webkit.org/show_bug.cgi?id=165231)
- [MDN: compositionend (Note on Safari behavior)](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event)
