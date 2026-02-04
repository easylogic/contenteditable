---
id: scenario-inline-element-recreation-after-delete-ko
title: contenteditable에서 삭제한 인라인 요소가 입력 시 다시 생성됨
description: contenteditable 안에서 빈 인라인 요소(span, b 등)를 삭제한 뒤 입력하면 브라우저가 삭제된 인라인 요소를 다시 만들어 DOM과 에디터 상태를 예측하기 어렵게 함.
category: formatting
tags:
  - delete
  - inline
  - span
  - dom
  - chromium
  - execCommand
status: draft
locale: ko
---

## 문제 개요

Chromium(및 다른 엔진에서는 동작이 다름)에서 사용자가 contenteditable 영역 안의 빈 인라인 요소(예: `<span>`, `<b>`)를 삭제한 다음 글자를 입력하면, 브라우저가 삭제된 인라인 요소를 자동으로 다시 만드는 경우가 있습니다. 이 “스마트” DOM 수정은 에디터가 DOM을 제어한다는 가정과 맞지 않으며, 프레임워크 기반 에디터에서 상태 불일치를 일으키고 정규화 로직을 복잡하게 합니다.

## 관찰된 동작

- **발생 조건**: 빈 인라인 요소(텍스트가 없는 `<span>` 또는 `<b>`)를 Backspace/Delete로 제거한 뒤 문자를 입력함.
- **결과**: 삭제된 인라인 래퍼가 새로 입력된 내용 주변 또는 예상치 못한 위치에 다시 나타남.
- **범위**: Chromium에서 확인됨; Safari, Firefox에서는 다르게 동작할 수 있음. span에 텍스트를 넣은 뒤 삭제하거나, span에 inline이 아닌 display를 주면 재생성이 발생하지 않거나 달라질 수 있음.

DOM 예시(삭제 전/후):

```html
<!-- 사용자가 빈 <span>을 지우고 "x" 입력 전 -->
<div contenteditable="true">hello <span></span> world</div>

<!-- Chromium이 만드는 결과 -->
<div contenteditable="true">hello <span>x</span> world</div>
```

## 영향

- **상태 오염**: 브라우저가 프레임워크를 거치지 않고 DOM을 수정하면 React/Vue/Svelte의 재조정이 DOM과 어긋날 수 있음.
- **실행 취소/다시 실행**: 브라우저의 재생성이 커스텀 히스토리 스택과 충돌할 수 있음.
- **예측 가능성**: “삭제 후 입력”이 DOM을 결정적으로 유지한다고 가정할 수 없음.

## 브라우저 비교

- **Chrome (Blink)**: 삭제된 빈 인라인 요소를 입력 시 다시 만듦; execCommand/editing 스펙 유산 동작과 연관됨.
- **Safari (WebKit)**: 항상 재생성하지 않을 수 있음; 구조에 따라 다름.
- **Firefox (Gecko)**: 동작이 다름; 많은 경우 재생성이 덜 공격적임.

## 해결 방법

1. **input 후 정규화**: `input` 또는 `beforeinput` 시 DOM을 순회해 에디터가 만들지 않은 불필요한 인라인 래퍼를 제거하거나 병합.
2. **빈 인라인 노드 피하기**: HTML을 생성할 때 빈 `<span>`, `<b>` 등을 남기지 않고, 텍스트 노드나 ZWSP(`\u200B`) 등으로 “빈” 노드가 되지 않게 함.
3. **삭제 가로채기**: `beforeinput`에서 `inputType`이 `deleteContentBackward`/`deleteContentForward`일 때 자체 DOM 변경을 적용하고 `preventDefault()`로 브라우저 기본 삭제(및 이후 재생성)를 막을 수 있는 경우 사용.

빈 인라인 제거 정규화 예:

```javascript
editor.addEventListener('input', () => {
  const emptyInlines = editor.querySelectorAll('span:empty, b:empty, i:empty');
  emptyInlines.forEach(el => {
    const parent = el.parentNode;
    while (el.firstChild) parent.insertBefore(el.firstChild, el);
    el.remove();
  });
});
```

## 모범 사례

- 삭제 후 입력으로 DOM이 그대로 유지된다고 가정하지 말 것.
- 단일 소스(예: 프레임워크 상태)를 우선하고, input 시 DOM을 그에 맞게 정규화.
- W3C editing 및 Chromium에서 향후 동작 변경 여부를 참고할 것.

## 관련 케이스

- [ce-0582-chromium-empty-span-recreated-after-delete](ce-0582-chromium-empty-span-recreated-after-delete) – Chromium에서 빈 span 삭제 후 입력 시 다시 생성됨

## 참고 자료

- [W3C editing #468: Contenteditable re-creating deleted children](https://github.com/w3c/editing/issues/468)
- [Stack Overflow: Chrome empty span in contenteditable](https://stackoverflow.com/questions/68914093/chrome-trying-to-delete-empty-span-in-contenteditable-results-in-added-node)
- [W3C execCommand (레거시)](https://w3c.github.io/editing/docs/execCommand/)
