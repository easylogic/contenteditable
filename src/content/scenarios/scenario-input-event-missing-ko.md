---
id: scenario-input-event-missing-ko
title: "특정 조건에서 Input 이벤트 발생 실패"
description: "DOM은 변경되었으나 브라우저가 'input' 이벤트를 디스패치하지 못하는 시나리오에 대한 기술적 분석입니다."
category: "input"
tags: ["events", "input", "reliability", "dom-sync"]
status: "confirmed"
locale: "ko"
---

## 문제 개요
`input` 이벤트(특히 Input Events Level 2 명세)는 현대 웹 애플리케이션이 로컬 콘텐츠 변경을 감지하는 가장 핵심적인 신호입니다. Slate, Lexical, React와 같은 프레임워크는 이 이벤트에 의존하여 가상 모델(Source of Truth)을 브라우저의 가변적인 DOM과 동기화(reconcile)합니다. 이 이벤트가 누락되면 모델과 DOM 간의 불일치가 발생하여 "유령 텍스트(ghost text)", 데이터 유실 또는 히스토리 파손으로 이어집니다.

## 관찰된 동작
이 현상은 주로 브라우저의 회귀(regression) 버그나 캐럿 위치와 관련된 복잡한 엣지 케이스에서 발생합니다.

### 시나리오 1: 블록 경계 입력 (Chrome 121)
텍스트 노드나 블록의 맨 시작점(`offset 0`)에서 타이핑할 때, 브라우저는 `beforeinput` 로직은 성공적으로 수행하지만 최종 `input` 디스패치 단계를 건너뜁니다.

```javascript
/* 이벤트 관찰 로직 */
element.addEventListener('beforeinput', (e) => {
  console.log('1. beforeinput 발생');
});
element.addEventListener('input', (e) => {
  console.log('2. input 발생'); // Chrome 121의 오프셋 0 지점에서는 나타나지 않음
});
```

### 시나리오 2: 프로그래밍 방식의 변이
수동 타이핑은 보통 이벤트를 트리거하지만, 일부 브라우저 확장 프로그램이나 OS 레벨의 도구(받아쓰기, 번역 서비스 등)는 표준 입력 이벤트 루프를 우회하는 내부 메서드를 사용하여 DOM을 수정하기도 합니다.

## 영향
- **상태 불일치**: 내부 데이터 모델은 "world"라고 인지하지만, 실제 DOM은 "Hworld"를 보여줍니다.
- **실행 취소(Undo) 파손**: 프레임워크의 히스토리 관리자가 변경 사항을 기록하지 못해 Undo가 불가능해집니다.
- **사이드 이펙트 중단**: 자동 저장, 글자 수 카운트, 실시간 협업 업데이트 등이 전혀 트리거되지 않습니다.

## 브라우저 비교
- **Blink (Chrome/Edge)**: 전반적으로 안정적이지만, 특정 버전(예: v121)에서 치명적인 회귀 버그가 발생할 가능성이 있습니다.
- **WebKit (Safari)**: 대체로 이벤트를 올바르게 디스패치하지만, `compositionend`와의 타이밍 문제가 발생할 수 있습니다.
- **Gecko (Firefox)**: 명세 준수 의지가 높지만, 중첩된 구조에서 과도한 이벤트를 발생시키는 경우가 있습니다.

## 해결 방법
### 1. "안전 타이머" 트릭
`beforeinput`은 감지했으나 짧은 시간 내에 `input`이 따르지 않는 경우, 수동으로 "Dirty Check"를 실행합니다.

```javascript
let pendingInput = null;

element.addEventListener('beforeinput', () => {
  if (pendingInput) clearTimeout(pendingInput);
  pendingInput = setTimeout(() => {
    console.warn('누락된 input 이벤트 복구 중...');
    editor.reconcileEntireDOM();
  }, 100);
});

element.addEventListener('input', () => {
  if (pendingInput) {
    clearTimeout(pendingInput);
    pendingInput = null;
  }
});
```

### 2. MutationObserver 폴백
`MutationObserver`는 인풋 API가 놓치는 변경 사항을 잡아낼 수 있는 가장 확실한 방법입니다. 다만, 성능 비용이 발생하므로 주의가 필요합니다.

## 모범 사례
- **`input`에만 의존하지 말 것**: 중요한 에디터라면 백업으로 `MutationObserver` 사용을 고려하세요.
- **beforeinput 추적**: `input` 이벤트에서는 `getTargetRanges()` 등을 사용할 수 없으므로, 항상 `beforeinput`에서 의도(intent)와 범위를 캡처해야 합니다.

## 관련 사례
- [ce-0565: 오프셋 0에서 타이핑 시 onInput 이벤트 누락](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0565-chrome-121-oninput-offset-0-ko.md)

## 참고 자료
- [W3C Input Events Level 2 명세](https://www.w3.org/TR/input-events-2/)
- [MDN: InputEvent](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent)
