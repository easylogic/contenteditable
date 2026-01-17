---
id: scenario-page-visibility-api-ko
title: "Page Visibility API가 탭 전환 중 contenteditable에 영향을 줄 수 있음"
description: "contenteditable 요소가 있는 페이지가 숨겨질 때(탭 전환, 최소화), Page Visibility API가 편집 상태에 영향을 줄 수 있습니다. 포커스가 손실되고 컴포지션이 중단될 수 있습니다."
category: focus
tags:
  - page-visibility-api
  - focus
  - safari
  - macos
status: draft
locale: ko
---

contenteditable 요소가 있는 페이지가 숨겨질 때(탭 전환, 최소화), Page Visibility API가 편집 상태에 영향을 줄 수 있습니다. 포커스가 손실되고 컴포지션이 중단될 수 있습니다.

## 참고 자료

- [MDN: Page Visibility API](https://frost.cs.uchicago.edu/ref/JavaScript/developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API.html) - Page Visibility API documentation
- [MDN: compositionupdate event](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event) - Composition events
- [ProseMirror Discuss: NodeView selection lost on tab focus](https://discuss.prosemirror.net/t/nodeview-selection-is-lost-if-div-prosemirror-is-altered-on-tab-focus/3977) - Selection loss issues
- [ProseMirror Discuss: Composition lost when input after select](https://discuss.prosemirror.net/t/composition-lost-when-i-input-after-select-multi-lines/4493) - Composition interruption
- [Reddit: Vivaldi browser focus issues](https://www.reddit.com/r/vivaldibrowser/comments/1epzkc3) - Focus restoration problems
- [Firefox Bugzilla: IME stops working after DOM changes](https://bugzilla.mozilla.org/show_bug.cgi?id=1967203) - IME issues
