---
id: ce-0231
scenarioId: scenario-ime-composition-focus-change
locale: ko
os: macOS
osVersion: "13+"
device: Desktop (Mac)
deviceVersion: Any
browser: Safari
browserVersion: "17+"
keyboard: Korean (IME) - macOS Korean Input Method
caseTitle: IME 컴포지션 중 다른 텍스트박스로 포커스 이동 시 이상 동작 (Safari)
description: "Safari에서 한국어 IME로 컴포지션 중에 다른 텍스트박스로 포커스가 이동하면, Chrome/Firefox와 유사하게 부분적으로 커밋되지 않은 자모가 남거나, WebKit 특유의 focus/selection 문제가 발생할 수 있습니다."
tags:
  - composition
  - ime
  - focus
  - blur
  - korean
  - safari
  - webkit
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
    description: "한국어 IME로 '나' 컴포지션 중"
  - label: "❌ After (Bug)"
    html: '<div contenteditable="true">ㅎ</div><div contenteditable="true">ㅎ</div>'
    description: "자모 'ㅎ'가 첫 번째 필드에 남고 두 번째 필드로도 전달됨"
  - label: "✅ Expected"
    html: '<div contenteditable="true">나</div>'
    description: "컴포지션 완료 후 두 번째 필드에만 커서 존재"
---

## 현상

Safari에서 한국어 IME로 텍스트를 컴포지션할 때, 다른 텍스트박스로 포커스가 이동하면 컴포지션이 제대로 종료되지 않고 WebKit 특유의 문제가 발생합니다.

## 재현 예시

1. 첫 번째 contenteditable 요소에 포커스합니다.
2. macOS 한국어 IME를 활성화합니다.
3. 글자를 입력하여 컴포지션을 시작합니다 (예: '나' = ㅎ + ㄴ).
4. 컴포지션이 완료되기 전(초성 'ㅎ' 입력 상태), 두 번째 텍스트박스를 클릭하거나 버튼으로 포커스를 이동합니다.

## 관찰된 동작

- **자모 전달 현상**: 자모 'ㅎ'가 첫 번째 필드뿐만 아니라, 두 번째 필드에도 전달되어 나타날 수 있습니다.
- **WebKit focus 문제**: WebKit은 외부 클릭 후에도 focus를 유지하려는 경향이 있어, 포커스가 제대로 이동하지 않을 수 있습니다.
- **selection addRange 실패**: Safari에서 `selection.addRange()`가 의도한 대로 동작하지 않을 수 있습니다 (관련 시나리오: selection-addrange-safari-fail).
- **compositionend 불확실**: `compositionend` 이벤트가 발생하지만, 컴포지션 상태가 완전히 정리되지 않습니다.

## 예상 동작

- 컴포지션이 완전히 종료되고 최종 글자('나')가 첫 번째 필드에만 커밋되어야 합니다.
- 두 번째 필드로 깨끗하게 포커스가 이동해야 합니다.
- 첫 번째 필드의 컴포지션 상태가 완전히 정리되어야 합니다.

## 참고사항 및 가능한 해결 방향

- **WebKit focus 특유 이해**: Safari/WebKit는 focus 관리가 다른 브라우저와 다를 수 있음을 인지해야 합니다.
- **blur 강제 사용**: 포커스 이동 전에 명시적으로 `editor1.blur()`를 호출하여 IME 상태를 강제로 종료합니다.
- **CSS user-select 확인**: `-webkit-user-select: text;`가 제대로 설정되었는지 확인합니다. (관련 시나리오: user-select-breaks-safari)
- **selection API 주의**: Safari에서는 `selection.addRange()`에 문제가 있을 수 있으므로, 대안적인 selection 설정 방법을 고려합니다.

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
  // Safari 특유: blur 강제로 IME 상태 종료
  setTimeout(() => {
    editor1.blur();
    editor2.focus();
  }, 150);
});

// 버튼 클릭 시
document.querySelector('button').addEventListener('click', () => {
  if (!isComposing) {
    editor2.focus();
  } else {
    alert('IME 입력 중입니다. 완료 후 이동하세요.');
  }
});
```
