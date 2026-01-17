---
id: scenario-beforeinput-input-inputtype-mismatch-ko
title: beforeinput과 input 이벤트가 다른 inputType 값을 가짐
description: "IME 조합 중 또는 특정 브라우저/IME 조합에서 beforeinput 이벤트가 해당 input 이벤트와 다른 inputType을 가질 수 있습니다. 예를 들어, beforeinput은 insertCompositionText로 발생하는 반면 input은 deleteContentBackward로 발생할 수 있습니다. 이 불일치는 핸들러가 실제 DOM 변경을 잘못 해석하게 만들 수 있으며, input 이벤트 처리에서 사용하기 위해 beforeinput의 targetRanges를 저장해야 합니다."
category: ime
tags:
  - ime
  - composition
  - beforeinput
  - input
  - inputtype-mismatch
  - targetranges
status: draft
locale: ko
---

IME 조합 중 또는 특정 브라우저/IME 조합에서 `beforeinput` 이벤트가 해당 `input` 이벤트와 다른 `inputType`을 가질 수 있습니다. 이 불일치는 핸들러가 실제 DOM 변경을 잘못 해석하게 만들 수 있으며, `input` 이벤트 처리에서 사용하기 위해 `beforeinput`의 `targetRanges`를 저장해야 합니다.

## 관찰된 동작

IME로 텍스트를 조합할 때 다음과 같은 불일치가 발생할 수 있습니다:

1. **beforeinput 이벤트**가 `inputType: 'insertCompositionText'`로 발생
   - `e.isComposing === true`
   - `e.getTargetRanges()`는 조합 텍스트가 삽입될 위치를 나타내는 범위를 반환
   - `e.data`는 조합 텍스트를 포함

2. **input 이벤트**가 `inputType: 'deleteContentBackward'`(또는 다른 다른 유형)로 발생
   - 실제 DOM 변경은 삽입이 아닌 삭제일 수 있음
   - `inputType`이 `beforeinput`에서 나타난 것과 일치하지 않음
   - `e.data`가 `null`이거나 `beforeinput.data`와 다를 수 있음

## 영향

- **DOM 변경 오해석**: 무슨 일이 일어났는지 결정하기 위해 `inputType`에 의존하는 핸들러가 잘못된 정보를 얻음
- **손실된 컨텍스트**: `beforeinput`의 `targetRanges`는 실제로 무엇이 변경되었는지 이해하는 데 중요하지만 `input` 이벤트에서 사용할 수 없음
- **잘못된 실행 취소/다시 실행**: 실행 취소/다시 실행 스택이 잘못된 작업 유형을 기록할 수 있음
- **상태 동기화 문제**: 애플리케이션 상태가 DOM 상태와 일관되지 않을 수 있음
- **이벤트 핸들러 로직 오류**: 일치하는 `inputType` 값을 기대하는 핸들러가 실패함

## 브라우저 비교

- **Chrome/Edge**: 조합 중 `beforeinput`과 `input` 간에 일반적으로 일관된 `inputType`
- **Firefox**: 특정 IME 시나리오에서 불일치를 가질 수 있음
- **Safari**: `inputType` 불일치가 더 발생할 가능성이 높음, 특히 iOS에서
- **모바일 브라우저**: 텍스트 예측 및 IME 변형으로 인해 불일치 가능성이 더 높음

## 해결 방법

`beforeinput` 이벤트에서 `targetRanges`를 저장하고 `input` 이벤트 핸들러에서 사용:

```javascript
let lastBeforeInputTargetRanges = null;
let lastBeforeInputType = null;
let lastBeforeInputData = null;

element.addEventListener('beforeinput', (e) => {
  // input 핸들러에서 사용하기 위해 targetRanges, inputType 및 data 저장
  lastBeforeInputTargetRanges = e.getTargetRanges?.() || [];
  lastBeforeInputType = e.inputType;
  lastBeforeInputData = e.data;
  
  // beforeinput을 정상적으로 처리
  if (e.inputType === 'insertCompositionText') {
    // 조합 텍스트 삽입 준비
  }
});

element.addEventListener('input', (e) => {
  // inputType 불일치 확인
  if (lastBeforeInputType && e.inputType !== lastBeforeInputType) {
    console.warn('inputType mismatch:', {
      beforeinput: lastBeforeInputType,
      input: e.inputType,
      beforeinputData: lastBeforeInputData,
      inputData: e.data
    });
    
    // 실제 변경을 이해하기 위해 beforeinput의 targetRanges 사용
    if (lastBeforeInputTargetRanges && lastBeforeInputTargetRanges.length > 0) {
      // targetRanges는 실제로 변경된 것을 나타냄
      // inputType이 아닌 targetRanges를 기반으로 처리
      handleActualChange(lastBeforeInputTargetRanges, e);
    }
  } else {
    // 정상적인 경우: inputType이 일치함
    handleInput(e);
  }
  
  // 처리 후 저장된 값 지우기
  lastBeforeInputTargetRanges = null;
  lastBeforeInputType = null;
  lastBeforeInputData = null;
});

function handleActualChange(targetRanges, inputEvent) {
  // targetRanges를 사용하여 실제로 일어난 일을 재구성
  for (const range of targetRanges) {
    // 검사를 위해 StaticRange를 Range로 변환
    const actualRange = document.createRange();
    actualRange.setStart(range.startContainer, range.startOffset);
    actualRange.setEnd(range.endContainer, range.endOffset);
    
    // 이전에 있던 것과 비교하여 범위에 무엇이 있는지 확인
    // 이것은 inputType에 관계없이 실제 변경을 알려줌
  }
}
```

**중요 참고사항**:

- `targetRanges`는 `beforeinput` 이벤트에서만 사용할 수 있으며 `input` 이벤트에서는 사용할 수 없음
- `targetRanges`는 DOM 변경 후 무효화될 수 있는 `StaticRange` 객체임
- 사용하기 전에 범위가 여전히 유효한지 항상 확인
- 실제 변경을 이해하기 위해 이전과 이후 DOM 상태를 비교하는 것을 고려
- `inputType`에만 의존하지 말고 항상 DOM 검사로 확인

## 모범 사례

1. **항상 targetRanges 저장**: `input` 핸들러에서 사용하기 위해 `beforeinput`에서 `targetRanges` 저장
2. **inputType 값 비교**: `beforeinput.inputType`이 `input.inputType`과 일치하는지 확인
3. **DOM 직접 검사**: 불일치가 발생하면 실제 변경을 이해하기 위해 DOM 상태 검사
4. **우아하게 처리**: `inputType`이 항상 올바르다고 가정하지 말고 폴백 로직을 가짐
5. **브라우저 간 테스트**: 이 문제는 브라우저와 IME 조합에 따라 크게 다름

## 참고 자료

- [W3C Input Events Level 2](https://www.w3.org/TR/input-events-2/) - beforeinput and inputType specification
- [W3C Input Events: targetRanges](https://www.w3.org/TR/2016/WD-input-events-20161018/) - getTargetRanges documentation
- [W3C Input Events: insertCompositionText](https://www.w3.org/TR/2017/WD-input-events-20170320/) - Composition input types
- [W3C Input Events: deleteContentBackward](https://www.w3.org/TR/input-events-2/) - Deletion input types
- [W3C Input Events: Grapheme clusters](https://www.w3.org/TR/2017/WD-input-events-1-20170714/) - Text unit handling
- [W3C Input Events GitHub Issue #86](https://github.com/w3c/input-events/issues/86) - Event ordering issues
