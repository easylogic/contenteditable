---
id: scenario-ime-composition-keydown-keycode-229
title: IME composition triggers duplicate keydown events with keyCode 229
description: "During IME composition, pressing certain keys (especially Enter) may trigger duplicate keydown events. The first event has keyCode 229 (indicating IME is processing the input), followed by the actual key's keyCode (e.g., 13 for Enter). This can cause event handlers to execute twice for a single key press."
category: ime
tags:
  - ime
  - composition
  - keydown
  - keycode-229
  - duplicate-events
status: draft
locale: en
---

During IME composition, pressing certain keys (especially Enter) may trigger duplicate `keydown` events. The first event has `keyCode 229` (indicating IME is processing the input), followed by the actual key's `keyCode` (e.g., 13 for Enter). This can cause event handlers to execute twice for a single key press.

## Observed Behavior

When pressing Enter during IME composition:

1. First `keydown` event fires with `keyCode: 229`
   - `keyCode 229` is a special value indicating that IME is processing the input
   - The actual key code is not available at this point
   - `e.isComposing === true` (if available)
2. Second `keydown` event fires with `keyCode: 13` (Enter)
   - This is the actual Enter key event
   - May occur after composition commits or during composition

## Language-Specific Manifestations

This issue manifests across all languages that use IME composition:

- **Korean IME**: Enter key during composition triggers keyCode 229 followed by 13
- **Japanese IME**: Similar behavior with Enter and other keys
- **Chinese IME**: Similar behavior with Enter and other keys
- **Other IMEs**: Similar issues may occur with other languages

## Impact

- Event handlers listening to `keydown` events may execute twice for a single key press
- This can lead to:
  - Duplicate line breaks when pressing Enter
  - Incorrect command execution (e.g., shortcuts triggered twice)
  - Performance issues (double processing)
  - State synchronization issues
  - Unexpected UI behavior

## Browser Comparison

- **Chrome/Edge**: May fire keyCode 229 followed by actual keyCode during composition
- **Firefox**: May have similar behavior
- **Safari**: Behavior may vary

## Technical Details

`keyCode 229` is a special value defined in the DOM Level 3 Events specification:
- It indicates that the key event is part of an IME composition
- The actual key code is not available because IME is processing the input
- This is different from `beforeinput` events which have `isComposing` property

## Workaround

Handle `keydown` events during composition by checking for `keyCode 229` and ignoring it, or by tracking composition state:

```javascript
let isComposing = false;
let lastKeyCode229 = null;

element.addEventListener('compositionstart', () => {
  isComposing = true;
});

element.addEventListener('compositionend', () => {
  isComposing = false;
  lastKeyCode229 = null;
});

element.addEventListener('keydown', (e) => {
  if (isComposing) {
    if (e.keyCode === 229) {
      // Store the timestamp or other info if needed
      lastKeyCode229 = e;
      // Option 1: Ignore keyCode 229 events
      return;
    }
    
    // Option 2: If actual keyCode follows keyCode 229, handle it once
    if (lastKeyCode229 && e.keyCode !== 229) {
      // This is the actual key event after IME processing
      // Handle it normally
      lastKeyCode229 = null;
    }
  }
  
  // Handle keydown normally when not composing
  handleKeyDown(e);
});
```

**Alternative approach**: Use `beforeinput` events instead of `keydown` when possible, as they provide better composition state information:

```javascript
element.addEventListener('beforeinput', (e) => {
  // beforeinput events have isComposing property
  if (e.isComposing) {
    // Handle composition-related input
    return;
  }
  
  // Handle normal input
  handleInput(e);
});
```

**Important Notes**:

- `keyCode` is deprecated. Consider using `e.key` or `e.code` instead when possible
- However, `keyCode 229` is a special case that may still be relevant for IME handling
- The `isComposing` property is available on `beforeinput` and `input` events, but not on `keydown` events in all browsers
- Always test with actual IMEs (Korean, Japanese, Chinese) as behavior may vary

## References

- [Stack Overflow: Is it ok to ignore keydown events with keyCode 229?](https://stackoverflow.com/questions/25043934/is-it-ok-to-ignore-keydown-events-with-keycode-229) - keyCode 229 handling
- [Stum.de: Handling IME events in JavaScript](https://www.stum.de/2016/06/24/handling-ime-events-in-javascript/) - IME event patterns
- [W3C UI Events: Composition events](https://www.w3.org/TR/2015/WD-uievents-20151215/) - Event specification
- [Dev.to: Why 1.6 billion East Asians are raging at your Enter key handler](https://dev.to/yukimi-inu/why-16-billion-east-asians-are-quietly-raging-at-your-enter-key-handler-1po0) - Composition event handling
- [Alibaba Cloud: Listen to IME keyboard input events](https://topic.alibabacloud.com/a/listen-to-ime-keyboard-input-events-in-javascript_1_24_32332279.html) - Browser differences
- [Gatunka Blog: IME basics for developers](https://blog.gatunka.com/2009/09/20/ime-basics-for-developers/) - Firefox behavior
