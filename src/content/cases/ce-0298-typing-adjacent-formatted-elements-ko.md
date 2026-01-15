---
id: ce-0298
scenarioId: scenario-typing-adjacent-formatted-elements
locale: ko
os: Android
osVersion: "10-14"
device: Mobile (Samsung Galaxy series)
deviceVersion: Any
browser: Chrome for Android
browserVersion: "120+"
keyboard: Korean (IME) - Samsung Keyboard with Text Prediction ON
caseTitle: 포맷된 요소 옆에서 입력 시 event.data에 포맷된 텍스트가 결합됨
description: "안드로이드 크롬에서 삼성 키보드 구문 추천이 켜져 있을 때, 링크나 bold 텍스트 같은 포맷된 요소 옆에서 텍스트를 입력하면 beforeinput 이벤트의 event.data에 포맷된 요소의 텍스트와 입력한 텍스트가 결합되어 포함됩니다."
tags:
  - formatting
  - link
  - bold
  - event.data
  - beforeinput
  - samsung-keyboard
  - text-prediction
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
  - label: "beforeinput event (Bug)"
    html: '<div contenteditable="true"><a href="https://example.com">링크 텍스트</a> </div>'
    description: "beforeinput: event.data='링크텍스트안녕' (결합됨), 입력한 텍스트만 추출하기 어려움"
  - label: "input event"
    html: '<div contenteditable="true"><a href="https://example.com">링크 텍스트</a> 안녕</div>'
    description: "input: 텍스트가 정상적으로 삽입되지만 event.data가 결합되어 있음"
  - label: "✅ Expected"
    html: '<div contenteditable="true"><a href="https://example.com">링크 텍스트</a> 안녕</div>'
    description: "예상: event.data는 입력한 텍스트('안녕')만 포함해야 함"
---

## 현상

안드로이드 크롬에서 삼성 키보드의 구문 추천 기능이 켜져 있을 때, `contenteditable` 요소 내의 링크나 bold 텍스트 같은 포맷된 요소 옆에서 텍스트를 입력하면 `beforeinput` 이벤트의 `event.data`에 포맷된 요소의 텍스트와 입력한 텍스트가 결합되어 포함됩니다.

## 재현 예시

1. 안드로이드 기기(삼성 갤럭시 시리즈 등)에서 Chrome 브라우저를 엽니다.
2. 삼성 키보드의 구문 추천 기능을 켭니다.
3. `contenteditable` 요소 내에 링크나 bold 텍스트가 있는 HTML을 준비합니다 (예: `<a href="https://example.com">링크 텍스트</a>` 또는 `<strong>Bold 텍스트</strong>`).
4. 포맷된 요소 바로 옆(뒤)에 커서를 위치시킵니다.
5. 텍스트를 입력합니다 (예: "안녕").
6. 브라우저 콘솔에서 `beforeinput` 이벤트의 `event.data`를 확인합니다.

## 관찰된 동작

포맷된 요소 옆에서 텍스트 입력 시:

1. **beforeinput 이벤트**:
   - `e.data`가 포맷된 요소의 텍스트와 입력한 텍스트를 결합하여 포함
   - 예: 링크 텍스트가 "링크 텍스트"이고 "안녕"을 입력하면 `e.data === '링크텍스트안녕'`
   - 입력한 텍스트만 추출하기 어려움

2. **결과**:
   - `event.data`에서 실제 입력한 텍스트를 정확히 파악할 수 없음
   - 텍스트 추출 로직이 실패할 수 있음
   - 변경 추적 시스템이 잘못된 변경을 기록할 수 있음

## 예상 동작

- `event.data`는 입력한 텍스트만 포함해야 함
- 포맷된 요소의 텍스트는 포함되지 않아야 함
- 예: "안녕"을 입력하면 `e.data === '안녕'`이어야 함

## 영향

- **잘못된 텍스트 추출**: `event.data`에서 실제 입력한 텍스트만 추출할 수 없음
- **변경 추적 실패**: 변경 추적 시스템이 잘못된 변경을 기록
- **Undo/redo 문제**: Undo/redo 스택이 잘못된 텍스트를 기록할 수 있음

## 브라우저 비교

- **Android Chrome + Samsung Keyboard (구문 추천 ON)**: 이 문제 발생
- **Android Chrome + Samsung Keyboard (구문 추천 OFF)**: 정상 동작
- **Android Chrome + Gboard**: 정상 동작
- **기타 브라우저**: 다른 구문 추천 기능에서도 유사한 문제 발생 가능

## 참고사항 및 가능한 해결 방향

- **DOM 상태 비교**: `event.data`가 신뢰할 수 없을 때 DOM 상태를 비교하여 실제 변경 사항 파악
- **텍스트 추출 로직**: 결합된 텍스트에서 실제 입력 텍스트만 추출하는 로직 구현
- **인접 요소 확인**: 인접한 포맷된 요소의 텍스트를 확인하여 제거

## 코드 예시

```javascript
const editor = document.querySelector('div[contenteditable]');

editor.addEventListener('beforeinput', (e) => {
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
      // 결합된 텍스트에서 실제 입력 텍스트 추출
      const actualInputText = extractActualInputText(
        e.data, 
        formattedElement
      );
      
      // 실제 입력 텍스트로 처리
      handleInput(actualInputText, range);
    } else {
      // 포맷된 요소 없음, e.data를 그대로 사용
      handleInput(e.data, range);
    }
  }
});

function extractActualInputText(combinedData, formattedElement) {
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
  
  // 폴백: 그대로 반환
  return combinedData;
}
```
