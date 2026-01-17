---
id: scenario-gettargetranges-empty-ko
title: beforeinput 이벤트에서 getTargetRanges()가 빈 배열을 반환
description: "beforeinput 이벤트의 getTargetRanges() 메서드가 구문 추천, 특정 IME 조합, 또는 특정 브라우저/기기 조합에서 빈 배열이나 undefined를 반환할 수 있습니다. getTargetRanges()를 사용할 수 없을 때, 개발자는 폴백으로 window.getSelection()에 의존해야 하지만 이것은 덜 정확할 수 있습니다."
category: ime
tags:
  - getTargetRanges
  - beforeinput
  - targetRanges
  - selection
  - ime
  - composition
  - text-prediction
  - android
status: draft
locale: ko
---

`beforeinput` 이벤트의 `getTargetRanges()` 메서드가 구문 추천, 특정 IME 조합, 또는 특정 브라우저/기기 조합에서 빈 배열이나 undefined를 반환할 수 있습니다. `getTargetRanges()`를 사용할 수 없을 때, 개발자는 폴백으로 `window.getSelection()`에 의존해야 하지만 이것은 덜 정확할 수 있습니다.

## 문제 개요

Input Events 명세에 따르면, `getTargetRanges()`는 입력 이벤트에 의해 영향을 받을 DOM 범위를 나타내는 `StaticRange` 객체 배열을 반환해야 합니다. 그러나 실제로는 `getTargetRanges()`가 빈 배열 `[]`을 반환하거나 특정 시나리오에서 메서드가 `undefined`일 수 있습니다.

## 관찰된 동작

### 시나리오 1: 구문 추천 (삼성 키보드)

삼성 키보드에서 구문 추천이 활성화되어 있을 때:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertCompositionText') {
    const ranges = e.getTargetRanges?.() || [];
    // ranges가 [] (빈 배열)
    // 정확한 삽입 위치를 알 수 없음
  }
});
```

### 시나리오 2: 특정 IME 조합

일부 IME 조합 시나리오 중:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertCompositionText' || 
      e.inputType === 'insertFromComposition') {
    const ranges = e.getTargetRanges?.() || [];
    // 일부 브라우저/IME 조합에서 ranges가 []일 수 있음
  }
});
```

### 시나리오 3: Chrome 77 이슈

Chrome 77에서 `getTargetRanges()`가 일관되게 빈 배열을 반환하는 것으로 보고됨:

```javascript
element.addEventListener('beforeinput', (e) => {
  const ranges = e.getTargetRanges?.() || [];
  // Chrome 77에서 ranges가 항상 []
  // 해당 버전의 알려진 버그였음
});
```

### 시나리오 4: 메서드 사용 불가

일부 브라우저나 이전 버전에서 메서드가 존재하지 않을 수 있음:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (typeof e.getTargetRanges !== 'function') {
    // 메서드가 존재하지 않음
    // window.getSelection()을 대신 사용해야 함
  }
});
```

## 영향

- **정확한 삽입 위치를 알 수 없음**: `targetRanges` 없이는 텍스트가 정확히 어디에 삽입될지 알 수 없음
- **window.getSelection()에 의존해야 함**: `window.getSelection()`으로 폴백하는 것이 덜 정확할 수 있음, 특히 포맷된 요소 옆에서 입력할 때
- **잘못된 위치 추적**: 텍스트가 잘못된 위치에 삽입될 수 있음
- **링크 구조 손상**: 링크 옆에서 입력할 때, 텍스트가 링크 뒤가 아닌 링크 안에 삽입될 수 있음
- **포맷팅 문제**: 텍스트가 잘못된 위치에 삽입될 때 잘못된 포맷팅을 상속할 수 있음

## 브라우저 비교

- **Chrome 60+**: 일반적으로 `getTargetRanges()`를 지원하지만, 특정 시나리오(구문 추천, 일부 IME)에서 빈 배열을 반환할 수 있음
- **Chrome 77**: `getTargetRanges()`가 일관되게 빈 배열을 반환하는 알려진 버그
- **Firefox 87+**: `getTargetRanges()`를 지원하지만 동작이 다를 수 있음
- **Safari**: `getTargetRanges()`를 지원하지만 일부 IME 시나리오에서 빈 배열을 반환할 수 있음
- **Android Chrome**: 빈 배열 가능성이 높음, 특히 삼성 키보드 구문 추천 사용 시

## 해결 방법

### 1. 항상 빈 배열 확인

```javascript
element.addEventListener('beforeinput', (e) => {
  const targetRanges = e.getTargetRanges?.() || [];
  
  if (targetRanges.length === 0) {
    // window.getSelection()으로 폴백
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0).cloneRange();
      // 처리에 range 사용
      handleInputWithRange(range, e);
    }
  } else {
    // targetRanges 사용
    handleInputWithRange(targetRanges[0], e);
  }
});
```

### 2. 기능 감지

`getTargetRanges()`가 사용 가능하고 작동하는지 확인:

```javascript
function isGetTargetRangesAvailable() {
  // 메서드가 존재하는지 확인
  if (typeof InputEvent.prototype.getTargetRanges !== 'function') {
    return false;
  }
  
  // 작동하는지 테스트 (일부 브라우저에서 예외를 던질 수 있음)
  try {
    const testEvent = new InputEvent('beforeinput', {
      inputType: 'insertText',
      data: 'test'
    });
    const ranges = testEvent.getTargetRanges();
    return Array.isArray(ranges);
  } catch (e) {
    return false;
  }
}

const useGetTargetRanges = isGetTargetRangesAvailable();

element.addEventListener('beforeinput', (e) => {
  if (useGetTargetRanges) {
    const targetRanges = e.getTargetRanges?.() || [];
    if (targetRanges.length > 0) {
      // targetRanges 사용
    } else {
      // 폴백
    }
  } else {
    // 항상 window.getSelection() 사용
  }
});
```

### 3. 폴백 사용 시 Selection 정규화

폴백으로 `window.getSelection()`을 사용할 때, 포맷된 요소를 제외하도록 정규화:

```javascript
element.addEventListener('beforeinput', (e) => {
  const targetRanges = e.getTargetRanges?.() || [];
  
  let range;
  if (targetRanges.length > 0) {
    // StaticRange를 Range로 변환
    const staticRange = targetRanges[0];
    range = document.createRange();
    range.setStart(staticRange.startContainer, staticRange.startOffset);
    range.setEnd(staticRange.endContainer, staticRange.endOffset);
  } else {
    // window.getSelection()으로 폴백
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      range = selection.getRangeAt(0).cloneRange();
      // 포맷된 요소를 제외하도록 정규화
      range = normalizeRangeForFormattedElements(range);
    }
  }
  
  if (range) {
    handleInputWithRange(range, e);
  }
});

function normalizeRangeForFormattedElements(range) {
  let container = range.startContainer;
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement;
  }
  
  // 포맷된 요소 내부에 있는지 확인
  const link = container.closest('a');
  const bold = container.closest('b, strong');
  const italic = container.closest('i, em');
  
  if (link && range.collapsed && range.startContainer === link) {
    // 링크 다음으로 이동
    const normalized = document.createRange();
    try {
      normalized.setStartAfter(link);
      normalized.collapse(true);
      return normalized;
    } catch (e) {
      return range;
    }
  }
  
  return range;
}
```

### 4. 비교를 위한 DOM 상태 저장

`getTargetRanges()`를 사용할 수 없을 때, 나중에 비교하기 위해 DOM 상태 저장:

```javascript
let domState = null;

element.addEventListener('beforeinput', (e) => {
  const targetRanges = e.getTargetRanges?.() || [];
  
  if (targetRanges.length === 0) {
    // 비교를 위해 DOM 상태 저장
    domState = {
      html: element.innerHTML,
      text: element.textContent,
      selection: window.getSelection()?.getRangeAt(0)?.cloneRange()
    };
  }
});

element.addEventListener('input', (e) => {
  if (domState) {
    // 실제 변경 사항을 파악하기 위해 DOM 상태 비교
    const domAfter = {
      html: element.innerHTML,
      text: element.textContent
    };
    
    const actualChange = compareDOM(domState, domAfter);
    handleActualChange(actualChange);
    
    domState = null;
  }
});
```

### 5. 구문 추천 감지 및 특별 처리

구문 추천이 활성화되어 있을 때 감지하고 특별 처리:

```javascript
function isTextPredictionActive(e) {
  // 구문 추천 감지 휴리스틱:
  // 1. insertCompositionText이지만 getTargetRanges()가 비어있음
  // 2. event.data가 전체 구문을 포함
  // 3. isComposing이 true이지만 실제 조합이 시작되지 않음
  
  if (e.inputType === 'insertCompositionText') {
    const ranges = e.getTargetRanges?.() || [];
    if (ranges.length === 0 && e.data && e.data.length > 1) {
      return true;
    }
  }
  
  return false;
}

element.addEventListener('beforeinput', (e) => {
  const targetRanges = e.getTargetRanges?.() || [];
  
  if (targetRanges.length === 0) {
    if (isTextPredictionActive(e)) {
      // 구문 추천에 대한 특별 처리
      handleTextPredictionInput(e);
    } else {
      // 기타 경우에 대한 폴백
      handleInputWithSelectionFallback(e);
    }
  } else {
    // 정상적인 경우: targetRanges 사용
    handleInputWithTargetRanges(targetRanges, e);
  }
});
```

## 모범 사례

1. **항상 빈 배열 확인**: `getTargetRanges()`가 항상 유효한 범위를 반환한다고 가정하지 않기
2. **기능 감지**: 사용하기 전에 `getTargetRanges()`가 사용 가능한지 확인
3. **폴백 selection 정규화**: `window.getSelection()`을 사용할 때, 포맷된 요소를 제외하도록 정규화
4. **DOM 상태 저장**: `getTargetRanges()`를 사용할 수 없을 때, 비교를 위해 DOM 상태 저장
5. **우아하게 처리**: `getTargetRanges()`에 의존하지 않는 폴백 로직 구현
6. **브라우저 간 테스트**: `getTargetRanges()` 동작은 브라우저와 기기에 따라 크게 다름
7. **특수 케이스 감지**: 빈 배열을 일으킬 수 있는 구문 추천이나 기타 특수 시나리오 식별

## 관련 케이스

- `ce-0295`: 삼성 키보드 구문 추천 ON 시 a 링크 옆 입력 시 insertCompositionText 이벤트와 selection 불일치
- Chrome 77에서 `getTargetRanges()`가 일관되게 빈 배열을 반환하는 버그

## 참고 자료

- [MDN: InputEvent.getTargetRanges()](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/getTargetRanges) - 공식 문서
- [Stack Overflow: InputEvent.getTargetRanges always empty](https://stackoverflow.com/questions/58892747/inputevent-gettargetranges-always-empty) - Chrome 77 이슈 토론
- [W3C Input Events Level 2 사양](https://www.w3.org/TR/input-events-2/) - 공식 사양
- [W3C Input Events Level 1 사양](https://www.w3.org/TR/2016/WD-input-events-20160928/) - 레거시 사양
