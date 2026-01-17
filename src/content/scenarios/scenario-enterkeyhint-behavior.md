---
id: scenario-enterkeyhint-behavior
title: enterkeyhint attribute does not work on contenteditable
description: "The enterkeyhint attribute, which controls the label on the Enter key on mobile keyboards, does not work on contenteditable elements. The Enter key label remains the default regardless of the attribute value."
category: mobile
tags:
  - enterkeyhint
  - mobile
  - android
  - chrome
status: draft
locale: en
---

The `enterkeyhint` attribute, which controls the label on the Enter key on mobile keyboards, does not work on contenteditable elements. The Enter key label remains the default regardless of the attribute value.

## References

- [WHATWG HTML: enterkeyhint attribute](https://html.spec.whatwg.org/multipage/interaction.html) - enterkeyhint specification
- [WebKit Blog: New WebKit features in Safari 13.1](https://webkit.org/blog/10247/new-webkit-features-in-safari-13-1/) - iOS Safari support
- [Stack Overflow: Combine numeric keyboard and enterkeyhint](https://stackoverflow.com/questions/72405834/combine-numeric-virtual-keyboard-and-enterkeyhint-on-mobile-safari) - Numeric keyboard limitations
- [Stack Overflow: Updating enterkeyhint resets input value](https://stackoverflow.com/questions/71381764/updating-enterkeyhint-resets-the-input-value-on-chrome-android) - Chrome Android issues
