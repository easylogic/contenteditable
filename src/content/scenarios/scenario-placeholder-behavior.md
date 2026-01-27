---
id: scenario-placeholder-behavior
title: "Placeholder interference with IME and DOM mutations"
description: "Technical analysis of how CSS and attribute-based placeholders disrupt text insertion and IME sessions."
category: "ui"
tags: ["placeholder", "collision", "ime", "rendering"]
status: "confirmed"
locale: "en"
---

## Problem Overview
Standard `<input>` and `<textarea>` elements have native placeholder support. `contenteditable` does not. Developers typically simulate placeholders using the CSS `:empty:before` selector or by injecting a pseudo-node. This simulation often creates a "Race Condition" where the browser's logic for removing the placeholder collides with the user's logic for inserting text, particularly during the startup of an IME session.

## Observed Behavior
### Scenario 1: The Korean IME Decimation (Chrome/Android)
In Chrome 131+ on Android, when the first character of a Korean syllable is typed, the DOM mutation triggered by CSS removing the `:before` placeholder (because the element is no longer `:empty`) causes the browser to reset its internal IME buffer.

```javascript
/* Chrome Logic Loop */
// 1. User types 'ㅎ'
// 2. Element is no longer :empty
// 3. CSS pseudo-element is destroyed
// 4. Mutation event clears the text node 'ㅎ' incorrectly
```

### Scenario 2: Layout Shift on Focus
In Safari, the placeholder often remains visible until a character is typed, but if the placeholder has different padding/font than the text, focusing it can cause a "jump" that moves the caret unexpectedly.

## Impact
- **Character Loss**: The first character of every input session is erased or ignored.
- **Incorrect Positioning**: The caret ends up inside the pseudo-element or at the documents start.
- **Accessibility**: Screen readers often announce the placeholder text *after* the user has already started typing.

## Browser Comparison
- **Chromium**: Vulnerable to "Mutation Collision" specifically on mobile.
- **WebKit**: Prone to layout jumps and caret miscalculations.
- **Gecko**: Generally handles `:empty` transitions safely but may fail to render a caret in zero-height divs.

## Solutions
### 1. Opacity-based Toggling
Instead of allowing `:empty` to destroy the node, toggle its visibility or opacity based on a manually maintained `is-empty` class or the `focus` state.

```css
/* Avoid content: "" changes mid-type */
[contenteditable]::before {
  content: attr(placeholder);
  opacity: 0.5;
}
[contenteditable]:not(:empty)::before,
[contenteditable]:focus::before {
  display: none; /* or visibility: hidden */
}
```

### 2. Manual Placeholder Removal on Focus
Explicitly remove the placeholder state when the element is focused, before any composition events fire.

## Related Cases
- [ce-0568: Placeholder breaks first character of Hangul composition](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0568-chrome-android-placeholder-korean-ime.md)

## References
- [Lexical Issue: Chrome Android Hangul Placeholder](https://github.com/facebook/lexical/issues/6821)
- [ProseMirror: Handling placeholders](https://prosemirror.net/examples/placeholder/)
