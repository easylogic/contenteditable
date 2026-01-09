---
id: ce-0217
scenarioId: scenario-keyboard-handlers-during-composition
locale: ko
os: iOS
osVersion: "17.0+"
device: iPhone or iPad
deviceVersion: Any
browser: Safari
browserVersion: "17.0+"
keyboard: Korean (IME)
caseTitle: iOS Safari 한글 IME에서 isComposing이 항상 false여서 키보드 핸들러 조합 감지가 깨짐
description: "iOS Safari에서 한글 IME를 사용할 때, beforeinput 및 input 이벤트의 isComposing 플래그가 항상 false이고 조합 이벤트가 발생하지 않습니다. 이것은 키보드 핸들러(Enter, Backspace, Delete)에 대해 브라우저 기본 동작을 허용하기 위해 조합 상태를 감지하는 표준 패턴을 깨뜨립니다. 에디터는 iOS Safari에서 항상 브라우저 기본 동작을 허용해야 합니다."
tags:
  - composition
  - ime
  - beforeinput
  - input
  - isComposing
  - keyboard
  - ios
  - safari
  - korean
status: draft
domSteps:
  - label: "Before"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">한</span></p>'
    description: "한글 조합 진행 중"
  - label: "사용자가 Enter 누름 (버그)"
    html: '<p>Hello </p><p></p>'
    description: "사용자 정의 Enter 핸들러가 기본 동작을 방지하여 조합이 깨짐"
  - label: "✅ 예상"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">한</span></p><p></p>'
    description: "브라우저 기본 동작이 조합 중 Enter를 올바르게 처리함"
---

## 현상

iOS Safari에서 한글 IME를 사용할 때, `beforeinput` 및 `input` 이벤트의 `isComposing` 플래그가 항상 `false`이고 조합 이벤트(`compositionstart`, `compositionupdate`, `compositionend`)가 발생하지 않습니다. 이것은 키보드 핸들러(Enter, Backspace, Delete)에 대해 브라우저 기본 동작을 허용하기 위해 조합 상태를 감지하는 표준 패턴을 깨뜨립니다. 키보드 핸들러를 재정의하는 에디터는 iOS Safari에서 항상 브라우저 기본 동작을 허용해야 합니다.

## 재현 예시

1. Enter, Backspace, Delete에 대한 사용자 정의 키보드 핸들러가 있는 `contenteditable` 요소를 만듭니다.
2. iOS Safari(iPhone/iPad)에서 요소에 포커스합니다.
3. 한글 IME를 활성화합니다.
4. 한글 텍스트 조합을 시작합니다 (예: "ㅎ" → "ㅏ" → "ㄴ"을 입력하여 "한" 조합).
5. 조합이 활성화된 상태에서 Enter, Backspace 또는 Delete를 누릅니다.
6. `beforeinput` 이벤트에서 `isComposing`이 `false`임을 관찰합니다.
7. 조합 이벤트가 발생하지 않음을 관찰합니다.
8. 사용자 정의 키보드 핸들러가 조합이 활성화되지 않았다고 생각하고 기본 동작을 방지합니다.
9. 이것이 조합 동작을 깨뜨립니다.

## 관찰된 동작

한글 조합 중 Enter/Backspace/Delete를 누를 때:

1. **isComposing이 항상 false임**:
   - `beforeinput` 이벤트에 `isComposing: false`가 있음
   - `input` 이벤트에 `isComposing: false`가 있음
   - `isComposing` 플래그를 사용하여 조합 상태를 감지할 수 없음

2. **조합 이벤트가 발생하지 않음**:
   - `compositionstart`가 발생하지 않음
   - `compositionupdate`가 발생하지 않음
   - `compositionend`가 발생하지 않음
   - 조합 이벤트를 사용하여 조합 상태를 감지할 수 없음

3. **사용자 정의 키보드 핸들러가 조합을 깨뜨림**:
   - 핸들러가 `isComposing`을 확인함 → 항상 `false`
   - 핸들러가 조합이 활성화되지 않았다고 생각함
   - 핸들러가 기본 동작을 방지하고 키를 사용자 정의로 처리함
   - 이것이 브라우저의 조합 처리를 방해함
   - 조합 텍스트가 손실되거나 잘못 처리될 수 있음

4. **결과**:
   - 조합 중 Enter가 조합을 깨뜨리거나 줄바꿈을 잘못 삽입할 수 있음
   - 조합 중 Backspace가 잘못 삭제할 수 있음
   - 조합 중 Delete가 잘못 삭제할 수 있음
   - 조합 동작이 깨짐

## 예상 동작

- `isComposing` 플래그가 조합 상태를 정확하게 반영해야 함
- 조합 중에 조합 이벤트가 발생해야 함
- 사용자 정의 키보드 핸들러가 조합 상태를 감지할 수 있어야 함
- 조합 중에 브라우저 기본 동작이 허용되어야 함
- 키보드 핸들러가 조합을 방해하지 않아야 함

## 영향

- **깨진 조합**: 사용자 정의 키보드 핸들러가 IME 조합을 방해함
- **손실된 텍스트**: 조합 텍스트가 손실되거나 잘못 처리될 수 있음
- **잘못된 동작**: Enter/Backspace/Delete가 조합 중 예상대로 작동하지 않을 수 있음
- **플랫폼별 버그**: 다른 브라우저에서 작동하는 코드가 iOS Safari에서 실패함
- **IME별 버그**: 다른 IME에서 작동하는 코드가 iOS Safari의 한글 IME에서 실패함
- **에디터 호환성**: `isComposing`이나 조합 이벤트에 의존하는 에디터가 iOS Safari에서 깨짐

## 브라우저 비교

- **iOS Safari (한글 IME)**: `isComposing`이 항상 `false`임, 조합 이벤트가 발생하지 않음
- **iOS Safari (일본어/한자 IME)**: `isComposing`이 정확함, 조합 이벤트 발생
- **Desktop Safari**: `isComposing`이 정확함, 조합 이벤트 발생
- **Chrome/Edge**: `isComposing`이 정확함, 조합 이벤트 발생
- **Firefox**: `isComposing`이 정확함, 조합 이벤트 발생

## 해결 방법 및 참고사항

- **iOS Safari에서 항상 브라우저 기본 동작 허용**: iOS Safari에서 키보드 핸들러에 대해 기본 동작을 방지하지 않습니다:
  ```javascript
  const isIOSSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) && 
                      /Safari/.test(navigator.userAgent) && 
                      !/Chrome/.test(navigator.userAgent);

  element.addEventListener('beforeinput', (e) => {
    // iOS Safari: 키보드 핸들러에 대해 항상 브라우저 기본 동작 허용
    if (isIOSSafari) {
      if (e.inputType === 'insertParagraph' || 
          e.inputType === 'deleteContentBackward' ||
          e.inputType === 'deleteContentForward') {
        return; // 브라우저 기본 동작 허용
      }
    }
    
    // 표준 브라우저: isComposing 확인
    if (e.isComposing) {
      return; // 브라우저가 처리하도록 함
    }
    
    // 사용자 정의 키보드 처리
    if (e.inputType === 'insertParagraph') {
      e.preventDefault();
      handleCustomEnter();
    }
  });
  ```

- **iOS Safari 한글 IME 패턴 감지**: `deleteContentBackward` + `insertText` 패턴을 인식합니다:
  ```javascript
  let lastDeleteBackward = null;
  const isIOSSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) && 
                      /Safari/.test(navigator.userAgent) && 
                      !/Chrome/.test(navigator.userAgent);

  element.addEventListener('beforeinput', (e) => {
    if (isIOSSafari) {
      // iOS Safari 한글 IME 패턴
      if (e.inputType === 'deleteContentBackward') {
        lastDeleteBackward = e;
        return; // 브라우저 기본 동작 허용
      }
      
      if (e.inputType === 'insertText' && lastDeleteBackward) {
        lastDeleteBackward = null;
        return; // 브라우저 기본 동작 허용 (조합 업데이트)
      }
      
      // 보수적: 모든 키보드 핸들러에 대해 브라우저 기본 동작 허용
      if (e.inputType === 'insertParagraph' || 
          e.inputType === 'deleteContentBackward' ||
          e.inputType === 'deleteContentForward') {
        return; // 브라우저 기본 동작 허용
      }
    }
    
    // 표준 브라우저
    if (e.isComposing) {
      return;
    }
    
    // 사용자 정의 처리
    // ...
  });
  ```

- **iOS Safari에서 isComposing에 의존하지 않기**: iOS Safari 한글 IME의 경우 `isComposing` 플래그를 사용하여 조합을 감지하지 않습니다
- **iOS Safari에서 조합 이벤트에 의존하지 않기**: iOS Safari 한글 IME의 경우 조합 이벤트를 사용하여 조합을 감지하지 않습니다
- **플랫폼 감지 사용**: iOS Safari를 감지하고 특별한 처리를 적용합니다
- **keydown 대신 beforeinput 사용**: `beforeinput` 이벤트가 `keydown` 이벤트보다 더 나은 조합 상태 정보를 제공합니다
