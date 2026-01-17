---
id: scenario-composition-events
title: Composition events are not fired consistently for all IMEs
description: "When using certain IMEs (Input Method Editors) like Chinese IME in Safari, composition events (compositionstart, compositionupdate, compositionend) may not fire consistently or may fire in an unexpected order."
category: ime
tags:
  - ime
  - composition
  - events
  - safari
status: draft
locale: en
---

When using certain IMEs (Input Method Editors) like Chinese IME in Safari, composition events (`compositionstart`, `compositionupdate`, `compositionend`) may not fire consistently or may fire in an unexpected order.

## References

- [WebKit Bug 261764: iOS/iPadOS dictation doesn't trigger composition events](https://bugs.webkit.org/show_bug.cgi?id=261764) - Missing composition events
- [WebKit Bug 165004: Event order differences](https://bugs.webkit.org/show_bug.cgi?id=165004) - Event ordering issues
- [WebKit Mailing List: Chinese IME punctuation issues](https://lists.webkit.org/pipermail/webkit-unassigned/2017-March/761221.html) - Composition event missing cases
- [React Issue #8683: Composition events in controlled components](https://github.com/facebook/react/issues/8683) - React composition event issues
- [ProseMirror Discuss: IME composing problems in table cells](https://discuss.prosemirror.net/t/ime-composing-problems-on-td-or-th-element-in-safari-browser/4501) - Table cell composition issues
- [Lexical Issue #5841: isComposing flag issues](https://github.com/facebook/lexical/issues/5841) - Composition state detection
