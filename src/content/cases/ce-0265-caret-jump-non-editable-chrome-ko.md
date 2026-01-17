---
id: ce-0265-caret-jump-non-editable-chrome-ko
scenarioId: scenario-caret-jump-non-editable
locale: ko
os: Windows
osVersion: "10/11"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "120+"
keyboard: English (QWERTY)
caseTitle: Chrome에서 비편집 요소 옆 삭제 시 캐럿 점프
description: "Chrome의 contenteditable 요소 안에서 비편집 요소(contenteditable=false) 옆에 있는 글자를 삭제할 때, 캐럿이 남아 있는 내용의 끝으로 점프합니다. 사용자는 계속 타이핑을 하려면 수동으로 클릭해서 커서를 되돌려야 합니다."
tags:
  - caret
  - cursor
  - non-editable
  - chrome
  - delete
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; display: inline-block;">
    안녕하세요
    <span contenteditable="false" style="background: #fef08a; padding: 2px 8px; border-radius: 4px; margin: 0 4px;">
      @사용자
    </span>
    다시 오세요
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true">안녕하세요<span contenteditable="false">@사용자</span> 다시 오세요</div>'
    description: "텍스트 + 비편집 '사용자' 태그"
  - label: "Step 1: Delete '요' character"
    html: '<div contenteditable="true">안녕하세요<span contenteditable="false">@사용자</span> 다시 오|</div>'
    description: "❌ 캐럿 점프! 캐럿이 끝(|)으로 이동함"
  - label: "✅ Expected"
    html: '<div contenteditable="true">안녕하세요<span contenteditable="false">@사용자</span> 다시 오|</div>'
    description: "예상: 캐럿이 '@사용자' 옆에 유지되어야 함"
---

## 현상

Chrome의 contenteditable 요소 안에서 비편집 요소(contenteditable=false) 옆에 있는 글자를 삭제할 때, 캐럿이 남아 있는 내용의 끝으로 점프합니다.

## 재현 예시

1. contenteditable 요소에 포커스합니다.
2. 비편집 요소(contenteditable="false")가 포함된 텍스트가 있습니다 (예: "안녕하세요 @사용자 다시 오세요").
3. 비편집 요소 바로 앞에 있는 글자를 삭제합니다 (Backspace 또는 Delete 키).
4. ❌ 캐럿이 비편집 요소 옆이 아니라 전체 contenteditable 끝으로 점프합니다.

## 관찰된 동작

- **캐럿 점프**: 캐럿이 삭제된 글자 옆이 아니라 전체 에디터 끝으로 이동함
- **계속 타이핑 불가**: 다음 글자를 입력하면 에디터 끝에 입력됨
- **수동 클릭 필요**: 올바른 위치에 계속 타이핑하려면 비편집 요소 옆을 직접 클릭해야 함
- **Chrome 특유**: Firefox에서는 발생하지 않음

## 예상 동작

- 캐럿이 비편집 요소 바로 옆에 유지되어야 함
- 바로 다음 글자를 입력할 수 있어야 함
- 수동 클릭 필요 없이

## 참고사항 및 가능한 해결 방향

- **display: inline-block**: contenteditable 요소에 `display: inline-block;` CSS 추가
- **zero-width space**: 비편집 요소 뒤에 ZWSP(U+200B) 문자 추가
- **빈 span 플레이스홀더**: 비편집 요소 뒤에 빈 `<span>` 요소 추가
- **프로그래매틱 캐럿 복원**: input 이벤트에서 캐럿 점프를 감지하고 원 위치로 복원
- **외부 래퍼**: 편집 가능한 내용을 별도 div로 래핑

## 코드 예시

```javascript
const editor = document.querySelector('div[contenteditable]');
const nonEditable = document.querySelector('span[contenteditable="false"]');

let lastCaretPosition = null;

// 캐럿 위치 감지
function getCaretPosition() {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    return {
      node: range.startContainer,
      offset: range.startOffset
    };
  }
  return null;
}

// input 이벤트로 캐럿 점프 감지
editor.addEventListener('input', (e) => {
  const currentPos = getCaretPosition();
  
  if (lastCaretPosition && currentPos) {
    // 캐럿이 의치치 않게 점프했는지 확인
    const distance = Math.abs(currentPos.offset - lastCaretPosition.offset);
    
    if (distance > 10) { // 임계값
      console.warn('Caret jump detected:', lastCaretPosition, currentPos);
      
      // 캐럿 복원
      const selection = window.getSelection();
      const range = document.createRange();
      
      // 비편집 요소 앞으로 복원
      if (nonEditable) {
        range.setStartBefore(nonEditable);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }
  
  lastCaretPosition = currentPos;
});

// CSS 해결책
editor.style.display = 'inline-block';
```
