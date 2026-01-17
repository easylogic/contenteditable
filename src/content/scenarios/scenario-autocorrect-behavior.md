---
id: scenario-autocorrect-behavior
title: autocorrect attribute behavior differs on contenteditable
description: "The autocorrect attribute, which controls automatic text correction on mobile keyboards, behaves differently on contenteditable elements compared to standard input elements. The correction suggestions may interfere with editing."
category: mobile
tags:
  - autocorrect
  - mobile
  - ios
  - safari
status: draft
locale: en
---

The `autocorrect` attribute, which controls automatic text correction on mobile keyboards, behaves differently on contenteditable elements compared to standard input elements. The correction suggestions may interfere with editing.

## References

- [MDN: autocorrect global attribute](https://developer.mozilla.org/docs/Web/HTML/Reference/Global_attributes/autocorrect) - autocorrect documentation
- [TutorialPedia: Disable spell checking on HTML textfields](https://www.tutorialpedia.org/blog/disable-spell-checking-on-html-textfields/) - Attribute combinations
- [Stack Overflow: Disable autocorrect on contenteditable div](https://stackoverflow.com/questions/8172397/disable-mac-os-x-lion-safaris-autocorrect-on-contenteditable-div) - iOS Safari issues
- [WebKit Bug 148503: autocapitalize not supported on contenteditable](https://bugs.webkit.org/show_bug.cgi?id=148503) - Related attribute issues
- [WebKit Bug 265674: Predictive text bar not updating](https://lists.webkit.org/pipermail/webkit-unassigned/2023-December/1135698.html) - Caret movement issues
- [WebKit Bug 265856: Autocorrect UI doesn't disappear](https://lists.webkit.org/pipermail/webkit-unassigned/2023-December/1136334.html) - UI synchronization issues
