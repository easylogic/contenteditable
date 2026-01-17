---
id: ce-0230-korean-ime-focus-blur-firefox-ko
scenarioId: scenario-ime-composition-focus-change
locale: ko
os: Windows
osVersion: "10/11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120+"
keyboard: Korean (IME) - Microsoft IME
caseTitle: IME 컴포지션 중 다른 텍스트박스로 포커스 이동 시 자모 유지 (Firefox)
description: "Firefox에서 한국어 IME로 컴포지션 중에 다른 텍스트박스로 포커스가 이동하면, Chrome과 비슷하게 부분적으로 커밋되지 않은 자모가 원래 필드에 남아 있습니다. 다만 Firefox 특유의 selection 문제도 함께 발생할 수 있습니다."
tags:
  - composition
  - ime
  - focus
  - blur
  - korean
  - firefox
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; margin-bottom: 10px;">
    첫 번째 입력창입니다.
  </div>
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; margin-bottom: 10px;">
    두 번째 입력창입니다.
  </div>
  <div style="margin-top: 20px;">
    <button onclick="document.querySelector('div[contenteditable]').focus()">첫 번째 포커스</button>
    <button onclick="document.querySelectorAll('div[contenteditable]')[1].focus()">두 번째 포커스</button>
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true">ㅎ</div>'
    description: "한국어 IME로 '나' 컴포지션 중 (ㅎ 입력 후 ㄴ 조합 중)"
  - label: "❌ After (Bug)"
    html: '<div contenteditable="true">ㅎ</div>'
    description: "자모 'ㅎ'가 첫 번째 필드에 남음, 두 번째 필드로 포커스 이동"
  - label: "✅ Expected"
    html: '<div contenteditable="true">나</div>'
    description: "컴포지션 완료 후 두 번째 필드로 포커스 이동"
---

## 현상

Firefox에서 한국어 IME로 텍스트를 컴포지션할 때, 다른 텍스트박스로 포커스가 이동하면 컴포지션이 제대로 종료되지 않습니다.

## 재현 예시

1. 첫 번째 contenteditable 요소에 포커스합니다.
2. 한국어 IME를 활성화합니다.
3. 글자를 입력하여 컴포지션을 시작합니다 (예: '나' = ㅎ + ㄴ).
4. 컴포지션이 완료되기 전(초성 'ㅎ' 입력 상태), 두 번째 텍스트박스를 클릭하거나 버튼으로 포커스를 이동합니다.

## 관찰된 동작

- **compositionend 발생하지만 자모 유지**: `compositionend` 이벤트가 발생하지만, 첫 번째 필드에서 자모 'ㅎ'가 그대로 남아 있습니다.
- **두 번째 필드 포커스**: 두 번째 필드로 포커스가 이동합니다.
- **selection 불안정**: Firefox에서는 selection 관련 문제도 함께 발생할 수 있어, 첫 번째 필드의 자모가 제대로 선택되지 않을 수도 있습니다.
- **입력 불가능한 상태**: 두 번째 필드에서 타이핑을 시도하면 첫 번째 필드의 자모가 사라지거나 이상하게 동작할 수 있습니다.

## 예상 동작

- 컴포지션이 완전히 종료되고 최종 글자('나')가 첫 번째 필드에 커밋되어야 합니다.
- 두 번째 필드로 부드럽게 포커스가 이동해야 합니다.
- 첫 번째 필드의 커서 상태가 정리되어야 합니다.

## 참고사항 및 가능한 해결 방향

- **compositionend 기다림**: 포커스 이동 전에 `compositionend` 이벤트가 완전히 처리되기를 기다립니다.
- **selection API 주의**: Firefox의 selection API는 다른 브라우저와 다르게 동작할 수 있으므로 주의가 필요합니다.
- **clearSelection 사용**: 포커스 이동 후 명시적으로 `selection.removeAllRanges()`를 호출하여 기존 selection을 정리합니다.

## 코드 예시

```javascript
let isComposing = false;

const editor1 = document.querySelector('div[contenteditable]:nth-child(1)');
const editor2 = document.querySelector('div[contenteditable]:nth-child(2)');

editor1.addEventListener('compositionstart', () => {
  isComposing = true;
});

editor1.addEventListener('compositionend', () => {
  isComposing = false;
  // Firefox 특유: selection 정리
  setTimeout(() => {
    document.getSelection()?.removeAllRanges();
    editor2.focus();
  }, 100);
});

// 버튼 클릭 시 안전하게 포커스 이동
document.querySelector('button').addEventListener('click', () => {
  if (!isComposing) {
    editor2.focus();
  } else {
    alert('IME 입력 중입니다. 완료 후 이동하세요.');
  }
});
```
