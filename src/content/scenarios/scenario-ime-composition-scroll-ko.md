---
id: scenario-ime-composition-scroll
title: 스크롤이 IME 컴포지션을 취소하거나 간섭함
description: "contenteditable 요소에서 IME로 텍스트를 컴포지션할 때 스크롤(마우스 휠, 터치 또는 프로그래밍 방식)이 활성 컴포지션을 취소하거나, 컴포지션된 텍스트가 손실되거나, 컴포지션 UI가 잘못된 위치에 배치될 수 있습니다. 여러 언어에 영향을 미치며 모바일 기기에서 특히 문제가 됩니다."
category: ime
tags:
  - ime
  - composition
  - scroll
  - mobile
status: draft
---

`contenteditable` 요소에서 IME로 텍스트를 컴포지션할 때 스크롤(마우스 휠, 터치 또는 프로그래밍 방식)이 활성 컴포지션을 취소하거나, 컴포지션된 텍스트가 손실되거나, 컴포지션 UI가 잘못된 위치에 배치될 수 있습니다. 텍스트 입력 중 스크롤이 일반적인 모바일 기기에서 특히 문제가 됩니다.

## 관찰된 동작

1. **컴포지션 취소**: 스크롤이 활성 컴포지션을 취소합니다
2. **텍스트 손실**: 스크롤이 발생하면 컴포지션된 텍스트가 손실됩니다
3. **UI 위치 오류**: 스크롤 후 IME 후보 목록 또는 컴포지션 UI가 잘못된 위치에 배치될 수 있습니다
4. **포커스 문제**: 스크롤이 포커스를 잃거나 변경시킬 수 있습니다
5. **이벤트 시퀀스 문제**: `scroll`, `compositionend`, `blur` 이벤트의 시퀀스가 일관되지 않을 수 있습니다

## 언어별 특성

이 문제는 IME 컴포지션을 사용하는 모든 언어에서 나타납니다:

- **한국어 IME**: 스크롤하면 부분 음절이 손실될 수 있습니다
- **일본어 IME**: 불완전한 한자 변환이 손실될 수 있습니다
- **중국어 IME**: 부분 병음 또는 문자 변환이 손실될 수 있습니다
- **기타 IME**: 다른 언어에서도 유사한 문제가 발생할 수 있습니다

## 브라우저 비교

- **Chrome/Edge**: 스크롤이 컴포지션을 취소할 수 있으며, 특히 모바일에서 그렇습니다
- **Firefox**: 컴포지션 중 스크롤 동작이 다를 수 있습니다
- **Safari**: 컴포지션 중 스크롤 처리가 일관되지 않을 수 있으며, 특히 iOS에서 그렇습니다

## 영향

- 컴포지션 중 실수로 스크롤하면 사용자의 작업이 손실됩니다
- 입력 중 스크롤이 일반적인 모바일 사용자가 특히 영향을 받습니다
- IME UI 위치 문제로 후보 선택이 어려워집니다
- 네이티브 입력 필드에 비해 사용자 경험이 저하됩니다

## 해결 방법

컴포지션 중 스크롤 이벤트를 주의 깊게 처리합니다:

```javascript
let isComposing = false;

element.addEventListener('compositionstart', () => {
  isComposing = true;
});

element.addEventListener('compositionend', () => {
  isComposing = false;
});

// 컴포지션 중 스크롤 방지 (바람직하지 않을 수 있음)
element.addEventListener('wheel', (e) => {
  if (isComposing) {
    // 옵션 1: 컴포지션 중 스크롤 방지
    // e.preventDefault();
    // 참고: 이것은 사용자 경험을 저하시킬 수 있습니다
    
    // 옵션 2: 스크롤을 허용하지만 컴포지션 보존
    // 이것을 안정적으로 구현하기는 어렵습니다
  }
}, { passive: false });

// 터치 기기의 경우
element.addEventListener('touchmove', (e) => {
  if (isComposing) {
    // 터치 스크롤에 대한 유사한 처리
  }
}, { passive: false });

// 스크롤 이벤트 모니터링
element.addEventListener('scroll', () => {
  if (isComposing) {
    // 컴포지션 UI가 재배치가 필요한지 확인
    // IME UI 업데이트를 트리거해야 할 수 있습니다
  }
});
```
