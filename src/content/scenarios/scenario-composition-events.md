---
id: scenario-composition-events
title: "Composition event lifecycle inconsistencies across browsers"
description: "Analysis of how out-of-order or missing composition events disrupt editor state synchronization."
category: "ime"
tags: ["ime", "composition", "events", "order", "reliability"]
status: "confirmed"
locale: "en"
---

## Problem Overview
For CJK (Chinese, Japanese, Korean) languages, the `Composition` event lifecycle is as important as the `Input` event loop. Frameworks often "lock" their state during composition to prevent the browser's intermediate DOM states from corrupting the internal model. If events fire out of order, or if `isComposing` flags are incorrectly set, the framework may prematurely "unlock" and perform a destructive sync.

## Observed Behavior
### Scenario 1: Event Order Inversion (Safari)
In Safari, when committing with Enter, `compositionend` fires before the matching `keydown`. This clears the `isComposing` flag too early.

```javascript
/* Expected Sequence */
// 1. keydown (key: Enter, isComposing: true)
// 2. compositionend

/* Safari Sequence */
// 1. compositionend (State unlocked!)
// 2. keydown (key: Enter, isComposing: false) -> Triggers newline/send!
```

### Scenario 2: Missing Events (Dictation/Auto-correct)
OS-level features like iOS Dictation or macOS auto-correct (double-space period) often modify text by injecting characters directly, sometimes bypassing `compositionupdate` entirely.

## impact
- **Premature Command Execution**: Enter keys meant for composition are treated as editor commands (e.g., new paragraph).
- **History Corruption**: The undo stack treats the final character as a separate operation from the composition.
- **Visual Stutter**: The editor model and DOM fight over the uncommitted text.

## Browser Comparison
- **WebKit (Safari)**: Notable for the "order inversion" bug during Enter commits.
- **Blink (Chrome)**: Most compliant, but known for "ghost" `compositionupdate` events during rapid typing.
- **Gecko (Firefox)**: Fires `keydown` with `keyCode 229` consistently, making it the most reliable to detect IME activity.

## Solutions
### 1. The "Lock Delay" (Safari fix)
Use a short timeout after `compositionend` before allowing `keydown` events to proceed normally.

```javascript
let imeLock = false;
element.addEventListener('compositionstart', () => { imeLock = true; });
element.addEventListener('compositionend', () => {
  setTimeout(() => { imeLock = false; }, 40); // Catch the Safari keydown
});
```

### 2. keyCode 229 Check
Reliably detect IME activity across engines by checking the deprecated but universally supported `keyCode 229`.

## Related Cases
- [ce-0567: compositionend fires before keydown on Enter](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0567-safari-composition-event-order.md)

## References
- [W3C UI Events: Composition Events](https://www.w3.org/TR/uievents/#events-compositionevents)
- [WebKit Bug 165231](https://bugs.webkit.org/show_bug.cgi?id=165231)
