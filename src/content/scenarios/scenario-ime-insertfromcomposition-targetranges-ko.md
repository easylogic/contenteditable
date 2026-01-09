---
id: scenario-ime-insertfromcomposition-targetranges
title: insertFromComposition targetRanges 동작이 Safari 플랫폼 간에 다름
description: "insertFromComposition inputType이 Desktop Safari와 iOS Safari에서 다른 targetRanges 동작과 함께 발생하여 다른 처리 전략이 필요합니다. Desktop Safari는 collapsed여도 정확한 targetRanges를 제공하는 반면, iOS Safari는 재계산이 필요한 collapsed 범위를 제공할 수 있습니다. 또한 iOS Safari 한글 IME는 insertFromComposition이 전혀 발생하지 않습니다."
category: ime
tags:
  - ime
  - composition
  - beforeinput
  - insertFromComposition
  - targetRanges
  - safari
status: draft
locale: ko
---

`insertFromComposition` inputType이 Safari 플랫폼 간에 다른 `targetRanges` 동작과 함께 발생하여 플랫폼별 처리 전략이 필요합니다.

## 플랫폼별 동작

### Desktop Safari
- 한글 IME를 포함한 다양한 IME에서 조합 업데이트 중 `insertFromComposition` 발생
- `targetRanges`가 정확하며 collapsed여도 신뢰해야 함
- 현재 선택 영역을 기반으로 범위를 재계산하면 잘못된 위치 지정이 발생할 수 있음
- 한글 IME 및 기타 IME에 적용됨

### iOS Safari - 일본어/한자 IME
- 일본어/한자 조합 중 `insertFromComposition` 발생
- `targetRanges`가 collapsed일 수 있으며 현재 선택 영역을 기반으로 재계산이 필요함
- 재계산이 조합 텍스트를 정확한 위치에 배치하는 데 필요함

### iOS Safari - 한글 IME
- `insertFromComposition`이 전혀 발생하지 않음
- 조합 이벤트(`compositionstart`, `compositionupdate`, `compositionend`)가 발생하지 않음
- 대신 항상 `deleteContentBackward` 다음에 `insertText` 패턴 사용
- 이는 iOS Safari가 한글 IME에 대해 자체 입력 모델을 사용하기 때문일 수 있음

## 관찰된 동작

### Desktop Safari + 한글 IME
1. 사용자가 조합 중 한글 문자를 입력함
2. `beforeinput`이 `inputType: 'insertFromComposition'`과 함께 발생함
3. `targetRanges`가 collapsed일 수 있지만 정확한 삽입 위치를 나타냄
4. 현재 선택 영역을 기반으로 재계산하면 잘못된 위치 지정이 발생함
5. `targetRanges`를 그대로 신뢰하면 올바른 동작이 생성됨

### iOS Safari + 일본어/한자 IME
1. 사용자가 조합 중 일본어/한자 문자를 입력함
2. `beforeinput`이 `inputType: 'insertFromComposition'`과 함께 발생함
3. `targetRanges`가 collapsed임 (`startOffset === endOffset`)
4. 현재 선택 영역을 기반으로 재계산이 필요함
5. 재계산 없이는 조합 텍스트가 잘못된 위치에 삽입될 수 있음

### iOS Safari + 한글 IME
1. 사용자가 한글 문자를 입력함
2. `insertFromComposition` 이벤트가 발생하지 않음
3. 조합 이벤트가 발생하지 않음
4. 대신 `deleteContentBackward` 다음에 `insertText` 패턴이 발생함
5. 이는 근본적으로 다른 입력 모델임

## 영향

- **잘못된 범위 처리**: Desktop Safari에서 collapsed된 `targetRanges`를 재계산하는 핸들러는 텍스트를 잘못된 위치에 배치함
- **누락된 재계산**: iOS Safari 일본어/한자에서 collapsed된 `targetRanges`를 재계산하지 않는 핸들러는 텍스트를 잘못된 위치에 배치함
- **누락된 이벤트 핸들러**: iOS Safari 한글에서 `insertFromComposition`을 기대하는 핸들러는 이러한 이벤트를 받지 못함
- **플랫폼별 코드 필요**: Desktop Safari와 iOS Safari에 대해 다른 처리 로직이 필요함
- **IME별 코드 필요**: iOS Safari에서 한글과 일본어/한자에 대해 다른 처리 로직이 필요함

## 브라우저 비교

- **Desktop Safari**: 정확한 `targetRanges`와 함께 `insertFromComposition` 발생 (그대로 신뢰, collapsed여도)
- **iOS Safari (일본어/한자)**: 재계산이 필요한 collapsed된 `targetRanges`와 함께 `insertFromComposition` 발생
- **iOS Safari (한글)**: `insertFromComposition`이 발생하지 않음 (`deleteContentBackward` + `insertText` 패턴 대신 사용)
- **Chrome/Edge**: 일반적으로 `insertFromComposition` 대신 `insertCompositionText` 사용
- **Firefox**: 동작이 다양하지만 일반적으로 Chrome과 더 일관됨

## 해결 방법

### Desktop Safari - targetRanges 신뢰
```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertFromComposition') {
    const targetRanges = e.getTargetRanges?.() || [];
    if (targetRanges.length > 0) {
      // collapsed여도 targetRanges 신뢰
      // 현재 선택 영역을 기반으로 재계산하지 않음
      const range = targetRanges[0];
      // range.startContainer와 range.startOffset을 그대로 사용
      handleCompositionInsertion(range);
    }
  }
});
```

### iOS Safari - 일본어/한자 - collapsed 범위 재계산
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

### iOS Safari - 한글 - deleteContentBackward + insertText 패턴 처리
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

**중요**: 올바른 처리 전략을 적용하려면 플랫폼 및 IME 감지가 필요합니다.
