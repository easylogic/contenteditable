---
id: scenario-caret-movement-with-emoji-ko
title: "contenteditable에서 화살표 키가 이모지를 건너뜀"
description: "이모지를 포함하는 `contenteditable` 요소에서 왼쪽 및 오른쪽 화살표 키를 사용할 때"
category: caret
tags:
  - caret
  - emoji
  - navigation
status: draft
locale: ko
---

이모지를 포함하는 `contenteditable` 요소에서 왼쪽 및 오른쪽 화살표 키를 사용할 때
커서가 단일 시각적 위치로 이동하는 대신 전체 이모지 클러스터를 건너뛸 수 있습니다.

이 시나리오는 유사한 동작으로 여러 환경에서 관찰되었습니다.

## 참고 자료

- [Unicode TR29: Text Segmentation](https://www.unicode.org/reports/tr29/tr29-29.html) - Grapheme cluster rules
- [Unicode TR51: Emoji](https://unicode.org/standard/reports/tr51/) - Emoji and ZWJ sequences
- [Firefox Bug 435967: Caret movement with non-text nodes](https://bugzilla.mozilla.org/show_bug.cgi?id=435967) - Non-editable element navigation
- [Stack Overflow: Chrome skips over empty paragraphs](https://stackoverflow.com/questions/75397803/chrome-skips-over-empty-paragraphs-of-contenteditable-parent-when-moving-cursor) - Empty paragraph navigation
- [WebKit Bug 106827: Down arrow doesn't move caret with images](https://bugs.webkit.org/show_bug.cgi?id=106827) - Image element navigation
- [W3C: ContentEditable specification](https://www.w3.org/TR/content-editable/) - Legal caret positions
- [Stack Overflow: Emojis become question marks after re-render](https://stackoverflow.com/questions/66926658/emojis-become-question-marks-after-re-render-in-contenteditable) - Emoji handling issues
- [Stack Overflow: Strange caret position in contenteditable](https://stackoverflow.com/questions/49222639/strange-caret-position-in-contenteditable-div) - Caret positioning with spans
