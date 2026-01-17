---
id: ce-0296-beforeinput-input-selection-mismatch-ko
scenarioId: scenario-beforeinput-input-selection-mismatch
locale: ko
os: Android
osVersion: "10-14"
device: Mobile (Samsung Galaxy series)
deviceVersion: Any
browser: Chrome for Android
browserVersion: "120+"
keyboard: Korean (IME) - Samsung Keyboard with Text Prediction ON
caseTitle: beforeinput과 input 이벤트 간 selection 불일치
description: "안드로이드 크롬에서 삼성 키보드 구문 추천이 켜져 있을 때, 링크 옆에서 텍스트를 입력하면 beforeinput 이벤트의 selection과 input 이벤트의 selection이 다릅니다. beforeinput의 selection은 링크 요소를 포함하지만, input의 selection은 링크 다음의 텍스트 노드를 가리킵니다."
tags:
  - selection
  - beforeinput
  - input
  - samsung-keyboard
  - text-prediction
  - link
  - android
  - chrome
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    <a href="https://example.com">링크 텍스트</a> 여기에 입력하세요
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true"><a href="https://example.com">링크 텍스트</a> </div>'
    description: "링크 뒤에 커서 위치"
  - label: "beforeinput event"
    html: '<div contenteditable="true"><a href="https://example.com">링크 텍스트</a> </div>'
    description: "beforeinput: selection.startContainer가 <a> 요소, selection이 링크 텍스트 포함"
  - label: "input event (Bug)"
    html: '<div contenteditable="true"><a href="https://example.com">링크 텍스트</a> 안녕</div>'
    description: "input: selection.startContainer가 링크 다음의 텍스트 노드, beforeinput과 다른 selection"
  - label: "✅ Expected"
    html: '<div contenteditable="true"><a href="https://example.com">링크 텍스트</a> 안녕</div>'
    description: "예상: beforeinput과 input의 selection이 일치해야 함"
---

## 현상

안드로이드 크롬에서 삼성 키보드의 구문 추천 기능이 켜져 있을 때, `contenteditable` 요소 내의 링크 옆에서 텍스트를 입력하면 `beforeinput` 이벤트의 selection과 `input` 이벤트의 selection이 다릅니다.

## 재현 예시

1. 안드로이드 기기(삼성 갤럭시 시리즈 등)에서 Chrome 브라우저를 엽니다.
2. 삼성 키보드의 구문 추천 기능을 켭니다.
3. `contenteditable` 요소 내에 a 링크가 있는 HTML을 준비합니다 (예: `<a href="https://example.com">링크 텍스트</a>`).
4. a 링크 바로 옆(뒤)에 커서를 위치시킵니다.
5. 텍스트를 입력합니다 (예: "안녕").
6. 브라우저 콘솔에서 `beforeinput`과 `input` 이벤트의 selection을 관찰합니다.

## 관찰된 동작

링크 옆에서 텍스트 입력 시:

1. **beforeinput 이벤트**:
   - `window.getSelection().getRangeAt(0).startContainer`가 `<a>` 요소일 수 있음
   - selection이 링크 텍스트를 포함
   - `startOffset`과 `endOffset`이 예상과 다른 형태

2. **input 이벤트**:
   - `window.getSelection().getRangeAt(0).startContainer`가 링크 다음의 텍스트 노드
   - selection이 실제 커서 위치를 반영
   - `beforeinput`의 selection과 다른 container와 offset

3. **결과**:
   - `beforeinput` 핸들러에서 저장한 selection 정보가 `input` 핸들러에서 사용할 수 없음
   - 상태 동기화 문제 발생
   - 위치 추적이 부정확함

## 예상 동작

- `beforeinput`과 `input`의 selection이 일치해야 함
- 두 이벤트 모두에서 같은 container와 offset을 가져야 함
- selection이 링크 요소를 포함하지 않고 실제 커서 위치만 반영해야 함

## 영향

- **상태 동기화 문제**: `beforeinput`에서 저장한 selection이 `input`에서 사용할 수 없음
- **잘못된 위치 추적**: selection 불일치로 인해 위치 추적이 부정확함
- **Undo/redo 불일치**: Undo/redo 스택이 잘못된 위치를 기록할 수 있음

## 브라우저 비교

- **Android Chrome + Samsung Keyboard (구문 추천 ON)**: 이 문제 발생
- **Android Chrome + Samsung Keyboard (구문 추천 OFF)**: 정상 동작
- **Android Chrome + Gboard**: 정상 동작
- **기타 브라우저**: 다른 IME나 구문 추천에서도 유사한 문제 발생 가능

## 참고사항 및 가능한 해결 방향

- **Selection 정규화**: `beforeinput`과 `input` 모두에서 selection을 정규화하여 비교
- **DOM 상태 저장**: selection 대신 DOM 상태를 저장하여 비교
- **getTargetRanges() 사용**: 사용 가능할 때 `getTargetRanges()`를 사용 (하지만 이 경우에도 빈 배열일 수 있음)

## 코드 예시

```javascript
const editor = document.querySelector('div[contenteditable]');
let beforeInputSelection = null;

editor.addEventListener('beforeinput', (e) => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0).cloneRange();
    
    // Selection 정규화 (링크 제외)
    beforeInputSelection = normalizeSelectionForLink(range);
  }
});

editor.addEventListener('input', (e) => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0).cloneRange();
    const inputSelection = normalizeSelectionForLink(range);
    
    // Selection 비교
    if (beforeInputSelection && !selectionsMatch(beforeInputSelection, inputSelection)) {
      console.warn('Selection 불일치 감지');
      // 불일치 처리
    }
  }
  
  beforeInputSelection = null;
});

function normalizeSelectionForLink(range) {
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
