---
id: ce-0216-ime-insertfromcomposition-missing-ios-safari-korean-ko
scenarioId: scenario-ime-insertfromcomposition-targetranges
locale: ko
os: iOS
osVersion: "17.0+"
device: iPhone or iPad
deviceVersion: Any
browser: Safari
browserVersion: "17.0+"
keyboard: Korean (IME)
caseTitle: iOS Safari에서 한글 IME 사용 시 insertFromComposition이 발생하지 않음
description: "iOS Safari에서 한글 IME를 사용할 때, insertFromComposition 이벤트가 전혀 발생하지 않습니다. 조합 이벤트(compositionstart, compositionupdate, compositionend)도 발생하지 않습니다. 대신 iOS Safari는 deleteContentBackward 다음에 insertText 패턴을 사용합니다. 이는 iOS Safari가 한글 IME에 대해 자체 입력 모델을 사용하기 때문일 수 있습니다."
tags:
  - composition
  - ime
  - beforeinput
  - insertFromComposition
  - ios
  - safari
  - korean
  - missing-events
status: draft
domSteps:
  - label: "Before"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">한</span></p>'
    description: "한글 조합 진행 중"
  - label: "beforeinput 이벤트 (버그)"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">한</span></p>'
    description: "insertFromComposition이 발생하지 않음, 조합 이벤트가 발생하지 않음"
  - label: "실제 이벤트"
    html: '<p>Hello </p>'
    description: "대신 deleteContentBackward가 발생함"
  - label: "After"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">한글</span></p>'
    description: "insertText가 발생하여 새로운 조합 텍스트를 삽입함"
---

## 현상

iOS Safari에서 한글 IME를 사용할 때, `insertFromComposition` 이벤트가 전혀 발생하지 않습니다. 조합 이벤트(`compositionstart`, `compositionupdate`, `compositionend`)도 발생하지 않습니다. 대신 iOS Safari는 각 조합 업데이트에 대해 `deleteContentBackward` 다음에 `insertText` 패턴을 사용합니다. 이는 iOS Safari가 한글 IME에 대해 자체 입력 모델을 사용하기 때문일 수 있습니다.

## 재현 예시

1. iOS Safari(iPhone/iPad)에서 `contenteditable` 요소에 포커스합니다.
2. 한글 IME를 활성화합니다.
3. 한글 텍스트 조합을 시작합니다 (예: "ㅎ" → "ㅏ" → "ㄴ"을 입력하여 "한" 조합).
4. 조합을 업데이트하기 위해 계속 입력합니다 (예: "ㄱ" → "ㅡ" → "ㄹ"을 입력하여 "한글"로 업데이트).
5. `beforeinput` 이벤트를 관찰합니다 - `insertFromComposition`이 발생하지 않습니다.
6. 조합 이벤트를 관찰합니다 - 발생하지 않습니다.
7. 대신 `deleteContentBackward` 다음에 `insertText` 패턴을 관찰합니다.

## 관찰된 동작

한글 텍스트를 조합할 때:

1. **insertFromComposition 이벤트 없음**:
   - `insertFromComposition`이 절대 발생하지 않습니다
   - `insertFromComposition`을 기대하는 핸들러는 이러한 이벤트를 받지 못합니다

2. **조합 이벤트 없음**:
   - `compositionstart`가 발생하지 않습니다
   - `compositionupdate`가 발생하지 않습니다
   - `compositionend`가 발생하지 않습니다
   - 조합 이벤트를 기대하는 핸들러는 이러한 이벤트를 받지 못합니다

3. **대체 이벤트 패턴**:
   - `beforeinput`이 `inputType: 'deleteContentBackward'`와 `isComposing: true`와 함께 발생합니다
   - `beforeinput`이 다시 `inputType: 'insertText'`(`insertCompositionText`가 아님)와 `isComposing: true`와 함께 발생합니다
   - 이 패턴이 각 조합 업데이트에 대해 반복됩니다

4. **결과**:
   - `insertFromComposition`을 기대하는 핸들러는 작동하지 않습니다
   - 조합 이벤트를 기대하는 핸들러는 작동하지 않습니다
   - `deleteContentBackward` + `insertText` 패턴을 인식하는 핸들러만 작동합니다

## 예상 동작

- 조합 업데이트 중에 `insertFromComposition`이 발생해야 합니다
- 조합 중에 조합 이벤트가 발생해야 합니다
- 표준 조합 이벤트 모델이 사용되어야 합니다
- 다른 브라우저 및 IME와 일관된 동작이어야 합니다

## 영향

- **누락된 이벤트 핸들러**: `insertFromComposition`을 기대하는 핸들러는 이벤트를 받지 못합니다
- **누락된 조합 핸들러**: 조합 이벤트를 기대하는 핸들러는 이벤트를 받지 못합니다
- **다른 입력 모델**: iOS Safari는 한글 IME에 대해 근본적으로 다른 입력 모델을 사용합니다
- **플랫폼별 코드 필요**: iOS Safari 한글 IME에 대해 다른 처리 로직이 필요합니다
- **IME별 코드 필요**: iOS Safari에서 한글과 다른 IME에 대해 다른 처리 로직이 필요합니다

## 브라우저 비교

- **iOS Safari (한글)**: `insertFromComposition`이 발생하지 않음, 조합 이벤트가 발생하지 않음, `deleteContentBackward` + `insertText` 패턴 사용
- **iOS Safari (일본어/한자)**: `insertFromComposition` 발생, 조합 이벤트 발생
- **Desktop Safari**: `insertFromComposition` 발생, 조합 이벤트 발생
- **Chrome/Edge**: 일반적으로 `insertFromComposition` 대신 `insertCompositionText` 사용, 조합 이벤트 발생
- **Firefox**: 동작이 다양하지만 일반적으로 Chrome과 더 일관됨

## 해결 방법 및 참고사항

- **deleteContentBackward + insertText 패턴 처리**: 이 패턴을 조합 업데이트로 인식합니다:
  ```javascript
  let lastCompositionDelete = null;

  element.addEventListener('beforeinput', (e) => {
    if (e.inputType === 'deleteContentBackward' && e.isComposing) {
      // insertText와 페어링하기 위해 저장
      lastCompositionDelete = e;
      return;
    }
    
    if (e.inputType === 'insertText' && e.isComposing) {
      // iOS Safari 한글 IME: insertFromComposition이 절대 발생하지 않음
      // 조합 업데이트로 처리
      if (lastCompositionDelete) {
        // 단일 조합 업데이트로 처리
        handleCompositionUpdate(e.data);
        lastCompositionDelete = null;
      }
    }
  });
  ```

- **플랫폼 및 IME 감지**: iOS Safari에서 한글 IME를 감지합니다:
  ```javascript
  const isIOSSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  const isKoreanIME = /* 한글 IME 감지 */;
  
  if (isIOSSafari && isKoreanIME) {
    // deleteContentBackward + insertText 패턴 핸들러 사용
    // insertFromComposition이나 조합 이벤트를 기대하지 않음
  }
  ```

- **insertFromComposition에 의존하지 않기**: iOS Safari 한글 IME의 경우 `insertFromComposition` 이벤트를 기대하지 않습니다
- **조합 이벤트에 의존하지 않기**: iOS Safari 한글 IME의 경우 조합 이벤트를 기대하지 않습니다
- **isComposing 플래그 사용**: 조합 이벤트 대신 `e.isComposing` 플래그를 사용하여 조합 상태를 감지합니다
