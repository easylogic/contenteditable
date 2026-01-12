---
id: ce-0229
scenarioId: scenario-ime-composition-focus-change
locale: ko
os: Windows
osVersion: "10/11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120+"
keyboard: Korean (IME) - Microsoft IME
caseTitle: IME 컴포지션 중 다른 텍스트박스로 포커스 이동 시 부분 문자 커밋
description: "contenteditable 요소에서 한국어 IME로 컴포지션 중에 다른 텍스트박스로 포커스가 이동하면, 컴포지션이 제대로 종료되지 않고 부분적으로 커밋된 자모(초성/중성/종성)가 원래 필드에 남거나 완료되지 않은 상태로 남아 있습니다."
tags:
  - composition
  - ime
  - focus
  - blur
  - korean
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
    description: "첫 번째 필드에 자모 'ㅎ'만 남음, 두 번째 필드에 커서 이동 실패"
  - label: "✅ Expected"
    html: '<div contenteditable="true">나</div>'
    description: "컴포지션 완료 후 두 번째 필드로 포커스 이동"
---

## 현상

`contenteditable` 요소에서 한국어 IME로 텍스트를 컴포지션할 때, 다른 텍스트박스로 포커스가 이동하면 컴포지션이 제대로 종료되지 않습니다.

## 재현 예시

1. 첫 번째 contenteditable 요소에 포커스합니다.
2. 한국어 IME를 활성화합니다.
3. 글자를 입력하여 컴포지션을 시작합니다 (예: '나' = ㅎ + ㄴ)
4. 컴포지션이 완료되기 전(초성 ㅎ 입력 상태), 두 번째 텍스트박스를 클릭하거나 버튼으로 포커스를 이동합니다.

## 관찰된 동작

- **compositionend 이벤트 발생**: 첫 번째 필드에서 `compositionend`가 발생하지만, 컴포지션이 완전히 정리되지 않습니다.
- **부분 자모 유지**: 자모 'ㅎ'가 첫 번째 필드에 그대로 남아 있습니다.
- **두 번째 필드 포커스 실패**: 두 번째 필드로 포커스가 이동하지 않거나, 이동해도 컴포지션 상태가 이어지지 않습니다.
- **입력 계속**: 새 필드에서 타이핑을 계속하면 이전 컴포지션이 완료된 것처럼 동작하지만, 첫 번째 필드의 상태가 정리되지 않습니다.

## 예상 동작

- 컴포지션이 완전히 종료되고 최종 글자('나')가 첫 번째 필드에 커밋되어야 합니다.
- 두 번째 필드로 부드럽게 포커스가 이동해야 합니다.

## 참고사항 및 가능한 해결 방향

- **compositionend 감지**: 포커스 이동 전에 `compositionend` 이벤트가 발생했는지 확인합니다.
- **setTimeout 지연**: 포커스 이동에 작은 시간 지연(100-200ms)을 주어 IME가 컴포지션을 정리할 시간을 줍니다.
- **컴포지션 상태 플래그**: `isComposing` 플래그를 사용하여 컴포지션 중에는 포커스 이동을 막습니다.
- **UI 피드백**: 컴포지션 중에는 다른 필드로 이동하는 버튼을 비활성화하거나 시각적 피드백을 제공합니다.

## 코드 예시

```javascript
let isComposing = false;

const editor1 = document.querySelector('div[contenteditable]:nth-child(1)');
const editor2 = document.querySelector('div[contenteditable]:nth-child(2)');

// 컴포지션 상태 추적
editor1.addEventListener('compositionstart', () => {
  isComposing = true;
});

editor1.addEventListener('compositionend', () => {
  isComposing = false;
  // 컴포지션이 완료된 후 포커스 이동
  setTimeout(() => {
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
