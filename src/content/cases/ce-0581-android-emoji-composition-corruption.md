---
id: ce-0581
scenarioId: scenario-ime-interaction-patterns
locale: en
os: Android
osVersion: "14.0 / 15.0"
device: Smartphone
deviceVersion: Any
browser: Chrome
browserVersion: "131.0+"
keyboard: Gboard (Emoji)
caseTitle: "Android Chrome: Emoji insertion cancels composition without committing"
description: "Inserting an emoji while a composition session is active incorrectly cancels the IME session without firing the expected 'insertText' event for the buffered characters."
tags: ["android", "chrome-131", "emoji", "composition", "data-loss"]
status: confirmed
domSteps:
  - label: "1. Active Composition"
    html: '<div contenteditable="true">Han<span>g</span>|</div>'
    description: "User is mid-composition for a Korean syllable (e.g., 'ㄱ')."
  - label: "2. Insert Emoji"
    html: '<!-- User clicks 😊 from Gboard -->'
    description: "The user switches to the emoji pane and inserts an icon."
  - label: "3. Result (Bug)"
    html: '<div contenteditable="true">Han😊|</div>'
    description: "The emoji is inserted, but the 'g' (the active composition) is DELETED instead of being committed."
  - label: "✅ Expected"
    html: '<div contenteditable="true">Hang😊|</div>'
    description: "Expected: The browser should flush the composition buffer ('g') before inserting the emoji."
---

## Phenomenon
A data-loss bug exists in high-version Chromium for Android (131+) when mixing complex IME composition with emoji input. If a user is in the middle of typing a character (especially in CJK or Thai) and switches to the emoji keyboard to insert an icon, the browser triggers a `compositionend` event with `data: ""` or null. This effectively wipes out the currently composing character instead of finalizing it.

## Reproduction Steps
1. Open a `contenteditable` editor on Android.
2. Use a CJK IME (like Korean Gboard).
3. Type a character so that the underline is visible (active composition).
4. Without hitting Space or Enter, open the Emoji menu and select an emoji.
5. Check if the composing character remains in the DOM.

## Observed Behavior
- **Buffer Wipeout**: The `compositionupdate` text disappears from the DOM.
- **Missing Events**: The browser fails to send an `insertReplacementText` or `insertText` event for the ghost-character.
- **Inconsistent 'beforeinput'**: `beforeinput` types for the emoji are fired, but no events are fired to "clean up" the previous session.

## Impact
- **Information Loss**: Users lose the last syllable of their sentence if they punctuate with an emoji.
- **Frustration**: Users must switch back keyboards, re-type the character, and then re-add the emoji.

## Browser Comparison
- **Chrome for Android (131+)**: Confirmed regression.
- **iOS Safari**: Correctly flushes the composition buffer before inserting the emoji.
- **Firefox for Android**: Generally stable; correctly handles the keyboard switch.

## References & Solutions
### Mitigation: manual flush
Developers can watch for a keyboard type change (if detectable) or manually capture the last `compositionupdate` value. If a focus-like or input-mode change occurs while `isComposing` is true, manually insert the cached text.

- [Chromium Issue #381254331: Emoji picker cancels composition](https://issues.chromium.org/issues/381254331)
