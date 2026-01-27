---
id: scenario-contenteditable-shadow-dom-ko
title: "Shadow DOM에서의 contenteditable 격리 및 선택 영역 문제"
description: "문서당 단일 선택 영역 모델과 웹 컴포넌트의 캡슐화 원칙 사이의 구조적 충돌에 대한 분석입니다."
category: "other"
tags: ["shadow-dom", "selection", "encapsulation", "api-collision"]
status: "confirmed"
locale: "ko"
---

## 문제 개요
웹의 Selection API는 Shadow DOM이 널리 보급되기 훨씬 전에 표준화되었습니다. 이러한 아키텍처적 간극은 "선택 영역 사각지대" 현상을 유발합니다. 전역 `window.getSelection()` 모델은 Shadow Host를 하나의 불투명한 블록으로 취급하는 반면, 내부의 `shadowRoot.getSelection()`은 애플리케이션의 나머지 부분(심지어 '페이지 내 찾기'와 같은 브라우저 시스템까지도)이 인지하지 못하는 범위를 제공합니다.

## 관찰된 동작
### 시나리오 1: 선택 영역 충돌 (이중 하이라이트)
사용자가 전역 텍스트 선택 영역에서 Shadow Root 내부의 `contenteditable` 영역으로 포커스를 옮길 때, 많은 브라우저가 이전의 하이라이트를 즉시 지우지 못해 시각적으로 두 개의 선택 영역이 나타나는 혼란을 야기합니다.

```javascript
/* 충돌 로직 */
// 1. 사용자가 Light DOM에서 "Hello World"를 선택함.
// 2. 사용자가 <my-editor> (Shadow DOM) 내부를 클릭함.
// 3. window.getSelection()은 여전히 "Hello World"를 보고함.
// 4. shadowRoot.getSelection()은 에디터 내부의 활성 캐럿을 보고함.
```

### 시나리오 2: 명령어 실행 실패
`document.execCommand()` 호출은 기본적으로 `window.getSelection()`이 보고하는 범위를 대상으로 합니다. 만약 이 선택 영역이 shadow-host 경계에 멈춰 있다면, 전역 명령어('bold', 'italic' 등)는 에디터 내부의 텍스트에 아무런 영향도 주지 못합니다.

## 영향
- **프레임워크 무력화**: 문서의 `selectionchange` 이벤트에 의존하는 에디터 엔진(Slate, Lexical 등)이 Shadow Root 내부에서 발생하는 변화를 감지하지 못합니다.
- **접근성 격리**: 접근성 트리(Accessibility Tree)가 Shadow 기반 캐럿과 문서 레벨의 포커스 표시기 사이의 간극을 메우지 못하는 경우가 발생합니다.

## 브라우저 비교
- **Blink (Chrome/Edge)**: `shadowRoot.getSelection()`을 지원하지만, Light DOM 선택 영역과의 동기화가 느리거나 일관성이 없는 경우가 잦습니다.
- **Gecko (Firefox)**: 역사적으로 Shadow 경계를 넘나드는 선택 지원이 가장 제한적이었으며, 많은 부분에서 수동 폴리필(Polyfill)이 필요합니다.
- **WebKit (Safari)**: 포커스가 Shadow Root 깊숙이 들어갔음에도 원본 Light DOM 선택 영역이 해제되지 않고 유지되는 특성이 두드러집니다.

## 해결 방법
### 1. 수동 선택 영역 동기화
Shadow Root 내부에서 `selectionchange` 이벤트를 감지하여 별도의 상태 관리자에게 명시적으로 알립니다.

```javascript
this.shadowRoot.addEventListener('selectionchange', () => {
  const selection = this.shadowRoot.getSelection();
  if (selection.rangeCount > 0) {
    this.dispatchEvent(new CustomEvent('editor-selection-change', {
      detail: selection.getRangeAt(0),
      bubbles: true,
      composed: true
    }));
  }
});
```

## 관련 사례
- [ce-0571: Shadow DOM 내 다중 선택 영역 충돌 현상](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0571-shadow-dom-selection-collision-ko.md)

## 참고 자료
- [W3C: Selection API in Shadow DOM 이슈](https://github.com/w3c/selection-api/issues/173)
- [Blink Intent-to-Ship: delegatesFocus와 텍스트 선택](https://groups.google.com/a/chromium.org/g/blink-dev/c/egWmzZ4MNuU)
