---
id: ce-0297-gettargetranges-empty-ko
scenarioId: scenario-gettargetranges-empty
locale: ko
os: Android
osVersion: "10-14"
device: Mobile (Samsung Galaxy series)
deviceVersion: Any
browser: Chrome for Android
browserVersion: "120+"
keyboard: Korean (IME) - Samsung Keyboard with Text Prediction ON
caseTitle: 삼성 키보드 구문 추천 ON 시 beforeinput.getTargetRanges()가 빈 배열 반환
description: "안드로이드 크롬에서 삼성 키보드의 구문 추천 기능이 켜져 있을 때, 링크 옆에서 텍스트를 입력하면 beforeinput 이벤트의 getTargetRanges()가 빈 배열을 반환합니다. 이로 인해 정확한 텍스트 삽입 위치를 알 수 없어 window.getSelection()을 폴백으로 사용해야 하지만 이것은 덜 정확할 수 있습니다."
tags:
  - getTargetRanges
  - beforeinput
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
  - label: "beforeinput event (Bug)"
    html: '<div contenteditable="true"><a href="https://example.com">링크 텍스트</a> </div>'
    description: "beforeinput: getTargetRanges()가 [] (빈 배열) 반환, 정확한 삽입 위치를 알 수 없음"
  - label: "input event"
    html: '<div contenteditable="true"><a href="https://example.com">링크 텍스트</a> 안녕</div>'
    description: "input: 텍스트가 삽입되지만 정확한 위치 추적이 어려움"
  - label: "✅ Expected"
    html: '<div contenteditable="true"><a href="https://example.com">링크 텍스트</a> 안녕</div>'
    description: "예상: getTargetRanges()가 정확한 삽입 위치를 나타내는 범위를 반환해야 함"
---

## 현상

안드로이드 크롬에서 삼성 키보드의 구문 추천 기능이 켜져 있을 때, `contenteditable` 요소 내의 링크 옆에서 텍스트를 입력하면 `beforeinput` 이벤트의 `getTargetRanges()`가 빈 배열을 반환합니다.

## 재현 예시

1. 안드로이드 기기(삼성 갤럭시 시리즈 등)에서 Chrome 브라우저를 엽니다.
2. 삼성 키보드의 구문 추천 기능을 켭니다.
3. `contenteditable` 요소 내에 a 링크가 있는 HTML을 준비합니다 (예: `<a href="https://example.com">링크 텍스트</a>`).
4. a 링크 바로 옆(뒤)에 커서를 위치시킵니다.
5. 텍스트를 입력합니다 (예: "안녕").
6. 브라우저 콘솔에서 `beforeinput.getTargetRanges()`를 확인합니다.

## 관찰된 동작

링크 옆에서 텍스트 입력 시:

1. **beforeinput 이벤트**:
   - `e.getTargetRanges()`가 `[]` (빈 배열)을 반환
   - 또는 `e.getTargetRanges`가 `undefined`일 수 있음
   - 정확한 텍스트 삽입 위치를 알 수 없음

2. **폴백 필요**:
   - `window.getSelection()`을 사용해야 하지만 덜 정확할 수 있음
   - `window.getSelection()`이 링크 요소를 포함할 수 있음

3. **결과**:
   - 정확한 삽입 위치를 파악하기 어려움
   - 텍스트가 잘못된 위치에 삽입될 수 있음
   - 링크 구조가 손상될 수 있음

## 예상 동작

- `getTargetRanges()`가 정확한 삽입 위치를 나타내는 `StaticRange` 객체 배열을 반환해야 함
- 빈 배열이 아닌 유효한 범위 정보를 제공해야 함
- 링크 옆에서도 정확한 위치를 반환해야 함

## 영향

- **정확한 위치 파악 불가**: `getTargetRanges()`가 없어 정확한 삽입 위치를 알 수 없음
- **부정확한 폴백**: `window.getSelection()`에 의존해야 하지만 덜 정확함
- **잘못된 삽입 위치**: 텍스트가 잘못된 위치에 삽입될 수 있음
- **링크 구조 손상**: 링크 안에 텍스트가 삽입될 수 있음

## 브라우저 비교

- **Android Chrome + Samsung Keyboard (구문 추천 ON)**: 이 문제 발생
- **Android Chrome + Samsung Keyboard (구문 추천 OFF)**: 정상 동작
- **Android Chrome + Gboard**: 정상 동작
- **Chrome 77**: 알려진 버그로 `getTargetRanges()`가 항상 빈 배열 반환

## 참고사항 및 가능한 해결 방향

- **빈 배열 확인**: 항상 `getTargetRanges()`가 빈 배열인지 확인
- **window.getSelection() 폴백**: 빈 배열일 때 `window.getSelection()` 사용
- **Selection 정규화**: 폴백 사용 시 selection을 정규화하여 링크 제외
- **DOM 상태 저장**: `getTargetRanges()`가 없을 때 DOM 상태를 저장하여 비교

## 코드 예시

```javascript
const editor = document.querySelector('div[contenteditable]');

editor.addEventListener('beforeinput', (e) => {
  const targetRanges = e.getTargetRanges?.() || [];
  
  if (targetRanges.length === 0) {
    // getTargetRanges()가 빈 배열 - 폴백 사용
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0).cloneRange();
      
      // Selection 정규화 (링크 제외)
      const normalized = normalizeRangeForLink(range);
      
      // 정규화된 range로 처리
      handleInputWithRange(normalized, e);
    }
  } else {
    // getTargetRanges() 사용 가능
    const staticRange = targetRanges[0];
    // StaticRange를 Range로 변환하여 사용
    const range = document.createRange();
    range.setStart(staticRange.startContainer, staticRange.startOffset);
    range.setEnd(staticRange.endContainer, staticRange.endOffset);
    
    handleInputWithRange(range, e);
  }
});

function normalizeRangeForLink(range) {
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
  
  return range;
}
```
