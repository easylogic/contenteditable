---
id: scenario-entermode-behavior
title: enterkeyhint and inputmode affect Enter key behavior inconsistently
description: "On mobile devices, the combination of enterkeyhint and inputmode attributes may affect Enter key behavior inconsistently on contenteditable elements. The Enter key may insert line breaks when it should perform an action, or vice versa."
category: mobile
tags:
  - enterkeyhint
  - inputmode
  - mobile
  - ios
  - safari
status: draft
locale: en
---

On mobile devices, the combination of `enterkeyhint` and `inputmode` attributes may affect Enter key behavior inconsistently on contenteditable elements. The Enter key may insert line breaks when it should perform an action, or vice versa.

## References

- [WHATWG HTML: inputmode attribute](https://html.spec.whatwg.org/multipage/interaction.html) - inputmode specification
- [MDN: enterkeyhint global attribute](https://developer.mozilla.org/docs/Web/HTML/Reference/Global_attributes/enterkeyhint) - enterkeyhint documentation
- [Can I Use: enterkeyhint](https://caniuse.com/mdn-html_global_attributes_enterkeyhint) - Browser compatibility
- [Stack Overflow: Combine numeric keyboard and enterkeyhint](https://stackoverflow.com/questions/72405834/combine-numeric-virtual-keyboard-and-enterkeyhint-on-mobile-safari) - Numeric keyboard limitations
