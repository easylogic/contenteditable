---
id: ce-0211
scenarioId: scenario-ime-composition-keydown-keycode-229
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: Korean (IME)
caseTitle: IME 조합 중 Enter 키 입력 시 keyCode 229과 13의 중복 keydown 이벤트
description: "Firefox의 contenteditable 요소에서 한글 IME 조합 중 Enter를 누르면 두 개의 keydown 이벤트가 발생합니다: 첫 번째는 keyCode 229(IME 처리), 두 번째는 keyCode 13(Enter). 이것은 단일 Enter 키 입력에 대해 이벤트 핸들러가 두 번 실행될 수 있습니다."
tags:
  - composition
  - ime
  - enter
  - keydown
  - keycode-229
  - duplicate-events
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한</span>'
    description: "Korean composition in progress"
  - label: "After Enter (Bug)"
    html: 'Hello 한<br><br>'
    description: "Duplicate keydown events cause Enter to be processed twice, creating two line breaks"
  - label: "✅ Expected"
    html: 'Hello 한<br>'
    description: "Expected: Single line break after composition commits"
---

## 현상

Firefox의 `contenteditable` 요소에서 한글 IME 조합 중 Enter를 누르면 두 개의 `keydown` 이벤트가 순차적으로 발생합니다:
1. 첫 번째 이벤트: `keyCode: 229` (IME가 입력을 처리 중임을 나타냄)
2. 두 번째 이벤트: `keyCode: 13` (실제 Enter 키)

이것은 `keydown` 이벤트를 수신하는 이벤트 핸들러가 단일 Enter 키 입력에 대해 두 번 실행될 수 있습니다.

## 재현 예시

1. Firefox에서 `contenteditable` 요소에 포커스를 둡니다.
2. 한글 IME를 활성화합니다.
3. 한글 텍스트 조합을 시작합니다 (예: "ㅎ" 그 다음 "ㅏ" 그 다음 "ㄴ"을 입력하여 "한" 조합).
4. 조합이 활성화된 상태에서 Enter를 누릅니다.
5. 브라우저 콘솔이나 이벤트 로그에서 `keydown` 이벤트를 관찰합니다.

## 관찰된 동작

Enter를 조합 중에 누를 때:

1. **첫 번째 `keydown` 이벤트**:
   - `keyCode: 229` (IME 처리 중임을 나타내는 특수 값)
   - `key: 'Process'` 또는 유사한 IME 관련 값
   - `isComposing` 속성을 가질 수 있음 (브라우저에 따라 다름)
   - 이 시점에서 실제 키 코드를 사용할 수 없음

2. **두 번째 `keydown` 이벤트**:
   - `keyCode: 13` (Enter 키)
   - `key: 'Enter'`
   - IME가 입력을 처리한 후 발생

3. **결과**:
   - `keyCode === 13`인 `keydown`을 수신하는 이벤트 핸들러가 두 번 실행됨
   - 이것은 중복 줄바꿈, 중복 명령 실행 또는 기타 의도하지 않은 동작을 일으킬 수 있음

## 예상 동작

- 단일 Enter 키 입력에 대해 하나의 `keydown` 이벤트만 발생해야 합니다
- `keyCode 229`가 발생하면 실제 키 이벤트와 명확히 구별 가능해야 합니다
- 이벤트 핸들러가 조합 중 키 이벤트를 중복 제거하기 위한 특별한 로직이 필요하지 않아야 합니다
- `keyCode 229` 이벤트가 실제 키를 위한 핸들러를 트리거하지 않아야 합니다

## 영향

이것은 다음을 일으킬 수 있습니다:

- **중복 줄바꿈**: Enter 키 핸들러가 하나 대신 두 개의 `<br>` 요소를 만듦
- **중복 명령 실행**: 키보드 단축키나 명령이 두 번 실행됨
- **성능 문제**: 이벤트 핸들러가 같은 작업을 두 번 처리함
- **상태 동기화 문제**: 애플리케이션 상태가 일관되지 않을 수 있음
- **예상치 못한 UI 동작**: UI가 단일 사용자 작업에 대해 두 번 응답할 수 있음

## 브라우저 비교

- **Chrome/Edge**: 조합 중 `keyCode 229` 다음에 실제 `keyCode 13` 발생
- **Firefox**: 유사한 동작 - `keyCode 229` 다음에 `keyCode 13` 발생
- **Safari**: 동작이 다양할 수 있음

## 참고 및 해결 방법 가능한 방향

- **`keyCode 229` 확인**: 조합 중 `keyCode 229`인 `keydown` 이벤트를 무시합니다:
  ```javascript
  let isComposing = false;
  
  element.addEventListener('compositionstart', () => {
    isComposing = true;
  });
  
  element.addEventListener('compositionend', () => {
    isComposing = false;
  });
  
  element.addEventListener('keydown', (e) => {
    if (isComposing && e.keyCode === 229) {
      // 조합 중 keyCode 229 이벤트 무시
      return;
    }
    
    // 실제 키 이벤트 처리
    if (e.keyCode === 13) {
      // Enter 키 처리
    }
  });
  ```

- **`beforeinput` 이벤트 사용**: 가능한 경우 `keydown` 대신 `beforeinput` 이벤트를 사용하는 것을 고려합니다. 이는 더 나은 조합 상태 정보를 제공합니다:
  ```javascript
  element.addEventListener('beforeinput', (e) => {
    if (e.isComposing) {
      // 조합 관련 입력 처리
      return;
    }
    
    if (e.inputType === 'insertParagraph') {
      // Enter 키 처리 (줄바꿈)
    }
  });
  ```

- **중요**: `keyCode`는 더 이상 사용되지 않습니다. 가능한 경우 `e.key` 또는 `e.code`를 대신 사용하는 것을 고려하지만, `keyCode 229`는 IME 처리에 여전히 관련될 수 있는 특수한 경우입니다.
