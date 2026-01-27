---
id: scenario-ime-interaction-patterns-ko
title: "IME 상호작용 패턴: 키 핸들링, 이벤트 및 예외 케이스"
description: "IME 조합 세션 중 엔터, 백스페이스, 이스케이프 및 프로그래밍 방식의 동작이 어떻게 처리되는지에 대한 기술적 분석입니다."
category: "interaction"
tags: ["ime", "composition", "keys", "events", "behavior"]
status: "confirmed"
locale: "ko"
---

## 개요
표준 키보드 입력과 달리, IME(입력기) 세션은 모든 키 입력을 가로채고 버퍼링합니다. 이 문서는 조합(composition)이 활성화된 상태에서 기능 키와 프로그래밍 방식의 동작을 처리하는 패턴을 설명합니다.

## 키 핸들링 패턴

### 1. '엔터(Enter)' 딜레마
- **Blink/WebKit**: 엔터 키 입력 시 보통 조합을 확정(commit)함과 동시에 `inputType: "insertParagraph"`인 `beforeinput` 이벤트를 발생시킵니다. 이를 올바르게 처리하지 않으면 "이중 줄바꿈" 현상이 발생할 수 있습니다.
- **Gecko**: 엔터 키가 조합만 확정하고, 한 번 더 눌러야 줄바꿈이 삽입되는 경우가 많습니다.

### 2. 백스페이스 및 자음/모음 단위 삭제
한국어(한글)와 같은 언어에서는 백스페이스 한 번으로 글자 전체가 아닌 초성/중성/종성 단위로 삭제(조합 해제)될 수 있습니다.
- **버그**: 일부 브라우저는 자음/모음 단위 삭제 시 `beforeinput`을 발생시키지 않아 프레임워크가 글자 단위 변화를 추적하는 데 어려움을 겪습니다.

### 3. KeyCode 229 ('조합 중' 신호)
조합 세션 중에는 거의 모든 물리적 키가 `keyCode: 229`를 보고합니다.
- **패턴**: 조합 중에는 로직 구현을 위해 `keydown`에 의존해서는 안 됩니다. 대신 `beforeinput`이나 `compositionupdate`를 사용해야 합니다.

## 프로그래밍 방식의 동작 처리

### 조합 중 실행 취소(Undo/Redo)
`isComposing`이 true인 상태에서 `document.execCommand('undo')`를 실행하면 Safari에서 **즉각적인 버퍼 오염**이 발생합니다. 브라우저가 그림자 텍스트(shadow-text)를 놓치고 DOM에 "유령" 글자를 남길 수 있습니다.

### 포커스 및 블러(Blur) 전환
- **'포커스 소실' 트랩**: 조합 중 엘리먼트의 포커스를 해제하면 보통 강제로 "확정(Commit)"이 일어납니다. 하지만 일부 안드로이드 IME는 세션을 아예 취소해 버려 사용자의 입력 내용을 소실시키기도 합니다.

## 해결책: 상호작용 가디언(Guardians)
상태가 잠긴(state-locked) 이벤트 인터셉터를 구현하십시오.

```javascript
/* 상호작용 보호 로직 */
element.addEventListener('keydown', (e) => {
  if (e.target.isComposing) {
    if (e.key === 'Enter' || e.key === 'Backspace') {
       // 중복 처리를 방지하기 위한 로직
    }
  }
});
```

## 관련 사례
- [ce-0577: 안드로이드 첫 단어 중복 현상](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0577-android-first-word-duplication.md)
- [ce-0181: 크롬 일본어 IME 엔터 버그](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0181-japanese-ime-enter-breaks-chrome.md)
---
id: scenario-ime-interaction-patterns-ko
title: "IME 상호작용 패턴: 키 핸들링, 이벤트 및 예외 케이스"
description: "IME 조합 세션 중 엔터, 백스페이스, 이스케이프 및 프로그래밍 방식의 동작이 어떻게 처리되는지에 대한 기술적 분석입니다."
category: "interaction"
tags: ["ime", "composition", "keys", "events", "behavior"]
status: "confirmed"
locale: "ko"
---

## 개요
표준 키보드 입력과 달리, IME(입력기) 세션은 모든 키 입력을 가로채고 버퍼링합니다. 이 문서는 조합(composition)이 활성화된 상태에서 기능 키와 프로그래밍 방식의 동작을 처리하는 패턴을 설명합니다.

## 키 핸들링 패턴

### 1. '엔터(Enter)' 딜레마
- **Blink/WebKit**: 엔터 키 입력 시 보통 조합을 확정(commit)함과 동시에 `inputType: "insertParagraph"`인 `beforeinput` 이벤트를 발생시킵니다. 이를 올바르게 처리하지 않으면 "이중 줄바꿈" 현상이 발생할 수 있습니다.
- **Gecko**: 엔터 키가 조합만 확정하고, 한 번 더 눌러야 줄바꿈이 삽입되는 경우가 많습니다.

### 2. 백스페이스 및 자음/모음 단위 삭제
한국어(한글)와 같은 언어에서는 백스페이스 한 번으로 글자 전체가 아닌 초성/중성/종성 단위로 삭제(조합 해제)될 수 있습니다.
- **버그**: 일부 브라우저는 자음/모음 단위 삭제 시 `beforeinput`을 발생시키지 않아 프레임워크가 글자 단위 변화를 추적하는 데 어려움을 겪습니다.

### 3. KeyCode 229 ('조합 중' 신호)
조합 세션 중에는 거의 모든 물리적 키가 `keyCode: 229`를 보고합니다.
- **패턴**: 조합 중에는 로직 구현을 위해 `keydown`에 의존해서는 안 됩니다. 대신 `beforeinput`이나 `compositionupdate`를 사용해야 합니다.

## 프로그래밍 방식의 동작 처리

### 조합 중 실행 취소(Undo/Redo)
`isComposing`이 true인 상태에서 `document.execCommand('undo')`를 실행하면 Safari에서 **즉각적인 버퍼 오염**이 발생합니다. 브라우저가 그림자 텍스트(shadow-text)를 놓치고 DOM에 "유령" 글자를 남길 수 있습니다.

### 포커스 및 블러(Blur) 전환
- **'포커스 소실' 트랩**: 조합 중 엘리먼트의 포커스를 해제하면 보통 강제로 "확정(Commit)"이 일어납니다. 하지만 일부 안드로이드 IME는 세션을 아예 취소해 버려 사용자의 입력 내용을 소실시키기도 합니다.

## 해결책: 상호작용 가디언(Guardians)
상태가 잠긴(state-locked) 이벤트 인터셉터를 구현하십시오.

```javascript
/* 상호작용 보호 로직 */
element.addEventListener('keydown', (e) => {
  if (e.target.isComposing) {
    if (e.key === 'Enter' || e.key === 'Backspace') {
       // 중복 처리를 방지하기 위한 로직
    }
  }
});
```

## 관련 사례
- [ce-0577: 안드로이드 첫 단어 중복 현상](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0577-android-first-word-duplication.md)
- [ce-0181: 크롬 일본어 IME 엔터 버그](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0181-japanese-ime-enter-breaks-chrome.md)
