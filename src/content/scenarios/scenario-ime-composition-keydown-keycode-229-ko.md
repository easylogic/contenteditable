---
id: scenario-ime-composition-keydown-keycode-229
title: IME 컴포지션 중 keyCode 229를 가진 중복 keydown 이벤트 발생
description: "IME 컴포지션 중 특정 키(특히 Enter)를 누르면 중복된 keydown 이벤트가 발생할 수 있습니다. 첫 번째 이벤트는 keyCode 229(IME가 입력을 처리 중임을 나타냄)를 가지며, 그 다음 실제 키의 keyCode(예: Enter의 경우 13)가 발생합니다. 이로 인해 단일 키 입력에 대해 이벤트 핸들러가 두 번 실행될 수 있습니다."
category: ime
tags:
  - ime
  - composition
  - keydown
  - keycode-229
  - duplicate-events
status: draft
locale: ko
---

IME 컴포지션 중 특정 키(특히 Enter)를 누르면 중복된 `keydown` 이벤트가 발생할 수 있습니다. 첫 번째 이벤트는 `keyCode 229`(IME가 입력을 처리 중임을 나타냄)를 가지며, 그 다음 실제 키의 `keyCode`(예: Enter의 경우 13)가 발생합니다. 이로 인해 단일 키 입력에 대해 이벤트 핸들러가 두 번 실행될 수 있습니다.

## 관찰된 동작

IME 컴포지션 중 Enter를 누를 때:

1. 첫 번째 `keydown` 이벤트가 `keyCode: 229`로 발생합니다
   - `keyCode 229`는 IME가 입력을 처리 중임을 나타내는 특수 값입니다
   - 이 시점에서는 실제 키 코드를 사용할 수 없습니다
   - `e.isComposing === true` (사용 가능한 경우)
2. 두 번째 `keydown` 이벤트가 `keyCode: 13` (Enter)로 발생합니다
   - 이것이 실제 Enter 키 이벤트입니다
   - 컴포지션이 커밋된 후 또는 컴포지션 중에 발생할 수 있습니다

## 언어별 특성

이 문제는 IME 컴포지션을 사용하는 모든 언어에서 나타납니다:

- **한국어 IME**: 컴포지션 중 Enter 키가 keyCode 229 다음에 13을 트리거합니다
- **일본어 IME**: Enter 및 기타 키에서 유사한 동작이 발생합니다
- **중국어 IME**: Enter 및 기타 키에서 유사한 동작이 발생합니다
- **기타 IME**: 다른 언어에서도 유사한 문제가 발생할 수 있습니다

## 영향

- `keydown` 이벤트를 수신하는 이벤트 핸들러가 단일 키 입력에 대해 두 번 실행될 수 있습니다
- 이로 인해 다음 문제가 발생할 수 있습니다:
  - Enter를 누를 때 중복 줄바꿈
  - 잘못된 명령 실행 (예: 단축키가 두 번 트리거됨)
  - 성능 문제 (이중 처리)
  - 상태 동기화 문제
  - 예상치 못한 UI 동작

## 브라우저 비교

- **Chrome/Edge**: 컴포지션 중 keyCode 229 다음에 실제 keyCode가 발생할 수 있습니다
- **Firefox**: 유사한 동작이 발생할 수 있습니다
- **Safari**: 동작이 다를 수 있습니다

## 기술적 세부사항

`keyCode 229`는 DOM Level 3 Events 사양에 정의된 특수 값입니다:
- 키 이벤트가 IME 컴포지션의 일부임을 나타냅니다
- IME가 입력을 처리 중이므로 실제 키 코드를 사용할 수 없습니다
- `isComposing` 속성을 가진 `beforeinput` 이벤트와는 다릅니다

## 해결 방법

컴포지션 중 `keydown` 이벤트를 처리할 때 `keyCode 229`를 확인하고 무시하거나, 컴포지션 상태를 추적합니다:

```javascript
let isComposing = false;
let lastKeyCode229 = null;

element.addEventListener('compositionstart', () => {
  isComposing = true;
});

element.addEventListener('compositionend', () => {
  isComposing = false;
  lastKeyCode229 = null;
});

element.addEventListener('keydown', (e) => {
  if (isComposing) {
    if (e.keyCode === 229) {
      // 필요한 경우 타임스탬프 또는 기타 정보 저장
      lastKeyCode229 = e;
      // 옵션 1: keyCode 229 이벤트 무시
      return;
    }
    
    // 옵션 2: 실제 keyCode가 keyCode 229 다음에 오는 경우, 한 번만 처리
    if (lastKeyCode229 && e.keyCode !== 229) {
      // 이것은 IME 처리 후 실제 키 이벤트입니다
      // 정상적으로 처리합니다
      lastKeyCode229 = null;
    }
  }
  
  // 컴포지션하지 않을 때 keydown을 정상적으로 처리
  handleKeyDown(e);
});
```

**대안 접근 방식**: 가능한 경우 `keydown` 대신 `beforeinput` 이벤트를 사용합니다. 이는 더 나은 컴포지션 상태 정보를 제공합니다:

```javascript
element.addEventListener('beforeinput', (e) => {
  // beforeinput 이벤트는 isComposing 속성을 가집니다
  if (e.isComposing) {
    // 컴포지션 관련 입력 처리
    return;
  }
  
  // 정상 입력 처리
  handleInput(e);
});
```

**중요 참고사항**:

- `keyCode`는 더 이상 사용되지 않습니다. 가능한 경우 `e.key` 또는 `e.code`를 대신 사용하는 것을 고려하세요
- 그러나 `keyCode 229`는 IME 처리에 여전히 관련이 있을 수 있는 특수한 경우입니다
- `isComposing` 속성은 `beforeinput` 및 `input` 이벤트에서 사용할 수 있지만, 모든 브라우저의 `keydown` 이벤트에서는 사용할 수 없습니다
- 동작이 다를 수 있으므로 실제 IME(한국어, 일본어, 중국어)로 항상 테스트하세요
