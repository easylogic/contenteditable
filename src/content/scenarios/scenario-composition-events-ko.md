---
id: scenario-composition-events-ko
title: 모든 IME에 대해 조합 이벤트가 일관되게 발생하지 않음
description: "Safari에서 중국어 IME와 같은 특정 IME(입력기)를 사용할 때 조합 이벤트(compositionstart, compositionupdate, compositionend)가 일관되게 발생하지 않거나 예상치 못한 순서로 발생할 수 있습니다."
category: ime
tags:
  - ime
  - composition
  - events
  - safari
status: draft
locale: ko
---

Safari에서 중국어 IME와 같은 특정 IME(입력기)를 사용할 때 조합 이벤트(`compositionstart`, `compositionupdate`, `compositionend`)가 일관되게 발생하지 않거나 예상치 못한 순서로 발생할 수 있습니다.

## 참고 자료

- [WebKit Bug 261764: iOS/iPadOS dictation doesn't trigger composition events](https://bugs.webkit.org/show_bug.cgi?id=261764) - Missing composition events
- [WebKit Bug 165004: Event order differences](https://bugs.webkit.org/show_bug.cgi?id=165004) - Event ordering issues
- [WebKit Mailing List: Chinese IME punctuation issues](https://lists.webkit.org/pipermail/webkit-unassigned/2017-March/761221.html) - Composition event missing cases
- [React Issue #8683: Composition events in controlled components](https://github.com/facebook/react/issues/8683) - React composition event issues
- [ProseMirror Discuss: IME composing problems in table cells](https://discuss.prosemirror.net/t/ime-composing-problems-on-td-or-th-element-in-safari-browser/4501) - Table cell composition issues
- [Lexical Issue #5841: isComposing flag issues](https://github.com/facebook/lexical/issues/5841) - Composition state detection
