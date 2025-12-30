---
id: ce-0213
scenarioId: scenario-beforeinput-input-inputtype-mismatch
locale: ko
os: iOS
osVersion: "17.0"
device: iPhone or iPad
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: Korean (IME)
caseTitle: beforeinput은 insertCompositionText로 발생하지만 input은 deleteContentBackward로 발생함
description: "iOS Safari에서 한글 IME 조합 중 beforeinput은 inputType 'insertCompositionText'로 발생하는 반면 해당 input 이벤트는 'deleteContentBackward'로 발생할 수 있습니다. 이 불일치는 beforeinput의 targetRanges를 저장하여 실제 DOM 변경을 올바르게 이해하는 데 필요합니다."
tags:
  - composition
  - ime
  - beforeinput
  - input
  - inputtype-mismatch
  - targetranges
  - ios
  - safari
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한</span>'
    description: "Korean composition in progress"
  - label: "beforeinput event"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한</span>'
    description: "beforeinput fires with inputType: 'insertCompositionText', data: '한글', targetRanges indicate insertion point"
  - label: "input event (Bug)"
    html: 'Hello '
    description: "input fires with inputType: 'deleteContentBackward' (mismatch!), composition text deleted instead of inserted"
  - label: "✅ Expected"
    html: 'Hello 한글'
    description: "Expected: Composition text '한글' inserted, inputType should match beforeinput"
---

### 현상

iOS Safari에서 한글 IME 조합 중 `beforeinput`은 `inputType: 'insertCompositionText'`로 발생하는 반면 해당 `input` 이벤트는 `inputType: 'deleteContentBackward'`로 발생할 수 있습니다. 이 불일치는 `input` 이벤트의 `inputType`만 사용하여 DOM 변경을 올바르게 이해하는 것을 불가능하게 만듭니다.

### 재현 예시

1. iOS Safari에서 `contenteditable` 요소에 포커스를 둡니다.
2. 한글 IME를 활성화합니다.
3. 한글 텍스트 조합을 시작합니다 (예: "ㅎ" 그 다음 "ㅏ" 그 다음 "ㄴ"을 입력하여 "한" 조합).
4. 조합을 업데이트하기 위해 계속 입력합니다 (예: "ㄱ" 그 다음 "ㅡ" 그 다음 "ㄹ"을 입력하여 "한글"로 업데이트).
5. 브라우저 콘솔이나 이벤트 로그에서 `beforeinput`과 `input` 이벤트를 관찰합니다.

### 관찰된 동작

조합 텍스트를 업데이트할 때:

1. **beforeinput 이벤트**:
   - `inputType: 'insertCompositionText'`
   - `isComposing: true`
   - `data: '한글'` (새 조합 텍스트)
   - `getTargetRanges()`는 조합 텍스트가 삽입될 위치를 나타내는 범위를 반환합니다
   - 범위는 일반적으로 교체될 이전 조합 텍스트를 포함합니다

2. **input 이벤트**:
   - `inputType: 'deleteContentBackward'` (불일치!)
   - `data: null` 또는 비어 있음
   - 실제 DOM 변경은 `beforeinput`에서 나타난 삽입이 아닌 삭제일 수 있습니다
   - 조합 텍스트가 업데이트되는 대신 삭제될 수 있습니다

3. **결과**:
   - `inputType`에 의존하여 무슨 일이 일어났는지 결정하는 핸들러가 변경을 잘못 해석합니다
   - `beforeinput`의 `targetRanges`가 손실되고 `input`에서 사용할 수 없습니다
   - 애플리케이션 상태가 DOM 상태와 일관되지 않을 수 있습니다

### 예상 동작

- `input` 이벤트의 `inputType`이 `beforeinput` 이벤트의 `inputType`과 일치해야 합니다
- `beforeinput`이 `insertCompositionText`로 발생하면 `input`도 `insertCompositionText`를 가져야 합니다
- `input.data`가 `beforeinput.data`와 일치해야 합니다 (또는 실제 커밋된 텍스트를 반영해야 함)
- DOM 변경이 `beforeinput`에서 나타난 것과 일치해야 합니다

### 영향

이것은 다음을 일으킬 수 있습니다:

- **잘못된 DOM 변경 감지**: 핸들러가 삽입이 발생했다고 생각하지만 실제로는 삭제가 발생했습니다
- **손실된 targetRanges 컨텍스트**: `beforeinput`의 `targetRanges`는 중요하지만 `input`에서 사용할 수 없습니다
- **잘못된 실행 취소/다시 실행**: 실행 취소/다시 실행 스택이 잘못된 작업 유형을 기록합니다
- **상태 동기화 문제**: 애플리케이션 상태가 일관되지 않게 됩니다
- **이벤트 핸들러 실패**: 일치하는 `inputType` 값을 기대하는 핸들러가 실패합니다

### 브라우저 비교

- **iOS Safari**: `beforeinput`에서 `insertCompositionText`를 발생시키지만 `input`에서 `deleteContentBackward`를 발생시킬 수 있음
- **Chrome/Edge**: 일반적으로 이벤트 간 일관된 `inputType`
- **Firefox**: 특정 시나리오에서 불일치를 가질 수 있음
- **Android Chrome**: 동작이 다양할 수 있음

### 참고 및 해결 방법 가능한 방향

- **beforeinput에서 targetRanges 저장**: `input` 핸들러에서 사용하기 위해 `targetRanges`를 저장합니다:
  ```javascript
  let lastBeforeInputTargetRanges = null;
  let lastBeforeInputType = null;
  
  element.addEventListener('beforeinput', (e) => {
    lastBeforeInputTargetRanges = e.getTargetRanges?.() || [];
    lastBeforeInputType = e.inputType;
  });
  
  element.addEventListener('input', (e) => {
    if (lastBeforeInputType && e.inputType !== lastBeforeInputType) {
      // 불일치 감지 - targetRanges를 사용하여 실제 변경 이해
      if (lastBeforeInputTargetRanges && lastBeforeInputTargetRanges.length > 0) {
        // inputType이 아닌 targetRanges를 기반으로 처리
        handleActualChange(lastBeforeInputTargetRanges, e);
      }
    }
    lastBeforeInputTargetRanges = null;
    lastBeforeInputType = null;
  });
  ```

- **DOM 상태 비교**: 불일치가 발생하면 실제 변경을 이해하기 위해 이전과 이후 DOM을 비교합니다:
  ```javascript
  let domBefore = null;
  
  element.addEventListener('beforeinput', (e) => {
    domBefore = element.innerHTML;
  });
  
  element.addEventListener('input', (e) => {
    const domAfter = element.innerHTML;
    if (lastBeforeInputType && e.inputType !== lastBeforeInputType) {
      // domBefore와 domAfter를 비교하여 실제 변경 이해
      const actualChange = compareDOM(domBefore, domAfter);
      handleChange(actualChange);
    }
    domBefore = null;
  });
  ```

- **inputType에만 의존하지 않기**: 조합 이벤트를 처리할 때 항상 DOM 검사로 확인합니다
- **우아하게 처리**: `inputType` 일치에 의존하지 않는 폴백 로직을 가집니다
