---
id: scenario-media-query-layout-ko
title: 미디어 쿼리 레이아웃 변경이 contenteditable 편집을 방해할 수 있음
description: "contenteditable 요소가 있는 페이지가 미디어 쿼리 변경(예: 방향 변경, 창 크기 조정)에 응답할 때 레이아웃 변경이 편집을 방해할 수 있습니다. 캐럿 위치가 점프하고 선택이 손실될 수 있습니다."
category: mobile
tags:
  - media-query
  - layout
  - mobile
  - ios
  - safari
status: draft
locale: ko
---

contenteditable 요소가 있는 페이지가 미디어 쿼리 변경(예: 방향 변경, 창 크기 조정)에 응답할 때 레이아웃 변경이 편집을 방해할 수 있습니다. 캐럿 위치가 점프하고 선택이 손실될 수 있습니다.

## 참고 자료

- [Stack Overflow: Caret jumping to end in Chrome](https://stackoverflow.com/questions/27786048/why-is-my-contenteditable-caret-jumping-to-the-end-in-chrome) - Chrome 커서 점프 이슈
- [Stack Overflow: Caret position when centering with flexbox](https://stackoverflow.com/questions/32905957/caret-position-when-centering-with-flexbox-in-contenteditable) - Flexbox 커서 이슈
- [ProseMirror Discuss: Selection lost on Safari when editor is blurred](https://discuss.prosemirror.net/t/selection-is-lost-on-safari-when-editor-is-blured/3001) - Safari 선택 이슈
- [Stack Overflow: Saving and restoring caret position](https://stackoverflow.com/questions/4576694/saving-and-restoring-caret-position-for-contenteditable-div) - 커서 복원
