---
id: scenario-ios-safari-contenteditable-do-not-force-rerender-or-change-selection-during-input-ko
title: iOS Safari contenteditable — 입력 중 강제 재렌더·선택 변경 금지
description: "iOS Safari에서는 input/beforeinput이 inputType 'insertText'로 여러 번 오거나(음성 입력 등), inputType이 undefined/null로 올 수 있다. 이 흐름 중에 강제 재렌더나 선택 변경을 하면 에디터 모델과 DOM이 어긋나고, 이후 입력이 영구적으로 깨질 수 있다."
category: ime
tags:
  - ios
  - safari
  - input
  - beforeinput
  - inputType
  - voice
  - dictation
  - re-render
  - model-sync
  - selection
status: draft
locale: ko
---

## 문제 개요

iOS Safari에서 사용자가 contenteditable에서 입력하거나 음성으로 입력할 때, 에디터는 입력을 **관찰**하고 내부 모델만 갱신해야 한다. 입력 스트림이 진행되는 **도중에** 강제 재렌더(예: 모델에서 DOM으로 다시 쓰기)나 선택(selection)을 프로그램적으로 바꾸면 안 된다. 이유는 두 가지다.

1. **insertText가 여러 번 옴**: 음성 입력은 `inputType: 'insertText'`인 `beforeinput`/`input`을 여러 번 보낸다(단어 단위나 덩어리로). 첫 번째 이벤트 직후에 에디터가 재렌더하거나 선택을 옮기면, 그 다음 이벤트들이 잘못된 위치에 적용되어 모델과 DOM이 어긋난다.
2. **inputType이 undefined나 null일 수 있음**: iOS에서는 `event.inputType`이 보장되지 않는다. undefined나 null이어도 브라우저는 변경을 적용한다. 이때 "inputType을 모르니까"라고 하고 강제 동기화나 모델 기준 재렌더를 하면, DOM을 덮어쓰거나 어긋나게 한다. 그 순간부터 이후 입력이 "깨진" 것처럼 보이고, 모델과 DOM을 다시 맞출 수 없게 된다.

안전한 패턴은 **입력을 관찰하고, DOM(또는 이벤트)에서만 모델을 갱신하며, 입력 흐름이 끝나기 전에는 DOM이나 선택을 다시 쓰지 않는 것**이다.

## 관찰된 동작

- **insertText 다중 발생**: 음성 입력 시 insertText 이벤트가 연속으로 온다. 첫 이벤트 후 DOM에는 이미 일부만 반영되고, 다음 이벤트에 나머지 텍스트가 온다. 그 사이에 에디터가 재렌더(예: React setState → DOM 교체)하거나 선택을 복원하면, 두 번째 이후 이벤트가 잘못된 위치에 적용되어 최종 텍스트가 틀리거나 중복된다.
- **inputType undefined/null**: iOS Safari의 일부 경로에서는 `input` 또는 `beforeinput`이 `event.inputType === undefined` 또는 `null`인 채로 발생한다. DOM은 그대로 브라우저에 의해 갱신된다. "inputType이 없으면 모델→DOM 강제 동기화" 또는 "inputType이 없으면 선택 복원" 같은 처리를 하면, 브라우저가 적용한 변경을 덮어쓰거나 캐럿을 옮겨 버린다. 그 시점부터 모델과 DOM이 갈라지고, 이후 타이핑/음성 입력이 깨져 보인다.
- **선택 변경**: 입력 스트림 도중에 `selection.removeAllRanges()` / `addRange()` 등으로 선택을 바꾸면, 재렌더와 같은 효과로 다음 이벤트가 잘못된 위치에 적용되어 동기화가 깨진다.

## 영향

- **영구적 동기화 깨짐**: inputType이 null/undefined인 이벤트에서, 또는 다중 insertText 스트림 도중에 강제 재렌더나 선택 변경을 한 번이라도 하면, 모델과 DOM이 더 이상 맞지 않는다. 이후 입력은 잘못된 위치에 쌓이거나 덮어쓰며, 사용자에게는 "글자가 모두 깨진다" 또는 순서가 뒤섞인 것처럼 보인다.
- **음성 입력 사용 불가에 가까움**: 음성 입력이 다중 insertText의 대표적 케이스이므로, dictation 중 재렌더나 선택 조작은 iOS에서 음성 입력을 불안정하게 만든다.
- **제어 컴포넌트**: 매 입력마다 state를 갱신해 DOM을 state로 맞추는 React 등 "제어" 패턴은, 매 키 입력/input마다 재렌더에 해당하므로 위 조건에서 특히 위험하다.

## 브라우저 비교

- **iOS Safari**: inputType이 undefined/null일 수 있음; 음성 입력 시 insertText가 여러 번 옴; 입력 중 재렌더나 선택 변경 시 동기화 깨짐 및 이후 입력 깨짐.
- **macOS Safari / Chrome / Firefox**: inputType은 대체로 설정됨; dictation은 composition 등 다른 이벤트 패턴일 수 있음; 매 input마다 재렌더는 캐럿 점프 등 위험은 있으나 iOS만큼 모델/DOM 영구적 어긋남을 유발하지는 않을 수 있음.

## 해결 방법

1. **입력 중에는 관찰만**: `input`/`beforeinput` 핸들러에서는 DOM(또는 이벤트)만 읽어서 에디터 모델을 갱신한다. 같은 틱(또는 입력 "폭발"이 끝나기 전)에는 모델을 DOM에 다시 쓰지 않고, Selection도 바꾸지 않는다.
2. **inputType이 없을 때 강제 동기화 금지**: `event.inputType`이 `undefined` 또는 `null`이면 "알 수 없으니 모델로 DOM 덮어쓰기"를 하지 않는다. "브라우저가 변경을 적용했으니 읽기만 하고 모델만 갱신"으로 처리한다. inputType이 falsy일 때 force-sync나 재렌더를 수행하는 경로를 제거한다.
3. **모델→DOM 쓰기는 지연**: 모델 상태를 DOM에 반영해야 한다면, 입력이 안정된 뒤(blur, debounce 등)에 수행하고, input 핸들러 안에서 동기적으로 하지 않는다. iOS에서는 빠른 연속 input(예: dictation) 중간에 재렌더를 하지 않는다.
4. **비제어 또는 하이브리드**: 편집 중에는 contenteditable DOM을 진실의 원천으로 두고, blur나 debounce된 시점에만 프레임워크 state와 동기화하면, 재렌더가 입력 스트림 중에 발생하지 않는다.

예: inputType이 없을 때 강제 재렌더를 하지 않기

```javascript
editable.addEventListener('input', (e) => {
  // 읽기만 하고 모델만 갱신; 여기서 DOM에 다시 쓰지 않음
  const newContent = editable.innerHTML; // 또는 e / getTargetRanges에서
  updateModel(newContent);

  // inputType이 undefined/null이거나 insertText 스트림 중에는 다음을 하지 말 것:
  // setState(newContent);  // → React 재렌더 → DOM 교체 → iOS에서 동기화 깨짐
  // selection.removeAllRanges(); selection.addRange(myRange);  // → 다음 입력이 잘못된 위치에
});
```

## 모범 사례

- iOS Safari에서는 inputType이 undefined/null일 수 있다고 가정하고, "inputType이 없으니 모델 기준으로 DOM/선택을 갱신한다"는 로직을 두지 않는다.
- insertText가 연속으로 올 수 있다고 가정(음성 등); 그 사이에 재렌더나 선택 변경을 하지 않는다.
- 관찰 전용 패턴을 우선한다: input 핸들러는 DOM/이벤트에서만 모델을 갱신하고, DOM/선택은 입력이 안정된 뒤(blur, debounce 등)에만 다시 쓴다.

## 관련 케이스

- [ce-0584-ios-safari-inputtype-null-forced-render-breaks-sync](ce-0584-ios-safari-inputtype-null-forced-render-breaks-sync) – iOS Safari: inputType undefined/null 또는 다중 insertText 시 강제 재렌더로 모델–DOM 동기화 깨짐
- [ce-0293](ce-0293-ios-dictation-duplicate-events-safari) – iOS 음성 입력 중복 이벤트 (관련 이벤트 순서)

## 참고 자료

- [WebKit Bug 261764: iOS/iPadOS dictation doesn't trigger composition events](https://bugs.webkit.org/show_bug.cgi?id=261764)
- [MDN: InputEvent.inputType](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/inputType) – "null or undefined를 반환할 수 있음"
- [Stack Overflow: Safari에서 contenteditable 재렌더 시 캐럿이 맨 앞으로](https://stackoverflow.com/questions/40537746/caret-position-reverts-to-start-of-contenteditable-span-on-re-render-in-react-in)
- [시나리오: iOS dictation duplicate events](scenario-ios-dictation-duplicate-events) – 음성 입력 시 이벤트 재발생; dictation 중 재렌더 시 악화
