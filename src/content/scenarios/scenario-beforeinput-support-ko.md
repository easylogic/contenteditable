---
id: scenario-beforeinput-support-ko
title: beforeinput 이벤트가 Safari에서 지원되지 않음
description: "DOM에 커밋되기 전에 입력을 가로채고 수정하는 데 중요한 beforeinput 이벤트가 Safari에서 지원되지 않습니다. 이것은 모든 브라우저에서 작동하는 사용자 정의 입력 처리를 구현하기 어렵게 만듭니다."
category: other
tags:
  - beforeinput
  - events
  - safari
  - compatibility
status: draft
locale: ko
---

DOM에 커밋되기 전에 입력을 가로채고 수정하는 데 중요한 `beforeinput` 이벤트가 Safari에서 지원되지 않습니다. 이것은 모든 브라우저에서 작동하는 사용자 정의 입력 처리를 구현하기 어렵게 만듭니다.

## 참고 자료

- [WebKit Blog: Enhanced Editing with Input Events](https://webkit.org/blog/7358/enhanced-editing-with-input-events/) - beforeinput implementation in Safari
- [Can I Use: beforeinput event](https://caniuse.com/mdn-api_element_beforeinput_event) - Browser compatibility
- [WebKit Bug 217692: beforeinput not fired for autocomplete](https://bugs.webkit.org/show_bug.cgi?id=217692) - Autocomplete issues
- [WebKit Bug 284769: beforeinput not fired for password autofill](https://bugs.webkit.org/show_bug.cgi?id=284769) - Autofill issues
- [WebKit Changes: Event order fix](https://lists.webkit.org/pipermail/webkit-changes/2024-May/302147.html) - beforeinput/textInput order correction
- [WebKit Bug 166889: beforeinput order during IME composition](https://lists.webkit.org/pipermail/webkit-unassigned/2024-March/1156275.html) - Composition event ordering
- [W3C Input Events Issue #86: Event ordering](https://github.com/w3c/input-events/issues/86) - Specification discussion
- [MDN: Element beforeinput event](https://developer.mozilla.org/en-US/docs/Web/API/Element/beforeinput_event) - Official documentation
