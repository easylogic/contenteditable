---
id: scenario-fullscreen-api-ko
title: "Fullscreen API가 contenteditable 포커스 및 선택에 영향을 줄 수 있음"
description: "contenteditable 요소가 Fullscreen API를 사용하여 전체화면 모드에 들어가거나 나갈 때 포커스와 선택이 손실될 수 있습니다. 커서 위치가 재설정될 수 있고 편집이 중단될 수 있습니다."
category: focus
tags:
  - fullscreen-api
  - focus
  - chrome
  - windows
status: draft
locale: ko
---

contenteditable 요소가 Fullscreen API를 사용하여 전체화면 모드에 들어가거나 나갈 때 포커스와 선택이 손실될 수 있습니다. 커서 위치가 재설정될 수 있고 편집이 중단될 수 있습니다.

## 참고 자료

- [MDN: Fullscreen API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API/Guide) - Fullscreen API documentation
- [MDN: contenteditable global attribute](https://developer.mozilla.org/docs/Web/HTML/Reference/Global_attributes/contenteditable) - contenteditable documentation
- [Stack Overflow: contenteditable loses selection when another input focuses](https://stackoverflow.com/questions/12778508/contenteditable-div-loses-selection-when-another-input-focuses) - Selection preservation techniques
- [ProseMirror Discuss: Selection is lost on Safari when editor is blurred](https://discuss.prosemirror.net/t/selection-is-lost-on-safari-when-editor-is-blured/3001) - Safari selection issues
