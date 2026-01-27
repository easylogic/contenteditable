---
id: scenario-ime-interaction-patterns-ko
title: "IME 상호작용 패턴: 키, 이벤트 및 예외 사례"
description: "활성 조합(Composition) 중인 상태에서 Enter, Backspace, Escape 및 프로그래밍 방식의 동작을 처리하기 위한 기술 가이드입니다."
category: "interaction"
tags: ["ime", "composition", "keys", "events", "behavior", "autocorrect", "autocapitalize", "input-events"]
status: "confirmed"
locale: "ko"
---

## 개요
표준 키보드 입력과 달리, IME(입력기) 세션은 키 입력을 가로채고 버퍼링합니다. 이 문서는 조합이 활성화된 상태에서 기능 키, 입력 이벤트, OS 레벨의 자동 수정 속성 및 프로그래밍 방식의 동작을 처리하는 패턴을 설명합니다.

## 키 처리 패턴

### 1. 'Enter'의 딜레마
- **Blink/WebKit**: 'Enter'는 대개 조합을 확정(commit)함과 동시에 `insertParagraph` 타입의 `beforeinput` 이벤트를 발생시킵니다. 이를 적절히 처리하지 않으면 불필요한 줄바꿈이 두 번 발생하는 "Double Break" 현상이 나타납니다.
- **Gecko**: 'Enter'가 조합을 확정하기만 하고, 줄바꿈을 삽입하려면 한 번 더 눌러야 하는 경우가 많습니다.

### 2. 백스페이스 및 음절 단위(Granularity) 처리
한국어(한글)와 같은 언어에서는 백스페이스 한 번으로 글자 전체가 아닌 초/중/종성(자모) 단위로 지워질 수 있습니다.
- **버그**: 일부 브라우저에서는 이 자모 단위 삭제 중에 `beforeinput` 신호를 보내지 않아, 프레임워크가 글자 수 변화를 추적하지 못하는 경우가 있습니다.

### 3. iOS/macOS 자동 입력 동작
`autocorrect`, `autocapitalize`, `autocomplete` 속성들은 IME 버퍼와 예기치 않은 방식으로 상호작용합니다.
- **자동 수정(Autocorrect) 충돌**: iOS에서 예측 바가 조합 중인 단어를 갑자기 교체하면서, 마지막 `compositionupdate` 값과 다른 값으로 `compositionend`가 발생하는 경우가 있습니다. [WebKit Bug 265856](https://lists.webkit.org/pipermail/webkit-unassigned/2023-December/1136334.html)
- **자동 대문자화(Autocapitalize)**: `contenteditable`에서 지원이 일관되지 않습니다. 문장 시작 시 예기치 않은 `textInput` 이벤트를 발생시켜 CJK 버퍼를 조기에 플러시할 수 있습니다. [WebKit Bug 148503](https://bugs.webkit.org/show_bug.cgi?id=148503)

## 입력 이벤트 이상 현상 (Input Event Anomalies)

### 'input' 이벤트 누락 (Chrome 121 회귀 버그)
텍스트 노드나 블록의 `offset 0` 지점에서 타이핑할 때, Chrome 121 버전은 `beforeinput`을 정상적으로 처리함에도 불구하고 DOM 수정 후 최종적인 `input` 이벤트를 디스패치하지 않는 오류가 있습니다.
- **완화 방법**: `beforeinput` 발생 후 짧은 타이머를 사용하여 `input` 이벤트가 발생했는지 확인하거나, `MutationObserver`를 예비 수단으로 활용하십시오.

### 'input' 이벤트 중복 (Edge)
일부 Windows 환경의 구형 Edge에서는 하나의 키 입력에 대해 `input` 이벤트가 두 번 트리거되어, 의도치 않은 UI 업데이트나 성능 저하를 유발하는 경우가 보고되었습니다.

## 프로그래밍 방식 동작 처리

### 조합 중 실행 취소/다시 실행 (Undo/Redo)
`isComposing`이 true인 상태에서 `document.execCommand('undo')`를 트리거하면 Safari에서 **즉각적인 버퍼 오염**이 발생합니다.

### 이모지 삽입 vs 조합 (2026 업데이트)
안드로이드용 Chrome 131+ 버전에서는 조합 중에 이모지 키보드로 전환하여 아이콘을 삽입하면, 버퍼링된 글자를 확정하지 않고 세션을 취소하여 **데이터 유실**이 발생할 수 있습니다. [Chromium 이슈 #381254331](https://issues.chromium.org/issues/381254331)

## 해결책: 상호작용 가디언 (Interaction Guardians)
상태 잠금 또는 안전 타이머 방식의 이벤트 가로채기를 구현하십시오.

```javascript
/* 입력 이벤트 누락 대응을 위한 안전 타이머 */
let inputTimer = null;
element.addEventListener('beforeinput', (e) => {
  if (inputTimer) clearTimeout(inputTimer);
  inputTimer = setTimeout(() => {
    // input 이벤트가 발생하지 않은 경우 모델 수동 동기화
  }, 50);
});
element.addEventListener('input', () => {
  clearTimeout(inputTimer);
});
```

## 관련 사례
- [ce-0565: Chrome 121 offset 0 지점에서 onInput 누락](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0565-chrome-121-oninput-offset-0-ko.md)
- [ce-0581: 안드로이드 이모지 삽입 시 조합 데이터 유실](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0581-android-emoji-composition-corruption-ko.md)
- [ce-0071: autocorrect 동작 사례](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0071-contenteditable-with-autocorrect-ko.md)
- [ce-0042: input 이벤트 중복 발생 사례](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0042-input-events-duplicate-ko.md)
