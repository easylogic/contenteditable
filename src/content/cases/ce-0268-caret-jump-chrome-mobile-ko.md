---
id: ce-0268
scenarioId: scenario-caret-jump-chrome-mobile
locale: ko
os: Android
osVersion: "10-14"
device: Mobile (Samsung Galaxy, Pixel, etc.)
deviceVersion: Any
browser: Chrome for Android
browserVersion: "120+"
keyboard: English (QWERTY)
caseTitle: Chrome Mobile에서 특정 문자 입력 시 캐럿 점프
description: "Chrome Mobile(안드로이드)에서 단어 중간에 특정 문장 부호(쉼표, 콜론, 느낫표, 물음표 등)를 입력하면 캐럿이 입력점이 아니라 단어 끝으로 점프합니다. 사용자는 계속 타이핑하려면 수동으로 클릭해서 위치를 되돌려야 합니다."
tags:
  - caret
  - cursor
  - chrome
  - mobile
  - android
  - punctuation
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; font-size: 18px;">
    여기에 단어를 입력하세요: California
    <br><br>
    단어 중간에 이런 문자를 입력해보세요: 쉼표(,), 콜론(:), 느낫표(;), 물음표(!), 물음표(?), 따옴표("), 작은따옴표(&)
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true">California</div>'
    description: "단어 입력됨"
  - label: "Step 1: Type comma in middle (after 'Califor')"
    html: '<div contenteditable="true">California</div>'
    description: "❌ 캐럿 점프! 캐럿이 끝으로 이동함 (|)"
  - label: "Observation"
    html: '<div contenteditable="true">California</div>'
    description: "캐럿이 입력점(쉼표 뒤)이 아니라 단어 끝으로 이동"
  - label: "✅ Expected"
    html: '<div contenteditable="true">Califor|nia</div>'
    description: "예상: 캐럿이 쉼표 뒤에 위치해야 함"
---

## 현상

Chrome Mobile(안드로이드)에서 단어 중간에 특정 문장 부호를 입력하면 캐럿이 입력점이 아니라 단어 끝으로 점프합니다.

## 재현 예시

1. Chrome Mobile 브라우저에서 contenteditable 요소에 포커스합니다.
2. 단어를 입력합니다 (예: "California").
3. 커서를 단어 중간으로 이동합니다 (예: "Califor" 뒤, "nia" 앞).
4. 쉼표(,)를 입력합니다.

## 관찰된 동작

- **캐럿 점프**: 캐럿이 쉼표 뒤(입력점)이 아니라 "California" 끝으로 점프함
- **수동 클릭 필요**: 캐럿이 이상한 위치로 이동하면, 올바른 위치에 다시 클릭해야 함
- **편집 불가**: 해당 문장 부호를 사용하면 편집이 매우 어려워짐
- **Chrome Mobile 특유**: Desktop Chrome, Firefox Mobile, iOS Safari에서는 발생하지 않음

## 예상 동작

- 캐럿이 입력점에 유지되어야 함
- 바로 다음 글자를 입력할 수 있어야 함

## 참고사항 및 가능한 해결 방향

- **setTimeout 사용**: input 이벤트 후 짧은 지연으로 캐럿 위치 복원
- **beforeinput/input 감지**: 캐럿 점프를 감지하고 자동으로 복원
- **캐럿 위치 저장**: beforeinput에서 캐럿 위치를 저장했다가 input에서 비교
- **사용자 안내**: 해당 이슈가 발생할 수 있음을 알리거나 데스크탑 사용 권장
- **대안 브라우저**: 모바일에서 편집이 어려울 경우 데스크탑 브라우저 사용 안내

## 코드 예시

```javascript
const editor = document.querySelector('div[contenteditable]');
let lastCaretPosition = null;
let isChromeMobile = /Chrome\/[\d.]+/.test(navigator.userAgent) && /Android/.test(navigator.userAgent);

editor.addEventListener('beforeinput', (e) => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    lastCaretPosition = {
      node: range.startContainer,
      offset: range.startOffset
    };
    console.log('Before input, caret at:', lastCaretPosition.offset);
  }
});

editor.addEventListener('input', (e) => {
  if (!isChromeMobile) return;
  
  const selection = window.getSelection();
  if (selection.rangeCount > 0 && lastCaretPosition) {
    const range = selection.getRangeAt(0);
    const currentOffset = range.startOffset;
    const distance = Math.abs(currentOffset - lastCaretPosition.offset);
    
    // 캐럿 점프 감지 (2글자 이상 차이)
    if (distance > 2) {
      console.warn('Cursor jump detected:', lastCaretPosition, {node: range.startContainer, offset: currentOffset});
      
      // 캐럿 복원
      const restoreRange = document.createRange();
      restoreRange.setStart(lastCaretPosition.node, lastCaretPosition.offset);
      restoreRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(restoreRange);
      
      console.log('Caret restored to:', lastCaretPosition.offset);
    }
  }
});
```
