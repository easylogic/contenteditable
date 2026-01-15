---
id: ce-0295
scenarioId: scenario-samsung-keyboard-text-prediction
locale: ko
os: Android
osVersion: "10-14"
device: Mobile (Samsung Galaxy series)
deviceVersion: Any
browser: Chrome for Android
browserVersion: "120+"
keyboard: Korean (IME) - Samsung Keyboard with Text Prediction ON
caseTitle: 삼성 키보드 구문 추천 ON 시 a 링크 옆 입력 시 insertCompositionText 이벤트와 selection 불일치
description: "안드로이드 크롬에서 삼성 키보드의 구문 추천 기능이 켜져 있을 때, a 링크 옆에서 글을 입력하면 beforeinput과 input 이벤트가 모두 insertCompositionText로 발생하며, beforeinput의 getTargetRanges()가 존재하지 않고, beforeinput의 selection과 input의 selection이 다릅니다. beforeinput의 selection은 a 링크의 텍스트까지 포함하여 start, end가 다른 형태로 들어오고, event.data가 모든 문자가 결합되어 옵니다."
tags:
  - samsung-keyboard
  - text-prediction
  - link
  - anchor
  - insertCompositionText
  - getTargetRanges
  - selection
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
    description: "a 링크 뒤에 커서 위치"
  - label: "Step 1: Type text next to link"
    html: '<div contenteditable="true"><a href="https://example.com">링크 텍스트</a> 안녕</div>'
    description: "링크 옆에 '안녕' 입력 시도"
  - label: "beforeinput event (Bug)"
    html: '<div contenteditable="true"><a href="https://example.com">링크 텍스트</a> </div>'
    description: "beforeinput: inputType='insertCompositionText', getTargetRanges() 없음, selection이 링크 텍스트 포함, data='링크텍스트안녕' (결합됨)"
  - label: "input event (Bug)"
    html: '<div contenteditable="true"><a href="https://example.com">링크 텍스트</a> 안녕</div>'
    description: "input: inputType='insertCompositionText', selection이 beforeinput과 다름"
  - label: "✅ Expected"
    html: '<div contenteditable="true"><a href="https://example.com">링크 텍스트</a> 안녕</div>'
    description: "예상: beforeinput과 input의 selection이 일치하고, data는 입력한 텍스트만 포함"
---

## 현상

안드로이드 크롬에서 삼성 키보드의 구문 추천 기능이 켜져 있을 때, `contenteditable` 요소 내의 a 링크 옆에서 글을 입력하면 다음과 같은 문제가 발생합니다:

1. `beforeinput`과 `input` 이벤트가 모두 `insertCompositionText`로 발생
2. `beforeinput`의 `getTargetRanges()`가 존재하지 않음 (undefined 또는 빈 배열)
3. `beforeinput`의 selection과 `input`의 selection이 다름
4. `beforeinput`의 selection은 a 링크의 텍스트까지 포함하여 start, end가 다른 형태로 들어옴
5. `event.data`가 모든 문자가 결합되어 옴 (입력한 텍스트만 오지 않음)

## 재현 예시

1. 안드로이드 기기(삼성 갤럭시 시리즈 등)에서 Chrome 브라우저를 엽니다.
2. 삼성 키보드의 구문 추천 기능을 켭니다.
3. `contenteditable` 요소 내에 a 링크가 있는 HTML을 준비합니다 (예: `<a href="https://example.com">링크 텍스트</a>`).
4. a 링크 바로 옆(뒤)에 커서를 위치시킵니다.
5. 텍스트를 입력합니다 (예: "안녕").
6. 브라우저 콘솔이나 이벤트 로그에서 `beforeinput`과 `input` 이벤트를 관찰합니다.

## 관찰된 동작

a 링크 옆에서 텍스트 입력 시:

1. **beforeinput 이벤트**:
   - `inputType: 'insertCompositionText'` (항상)
   - `isComposing: true`
   - `getTargetRanges()`가 존재하지 않음 (undefined 또는 빈 배열 반환)
   - `window.getSelection()`으로 얻은 selection이 a 링크의 텍스트까지 포함
   - selection의 start, end가 예상과 다른 형태로 들어옴
   - `event.data`가 입력한 텍스트뿐만 아니라 링크 텍스트까지 결합되어 옴 (예: "링크텍스트안녕")

2. **input 이벤트**:
   - `inputType: 'insertCompositionText'` (항상)
   - `isComposing: true`
   - `window.getSelection()`으로 얻은 selection이 `beforeinput`의 selection과 다름
   - 실제 DOM에는 입력한 텍스트만 정상적으로 삽입됨

3. **결과**:
   - `getTargetRanges()`를 사용할 수 없어 정확한 삽입 위치를 파악하기 어려움
   - `beforeinput`의 selection 정보가 부정확하여 이벤트 처리 로직이 잘못된 위치를 참조할 수 있음
   - `event.data`가 결합된 텍스트를 포함하여 실제 입력된 텍스트를 정확히 파악하기 어려움
   - `beforeinput`과 `input`의 selection 불일치로 인해 상태 동기화 문제 발생 가능

## 예상 동작

- `beforeinput`의 `getTargetRanges()`가 정확한 삽입 위치를 반환해야 함
- `beforeinput`의 selection이 실제 커서 위치를 정확히 반영해야 함
- `event.data`가 입력한 텍스트만 포함해야 함 (링크 텍스트와 결합되지 않아야 함)
- `beforeinput`과 `input`의 selection이 일치해야 함
- `insertCompositionText`가 아닌 적절한 `inputType`으로 발생해야 함 (구문 추천이 아닌 일반 입력의 경우)

## 영향

이것은 다음을 일으킬 수 있습니다:

- **부정확한 삽입 위치 파악**: `getTargetRanges()`가 없어 정확한 삽입 위치를 알 수 없음
- **잘못된 selection 참조**: `beforeinput`의 selection이 부정확하여 이벤트 처리 로직이 잘못된 위치를 참조
- **잘못된 텍스트 추출**: `event.data`가 결합된 텍스트를 포함하여 실제 입력된 텍스트를 정확히 파악하기 어려움
- **상태 동기화 문제**: `beforeinput`과 `input`의 selection 불일치로 인해 애플리케이션 상태가 DOM 상태와 불일치
- **링크 인접 입력 처리 실패**: 링크 옆에서의 입력을 정확히 처리하기 어려움

## 브라우저 비교

- **Android Chrome + Samsung Keyboard (구문 추천 ON)**: 이 문제 발생
- **Android Chrome + Samsung Keyboard (구문 추천 OFF)**: 정상 동작
- **Android Chrome + Gboard**: 정상 동작
- **Android Chrome + SwiftKey**: 정상 동작
- **iOS Safari**: 다른 동작 패턴 (구문 추천 방식이 다름)

## 참고사항 및 가능한 해결 방향

- **getTargetRanges() 대체**: `getTargetRanges()`가 없을 때 `window.getSelection()`을 사용하되, 링크 내부가 아닌 실제 커서 위치를 확인:
  ```javascript
  element.addEventListener('beforeinput', (e) => {
    if (e.inputType === 'insertCompositionText') {
      const targetRanges = e.getTargetRanges?.() || [];
      
      if (targetRanges.length === 0) {
        // getTargetRanges()가 없을 때 대체 방법
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0).cloneRange();
          
          // 링크 내부가 아닌 실제 커서 위치 확인
          let container = range.startContainer;
          if (container.nodeType === Node.TEXT_NODE) {
            container = container.parentElement;
          }
          
          // 링크 요소를 벗어난 위치 찾기
          const link = container.closest('a');
          if (link) {
            // 링크 다음 위치로 조정
            const afterLink = document.createRange();
            afterLink.setStartAfter(link);
            afterLink.collapse(true);
            // afterLink를 사용하여 처리
          } else {
            // range를 그대로 사용
          }
        }
      } else {
        // targetRanges 사용
      }
    }
  });
  ```

- **event.data 정제**: 결합된 텍스트에서 실제 입력된 텍스트만 추출:
  ```javascript
  element.addEventListener('beforeinput', (e) => {
    if (e.inputType === 'insertCompositionText' && e.data) {
      // DOM 상태를 확인하여 실제 삽입될 텍스트 파악
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const beforeText = getTextBeforeCursor(range);
        const afterText = getTextAfterCursor(range);
        
        // event.data에서 실제 입력된 텍스트 추출
        // (구현은 DOM 상태 비교 필요)
      }
    }
  });
  ```

- **selection 정규화**: `beforeinput`과 `input`의 selection을 정규화하여 일치시키기:
  ```javascript
  let beforeInputSelection = null;
  
  element.addEventListener('beforeinput', (e) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      beforeInputSelection = normalizeSelection(selection.getRangeAt(0));
    }
  });
  
  element.addEventListener('input', (e) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const inputSelection = normalizeSelection(selection.getRangeAt(0));
      
      // beforeInputSelection과 inputSelection 비교
      if (!selectionsMatch(beforeInputSelection, inputSelection)) {
        // 불일치 처리
        handleSelectionMismatch(beforeInputSelection, inputSelection);
      }
    }
    beforeInputSelection = null;
  });
  
  function normalizeSelection(range) {
    // 링크 내부가 아닌 실제 커서 위치로 정규화
    let container = range.startContainer;
    if (container.nodeType === Node.TEXT_NODE) {
      container = container.parentElement;
    }
    
    const link = container.closest('a');
    if (link && range.startContainer === link) {
      // 링크 다음 위치로 조정
      const normalized = document.createRange();
      normalized.setStartAfter(link);
      normalized.collapse(true);
      return normalized;
    }
    
    return range.cloneRange();
  }
  ```

- **DOM 상태 비교**: `beforeinput` 시점의 DOM 상태를 저장하고 `input` 시점과 비교하여 실제 변경 사항 파악:
  ```javascript
  let domBefore = null;
  let selectionBefore = null;
  
  element.addEventListener('beforeinput', (e) => {
    if (e.inputType === 'insertCompositionText') {
      domBefore = element.innerHTML;
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        selectionBefore = selection.getRangeAt(0).cloneRange();
      }
    }
  });
  
  element.addEventListener('input', (e) => {
    if (e.inputType === 'insertCompositionText') {
      const domAfter = element.innerHTML;
      const actualChange = compareDOM(domBefore, domAfter, selectionBefore);
      // 실제 변경 사항을 기반으로 처리
      handleActualChange(actualChange);
    }
    domBefore = null;
    selectionBefore = null;
  });
  ```

- **구문 추천 감지 및 처리**: 구문 추천이 활성화된 경우를 감지하고 특별 처리:
  ```javascript
  let isTextPredictionActive = false;
  
  // 구문 추천 활성화 감지 (사용자 에이전트 또는 이벤트 패턴으로)
  function detectTextPrediction() {
    // insertCompositionText가 항상 발생하는 패턴 감지
    // 또는 사용자 에이전트 확인
    const ua = navigator.userAgent;
    return /Samsung/i.test(ua) && /Android/i.test(ua);
  }
  
  element.addEventListener('beforeinput', (e) => {
    if (e.inputType === 'insertCompositionText' && detectTextPrediction()) {
      isTextPredictionActive = true;
      // 구문 추천 특별 처리
      handleTextPredictionInput(e);
    }
  });
  ```

## 코드 예시

```javascript
const editor = document.querySelector('div[contenteditable]');
let beforeInputState = null;

editor.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertCompositionText') {
    // beforeinput 시점의 상태 저장
    const selection = window.getSelection();
    const range = selection && selection.rangeCount > 0 
      ? selection.getRangeAt(0).cloneRange() 
      : null;
    
    beforeInputState = {
      targetRanges: e.getTargetRanges?.() || [],
      selection: range,
      data: e.data,
      domBefore: editor.innerHTML,
      timestamp: Date.now()
    };
    
    // getTargetRanges()가 없을 때 대체 처리
    if (beforeInputState.targetRanges.length === 0 && range) {
      // 링크 인접 위치 확인 및 정규화
      const normalizedRange = normalizeRangeForLinkAdjacent(range);
      beforeInputState.normalizedRange = normalizedRange;
    }
    
    // event.data 정제 (결합된 텍스트에서 실제 입력 텍스트 추출)
    if (e.data) {
      const actualInputText = extractActualInputText(e.data, range);
      beforeInputState.actualInputText = actualInputText;
    }
  }
});

editor.addEventListener('input', (e) => {
  if (e.inputType === 'insertCompositionText' && beforeInputState) {
    const selection = window.getSelection();
    const range = selection && selection.rangeCount > 0 
      ? selection.getRangeAt(0).cloneRange() 
      : null;
    
    // beforeinput과 input의 selection 비교
    if (range && beforeInputState.selection) {
      const selectionsMatch = compareSelections(
        beforeInputState.selection, 
        range
      );
      
      if (!selectionsMatch) {
        console.warn('Selection mismatch between beforeinput and input');
        // 불일치 처리
      }
    }
    
    // 실제 DOM 변경 확인
    const domAfter = editor.innerHTML;
    const actualChange = compareDOM(
      beforeInputState.domBefore, 
      domAfter, 
      beforeInputState.normalizedRange || beforeInputState.selection
    );
    
    // 실제 변경 사항을 기반으로 처리
    handleCompositionInput(actualChange, beforeInputState);
    
    beforeInputState = null;
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
      // 링크 다음에 텍스트 노드가 없을 수 있음
      return range;
    }
  }
  
  return range;
}

function extractActualInputText(combinedText, range) {
  // 결합된 텍스트에서 실제 입력된 텍스트만 추출
  // 이는 DOM 상태 비교가 필요할 수 있음
  // 간단한 예시: 링크 텍스트를 제거 (실제로는 더 정교한 로직 필요)
  const link = range?.startContainer?.parentElement?.closest('a');
  if (link && combinedText.startsWith(link.textContent)) {
    return combinedText.slice(link.textContent.length);
  }
  return combinedText;
}

function compareSelections(range1, range2) {
  if (!range1 || !range2) return false;
  
  const pos1 = {
    container: range1.startContainer,
    offset: range1.startOffset
  };
  const pos2 = {
    container: range2.startContainer,
    offset: range2.startOffset
  };
  
  return pos1.container === pos2.container && pos1.offset === pos2.offset;
}

function compareDOM(domBefore, domAfter, range) {
  // DOM 변경 사항 분석
  // 실제 구현은 더 복잡할 수 있음
  return {
    inserted: extractInsertedText(domBefore, domAfter, range),
    deleted: extractDeletedText(domBefore, domAfter, range)
  };
}

function handleCompositionInput(actualChange, beforeInputState) {
  // 실제 변경 사항을 기반으로 처리
  console.log('Actual change:', actualChange);
  console.log('Input text:', beforeInputState.actualInputText);
  // 에디터 상태 업데이트, undo/redo 스택 관리 등
}
```

## 관련 이슈 및 참고 자료

### 웹 표준 및 문서

- **MDN: InputEvent.getTargetRanges()**: https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/getTargetRanges
  - `getTargetRanges()`는 실험적 기술이며, `contenteditable` 요소에서만 동작하고 `<input>`, `<textarea>`에서는 빈 배열을 반환함
  - Chrome 60+에서 지원되지만 Android Chrome에서는 특정 시나리오에서 빈 배열을 반환할 수 있음

- **W3C Input Events Specification**: https://www.w3.org/TR/2016/WD-input-events-20160928/
  - `insertCompositionText` 이벤트는 non-cancelable이며, IME 조합 중 여러 번 발생할 수 있음

### 알려진 이슈

1. **getTargetRanges() 빈 배열 반환 문제**
   - Chrome 77에서 `getTargetRanges()`가 항상 빈 배열을 반환하는 문제가 보고됨
   - Stack Overflow: https://stackoverflow.com/questions/58892747/inputevent-gettargetranges-always-empty
   - Android Chrome에서 특히 `insertCompositionText` 이벤트에서 발생 가능

2. **Samsung Keyboard와 contenteditable 호환성 문제**
   - Substance Editor 이슈: Android Chrome에서 Samsung 키보드 사용 시 키 이벤트가 제대로 작동하지 않음
     - GitHub: https://github.com/substance/substance/issues/982
   - Obsidian 커뮤니티: Samsung 키보드 구문 추천 사용 시 커서 위치 문제
     - Forum: https://forum.obsidian.md/t/cursor-ends-up-before-the-letter-on-android-samsung-keyboard/78185

3. **Chromium 코드 리뷰 - Samsung Keyboard 관련**
   - Backspace 키코드 처리: Samsung 키보드가 조합 중 backspace 키 이벤트를 보내는 문제
     - Code Review: https://codereview.chromium.org/1126203013
   - IME Adapter 선택 영역 업데이트: 중복 업데이트 방지 개선
     - Code Review: https://codereview.chromium.org/13105005/patch/4003/6002

4. **Android에서 insertCompositionText 처리 문제**
   - 포커스 변경 시 예상치 못한 텍스트 삽입
   - Enter 및 Backspace 키 입력 시 `insertCompositionText` 이벤트 발생
   - Medium Article: https://pubuzhixing.medium.com/web-rich-text-editor-compatible-with-android-device-input-c26d4ba57058

5. **contenteditable에서 링크 선택 문제**
   - 링크가 포함된 텍스트 선택 시 anchor 태그가 선택에 포함되는 문제
   - Android에서 contenteditable 포커스 문제
   - Ionic Forum: https://forum.ionicframework.com/t/cant-focus-into-contenteditable-on-android-when-setting-html-content/8704

### React 및 프레임워크 이슈

- **React beforeinput 이벤트 지원**: Firefox 87 이전 버전에서 `beforeinput` 이벤트 미지원
  - GitHub: https://github.com/facebook/react/issues/11211

### 해결 방법 및 권장 사항

1. **구문 추천 기능 비활성화 안내**
   - 사용자에게 Samsung 키보드 설정에서 구문 추천 기능을 끄도록 안내
   - Settings > General Management > Samsung Keyboard Settings > Predictive text OFF

2. **대안 키보드 권장**
   - Gboard, Microsoft SwiftKey 등 다른 키보드 사용 권장

3. **기능 감지 및 폴백 구현**
   - `getTargetRanges()` 사용 전 기능 감지
   - 빈 배열 반환 시 `window.getSelection()` 사용
   - DOM 상태 비교를 통한 실제 변경 사항 파악
