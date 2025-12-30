---
id: scenario-ime-composition-tab-key
title: Tab 키가 IME 컴포지션을 취소하거나 예상치 못한 탐색을 유발함
description: "contenteditable 요소에서 IME로 텍스트를 컴포지션할 때 Tab 키를 누르면 컴포지션이 취소되거나, 예상치 못한 포커스 탐색이 발생하거나, 컴포지션이 예상치 못한 방식으로 커밋될 수 있습니다. 여러 언어에 영향을 미치며 폼이나 테이블의 키보드 탐색과 충돌할 수 있습니다."
category: ime
tags:
  - ime
  - composition
  - tab
  - navigation
status: draft
locale: ko
---

`contenteditable` 요소에서 IME로 텍스트를 컴포지션할 때 Tab 키를 누르면 컴포지션이 취소되거나, 예상치 못한 포커스 탐색이 발생하거나, 컴포지션이 예상치 못한 방식으로 커밋될 수 있습니다. 이는 폼, 테이블 또는 기타 대화형 요소의 키보드 탐색과 충돌할 수 있습니다.

## 관찰된 동작

1. **컴포지션 취소**: Tab 키가 활성 컴포지션을 취소합니다
2. **예상치 못한 탐색**: Tab이 다음 요소로 포커스를 이동시켜 컴포지션을 중단합니다
3. **부분 커밋**: 탐색 전에 컴포지션이 부분적으로 커밋될 수 있습니다
4. **텍스트 손실**: Tab을 누르면 컴포지션된 텍스트가 손실될 수 있습니다
5. **이벤트 충돌**: Tab 키 동작이 컴포지션 처리와 충돌합니다

## 언어별 특성

이 문제는 IME 컴포지션을 사용하는 모든 언어에서 나타납니다:

- **한국어 IME**: Tab을 누르면 부분 음절이 손실될 수 있습니다
- **일본어 IME**: 불완전한 한자 변환이 손실될 수 있습니다
- **중국어 IME**: 부분 병음 또는 문자 변환이 손실될 수 있습니다
- **기타 IME**: 다른 언어에서도 유사한 문제가 발생할 수 있습니다

## 브라우저 비교

- **Chrome/Edge**: Tab이 컴포지션을 취소하고 포커스를 탐색할 수 있습니다
- **Firefox**: 컴포지션 중 Tab 키 동작이 다를 수 있습니다
- **Safari**: 컴포지션 중 Tab 키 처리가 일관되지 않을 수 있습니다

## 영향

- 컴포지션 중 Tab을 누르면 사용자의 작업이 손실됩니다
- 폼/테이블의 키보드 탐색이 중단됩니다
- 컴포지션이 예상치 못하게 취소되면 워크플로가 중단됩니다
- 네이티브 입력 필드에 비해 사용자 경험이 저하됩니다

## 해결 방법

컴포지션 중 Tab 키를 주의 깊게 처리합니다:

```javascript
let isComposing = false;

element.addEventListener('compositionstart', () => {
  isComposing = true;
});

element.addEventListener('compositionend', () => {
  isComposing = false;
});

element.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && isComposing) {
    // 옵션 1: 컴포지션 중 Tab 방지
    e.preventDefault();
    // 옵션 2: Tab을 허용하기 전에 컴포지션이 완료될 때까지 대기
    // 이것은 컴포지션 상태를 추적하는 것을 요구합니다
    
    // 옵션 3: Tab을 허용하기 전에 먼저 컴포지션 커밋
    // 이것은 IME 특정 처리를 요구할 수 있습니다
  }
});

// 테이블 셀 또는 폼 요소의 경우
element.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && isComposing) {
    // 컴포지션 중 기본 Tab 동작 방지
    e.preventDefault();
    
    // 선택적으로 먼저 컴포지션 커밋
    // 그런 다음 컴포지션이 완료된 후 수동으로 Tab 탐색 처리
  }
});
```
