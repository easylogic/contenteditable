---
id: scenario-caret-position-after-paste-ko
title: "붙여넣기 후 커서 위치가 예상치 못하게 이동함"
description: "contenteditable 영역에 콘텐츠를 붙여넣은 후 커서 위치가 예상된 위치에 있지 않으며, 때로는 붙여넣은 콘텐츠의 시작 부분이나 예상치 못한 위치로 이동합니다."
category: paste
tags:
  - paste
  - caret
  - position
  - firefox
status: draft
locale: ko
---

contenteditable 영역에 콘텐츠를 붙여넣은 후 커서 위치가 예상된 위치에 있지 않으며, 때로는 붙여넣은 콘텐츠의 시작 부분이나 예상치 못한 위치로 이동합니다.

## 참고 자료

- [Stack Overflow: How to restore caret position after paste](https://stackoverflow.com/questions/10258637/how-to-restore-caret-position-after-paste-to-contenteditable-and-sanitization) - 커서 복원 기법
- [Stack Overflow: Firefox sets wrong caret position with ::before](https://stackoverflow.com/questions/21986985/firefox-sets-wrong-caret-position-contenteditable-with-before) - Firefox 특정 이슈
- [Stack Overflow: Caret disappears in Firefox when saving position](https://stackoverflow.com/questions/57373053/caret-disappears-in-firefox-when-saving-its-position-with-rangy) - Range 보존 이슈
- [ProseMirror Discuss: Firefox contenteditable false cursor bug](https://discuss.prosemirror.net/t/firefox-contenteditable-false-cursor-bug/5016) - 비편집 요소 이슈
- [Jessie Ji: ContentEditable in Vue](https://jessieji.com/2022/contenteditable-vue) - 프레임워크 특정 커서 이슈
- [WebCompat Issue #48056: Caret positioning](https://webcompat.com/issues/48056) - 브라우저 호환성 이슈
