---
id: ce-0067-contenteditable-with-form-ko
scenarioId: scenario-form-integration
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable 내용이 form 전송에 포함되지 않음
description: "contenteditable 요소를 <form> 내부에 배치하더라도, 표준 <input>이나 <textarea>와 달리 FormData에 자동으로 포함되거나 폼과 함께 제출되지 않습니다."
tags: ["form", "submission", "data-loss", "chrome"]
status: confirmed
---

## 현상
표준 HTML 폼은 `contenteditable` 영역을 유효한 입력 필드로 인식하지 않습니다. 표준 제출 버튼을 통해 폼을 전송할 때 에디터 내부의 값은 무시되며, 별도의 처리가 없다면 데이터 유실로 이어집니다.

## 재현 단계
1. `<form>` 내부에 `<div contenteditable="true">`를 배치합니다.
2. `<button type="submit">`을 추가합니다.
3. div에 텍스트를 입력하고 제출 버튼을 누릅니다.
4. 전송된 페이로드에 에디터 내용에 대한 키/값 쌍이 없는 것을 확인합니다.

## 예상 동작
에디터 내용은 폼 값으로 취급되어야 하며, 이상적으로는 내부 숨겨진 필드나 `ElementInternals` API를 통해 지원되어야 합니다.

## 해결 방법
모든 `input` 이벤트 발생 시 값을 동기화하는 숨겨진 input 필드를 사용하십시오.
```javascript
const editor = document.querySelector('[contenteditable]');
const hiddenInput = document.querySelector('input[name="editor-content"]');
editor.addEventListener('input', () => {
   hiddenInput.value = editor.innerHTML;
});
```
