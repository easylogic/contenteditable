---
id: ce-0267
scenarioId: scenario-caret-jump-non-editable
locale: ko
os: macOS
osVersion: "13+"
device: Desktop (Mac)
deviceVersion: Any
browser: Safari
browserVersion: "17+"
keyboard: English (QWERTY)
caseTitle: Safari에서도 비편집 요소 옆 삭제 시 캐럿 문제 발생 가능
description: "Safari에서도 Chrome과 비슷하게 비편집 요소(contenteditable=false) 옆의 글자를 삭제할 때 캐럿 점프 문제가 발생할 수 있지만, 발생 빈도는 Chrome보다 낮습니다."
tags:
  - caret
  - cursor
  - non-editable
  - safari
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
    description: "텍스트 + 비편집 태그"
  - label: "Step 1: Delete '요' character"
    html: '<div contenteditable="true">안녕하세요<span contenteditable="false">@사용자</span> 다시 오|</div>'
    description: "캐럿 위치 관찰"
  - label: "Observation"
    html: '<div contenteditable="true">안녕하세요<span contenteditable="false">@사용자</span> 다시 오|</div>'
    description: "Chrome처럼 점프하거나 정상 동작 (발생 빈도 다름)"
  - label: "✅ Expected"
    html: '<div contenteditable="true">안녕하세요<span contenteditable="false">@사용자</span> 다시 오|</div>'
    description: "예상: 캐럿이 '@사용자' 옆에 유지"
---

## 현상

Safari에서도 비편집 요소(contenteditable=false) 옆에 있는 글자를 삭제할 때 캐럿 점프 문제가 발생할 수 있지만, 발생 빈도는 Chrome보다 낮습니다.

## 재현 예시

1. contenteditable 요소에 포커스합니다.
2. 비편집 요소(contenteditable=false)가 포함된 텍스트가 있습니다.
3. 비편집 요소 바로 앞에 있는 글자를 삭제합니다.

## 관찰된 동작

- **불일치한 동작**: Safari에서도 때로는 캐럿 점프가 발생함
- **발생 빈도가 낮음**: Chrome보다 덜 일관하게 발생
- **WebKit 관련 이슈**: WebKit 기반 브라우저의 캐럿 계산 이슈일 가능성
- **CSS 영향**: `display: inline-block;` 스타일이 문제를 완화할 수도 있음

## 예상 동작

- 캐럿이 비편집 요소 바로 옆에 유지되어야 함
- Chrome보다 더 일관적으로 동작해야 함

## 참고사항 및 가능한 해결 방향

- **WebKit 버그 확인**: WebKit의 selection API 문제와 연관 있을 수 있음
- **CSS 해결책 테스트**: `display: inline-block;`가 Safari에서도 효과적인지 확인
- **브라우저 감지**: Safari에서 특유한 해결책 적용
- **캐럿 위치 강제 설정**: 프로그래매틱으로 Safari에서 캐럿 위치 강제 설정

## 코드 예시

```javascript
const editor = document.querySelector('div[contenteditable]');
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

function handleAfterInput() {
  const selection = window.getSelection();
  
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    
    // Safari에서 캐럿 점프 감지
    if (isSafari && caretJumpDetected(range)) {
      console.warn('Safari caret jump detected');
      
      // 캐럿 복원 시도
      restoreCaretPosition();
    }
  }
}

function caretJumpDetected(range) {
  // 캐럿 점프 여부 판단 로직
  // 구체적인 구현은 테스트 필요
  return false; // 플레이스홀더
}

function restoreCaretPosition() {
  const selection = window.getSelection();
  const range = document.createRange();
  
  // 적절한 위치로 복원
  const nonEditable = editor.querySelector('span[contenteditable="false"]');
  if (nonEditable) {
    range.setStartBefore(nonEditable);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

editor.addEventListener('input', handleAfterInput);
```
