---
id: scenario-select-all-non-editable-block-ko
title: 비편집 블록이 첫/끝 자식일 때 Ctrl+A(전체 선택)가 잘못 접힘
description: contenteditable 요소의 첫 번째 또는 마지막 자식이 비편집 블록일 때 Ctrl+A(전체 선택)를 누르면 전체가 선택되지 않고 비편집 블록 반대 방향으로 선택이 접혀 WYSIWYG 기대와 다르게 동작함.
category: selection
tags:
  - selection
  - select-all
  - non-editable
  - ctrl-a
  - wysiwyg
status: draft
locale: ko
---

## 문제 개요

비편집 블록 요소(임베드 위젯, 이미지, `contenteditable="false"` 블록 등)를 포함한 contenteditable 영역에서 Ctrl+A(또는 Cmd+A)를 누르면 전체 내용이 선택될 것으로 기대됩니다. Safari, Chrome, Opera에서는 비편집 블록이 contenteditable 루트의 **첫** 또는 **마지막** 자식일 때, 전체 선택이 아니라 그 비편집 블록의 반대 쪽으로 선택이 접히는 동작이 발생합니다. 이로 인해 편집 가능한 텍스트와 비편집 블록이 섞인 WYSIWYG 에디터에서 "전체 선택"이 신뢰할 수 없게 됩니다.

## 관찰된 동작

- **구성**: contenteditable 컨테이너의 맨 앞 또는 맨 끝에 `contenteditable="false"`(또는 이에 상응)인 블록 수준 자식이 하나 이상 있음.
- **동작**: 사용자가 Ctrl+A(전체 선택)를 누름.
- **예상**: 비편집 블록을 포함한 전체 내용이 선택됨.
- **실제**: 선택이 비편집 블록의 편집 가능한 쪽으로 접히며, 비편집 블록 및 일부 내용이 범위에 포함되지 않음.

구조 예:

```html
<div contenteditable="true">
  <div contenteditable="false">[임베드 위젯]</div>
  <p>편집 가능한 문단 1.</p>
  <p>편집 가능한 문단 2.</p>
</div>
```

두 번째 문단에 캐럿이 있을 때 Ctrl+A를 누르면 위젯을 제외한 두 문단만 선택되거나, 전체 범위 대신 한 지점으로 접힐 수 있음.

## 영향

- **WYSIWYG 에디터**: "전체 선택" 후 삭제/복사가 문서 전체를 다루지 못함.
- **접근성**: 키보드만 사용하는 사용자가 전체 내용을 선택해 교체하거나 복사하는 것이 불안정함.
- **일관성**: 네이티브 텍스트 필드 및 사용자 기대와 다름.

## 브라우저 비교

- **Safari**: 재현됨; Safari 15.5(2022)에서도 유지. 비편집 블록 기준으로 선택이 잘못된 방향으로 접힘.
- **Chrome / Opera**: 동일 유형 버그; 비편집 첫/끝 자식이 있을 때 전체 선택 실패.
- **Firefox**: 동작이 다를 수 있음; 버전별 테스트 권장.

## 해결 방법

1. **커스텀 Ctrl+A 핸들러**: `keydown`에서 Ctrl+A를 감지하고 기본 동작을 막은 뒤, contenteditable 루트 전체를 프로그램적으로 선택 (예: `range.selectNodeContents(editor)`), `selection.removeAllRanges(); selection.addRange(range)`.
2. **구조 정규화**: 비편집 블록이 유일한 첫/끝 자식이 되지 않도록 하기; 편집 가능한 블록으로 감싸거나 플레이스홀더를 두어 엔진의 전체 선택 경로가 모든 노드를 포함하도록 함.
3. **선택 범위 폴백**: Ctrl+A 후 선택이 루트 전체를 덮는지 검사하고, 아니면 위의 프로그램적 전체 선택 로직 실행.

프로그램적 전체 선택 예:

```javascript
editor.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
    e.preventDefault();
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editor);
    sel.removeAllRanges();
    sel.addRange(range);
  }
});
```

## 모범 사례

- 경계에 비편집 블록이 있는 문서에서는 네이티브 Ctrl+A에 의존하지 말 것.
- 편집 가능/비편집 혼합 구조일 때 Ctrl+A에 대한 키보드 핸들러를 두고, 루트 전체를 명시적으로 선택하도록 구현할 것.
- 비편집 첫 자식, 비편집 마지막 자식, 둘 다 있는 경우에 대해 전체 선택을 테스트할 것.

## 관련 케이스

- [ce-0583-select-all-non-editable-block-first-last-child](ce-0583-select-all-non-editable-block-first-last-child) – 비편집 블록이 첫/끝 자식일 때 전체 선택 실패 (Safari/Chrome)

## 참고 자료

- [WebKit Bug 124765: Select all is broken when non-editable block is first/last child](https://bugs.webkit.org/show_bug.cgi?id=124765)
- [MDN: KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)
- [Selection API: selectNodeContents](https://developer.mozilla.org/en-US/docs/Web/API/Range/selectNodeContents)
