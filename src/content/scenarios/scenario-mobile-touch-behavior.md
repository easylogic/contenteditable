---
id: scenario-mobile-touch-behavior
title: Touch events interfere with contenteditable focus on mobile
description: On iOS Safari, touch events (tap, long-press) on a contenteditable region may not properly focus the element. The virtual keyboard may not appear, or focus may be lost unexpectedly.
category: mobile
tags:
  - mobile
  - touch
  - focus
  - ios
status: draft
locale: en
---

On iOS Safari, touch events (tap, long-press) on a contenteditable region may not properly focus the element. The virtual keyboard may not appear, or focus may be lost unexpectedly.

This scenario has been observed in multiple environments with similar behavior.

## References

- [Algolia Support: Autocomplete input focus on iPhone](https://support.algolia.com/hc/en-us/articles/15445252263057-Why-doesn-t-Autocomplete-input-get-focus-or-open-the-keyboard-when-entering-detached-mode-on-iPhone-iOS) - User gesture requirements
- [Stack Overflow: contenteditable div doesn't focus on iPad](https://stackoverflow.com/questions/76043001/contenteditable-div-doesnt-focus-on-ipad-using-requestanimationframe) - Focus timing issues
- [ProseMirror Discuss: Can't focus on iOS](https://discuss.prosemirror.net/t/cant-focus-on-ios/3372) - iOS focus problems
- [GitHub Gist: Trigger focus with soft keyboard dynamically](https://gist.github.com/azaek/a52ffe350ff408f5932ffb228f0ca4e4) - Dummy input workaround
