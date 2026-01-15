---
id: scenario-samsung-keyboard-text-prediction
title: contenteditable에서 삼성 키보드 구문 추천 문제
description: "안드로이드 크롬에서 삼성 키보드의 구문 추천 기능이 contenteditable 요소에서 다양한 입력 이벤트 처리 문제를 일으킵니다. insertCompositionText 이벤트, getTargetRanges() 누락, selection 불일치, 링크나 포맷된 요소 옆에서 입력 시 event.data 결합 등의 문제가 발생합니다."
category: mobile
tags:
  - samsung-keyboard
  - text-prediction
  - android
  - chrome
  - insertCompositionText
  - getTargetRanges
  - selection
  - link
  - anchor
status: draft
locale: ko
---

안드로이드 크롬에서 삼성 키보드의 구문 추천 기능(phrase suggestion 또는 predictive text)이 `contenteditable` 요소에서 다양한 입력 이벤트 처리 문제를 일으킵니다. 이러한 문제는 구문 추천 기능이 켜져 있고 사용자가 텍스트를 입력할 때, 특히 링크나 다른 포맷된 요소 옆에서 입력할 때 발생합니다.

## 문제 개요

안드로이드 크롬에서 삼성 키보드의 구문 추천 기능이 켜져 있을 때 다음과 같은 문제들이 발생합니다:

1. **모든 입력 이벤트가 `insertCompositionText`로 발생**: 일반 타이핑도 `beforeinput`과 `input` 이벤트가 `inputType: 'insertCompositionText'`로 발생
2. **`getTargetRanges()` 누락**: `beforeinput.getTargetRanges()`가 빈 배열이나 undefined를 반환
3. **selection 불일치**: `beforeinput`의 selection과 `input`의 selection이 다름
4. **결합된 `event.data`**: `event.data`가 인접한 링크 텍스트까지 포함하여 결합됨 (입력한 텍스트만 포함하지 않음)
5. **잘못된 selection 범위**: selection이 인접한 링크 텍스트를 포함하여 예상치 못한 start/end 위치를 가짐

## 구체적인 문제들

### 문제 1: 모든 입력이 insertCompositionText로 발생

**문제**: 구문 추천 기능이 켜져 있으면 모든 텍스트 입력이 `insertText` 대신 `insertCompositionText` 이벤트를 발생시킵니다.

**관찰된 동작**:
```javascript
// 일반 타이핑은 다음과 같이 발생해야 함:
beforeinput: { inputType: 'insertText', data: 'H' }
input: { inputType: 'insertText', data: 'H' }

// 삼성 키보드 구문 추천 ON일 때:
beforeinput: { inputType: 'insertCompositionText', data: 'Hello', isComposing: true }
input: { inputType: 'insertCompositionText', data: 'Hello', isComposing: true }
```

**영향**:
- 실제 IME 조합과 구문 추천을 구분할 수 없음
- `insertText`를 기대하는 이벤트 핸들러가 제대로 작동하지 않음
- 조합 상태 관리가 혼란스러워짐

### 문제 2: getTargetRanges() 누락

**문제**: 구문 추천이 활성화되어 있을 때 `beforeinput.getTargetRanges()`가 빈 배열이나 undefined를 반환합니다.

**관찰된 동작**:
```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertCompositionText') {
    const ranges = e.getTargetRanges?.() || [];
    // ranges가 [] 또는 undefined
    // 정확한 삽입 위치를 알 수 없음
  }
});
```

**영향**:
- 정확한 텍스트 삽입 위치를 알 수 없음
- 부정확할 수 있는 `window.getSelection()`에 의존해야 함
- 정확한 텍스트 삽입 로직 구현이 어려움

### 문제 3: beforeinput과 input 간 selection 불일치

**문제**: `beforeinput` 이벤트의 selection이 `input` 이벤트의 selection과 다릅니다.

**관찰된 동작**:
```javascript
let beforeInputSelection = null;
let inputSelection = null;

element.addEventListener('beforeinput', (e) => {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    beforeInputSelection = sel.getRangeAt(0).cloneRange();
    // beforeInputSelection.startContainer가 링크 텍스트를 포함할 수 있음
  }
});

element.addEventListener('input', (e) => {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    inputSelection = sel.getRangeAt(0).cloneRange();
    // inputSelection이 beforeInputSelection과 다름
  }
});
```

**영향**:
- `beforeinput`과 `input` 핸들러 간 상태 동기화 문제
- 잘못된 위치 추적
- Undo/redo 스택 불일치

### 문제 4: 링크 옆 입력 시 결합된 event.data

**문제**: 앵커 링크 옆에서 입력할 때 `event.data`가 링크 텍스트까지 포함하여 결합됩니다.

**관찰된 동작**:
```html
<div contenteditable="true">
  <a href="https://example.com">링크 텍스트</a> 
</div>
<!-- 사용자가 링크 뒤에 "안녕" 입력 -->
```

```javascript
element.addEventListener('beforeinput', (e) => {
  // 예상: e.data === '안녕'
  // 실제: e.data === '링크텍스트안녕' (결합됨)
});
```

**영향**:
- `event.data`에서 실제 입력한 텍스트를 추출할 수 없음
- 텍스트 추출 로직 실패
- 변경 추적 시스템이 잘못된 변경을 기록

### 문제 5: selection이 인접한 링크 텍스트 포함

**문제**: 링크 옆에서 입력할 때 selection 범위가 예상치 못한 start/end 위치로 링크 텍스트를 포함합니다.

**관찰된 동작**:
```javascript
// 사용자가 링크 뒤에 커서를 두고 입력
element.addEventListener('beforeinput', (e) => {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  
  // range.startContainer가 링크 요소일 수 있음
  // range.startOffset과 range.endOffset이 링크 텍스트를 포함할 수 있음
  // 실제 커서 위치를 알 수 없음
});
```

**영향**:
- 잘못된 커서 위치 감지
- 텍스트가 잘못된 위치에 삽입됨
- 링크 구조가 손상될 수 있음

## 영향받는 브라우저 및 기기

- **Chrome for Android** (삼성 키보드 사용 시) - 문제 확인됨
- **Samsung Internet Browser** - 영향받을 가능성 있음 (Chromium 기반)
- **기타 Android 브라우저** - 삼성 키보드를 사용하는 경우 영향받을 수 있음
- **기타 키보드** - Gboard, SwiftKey 등은 이러한 문제가 발생하지 않음

## 영향받는 기기

- **삼성 갤럭시** 기기 (S9, S10, Note 시리즈 등)
- **삼성 키보드가 설치된 기타 Android 기기**

## 근본 원인

1. **삼성 키보드의 구문 추천 구현**: 키보드의 예측 텍스트 기능이 내부적으로 IME 조합 API를 사용하여 모든 입력을 조합으로 처리
2. **브라우저 IME 어댑터 문제**: Chrome의 IME 어댑터가 삼성 키보드의 구문 추천 이벤트를 제대로 처리하지 못할 수 있음
3. **selection 범위 계산**: 구문 추천이 활성화되어 있을 때 브라우저가 selection 범위를 잘못 계산할 수 있음
4. **이벤트 데이터 집계**: 구문 추천이 추천할 내용을 결정할 때 인접한 텍스트를 집계할 수 있음

## 해결 방법

### 1. insertCompositionText 감지 및 처리

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertCompositionText') {
    // 실제 조합인지 구문 추천인지 확인
    const isTextPrediction = detectTextPrediction(e);
    
    if (isTextPrediction) {
      // 일반 텍스트 입력으로 처리
      handleTextPredictionInput(e);
    } else {
      // 실제 IME 조합으로 처리
      handleCompositionInput(e);
    }
  }
});

function detectTextPrediction(e) {
  // 구문 추천 감지 휴리스틱:
  // 1. isComposing이 true이지만 실제 조합이 시작되지 않음
  // 2. event.data가 전체 구문을 포함
  // 3. getTargetRanges()가 비어있음
  const ranges = e.getTargetRanges?.() || [];
  return ranges.length === 0 && e.data && e.data.length > 1;
}
```

### 2. window.getSelection()을 폴백으로 사용

```javascript
element.addEventListener('beforeinput', (e) => {
  const targetRanges = e.getTargetRanges?.() || [];
  
  if (targetRanges.length === 0) {
    // window.getSelection()을 폴백으로 사용
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0).cloneRange();
      
      // 링크 텍스트를 제외하도록 범위 정규화
      const normalizedRange = normalizeRangeForLinkAdjacent(range);
      handleInputWithRange(normalizedRange, e);
    }
  } else {
    // targetRanges 사용
    handleInputWithRange(targetRanges[0], e);
  }
});

function normalizeRangeForLinkAdjacent(range) {
  let container = range.startContainer;
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement;
  }
  
  const link = container.closest('a');
  if (link) {
    // 링크 다음 위치로 조정
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

### 3. 결합된 데이터에서 실제 입력 텍스트 추출

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertCompositionText' && e.data) {
    // 입력 전 DOM 상태 저장
    const domBefore = element.innerHTML;
    const selection = window.getSelection();
    const range = selection && selection.rangeCount > 0 
      ? selection.getRangeAt(0).cloneRange() 
      : null;
    
    // 실제 입력 텍스트 추출
    const actualInputText = extractActualInputText(e.data, range, domBefore);
    
    // e.data 대신 actualInputText 사용
    handleInput(actualInputText, range);
  }
});

function extractActualInputText(combinedText, range, domBefore) {
  // 방법 1: 결합된 텍스트가 인접한 링크 텍스트로 시작하는지 확인
  if (range) {
    const link = range.startContainer?.parentElement?.closest('a');
    if (link && combinedText.startsWith(link.textContent)) {
      return combinedText.slice(link.textContent.length);
    }
  }
  
  // 방법 2: 입력 전후 DOM 비교 (상태 저장 필요)
  // 더 정확하지만 비동기 처리 필요
  
  // 방법 3: 텍스트 길이 기반 휴리스틱 사용
  // 결합된 텍스트가 예상보다 훨씬 길면 마지막 N개 문자 추출
  // 덜 신뢰할 수 있음
  
  return combinedText; // 폴백: 그대로 반환
}
```

### 4. 이벤트 간 selection 정규화

```javascript
let beforeInputState = null;

element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertCompositionText') {
    const selection = window.getSelection();
    const range = selection && selection.rangeCount > 0 
      ? selection.getRangeAt(0).cloneRange() 
      : null;
    
    beforeInputState = {
      selection: normalizeSelection(range),
      data: e.data,
      domBefore: element.innerHTML,
      timestamp: Date.now()
    };
  }
});

element.addEventListener('input', (e) => {
  if (e.inputType === 'insertCompositionText' && beforeInputState) {
    const selection = window.getSelection();
    const range = selection && selection.rangeCount > 0 
      ? selection.getRangeAt(0).cloneRange() 
      : null;
    
    const inputSelection = normalizeSelection(range);
    
    // 정규화된 selection 비교
    if (!selectionsMatch(beforeInputState.selection, inputSelection)) {
      // 불일치 처리
      handleSelectionMismatch(beforeInputState.selection, inputSelection);
    }
    
    beforeInputState = null;
  }
});

function normalizeSelection(range) {
  if (!range) return null;
  
  let container = range.startContainer;
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement;
  }
  
  const link = container.closest('a');
  if (link && range.startContainer === link) {
    // 링크 다음 위치로 조정
    const normalized = document.createRange();
    try {
      normalized.setStartAfter(link);
      normalized.collapse(true);
      return normalized;
    } catch (e) {
      return range;
    }
  }
  
  return range.cloneRange();
}

function selectionsMatch(range1, range2) {
  if (!range1 || !range2) return false;
  
  return range1.startContainer === range2.startContainer &&
         range1.startOffset === range2.startOffset;
}
```

### 5. DOM 상태 비교로 실제 변경 사항 파악

```javascript
let domState = null;

element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertCompositionText') {
    domState = {
      html: element.innerHTML,
      text: element.textContent,
      selection: window.getSelection()?.getRangeAt(0)?.cloneRange()
    };
  }
});

element.addEventListener('input', (e) => {
  if (e.inputType === 'insertCompositionText' && domState) {
    const domAfter = {
      html: element.innerHTML,
      text: element.textContent
    };
    
    // 실제 변경 사항 파악을 위해 비교
    const actualChange = compareDOM(domState, domAfter);
    
    // 실제 변경 사항을 기반으로 처리
    handleActualChange(actualChange);
    
    domState = null;
  }
});

function compareDOM(before, after) {
  // 간단한 텍스트 기반 비교
  const beforeText = before.text;
  const afterText = after.text;
  
  // 삽입된 텍스트 찾기 (단순화됨)
  if (afterText.length > beforeText.length) {
    const inserted = afterText.slice(beforeText.length);
    return { type: 'insert', text: inserted };
  }
  
  // 더 정교한 비교는 diff 알고리즘 사용
  return { type: 'unknown' };
}
```

### 6. 사용자 안내

```javascript
// 삼성 키보드 감지 및 경고 표시
function detectSamsungKeyboard() {
  const ua = navigator.userAgent;
  return /Samsung/i.test(ua) && /Android/i.test(ua);
}

if (detectSamsungKeyboard()) {
  // 사용자에게 선택적 경고 표시
  showKeyboardWarning();
}

function showKeyboardWarning() {
  const warning = document.createElement('div');
  warning.className = 'keyboard-warning';
  warning.innerHTML = `
    <p>입력 문제가 발생하면 구문 추천 기능을 끄는 것을 시도해보세요:</p>
    <p>설정 > 일반 관리 > 삼성 키보드 설정 > 구문 추천 OFF</p>
    <p>또는 Gboard나 SwiftKey 같은 대안 키보드를 사용하세요.</p>
  `;
  // UI에 추가
}
```

## 모범 사례

1. **항상 `getTargetRanges()` 가용성 확인**: 항상 유효한 범위를 반환한다고 가정하지 않기
2. **selection 정규화**: 필요할 때 인접한 링크 텍스트를 제외하도록 selection 범위를 항상 정규화
3. **이벤트 간 상태 저장**: `beforeinput`에서 DOM 상태와 selection을 저장하여 `input`에서 사용
4. **DOM 상태 비교**: 이벤트 데이터가 신뢰할 수 없을 때 입력 전후 DOM을 비교
5. **우아하게 처리**: 특정 이벤트 속성에 의존하지 않는 폴백 로직 구현
6. **구문 추천 ON/OFF 모두 테스트**: 두 시나리오 모두에서 에디터가 작동하는지 확인

## 관련 케이스

- `ce-0295`: 삼성 키보드 구문 추천 ON 시 a 링크 옆 입력 시 insertCompositionText 이벤트와 selection 불일치
- `ce-0290`: 삼성 키보드 백스페이스 크래시
- `insertText` 및 `insertReplacementText` 입력 타입의 일반적인 구문 추천 문제

## 참고 자료

- MDN: InputEvent.getTargetRanges() - https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/getTargetRanges
- W3C Input Events Specification - https://www.w3.org/TR/2016/WD-input-events-20160928/
- Chromium Code Review: 삼성 키보드 백스페이스 처리 - https://codereview.chromium.org/1126203013
