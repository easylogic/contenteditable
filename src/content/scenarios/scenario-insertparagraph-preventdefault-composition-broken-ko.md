---
id: scenario-insertparagraph-preventdefault-composition-broken-ko
title: Safari에서 insertParagraph preventDefault가 IME 조합 상태를 깨뜨림
description: "Safari 데스크톱에서 insertParagraph(Enter 키)에 대해 keydown 또는 beforeinput 이벤트에서 preventDefault()를 호출하면 IME 조합 상태가 손상됩니다. 이후 텍스트 입력이 제대로 작동하지 않아 input 이벤트가 발생하지 않거나 문자가 삽입되지 않거나 조합이 오작동할 수 있습니다."
tags:
  - safari
  - webkit
  - insertparagraph
  - preventdefault
  - ime
  - composition
  - keydown
  - beforeinput
  - input-event
category: ime
status: draft
locale: ko
---

## 개요

Safari 데스크톱에서 개발자가 `insertParagraph` 동작(일반적으로 Enter 키를 눌러 발생)을 `keydown` 또는 `beforeinput` 이벤트 핸들러에서 `preventDefault()`를 호출하여 가로채면, 브라우저의 내부 IME(Input Method Editor) 조합 상태가 손상됩니다. 이 문제가 발생한 후, IME(한국어, 일본어, 중국어 등)를 사용한 후속 텍스트 입력이 제대로 작동하지 않습니다. `input` 이벤트가 제대로 발생하지 않거나, 문자가 삽입되지 않거나, 조합 상태가 일관되지 않은 상태로 남을 수 있습니다.

## 영향

- **IME 입력 실패**: insertParagraph를 막은 후 IME 입력이 제대로 작동하지 않음
- **input 이벤트 누락**: 후속 IME 입력에 대해 `input` 이벤트가 발생하지 않을 수 있음
- **조합 상태 손상**: IME 조합 상태가 일관되지 않게 됨
- **문자 손실**: 입력한 문자가 contenteditable 요소에 나타나지 않을 수 있음
- **사용자 경험 저하**: Enter를 막은 후 사용자가 계속 입력할 수 없음

## 기술적 세부사항

다음 상황에서 문제가 발생합니다:

1. 사용자가 contenteditable 요소에서 IME(한국어, 일본어, 중국어 등)를 사용하여 입력 중
2. 사용자가 Enter 키를 눌러 `insertParagraph`를 트리거
3. 개발자가 `keydown` 또는 `beforeinput` 이벤트 핸들러에서 `preventDefault()`를 호출하여 단락 삽입을 방지
4. Safari가 기본 단락 삽입 동작을 억제
5. 그러나 Safari의 내부 IME 조합 상태 관리가 손상됨
6. 후속 IME 입력이 제대로 `input` 이벤트를 트리거하지 않거나 문자를 올바르게 삽입하지 못함

### 이벤트 순서

문제가 발생하는 순서:
1. `keydown` (Enter 키) - 여기서 `preventDefault()`가 호출되는 경우
2. `beforeinput` (inputType: "insertParagraph") - 여기서 `preventDefault()`가 호출되는 경우
3. IME 조합 상태가 손상됨
4. 다음 IME 입력 시도:
   - `compositionstart`가 발생하지 않을 수 있음
   - `compositionupdate`가 발생하지 않을 수 있음
   - `input` 이벤트가 발생하지 않을 수 있음
   - 문자가 삽입되지 않을 수 있음

## 브라우저 비교

- **Safari (데스크톱)**: 이 문제가 발생합니다. insertParagraph를 막으면 후속 IME 입력이 깨집니다
- **Chrome**: 다른 동작을 보일 수 있음, 확인 필요
- **Firefox**: 다른 동작을 보일 수 있음, 확인 필요
- **Edge**: 다른 동작을 보일 수 있음, 확인 필요

## 원인 분석

연구 및 WebKit 버그 보고서에 따르면:

1. **조합 이벤트 중복**: IME 조합 중 또는 조합 후 Enter를 누를 때 Safari는 단락 삽입과 조합 상태 전환을 모두 처리해야 합니다. 단락 삽입을 막으면 이 조정이 방해받습니다.

2. **내부 상태 불일치**: 포맷팅 래퍼나 빈 노드가 있을 때 `insertParagraph`를 막으면 Safari의 내부 IME 상태 추적이 실제 DOM 상태와 동기화되지 않습니다.

3. **이벤트 순서 문제**: WebKit은 조합 주변의 이벤트 순서에 알려진 문제가 있으며, 조합 세션을 종료하는 `keydown`이 `compositionend` 이후에 발생하거나 잘못된 `isComposing` 값을 가질 수 있습니다.

4. **취소 불가능한 조합 이벤트**: 조합 관련 입력 이벤트(`insertCompositionText`)는 사양에 따라 취소할 수 없지만, `insertParagraph`를 취소하면 조합 생명주기에 간섭할 수 있습니다.

## 해결 방법

### 1. 막기 전에 조합 상태 확인

조합 중이 아닐 때만 `insertParagraph`를 막기:

```javascript
editor.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertParagraph') {
    // 조합 중이 아닐 때만 막기
    if (!e.isComposing) {
      e.preventDefault();
      // 사용자 정의 단락 삽입 로직
    }
    // 조합 중이면 IME 상태를 유지하기 위해 기본 동작 허용
  }
});
```

### 2. 조합 확인과 함께 keydown에서 Enter 처리

```javascript
editor.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.isComposing) {
    e.preventDefault();
    // 사용자 정의 단락 삽입
  }
  // isComposing이 true이면 기본 동작 진행
});
```

### 3. 조합 후까지 사용자 정의 동작 지연

```javascript
let isComposing = false;

editor.addEventListener('compositionstart', () => {
  isComposing = true;
});

editor.addEventListener('compositionend', () => {
  isComposing = false;
});

editor.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertParagraph' && isComposing) {
    // 조합 중에는 막지 않음
    return;
  }
  if (e.inputType === 'insertParagraph') {
    e.preventDefault();
    // 사용자 정의 로직
  }
});
```

### 4. 수동 IME 상태 리셋 (고급)

조합 상태가 이미 손상된 경우 리셋 시도:

```javascript
function resetIMEState(editor) {
  // IME 상태를 리셋하기 위해 blur 후 refocus
  editor.blur();
  setTimeout(() => {
    editor.focus();
    // 남아있는 조합 상태 제거
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      selection.removeAllRanges();
      selection.addRange(selection.rangeCount === 0 ? 
        document.createRange() : selection.getRangeAt(0));
    }
  }, 0);
}
```

## 관련 케이스

- 특정 환경 조합에 대한 케이스가 생성되면 케이스 ID가 추가됩니다

## 참고 자료

- [W3C Input Events Level 2 사양](https://www.w3.org/TR/input-events-2/) - insertParagraph inputType 공식 사양
- [WebKit 블로그: Enhanced Editing with Input Events](https://webkit.org/blog/7358/enhanced-editing-with-input-events/) - beforeinput 이벤트 구현 세부사항
- [ProseMirror 이슈 #944: Safari에서 IME로 중복 문자 발생](https://github.com/ProseMirror/prosemirror/issues/944) - Safari에서 IME 조합 상태 손상 관련 이슈
- [WebKit 버그 269922: 텍스트 조합을 프로그래밍 방식으로 조작하는 API 추가](https://bugs.webkit.org/show_bug.cgi?id=269922) - 조합 상태 제어 개선 요청
- [WebKit 버그 67763: WebCore::InsertNodeBeforeCommand 생성자에서 크래시](https://bugs.webkit.org/show_bug.cgi?id=67763) - InsertParagraph 명령 크래시 문제
- [WebKit 메일링 리스트: 커서/예측 텍스트 바 동기화 문제](https://lists.webkit.org/pipermail/webkit-unassigned/2023-December/1135698.html) - 조합 중 선택 변경 문제
- [ProseMirror 토론: 테이블 셀에서 IME 조합 문제](https://discuss.prosemirror.net/t/ime-composing-problems-on-td-or-th-element-in-safari-browser/4501) - Safari IME 조합 이슈
