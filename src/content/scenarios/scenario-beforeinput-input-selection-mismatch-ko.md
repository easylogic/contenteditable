---
id: scenario-beforeinput-input-selection-mismatch-ko
title: beforeinput과 input 이벤트 간 selection 불일치
description: "beforeinput 이벤트의 selection(window.getSelection())이 해당 input 이벤트의 selection과 다를 수 있습니다. 이 불일치는 IME 조합 중, 구문 추천 중, 또는 링크와 같은 포맷된 요소 옆에서 입력할 때 발생할 수 있습니다. beforeinput의 selection은 인접한 포맷된 텍스트를 포함할 수 있는 반면, input selection은 최종 커서 위치를 반영합니다."
category: ime
tags:
  - selection
  - beforeinput
  - input
  - ime
  - composition
  - text-prediction
  - link
  - formatting
status: draft
locale: ko
---

`beforeinput` 이벤트의 selection(`window.getSelection()`)이 해당 `input` 이벤트의 selection과 다를 수 있습니다. 이 불일치는 IME 조합 중, 구문 추천 중, 또는 링크와 같은 포맷된 요소 옆에서 입력할 때 발생할 수 있습니다. `beforeinput`의 selection은 인접한 포맷된 텍스트를 포함할 수 있는 반면, `input` selection은 최종 커서 위치를 반영합니다.

## 문제 개요

`contenteditable` 요소에서 입력 이벤트를 처리할 때, 개발자들은 종종 `beforeinput`의 selection이 `input`의 selection과 일치한다고 가정합니다. 그러나 항상 그런 것은 아닙니다:

1. **`beforeinput`의 selection**: 인접한 포맷된 요소(링크, bold, italic 등)를 포함할 수 있음
2. **`input`의 selection**: DOM 변경 후 최종 커서 위치를 반영
3. **불일치**: 두 selection은 다른 container, offset 또는 범위를 가질 수 있음

## 관찰된 동작

### 시나리오 1: 링크 옆에서 입력

앵커 링크 옆에서 텍스트를 입력할 때:

```javascript
// HTML: <a href="...">링크 텍스트</a> [커서 위치]

element.addEventListener('beforeinput', (e) => {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  
  // beforeinput selection이 링크를 포함할 수 있음
  // range.startContainer가 <a> 요소일 수 있음
  // range.startOffset과 range.endOffset이 링크 텍스트를 포함할 수 있음
});

element.addEventListener('input', (e) => {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  
  // input selection은 최종 커서 위치를 반영
  // range.startContainer는 링크 다음의 텍스트 노드일 가능성이 높음
  // range.startOffset은 해당 텍스트 노드 내의 위치
});
```

### 시나리오 2: IME 조합 중

IME 조합 중 selection이 다를 수 있음:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertCompositionText') {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    
    // beforeinput selection은 조합 텍스트가 삽입될 위치를 보여줌
    // 기존 조합 텍스트를 포함할 수 있음
  }
});

element.addEventListener('input', (e) => {
  if (e.inputType === 'insertCompositionText') {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    
    // input selection은 조합 후 최종 커서 위치를 보여줌
    // beforeinput selection과 다름
  }
});
```

### 시나리오 3: 구문 추천 (삼성 키보드)

구문 추천이 활성화되어 있을 때 selection이 특히 일관되지 않을 수 있음:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertCompositionText') {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    
    // Selection이 인접한 링크 텍스트를 포함할 수 있음
    // range.startContainer가 링크 요소일 수 있음
    // range가 삽입 지점보다 더 많은 것을 포함
  }
});

element.addEventListener('input', (e) => {
  if (e.inputType === 'insertCompositionText') {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    
    // Selection은 실제 커서 위치를 반영
    // beforeinput과 다른 container와 offset
  }
});
```

## 영향

- **잘못된 위치 추적**: `beforeinput` selection에 의존하는 핸들러가 잘못된 위치를 추적할 수 있음
- **상태 동기화 문제**: `beforeinput` selection을 기반으로 한 애플리케이션 상태가 DOM 상태와 일치하지 않을 수 있음
- **링크 구조 손상**: selection이 링크 텍스트를 포함할 때, 텍스트가 링크 뒤가 아닌 링크 안에 삽입될 수 있음
- **Undo/redo 불일치**: Undo/redo 스택이 잘못된 위치를 기록할 수 있음
- **포맷팅 문제**: 텍스트가 잘못된 위치에 삽입될 때 잘못된 포맷팅을 상속할 수 있음

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 일관된 selection이지만, 구문 추천이나 IME에서 불일치가 발생할 수 있음
- **Firefox**: 더 빈번한 selection 불일치가 발생할 수 있음
- **Safari**: Selection 동작이 일관되지 않을 수 있음, 특히 iOS에서
- **Android Chrome**: 불일치 가능성이 높음, 특히 삼성 키보드 구문 추천 사용 시

## 해결 방법

### 1. Selection 저장 및 비교

```javascript
let beforeInputSelection = null;

element.addEventListener('beforeinput', (e) => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    beforeInputSelection = selection.getRangeAt(0).cloneRange();
  }
});

element.addEventListener('input', (e) => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const inputSelection = selection.getRangeAt(0).cloneRange();
    
    // Selection 비교
    if (beforeInputSelection && !selectionsMatch(beforeInputSelection, inputSelection)) {
      console.warn('Selection 불일치 감지');
      // 불일치 처리
      handleSelectionMismatch(beforeInputSelection, inputSelection);
    }
  }
  
  beforeInputSelection = null;
});

function selectionsMatch(range1, range2) {
  if (!range1 || !range2) return false;
  
  return range1.startContainer === range2.startContainer &&
         range1.startOffset === range2.startOffset &&
         range1.endContainer === range2.endContainer &&
         range1.endOffset === range2.endOffset;
}
```

### 2. Selection 정규화

포맷된 요소를 제외하도록 selection을 정규화:

```javascript
function normalizeSelection(range) {
  if (!range) return null;
  
  let container = range.startContainer;
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement;
  }
  
  // Selection이 포맷된 요소 내부에 있는지 확인
  const link = container.closest('a');
  const bold = container.closest('b, strong');
  const italic = container.closest('i, em');
  
  // Selection이 포맷된 요소의 경계에 있으면 조정
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
  
  // Selection이 포맷된 요소 내부에 있지만 끝에 있으면 조정
  if ((link || bold || italic) && range.collapsed) {
    const element = link || bold || italic;
    if (range.startOffset === element.textContent.length) {
      // 포맷된 요소의 끝에 있으면, 그 다음으로 이동
      const normalized = document.createRange();
      try {
        normalized.setStartAfter(element);
        normalized.collapse(true);
        return normalized;
      } catch (e) {
        return range;
      }
    }
  }
  
  return range.cloneRange();
}

element.addEventListener('beforeinput', (e) => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const normalized = normalizeSelection(range);
    // 정규화된 range로 처리
  }
});
```

### 3. getTargetRanges() 사용 가능 시 사용

`window.getSelection()`보다 `beforeinput`의 `getTargetRanges()`를 선호:

```javascript
element.addEventListener('beforeinput', (e) => {
  const targetRanges = e.getTargetRanges?.() || [];
  
  if (targetRanges.length > 0) {
    // targetRanges 사용 - 더 정확함
    const range = targetRanges[0];
    // targetRanges로 처리
  } else {
    // window.getSelection()으로 폴백하되 정규화
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = normalizeSelection(selection.getRangeAt(0));
      // 정규화된 range로 처리
    }
  }
});
```

### 4. DOM 상태 비교

Selection이 일치하지 않을 때 DOM 상태를 비교하여 실제 변경 사항 파악:

```javascript
let domState = null;

element.addEventListener('beforeinput', (e) => {
  const selection = window.getSelection();
  const range = selection && selection.rangeCount > 0 
    ? selection.getRangeAt(0).cloneRange() 
    : null;
  
  domState = {
    html: element.innerHTML,
    text: element.textContent,
    selection: range,
    selectionNormalized: normalizeSelection(range)
  };
});

element.addEventListener('input', (e) => {
  const selection = window.getSelection();
  const range = selection && selection.rangeCount > 0 
    ? selection.getRangeAt(0).cloneRange() 
    : null;
  
  const inputState = {
    html: element.innerHTML,
    text: element.textContent,
    selection: range,
    selectionNormalized: normalizeSelection(range)
  };
  
  // Selection 비교
  if (domState && !selectionsMatch(
    domState.selectionNormalized, 
    inputState.selectionNormalized
  )) {
    // Selection이 일치하지 않음 - DOM 비교 사용
    const actualChange = compareDOM(domState, inputState);
    handleActualChange(actualChange);
  }
  
  domState = null;
});
```

### 5. 링크 인접 입력 특별 처리

링크 옆에서 입력에 대한 특별 처리:

```javascript
function isAdjacentToLink(range) {
  let container = range.startContainer;
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement;
  }
  
  const link = container.closest('a');
  if (!link) return false;
  
  // 커서가 링크의 경계에 있는지 확인
  if (range.collapsed) {
    if (range.startContainer === link) {
      return true; // 커서가 링크 요소 내부에 있음
    }
    
    // 커서가 링크 바로 다음에 있는지 확인
    const textNode = range.startContainer;
    if (textNode.nodeType === Node.TEXT_NODE) {
      const parent = textNode.parentElement;
      const linkSibling = link.nextSibling;
      if (linkSibling === parent || linkSibling === textNode) {
        return true;
      }
    }
  }
  
  return false;
}

element.addEventListener('beforeinput', (e) => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    
    if (isAdjacentToLink(range)) {
      // 링크 인접 입력에 대한 특별 처리
      const normalized = normalizeSelectionForLink(range);
      handleLinkAdjacentInput(normalized, e);
    }
  }
});

function normalizeSelectionForLink(range) {
  let container = range.startContainer;
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement;
  }
  
  const link = container.closest('a');
  if (link) {
    // Selection을 링크 다음으로 이동
    const normalized = document.createRange();
    try {
      // 링크 다음의 텍스트 노드 찾기
      let afterLink = link.nextSibling;
      while (afterLink && afterLink.nodeType !== Node.TEXT_NODE) {
        afterLink = afterLink.nextSibling;
      }
      
      if (afterLink) {
        normalized.setStart(afterLink, 0);
      } else {
        // 링크 다음에 텍스트 노드 생성
        const textNode = document.createTextNode('');
        link.parentNode.insertBefore(textNode, link.nextSibling);
        normalized.setStart(textNode, 0);
      }
      normalized.collapse(true);
      return normalized;
    } catch (e) {
      return range;
    }
  }
  
  return range.cloneRange();
}
```

## 모범 사례

1. **Selection이 일치한다고 가정하지 않기**: 항상 `beforeinput`과 `input`의 selection을 비교
2. **Selection 정규화**: 적절할 때 selection 범위에서 포맷된 요소 제거
3. **`getTargetRanges()` 선호**: 사용 가능할 때 `beforeinput`의 `getTargetRanges()` 사용
4. **상태 저장**: `beforeinput`에서 selection 상태를 저장하여 `input` 핸들러에서 사용
5. **DOM 비교**: Selection이 일치하지 않을 때 DOM 상태를 비교하여 실제 변경 사항 파악
6. **엣지 케이스 처리**: 링크 인접 입력 및 포맷된 요소에 대한 특별 처리
7. **브라우저 간 테스트**: Selection 동작은 브라우저와 IME에 따라 크게 다름

## 관련 케이스

- `ce-0295`: 삼성 키보드 구문 추천 ON 시 a 링크 옆 입력 시 insertCompositionText 이벤트와 selection 불일치
- IME 조합 시나리오의 일반적인 selection 문제

## 참고 자료

- [MDN: Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection) - 공식 문서
- [MDN: Range API](https://developer.mozilla.org/en-US/docs/Web/API/Range) - 공식 문서
- [W3C Input Events Level 2 사양](https://www.w3.org/TR/input-events-2/) - 공식 사양
- [W3C Input Events Level 1 사양](https://www.w3.org/TR/2016/WD-input-events-20160928/) - 레거시 사양
