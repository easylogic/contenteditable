---
id: scenario-page-visibility-api
title: Page Visibility API may affect contenteditable during tab switches
description: When a page with a contenteditable element becomes hidden (tab switch, minimize), the Page Visibility API may affect editing state. Focus may be lost, and composition may be interrupted.
category: focus
tags:
  - page-visibility-api
  - focus
  - safari
  - macos
status: draft
locale: en
---

When a page with a contenteditable element becomes hidden (tab switch, minimize), the Page Visibility API may affect editing state. Focus may be lost, and composition may be interrupted.

## References

- [MDN: Page Visibility API](https://frost.cs.uchicago.edu/ref/JavaScript/developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API.html) - Page Visibility API documentation
- [MDN: compositionupdate event](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event) - Composition events
- [ProseMirror Discuss: NodeView selection lost on tab focus](https://discuss.prosemirror.net/t/nodeview-selection-is-lost-if-div-prosemirror-is-altered-on-tab-focus/3977) - Selection loss issues
- [ProseMirror Discuss: Composition lost when input after select](https://discuss.prosemirror.net/t/composition-lost-when-i-input-after-select-multi-lines/4493) - Composition interruption
- [Reddit: Vivaldi browser focus issues](https://www.reddit.com/r/vivaldibrowser/comments/1epzkc3) - Focus restoration problems
- [Firefox Bugzilla: IME stops working after DOM changes](https://bugzilla.mozilla.org/show_bug.cgi?id=1967203) - IME issues
