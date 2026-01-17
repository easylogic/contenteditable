---
id: scenario-typing-adjacent-formatted-elements-ko
title: 포맷된 요소 옆에서 입력 시 예상치 못한 동작 발생
description: "contenteditable에서 포맷된 요소(링크, bold, italic 등) 옆에서 텍스트를 입력할 때, 입력 이벤트의 event.data에 포맷된 요소의 텍스트가 포함될 수 있고, selection 범위가 포맷된 요소를 포함할 수 있으며, 텍스트가 포맷된 요소 뒤가 아닌 안에 삽입될 수 있습니다. 이것은 다양한 브라우저와 입력 방법에서 발생합니다."
category: formatting
tags:
  - formatting
  - link
  - anchor
  - bold
  - italic
  - selection
  - event.data
  - beforeinput
  - input
status: draft
locale: ko
---

`contenteditable`에서 포맷된 요소(링크, bold, italic 등) 옆에서 텍스트를 입력할 때, 입력 이벤트의 `event.data`에 포맷된 요소의 텍스트가 포함될 수 있고, selection 범위가 포맷된 요소를 포함할 수 있으며, 텍스트가 포맷된 요소 뒤가 아닌 안에 삽입될 수 있습니다. 이것은 다양한 브라우저와 입력 방법에서 발생합니다.

## 문제 개요

사용자가 링크, bold 텍스트, italic 텍스트와 같은 포맷된 요소 바로 다음에 텍스트를 입력할 때 여러 문제가 발생할 수 있습니다:

1. **결합된 `event.data`**: `event.data`가 포맷된 요소의 텍스트와 새로 입력한 텍스트를 모두 포함
2. **Selection이 포맷된 요소 포함**: Selection 범위가 삽입 지점이 아닌 포맷된 요소를 포함
3. **포맷된 요소 안에 텍스트 삽입**: 텍스트가 포맷된 요소 뒤가 아닌 안에 삽입됨
4. **잘못된 포맷팅 상속**: 새로 입력한 텍스트가 인접한 요소의 포맷팅을 상속할 수 있음

## 관찰된 동작

### 시나리오 1: 링크 옆에서 입력

앵커 링크 뒤에서 입력할 때:

```html
<div contenteditable="true">
  <a href="https://example.com">링크 텍스트</a> [커서 위치]
</div>
```

```javascript
element.addEventListener('beforeinput', (e) => {
  // 예상: e.data === '안녕'
  // 실제: e.data === '링크텍스트안녕' (결합됨)
  
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  // range.startContainer가 <a> 요소일 수 있음
  // range가 링크 텍스트를 포함
});
```

### 시나리오 2: Bold 텍스트 옆에서 입력

Bold 텍스트 뒤에서 입력할 때:

```html
<div contenteditable="true">
  <strong>Bold 텍스트</strong> [커서 위치]
</div>
```

```javascript
element.addEventListener('beforeinput', (e) => {
  // event.data가 'Bold 텍스트' + 입력한 텍스트를 포함할 수 있음
  // Selection이 <strong> 요소를 포함할 수 있음
});
```

### 시나리오 3: Italic 텍스트 옆에서 입력

Italic 텍스트 뒤에서 입력할 때:

```html
<div contenteditable="true">
  <em>Italic 텍스트</em> [커서 위치]
</div>
```

Bold 텍스트 및 링크와 유사한 문제가 발생합니다.

## 영향

- **잘못된 텍스트 추출**: `event.data`에서 입력한 텍스트만 추출할 수 없음
- **잘못된 삽입 위치**: 텍스트가 잘못된 위치에 삽입될 수 있음
- **포맷팅 손상**: 포맷된 요소가 손상되거나 잘못 중첩될 수 있음
- **Selection 추적 문제**: Selection 범위가 커서 위치를 정확히 나타내지 않음
- **Undo/redo 문제**: Undo/redo 스택이 잘못된 작업을 기록할 수 있음

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 더 나은 동작이지만, 구문 추천이나 IME에서 문제가 발생할 수 있음
- **Firefox**: 포맷된 요소에서 더 빈번한 문제가 발생할 수 있음
- **Safari**: 동작이 일관되지 않을 수 있음, 특히 iOS에서
- **Android Chrome**: 문제 가능성이 높음, 특히 삼성 키보드 구문 추천 사용 시

## 해결 방법

### 1. 포맷된 요소를 제외하도록 Selection 정규화

```javascript
function normalizeSelectionForFormattedElements(range) {
  if (!range) return null;
  
  let container = range.startContainer;
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement;
  }
  
  // 포맷된 요소 내부 또는 경계에 있는지 확인
  const link = container.closest('a');
  const bold = container.closest('b, strong');
  const italic = container.closest('i, em');
  const formattedElement = link || bold || italic;
  
  if (formattedElement) {
    // Selection이 포맷된 요소 내부에 있고 끝에 있으면, 그 다음으로 이동
    if (range.collapsed) {
      if (range.startContainer === formattedElement) {
        // Selection이 포맷된 요소 자체임
        const normalized = document.createRange();
        try {
          normalized.setStartAfter(formattedElement);
          normalized.collapse(true);
          return normalized;
        } catch (e) {
          return range;
        }
      }
      
      // 포맷된 요소의 텍스트 끝에 있는지 확인
      const textNode = range.startContainer;
      if (textNode.nodeType === Node.TEXT_NODE) {
        const parent = textNode.parentElement;
        if (parent === formattedElement && 
            range.startOffset === textNode.textContent.length) {
          // 포맷된 요소의 텍스트 끝에 있으면, 그 다음으로 이동
          const normalized = document.createRange();
          try {
            normalized.setStartAfter(formattedElement);
            normalized.collapse(true);
            return normalized;
          } catch (e) {
            return range;
          }
        }
      }
    }
  }
  
  return range.cloneRange();
}

element.addEventListener('beforeinput', (e) => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const normalized = normalizeSelectionForFormattedElements(range);
    // 정규화된 range 사용
  }
});
```

### 2. 결합된 데이터에서 실제 입력 텍스트 추출

```javascript
function extractActualInputText(combinedData, range, formattedElement) {
  if (!formattedElement || !combinedData) {
    return combinedData;
  }
  
  const formattedText = formattedElement.textContent;
  
  // 결합된 데이터가 포맷된 텍스트로 시작하는지 확인
  if (combinedData.startsWith(formattedText)) {
    return combinedData.slice(formattedText.length);
  }
  
  // 결합된 데이터가 포맷된 텍스트로 끝나는지 확인
  if (combinedData.endsWith(formattedText)) {
    return combinedData.slice(0, -formattedText.length);
  }
  
  // 포맷된 텍스트가 중간에 있으면 추출 시도
  const index = combinedData.indexOf(formattedText);
  if (index > 0) {
    // 포맷된 텍스트 앞의 텍스트가 실제 입력
    return combinedData.slice(0, index);
  }
  
  // 폴백: 그대로 반환
  return combinedData;
}

element.addEventListener('beforeinput', (e) => {
  if (e.data) {
    const selection = window.getSelection();
    const range = selection?.rangeCount > 0 
      ? selection.getRangeAt(0) 
      : null;
    
    // 인접한 포맷된 요소 찾기
    let container = range?.startContainer;
    if (container?.nodeType === Node.TEXT_NODE) {
      container = container.parentElement;
    }
    
    const link = container?.closest('a');
    const bold = container?.closest('b, strong');
    const italic = container?.closest('i, em');
    const formattedElement = link || bold || italic;
    
    if (formattedElement) {
      const actualInputText = extractActualInputText(
        e.data, 
        range, 
        formattedElement
      );
      // e.data 대신 actualInputText 사용
      handleInput(actualInputText, range);
    } else {
      // 포맷된 요소 없음, e.data를 그대로 사용
      handleInput(e.data, range);
    }
  }
});
```

### 3. 텍스트가 포맷된 요소 뒤에 삽입되도록 보장

```javascript
function ensureInsertionAfterFormattedElement(range, text) {
  let container = range.startContainer;
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement;
  }
  
  const link = container.closest('a');
  const bold = container.closest('b, strong');
  const italic = container.closest('i, em');
  const formattedElement = link || bold || italic;
  
  if (formattedElement) {
    // 포맷된 요소 다음의 텍스트 노드 찾기 또는 생성
    let afterElement = formattedElement.nextSibling;
    
    // 텍스트 노드 찾기
    while (afterElement && afterElement.nodeType !== Node.TEXT_NODE) {
      afterElement = afterElement.nextSibling;
    }
    
    if (afterElement) {
      // 기존 텍스트 노드에 추가
      afterElement.textContent += text;
      
      // 커서를 끝으로 이동
      const newRange = document.createRange();
      newRange.setStart(afterElement, afterElement.textContent.length);
      newRange.collapse(true);
      
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      // 포맷된 요소 다음에 새 텍스트 노드 생성
      const textNode = document.createTextNode(text);
      formattedElement.parentNode.insertBefore(textNode, formattedElement.nextSibling);
      
      // 커서를 끝으로 이동
      const newRange = document.createRange();
      newRange.setStart(textNode, textNode.textContent.length);
      newRange.collapse(true);
      
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  } else {
    // 포맷된 요소 없음, 정상적으로 삽입
    range.insertNode(document.createTextNode(text));
  }
}

element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertText' && e.data) {
    e.preventDefault();
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      ensureInsertionAfterFormattedElement(range, e.data);
    }
  }
});
```

### 4. 실제 변경 사항 파악을 위해 DOM 상태 비교

```javascript
let domState = null;

element.addEventListener('beforeinput', (e) => {
  // 입력 전 DOM 상태 저장
  domState = {
    html: element.innerHTML,
    text: element.textContent,
    selection: window.getSelection()?.getRangeAt(0)?.cloneRange()
  };
});

element.addEventListener('input', (e) => {
  if (domState) {
    const domAfter = {
      html: element.innerHTML,
      text: element.textContent
    };
    
    // 실제 삽입된 텍스트를 찾기 위해 비교
    const actualInserted = findInsertedText(domState, domAfter);
    
    // 실제 삽입된 텍스트로 처리
    handleInput(actualInserted);
    
    domState = null;
  }
});

function findInsertedText(before, after) {
  // 간단한 텍스트 기반 비교
  // 더 정교한 구현은 diff 알고리즘 사용
  
  const beforeText = before.text;
  const afterText = after.text;
  
  if (afterText.length > beforeText.length) {
    // 텍스트가 삽입된 위치 찾기
    let start = 0;
    while (start < beforeText.length && 
           beforeText[start] === afterText[start]) {
      start++;
    }
    
    // 삽입된 텍스트의 끝 찾기
    let end = afterText.length;
    let beforeEnd = beforeText.length;
    while (end > start && beforeEnd > start &&
           beforeText[beforeEnd - 1] === afterText[end - 1]) {
      end--;
      beforeEnd--;
    }
    
    return afterText.slice(start, end);
  }
  
  return '';
}
```

### 5. 포맷된 요소 안에 텍스트 삽입 방지

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertText' && e.data) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // Selection이 포맷된 요소 내부에 있는지 확인
      let container = range.startContainer;
      if (container.nodeType === Node.TEXT_NODE) {
        container = container.parentElement;
      }
      
      const link = container.closest('a');
      const bold = container.closest('b, strong');
      const italic = container.closest('i, em');
      
      if (link || bold || italic) {
        // 기본 동작 방지하고 포맷된 요소 뒤에 삽입
        e.preventDefault();
        
        const formattedElement = link || bold || italic;
        insertTextAfterElement(formattedElement, e.data);
      }
    }
  }
});

function insertTextAfterElement(element, text) {
  // 요소 다음의 텍스트 노드 찾기 또는 생성
  let afterNode = element.nextSibling;
  
  while (afterNode && afterNode.nodeType !== Node.TEXT_NODE) {
    afterNode = afterNode.nextSibling;
  }
  
  if (afterNode) {
    afterNode.textContent += text;
    
    // 커서 이동
    const range = document.createRange();
    range.setStart(afterNode, afterNode.textContent.length);
    range.collapse(true);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    // 새 텍스트 노드 생성
    const textNode = document.createTextNode(text);
    element.parentNode.insertBefore(textNode, element.nextSibling);
    
    // 커서 이동
    const range = document.createRange();
    range.setStart(textNode, textNode.textContent.length);
    range.collapse(true);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
```

## 모범 사례

1. **Selection 정규화**: 적절할 때 포맷된 요소를 제외하도록 selection 범위를 항상 정규화
2. **실제 입력 추출**: `event.data`에 포맷된 텍스트가 포함될 때, 입력한 텍스트만 추출
3. **포맷된 요소 안에 삽입 방지**: 텍스트가 포맷된 요소 안이 아닌 뒤에 삽입되도록 보장
4. **DOM 상태 비교**: 이벤트 데이터가 신뢰할 수 없을 때, 실제 변경 사항을 찾기 위해 입력 전후 DOM 비교
5. **우아하게 처리**: 특정 이벤트 속성에 의존하지 않는 폴백 로직 구현
6. **다양한 포맷된 요소로 테스트**: 링크, bold, italic 및 기타 포맷팅으로 테스트
7. **브라우저 간 테스트**: 동작은 브라우저와 입력 방법에 따라 크게 다름

## 관련 케이스

- `ce-0295`: 삼성 키보드 구문 추천 ON 시 a 링크 옆 입력 시 insertCompositionText 이벤트와 selection 불일치
- 포맷팅 및 텍스트 삽입의 일반적인 문제

## 참고 자료

- [MDN: Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection) - 공식 문서
- [MDN: Range API](https://developer.mozilla.org/en-US/docs/Web/API/Range) - 공식 문서
- [W3C Input Events Level 2 사양](https://www.w3.org/TR/input-events-2/) - 공식 사양
- [W3C Input Events Level 1 사양](https://www.w3.org/TR/2016/WD-input-events-20160928/) - 레거시 사양
