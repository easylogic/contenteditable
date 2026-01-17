---
id: scenario-spellcheck-behavior
title: Spellcheck interferes with contenteditable editing
description: "When spellcheck=\"true\" is enabled on a contenteditable region in Safari, the spellcheck functionality may interfere with normal editing. Red underlines may appear incorrectly, and the spellcheck UI may block text selection or editing."
category: other
tags:
  - spellcheck
  - editing
  - safari
status: draft
locale: en
---

When `spellcheck="true"` is enabled on a contenteditable region in Safari, the spellcheck functionality may interfere with normal editing. Red underlines may appear incorrectly, and the spellcheck UI may block text selection or editing.

## References

- [Stack Overflow: iOS Safari spellcheck suggestion menu with spellcheck false](https://stackoverflow.com/questions/78022279/ios-safari-when-contenteditable-true-and-spellcheck-false-clicking-on-a-word-tha) - Suggestion menu issues
- [Stack Overflow: Remove underlines after setting spellcheck to false](https://stackoverflow.com/questions/62515239/remove-underlines-after-setting-the-spellcheck-attribute-to-false) - Underline clearing
- [TutorialPedia: Disable spell checking on HTML textfields](https://www.tutorialpedia.org/blog/disable-spell-checking-on-html-textfields/) - Attribute combinations
- [Stack Overflow: Red spellcheck squiggles remain after editing disabled](https://stackoverflow.com/questions/12812348/red-spellcheck-squiggles-remain-in-chrome-after-editing-is-disabled/12839373) - Force re-render solutions
- [Stack Overflow: Prevent red squiggle lines from contenteditable](https://stackoverflow.com/questions/57468200/how-to-prevent-red-squiggle-lines-from-a-contenteditable-div-that-is-no-longer-i) - Toggle contenteditable approach
- [MDN: ::spelling-error pseudo-element](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/%3A%3Aspelling-error) - CSS styling for spelling errors
