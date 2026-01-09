---
id: ce-0214
scenarioId: scenario-ime-insertfromcomposition-targetranges
locale: ko
os: macOS
osVersion: "14.0+"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0+"
keyboard: Korean (IME)
caseTitle: Desktop Safari에서 insertFromComposition의 targetRanges는 collapsed여도 신뢰해야 함
description: "Desktop Safari에서 한글 IME를 사용할 때, insertFromComposition이 collapsed된 targetRanges와 함께 발생하지만 정확한 삽입 위치를 나타냅니다. 현재 선택 영역을 기반으로 범위를 재계산하면 잘못된 위치에 삽입됩니다. targetRanges를 그대로 신뢰해야 합니다."
tags:
  - composition
  - ime
  - beforeinput
  - insertFromComposition
  - targetRanges
  - desktop
  - safari
  - korean
status: draft
domSteps:
  - label: "Before"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">한</span></p>'
    description: "한글 조합 진행 중"
  - label: "beforeinput 이벤트"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">한</span></p>'
    description: "insertFromComposition이 collapsed된 targetRanges와 함께 발생 (정확한 삽입 위치)"
  - label: "After (버그 - 재계산됨)"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">한글</span>글</p>'
    description: "범위를 재계산하면 텍스트가 잘못된 위치에 삽입됨"
  - label: "✅ 예상 (targetRanges 신뢰)"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">한글</span></p>'
    description: "targetRanges를 그대로 신뢰하면 정확한 위치에 삽입됨"
---

## 현상

Desktop Safari에서 한글 IME를 사용할 때, `insertFromComposition`이 collapsed된 `targetRanges`와 함께 발생하지만 정확한 삽입 위치를 나타냅니다. 현재 선택 영역을 기반으로 범위를 재계산하면 잘못된 위치에 삽입됩니다. `targetRanges`를 그대로 신뢰해야 합니다.

## 재현 예시

1. Desktop Safari(macOS)에서 `contenteditable` 요소에 포커스합니다.
2. 한글 IME를 활성화합니다.
3. 한글 텍스트 조합을 시작합니다 (예: "ㅎ" → "ㅏ" → "ㄴ"을 입력하여 "한" 조합).
4. 조합을 업데이트하기 위해 계속 입력합니다 (예: "ㄱ" → "ㅡ" → "ㄹ"을 입력하여 "한글"로 업데이트).
5. `inputType: 'insertFromComposition'`이 있는 `beforeinput` 이벤트를 관찰합니다.
6. `getTargetRanges()`를 확인합니다 - collapsed일 수 있지만 정확한 삽입 위치를 나타냅니다.
7. 핸들러가 현재 선택 영역을 기반으로 범위를 재계산하면 텍스트가 잘못된 위치에 삽입됩니다.

## 관찰된 동작

한글 조합 텍스트를 업데이트할 때:

1. **beforeinput 이벤트**:
   - `inputType: 'insertFromComposition'`
   - `isComposing: true`
   - `data: '한글'` (새로운 조합 텍스트)
   - `getTargetRanges()`는 collapsed일 수 있는 범위를 반환합니다 (`startOffset === endOffset`)
   - collapsed된 범위는 조합 텍스트가 삽입되어야 할 정확한 위치를 나타냅니다

2. **범위가 재계산되는 경우**:
   - `window.getSelection()`을 기반으로 재계산하는 핸들러는 잘못된 위치를 얻습니다
   - 텍스트가 잘못된 위치에 삽입될 수 있습니다 (예: 중복되거나 잘못 배치됨)
   - 조합 텍스트가 예상치 못한 위치에 나타날 수 있습니다

3. **범위를 그대로 신뢰하는 경우**:
   - 텍스트가 정확한 위치에 삽입됩니다
   - 조합 업데이트가 올바르게 작동합니다
   - 위치 문제가 발생하지 않습니다

## 예상 동작

- `insertFromComposition`의 `targetRanges`는 collapsed여도 그대로 신뢰해야 합니다
- 현재 선택 영역을 기반으로 범위를 재계산할 필요가 없어야 합니다
- collapsed된 `targetRanges`는 정확한 삽입 위치를 나타냅니다
- 핸들러는 수정 없이 `targetRanges`를 직접 사용해야 합니다

## 영향

- **잘못된 위치 지정**: collapsed된 `targetRanges`를 재계산하는 핸들러는 텍스트를 잘못된 위치에 삽입합니다
- **중복된 텍스트**: 텍스트가 여러 번 삽입되거나 잘못된 위치에 삽입될 수 있습니다
- **조합 중단**: 조합 업데이트가 실패하거나 잘못된 결과를 생성할 수 있습니다
- **플랫폼별 버그**: 다른 브라우저에서 작동하는 코드가 Desktop Safari에서 실패할 수 있습니다

## 브라우저 비교

- **Desktop Safari**: 정확한 collapsed된 `targetRanges`와 함께 `insertFromComposition` 발생 (그대로 신뢰)
- **iOS Safari (일본어/한자)**: 재계산이 필요한 collapsed된 `targetRanges`와 함께 `insertFromComposition` 발생
- **iOS Safari (한글)**: `insertFromComposition`이 발생하지 않음
- **Chrome/Edge**: 일반적으로 `insertFromComposition` 대신 `insertCompositionText` 사용
- **Firefox**: 동작이 다양하지만 일반적으로 Chrome과 더 일관됨

## 해결 방법 및 참고사항

- **targetRanges를 그대로 신뢰**: Desktop Safari에서 collapsed된 `targetRanges`를 재계산하지 않습니다:
  ```javascript
  element.addEventListener('beforeinput', (e) => {
    if (e.inputType === 'insertFromComposition') {
      const targetRanges = e.getTargetRanges?.() || [];
      if (targetRanges.length > 0) {
        // collapsed여도 targetRanges를 신뢰
        // 현재 선택 영역을 기반으로 재계산하지 않음
        const range = targetRanges[0];
        // range.startContainer와 range.startOffset을 직접 사용
        handleCompositionInsertion(range);
      }
    }
  });
  ```

- **플랫폼 감지**: Desktop Safari와 iOS Safari를 구분하여 올바른 전략을 적용합니다:
  ```javascript
  const isDesktopSafari = /Macintosh/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  
  if (isDesktopSafari && e.inputType === 'insertFromComposition') {
    // targetRanges를 그대로 신뢰
  }
  ```

- **선택 기반 재계산 피하기**: Desktop Safari에서 `window.getSelection()`을 사용하여 범위를 재계산하지 않습니다
