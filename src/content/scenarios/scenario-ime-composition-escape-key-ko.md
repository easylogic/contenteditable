---
id: scenario-ime-composition-escape-key-ko
title: Escape 키가 IME 컴포지션을 예상치 못하게 취소함
description: "contenteditable 요소에서 IME로 텍스트를 컴포지션할 때 Escape 키를 누르면 컴포지션이 취소되거나, 컴포지션된 텍스트가 손실되거나, 일관되지 않게 동작할 수 있습니다. 여러 언어에 영향을 미치며, Escape를 취소 또는 대화상자 닫기에 사용하는 UI 상호작용과 충돌할 수 있습니다."
category: ime
tags:
  - ime
  - composition
  - escape
status: draft
locale: ko
---

`contenteditable` 요소에서 IME로 텍스트를 컴포지션할 때 Escape 키를 누르면 컴포지션이 취소되거나, 컴포지션된 텍스트가 손실되거나, 일관되지 않게 동작할 수 있습니다. 이는 Escape를 취소 또는 대화상자 닫기에 사용하는 UI 상호작용과 충돌할 수 있습니다.

## 관찰된 동작

1. **컴포지션 취소**: Escape 키가 활성 컴포지션을 취소합니다
2. **텍스트 손실**: Escape를 누르면 컴포지션된 텍스트가 손실됩니다
3. **일관되지 않은 동작**: Escape 동작이 네이티브 입력 필드와 다를 수 있습니다
4. **이벤트 충돌**: Escape 키가 컴포지션 취소와 다른 UI 작업을 모두 트리거할 수 있습니다
5. **복구 불가**: 손실된 컴포지션을 쉽게 복구할 수 없습니다

## 언어별 특성

이 문제는 IME 컴포지션을 사용하는 모든 언어에서 나타납니다:

- **한국어 IME**: Escape를 누르면 부분 음절이 손실될 수 있습니다
- **일본어 IME**: 불완전한 한자 변환이 손실될 수 있습니다
- **중국어 IME**: 부분 병음 또는 문자 변환이 손실될 수 있습니다
- **기타 IME**: 다른 언어에서도 유사한 문제가 발생할 수 있습니다

## 브라우저 비교

- **Chrome/Edge**: Escape가 컴포지션을 취소할 수 있습니다
- **Firefox**: 컴포지션 중 Escape 키 동작이 다를 수 있습니다
- **Safari**: 컴포지션 중 Escape 키 처리가 일관되지 않을 수 있습니다

## 영향

- 컴포지션 중 Escape를 누르면 사용자의 작업이 손실됩니다
- Escape를 사용하는 UI 상호작용이 컴포지션과 충돌할 수 있습니다
- 컴포지션이 예상치 못하게 취소되면 워크플로가 중단됩니다
- 네이티브 입력 필드에 비해 사용자 경험이 저하됩니다

## 해결 방법

컴포지션 중 Escape 키를 주의 깊게 처리합니다:

```javascript
let isComposing = false;

element.addEventListener('compositionstart', () => {
  isComposing = true;
});

element.addEventListener('compositionend', () => {
  isComposing = false;
});

element.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isComposing) {
    // 옵션 1: 컴포지션 중 Escape 방지
    e.preventDefault();
    // 옵션 2: Escape를 허용하지만 사용자에게 경고
    // 옵션 3: Escape를 허용하기 전에 컴포지션 커밋
    
    // 참고: Escape 방지는 다른 UI 작업과 충돌할 수 있습니다
    // 컨텍스트를 고려하세요 (예: 모달 대화상자, 드롭다운)
  }
});
```

## 참고 자료

- [W3C UI Events: Composition Events](https://w3c.github.io/uievents/split/composition-events.html) - Official composition events specification
- [MDN: Element keydown event](https://developer.mozilla.org/docs/Web/API/Element/keydown_event) - KeyboardEvent.isComposing documentation
- [W3C Lists: Composition event cancelability](https://lists.w3.org/Archives/Public/public-webapps-github/2023Nov/0539.html) - Discussion on event cancelability
- [Stack Overflow: Why is contenteditable beforeinput event not cancelable?](https://stackoverflow.com/questions/53140803/why-is-contenteditable-beforeinput-event-not-cancelable) - beforeinput cancelability during composition
- [W3C EditContext API Explainer](https://w3c.github.io/editing/docs/EditContext/explainer.html) - Experimental API for better composition control
