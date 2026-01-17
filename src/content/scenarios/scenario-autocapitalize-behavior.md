---
id: scenario-autocapitalize-behavior
title: autocapitalize attribute works inconsistently on contenteditable
description: The `autocapitalize` attribute, which controls automatic capitalization on mobile keyboards, works inconsistently on contenteditable elements. The behavior may differ from standard input elements.
category: mobile
tags:
  - autocapitalize
  - mobile
  - ios
  - safari
status: draft
locale: en
---

The `autocapitalize` attribute, which controls automatic capitalization on mobile keyboards, works inconsistently on contenteditable elements. The behavior may differ from standard input elements.

## References

- [MDN: autocapitalize global attribute](https://developer.mozilla.org/docs/Web/HTML/Reference/Global_attributes/autocapitalize) - autocapitalize documentation
- [MDN: HTMLElement.autoCapitalize](https://developer.mozilla.org/docs/Web/API/HTMLElement/autoCapitalize) - autoCapitalize property
- [WebKit Bug 148503: autocapitalize not supported on contenteditable](https://bugs.webkit.org/show_bug.cgi?id=148503) - iOS Safari support issues
- [WebKit Bug 287578: contenteditable-autocapitalize test flaky](https://bugs.webkit.org/show_bug.cgi?id=287578) - Test instability
- [Stack Overflow: Can autocapitalize be turned off with JavaScript?](https://stackoverflow.com/questions/1145880/can-autocapitalize-be-turned-off-with-javascript-in-mobile-safari) - JavaScript attribute handling
- [TutorialPedia: Disable spell checking](https://www.tutorialpedia.org/blog/disable-spell-checking-on-html-textfields/) - Related attributes
