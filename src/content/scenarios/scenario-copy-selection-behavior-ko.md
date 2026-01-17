---
id: scenario-copy-selection-behavior-ko
title: "contenteditable에서 콘텐츠 복사 후 선택이 손실됨"
description: "Safari에서 Cmd+C를 사용하여 contenteditable 영역에서 선택한 텍스트를 복사한 후 선택이 손실됩니다. 사용자가 추가 작업을 수행하려면 텍스트를 다시 선택해야 합니다."
category: selection
tags:
  - copy
  - selection
  - safari
status: draft
locale: ko
---

Safari에서 Cmd+C를 사용하여 contenteditable 영역에서 선택한 텍스트를 복사한 후 선택이 손실됩니다. 사용자가 추가 작업을 수행하려면 텍스트를 다시 선택해야 합니다.

## 참고 자료

- [ProseMirror Discuss: Selection is lost on Safari when editor is blurred](https://discuss.prosemirror.net/t/selection-is-lost-on-safari-when-editor-is-blured/3001) - 포커스 및 선택 이슈
- [Stack Overflow: user-select none breaking Safari contenteditable](https://stackoverflow.com/questions/20823468/user-selectnone-breaking-safari-contenteditable) - CSS 선택 이슈
- [ProseMirror Discuss: Clipboard data from Safari](https://discuss.prosemirror.net/t/clipboard-data-from-safari/3215) - 클립보드 동작 차이
- [Lightrun: Copy and cut to clipboard not working in Safari](https://lightrun.com/answers/coder-code-server-copy-and-cut-to-clipboard-not-working-in-safari-or-app-containers-like-unitefluid) - 메뉴 vs 키보드 단축키
