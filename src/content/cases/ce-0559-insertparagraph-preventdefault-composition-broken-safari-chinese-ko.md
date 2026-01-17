---
id: ce-0559-insertparagraph-preventdefault-composition-broken-safari-chinese-ko
scenarioId: scenario-insertparagraph-preventdefault-composition-broken
locale: ko
os: macOS
osVersion: "14.0+"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0+"
keyboard: Chinese (IME - Pinyin)
caseTitle: insertParagraph preventDefault가 Safari에서 중국어 IME 조합을 깨뜨림
description: "macOS의 Safari 데스크톱에서 insertParagraph(Enter 키)에 대해 keydown 또는 beforeinput 이벤트에서 preventDefault()를 호출하면 중국어 IME 조합 상태가 손상됩니다. 이후 중국어 텍스트 입력이 제대로 작동하지 않아 input 이벤트가 발생하지 않거나 문자가 삽입되지 않거나 조합이 오작동할 수 있습니다."
tags:
  - safari
  - macos
  - insertparagraph
  - preventdefault
  - chinese
  - ime
  - composition
  - keydown
  - beforeinput
  - input-event
status: draft
domSteps:
  - label: "초기 상태"
    html: '<div contenteditable="true"><p>你好</p></div>'
    description: "사용자가 중국어 텍스트를 입력함"
  - label: "preventDefault와 함께 Enter 누름"
    html: '<div contenteditable="true"><p>你好</p></div>'
    description: "Enter 키가 눌리고, keydown/beforeinput에서 preventDefault()가 호출됨"
  - label: "다시 중국어 입력 시도"
    html: '<div contenteditable="true"><p>你好</p></div>'
    description: "사용자가 더 많은 중국어 문자를 입력하려고 하지만 input 이벤트가 제대로 발생하지 않음"
  - label: "결과 - 문자가 삽입되지 않음"
    html: '<div contenteditable="true"><p>你好</p></div>'
    description: "중국어 문자가 삽입되지 않고 조합 상태가 깨짐"
---

## 현상

macOS의 Safari 데스크톱에서 `insertParagraph`(Enter 키)에 대해 `keydown` 또는 `beforeinput` 이벤트에서 `preventDefault()`를 호출하면 중국어 IME 조합 상태가 손상됩니다. 이 문제가 발생한 후, 후속 중국어 텍스트 입력이 제대로 작동하지 않습니다. `input` 이벤트가 제대로 발생하지 않거나, 중국어 문자가 삽입되지 않거나, 조합 상태가 일관되지 않은 상태로 남을 수 있습니다.

## 재현 예제

1. contenteditable div를 생성하고 포커스를 설정합니다.
2. Enter가 눌리거나 `inputType === "insertParagraph"`일 때 `e.preventDefault()`를 호출하는 `keydown` 및/또는 `beforeinput` 이벤트 리스너를 추가합니다.
3. IME를 사용하여 중국어 텍스트를 입력합니다(예: "你好").
4. Enter 키를 누릅니다.
5. `preventDefault()`가 단락 삽입을 성공적으로 막는 것을 확인합니다.
6. 더 많은 중국어 텍스트를 입력하려고 시도합니다(예: "谢谢").
7. 중국어 문자가 삽입되지 않거나 `input` 이벤트가 제대로 발생하지 않는 것을 확인합니다.

## 관찰된 동작

- **insertParagraph에서 preventDefault()**: `keydown` 또는 `beforeinput`에서 호출되면 단락 삽입을 성공적으로 막습니다.
- **후속 IME 입력 실패**: insertParagraph를 막은 후 중국어 IME 입력이 작동하지 않습니다.
- **input 이벤트 누락**: 후속 중국어 텍스트 입력에 대해 `input` 이벤트가 발생하지 않을 수 있습니다.
- **조합 이벤트**: `compositionstart`, `compositionupdate`, `compositionend`가 제대로 발생하지 않을 수 있습니다.
- **문자 삽입 실패**: 입력한 중국어 문자가 contenteditable 요소에 나타나지 않습니다.
- **IME 상태 손상**: IME 조합 상태가 일관되지 않게 되며 요소를 blur하고 refocus하지 않고는 복구할 수 없습니다.

## 예상 동작

- `preventDefault()`는 IME 조합 상태에 영향을 주지 않고 단락 삽입을 막아야 합니다.
- insertParagraph를 막은 후 후속 중국어 IME 입력이 정상적으로 계속 작동해야 합니다.
- 이전에 insertParagraph가 막혔는지 여부와 관계없이 모든 IME 입력에 대해 `input` 이벤트가 올바르게 발생해야 합니다.
- IME 조합 상태가 일관되고 기능적으로 유지되어야 합니다.

## 분석

이 문제는 `insertParagraph`를 막을 때 Safari의 내부 IME 조합 상태 관리가 손상되기 때문에 발생합니다. 포맷팅 래퍼나 빈 노드가 있을 때 특히 Enter를 누르면 단락 삽입과 조합 상태 전환 간의 브라우저 조정이 방해받아 IME가 일관되지 않은 상태로 남게 됩니다.

Input Events Level 2 사양에 따르면 조합 관련 입력 이벤트는 취소할 수 없지만, `insertParagraph`를 취소하면 조합 생명주기에 간섭할 수 있으며, 특히 IME 조합 중 또는 조합 후 Enter를 누를 때 그렇습니다.

## 해결 방법

### 막기 전에 isComposing 확인

조합 중이 아닐 때만 `insertParagraph`를 막기:

```javascript
editor.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertParagraph' && !e.isComposing) {
    e.preventDefault();
    // 사용자 정의 단락 삽입 로직
  }
});
```

### 조합 확인과 함께 keydown에서 Enter 처리

```javascript
editor.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.isComposing) {
    e.preventDefault();
    // 사용자 정의 단락 삽입
  }
});
```

### 손상된 경우 IME 상태 리셋

조합 상태가 이미 손상된 경우 요소를 blur하고 refocus:

```javascript
function resetIMEState(editor) {
  editor.blur();
  setTimeout(() => {
    editor.focus();
  }, 0);
}
```

## 브라우저 비교

- **Safari (데스크톱 macOS)**: 이 문제가 발생합니다. insertParagraph를 막으면 후속 중국어 IME 입력이 깨집니다.
- **Chrome**: 확인 필요
- **Firefox**: 확인 필요
- **Edge**: 확인 필요
