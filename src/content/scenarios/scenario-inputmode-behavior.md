---
id: scenario-inputmode-behavior
title: inputmode attribute does not affect virtual keyboard on mobile
description: The `inputmode` attribute, which should control the type of virtual keyboard shown on mobile devices, does not work on contenteditable regions in iOS Safari. The keyboard type cannot be controlled.
category: mobile
tags:
  - inputmode
  - mobile
  - keyboard
  - ios
status: draft
locale: en
---

The `inputmode` attribute, which should control the type of virtual keyboard shown on mobile devices, does not work on contenteditable regions in iOS Safari. The keyboard type cannot be controlled.

## References

- [MDN: inputmode global attribute](https://developer.mozilla.org/docs/Web/HTML/Reference/Global_attributes/inputmode) - inputmode documentation
- [CSS-Tricks: Everything about inputmode](https://css-tricks.com/everything-you-ever-wanted-to-know-about-inputmode/) - Browser compatibility
- [WHATWG HTML Issue #4876: inputmode on contenteditable](https://github.com/whatwg/html/issues/4876) - Dynamic changes not working
- [MDN Browser Compat Data Issue #5085: iOS inputmode flaky](https://github.com/mdn/browser-compat-data/issues/5085) - iOS version issues
- [Stack Overflow: contenteditable not working on iOS7](https://stackoverflow.com/questions/21295698/html5-contenteditable-attribute-not-working-properly-on-ios7-mobile-safari) - CSS workarounds
