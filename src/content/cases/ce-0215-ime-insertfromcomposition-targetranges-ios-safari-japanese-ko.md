---
id: ce-0215
scenarioId: scenario-ime-insertfromcomposition-targetranges
locale: ko
os: iOS
osVersion: "17.0+"
device: iPhone or iPad
deviceVersion: Any
browser: Safari
browserVersion: "17.0+"
keyboard: Japanese (IME)
caseTitle: iOS Safari에서 insertFromComposition의 targetRanges는 collapsed이므로 재계산이 필요함
description: "iOS Safari에서 일본어/한자 IME를 사용할 때, insertFromComposition이 collapsed된 targetRanges와 함께 발생하지만 정확한 삽입 위치를 나타내지 않습니다. 현재 선택 영역을 기반으로 범위를 재계산해야 조합 텍스트를 정확한 위치에 삽입할 수 있습니다."
tags:
  - composition
  - ime
  - beforeinput
  - insertFromComposition
  - targetRanges
  - ios
  - safari
  - japanese
status: draft
domSteps:
  - label: "Before"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">日</span></p>'
    description: "일본어 조합 진행 중"
  - label: "beforeinput 이벤트"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">日</span></p>'
    description: "insertFromComposition이 collapsed된 targetRanges와 함께 발생 (재계산 필요)"
  - label: "After (버그 - 재계산 안 됨)"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">日</span>本</p>'
    description: "범위를 재계산하지 않으면 텍스트가 잘못된 위치에 삽입됨"
  - label: "✅ 예상 (재계산됨)"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">日本</span></p>'
    description: "현재 선택 영역을 기반으로 재계산하면 정확한 위치에 삽입됨"
---

## 현상

iOS Safari에서 일본어/한자 IME를 사용할 때, `insertFromComposition`이 collapsed된 `targetRanges`와 함께 발생하지만 정확한 삽입 위치를 나타내지 않습니다. 현재 선택 영역을 기반으로 범위를 재계산해야 조합 텍스트를 정확한 위치에 삽입할 수 있습니다.

## 재현 예시

1. iOS Safari(iPhone/iPad)에서 `contenteditable` 요소에 포커스합니다.
2. 일본어 IME를 활성화합니다.
3. 일본어/한자 텍스트 조합을 시작합니다 (예: "に" → "ほ" → "ん"을 입력하여 "日本" 조합).
4. 조합을 업데이트하거나 한자로 변환합니다.
5. `inputType: 'insertFromComposition'`이 있는 `beforeinput` 이벤트를 관찰합니다.
6. `getTargetRanges()`를 확인합니다 - collapsed(`startOffset === endOffset`)이지만 정확한 삽입 위치를 나타내지 않습니다.
7. 핸들러가 `targetRanges`를 그대로 신뢰하면 텍스트가 잘못된 위치에 삽입됩니다.
8. 현재 선택 영역을 기반으로 재계산하면 정확한 위치에 삽입됩니다.

## 관찰된 동작

일본어/한자 조합 텍스트를 업데이트할 때:

1. **beforeinput 이벤트**:
   - `inputType: 'insertFromComposition'`
   - `isComposing: true`
   - `data: '日本'` (새로운 조합 텍스트)
   - `getTargetRanges()`는 collapsed된 범위를 반환합니다 (`startOffset === endOffset`)
   - collapsed된 범위는 조합 텍스트가 삽입되어야 할 정확한 위치를 나타내지 않습니다

2. **범위를 그대로 신뢰하는 경우**:
   - 텍스트가 잘못된 위치에 삽입될 수 있습니다
   - 조합 텍스트가 의도한 위치 앞이나 뒤에 나타날 수 있습니다
   - 조합 업데이트가 실패하거나 잘못된 결과를 생성할 수 있습니다

3. **범위를 재계산하는 경우**:
   - `window.getSelection()`을 사용하여 현재 선택 위치를 가져옵니다
   - 현재 선택 영역을 기반으로 삽입 위치를 재계산합니다
   - 텍스트가 정확한 위치에 삽입됩니다
   - 조합 업데이트가 올바르게 작동합니다

## 예상 동작

- `insertFromComposition`의 `targetRanges`는 정확한 삽입 위치를 나타내야 합니다
- `targetRanges`가 collapsed이고 부정확한 경우 재계산이 가능해야 합니다
- 핸들러는 현재 선택 영역을 사용하여 정확한 삽입 위치를 결정할 수 있어야 합니다
- 조합 텍스트는 정확한 위치에 삽입되어야 합니다

## 영향

- **잘못된 위치 지정**: collapsed된 `targetRanges`를 그대로 신뢰하는 핸들러는 텍스트를 잘못된 위치에 삽입합니다
- **조합 중단**: 조합 업데이트가 실패하거나 잘못된 결과를 생성할 수 있습니다
- **플랫폼별 버그**: Desktop Safari에서 작동하는 코드가 iOS Safari에서 실패할 수 있습니다
- **IME별 버그**: iOS Safari에서 한글 IME와 작동하는 코드가 일본어/한자 IME에서 실패할 수 있습니다

## 브라우저 비교

- **iOS Safari (일본어/한자)**: 재계산이 필요한 collapsed된 `targetRanges`와 함께 `insertFromComposition` 발생
- **Desktop Safari**: 정확한 collapsed된 `targetRanges`와 함께 `insertFromComposition` 발생 (그대로 신뢰)
- **iOS Safari (한글)**: `insertFromComposition`이 발생하지 않음
- **Chrome/Edge**: 일반적으로 `insertFromComposition` 대신 `insertCompositionText` 사용
- **Firefox**: 동작이 다양하지만 일반적으로 Chrome과 더 일관됨

## 해결 방법 및 참고사항

- **collapsed된 범위 재계산**: iOS Safari에서 현재 선택 영역을 기반으로 재계산합니다:
  ```javascript
  element.addEventListener('beforeinput', (e) => {
    if (e.inputType === 'insertFromComposition') {
      const targetRanges = e.getTargetRanges?.() || [];
      if (targetRanges.length > 0) {
        const range = targetRanges[0];
        if (range.collapsed) {
          // 현재 선택 영역을 기반으로 재계산
          const selection = window.getSelection();
          const currentRange = selection?.rangeCount ? selection.getRangeAt(0) : null;
          if (currentRange) {
            // targetRanges 대신 currentRange 사용
            handleCompositionInsertion(currentRange);
          }
        } else {
          // collapsed가 아니면 targetRanges를 그대로 사용
          handleCompositionInsertion(range);
        }
      }
    }
  });
  ```

- **플랫폼 및 IME 감지**: iOS Safari에서 일본어/한자 IME를 감지합니다:
  ```javascript
  const isIOSSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  const isJapaneseIME = /* 일본어 IME 감지 */;
  
  if (isIOSSafari && isJapaneseIME && e.inputType === 'insertFromComposition') {
    // collapsed된 범위 재계산
  }
  ```

- **현재 선택 영역 사용**: `targetRanges`가 collapsed일 때 항상 `window.getSelection()`을 사용하여 정확한 위치를 가져옵니다
