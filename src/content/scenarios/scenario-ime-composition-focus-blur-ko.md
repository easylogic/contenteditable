---
id: scenario-ime-composition-focus-blur
title: 포커스 변경 시 IME 컴포지션이 취소되거나 손실됨
description: "contenteditable 요소에서 IME로 텍스트를 컴포지션할 때 포커스 변경(blur) 또는 다른 곳 클릭 시 컴포지션이 취소되거나, 컴포지션된 텍스트가 손실되거나, 예상치 못하게 커밋될 수 있습니다. 여러 언어에 영향을 미치며, 다른 UI 요소와 상호작용하거나, 스크롤하거나, 프로그래밍 방식으로 포커스를 변경할 때 발생할 수 있습니다."
category: ime
tags:
  - ime
  - composition
  - focus
  - blur
status: draft
locale: ko
---

`contenteditable` 요소에서 IME로 텍스트를 컴포지션할 때 포커스 변경(blur) 또는 다른 곳 클릭 시 컴포지션이 취소되거나, 컴포지션된 텍스트가 손실되거나, 예상치 못하게 커밋될 수 있습니다. 이는 다른 UI 요소와 상호작용하거나, 스크롤하거나, 프로그래밍 방식으로 포커스를 변경할 때 발생할 수 있습니다.

## 관찰된 동작

1. **컴포지션 취소**: 포커스를 잃으면 컴포지션이 취소됩니다
2. **텍스트 손실**: blur가 발생하면 컴포지션된 텍스트가 손실될 수 있습니다
3. **예상치 못한 커밋**: 포커스가 변경되면 컴포지션이 예상치 못하게 커밋될 수 있습니다
4. **불완전한 커밋**: 부분 컴포지션만 커밋될 수 있습니다
5. **이벤트 시퀀스 문제**: `blur`, `compositionend`, `input` 이벤트의 시퀀스가 일관되지 않을 수 있습니다

## 언어별 특성

이 문제는 IME 컴포지션을 사용하는 모든 언어에서 나타납니다:

- **한국어 IME**: 포커스가 변경되면 부분 음절이 손실될 수 있습니다
- **일본어 IME**: 불완전한 한자 변환이 손실될 수 있습니다
- **중국어 IME**: 부분 병음 또는 문자 변환이 손실될 수 있습니다
- **태국어/베트남어/힌디어/아랍어 IME**: 결합 문자 또는 분음 기호가 손실될 수 있습니다
- **기타 IME**: 다른 언어에서도 유사한 문제가 발생할 수 있습니다

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 더 나은 처리를 하지만, 일부 경우에 컴포지션이 여전히 손실될 수 있습니다
- **Firefox**: 포커스 변경 중 컴포지션 보존에 더 많은 문제가 있을 수 있습니다
- **Safari**: 포커스 변경 중 컴포지션 처리가 일관되지 않을 수 있으며, 특히 iOS에서 그렇습니다

## 영향

- 실수로 다른 곳을 클릭하면 사용자의 작업이 손실됩니다
- 컴포지션이 예상치 못하게 취소되면 워크플로가 중단됩니다
- 텍스트가 부분적으로 커밋되어 잘못된 콘텐츠가 생성될 수 있습니다
- 네이티브 입력 필드에 비해 사용자 경험이 저하됩니다

## 해결 방법

포커스 이벤트를 모니터링하고 컴포지션 상태를 보존합니다:

```javascript
let compositionState = {
  isActive: false,
  pendingText: '',
  shouldPreserve: false
};

element.addEventListener('compositionstart', () => {
  compositionState.isActive = true;
  compositionState.shouldPreserve = true;
});

element.addEventListener('compositionupdate', (e) => {
  compositionState.pendingText = e.data;
});

element.addEventListener('compositionend', (e) => {
  compositionState.isActive = false;
  compositionState.pendingText = '';
  compositionState.shouldPreserve = false;
});

element.addEventListener('blur', (e) => {
  if (compositionState.isActive && compositionState.shouldPreserve) {
    // 컴포지션 보존 시도
    // 참고: 이를 안정적으로 구현하기는 어렵습니다
    // 대기 중인 텍스트를 저장하고 복원해야 할 수 있습니다
    console.warn('blur 시 컴포지션이 손실될 수 있습니다');
  }
});

// 컴포지션 중 프로그래밍 방식 포커스 변경 방지
const originalBlur = HTMLElement.prototype.blur;
HTMLElement.prototype.blur = function() {
  if (this === element && compositionState.isActive) {
    // 선택적으로 컴포지션이 완료될 때까지 blur 지연
    return;
  }
  originalBlur.call(this);
};
```
