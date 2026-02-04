---
id: ce-0584-ios-safari-inputtype-null-forced-render-breaks-sync-ko
scenarioId: scenario-ios-safari-contenteditable-do-not-force-rerender-or-change-selection-during-input
locale: ko
os: iOS
osVersion: "17"
device: Phone
deviceVersion: iPhone 15
browser: Safari
browserVersion: "17"
keyboard: US QWERTY / 음성 받아쓰기
caseTitle: iOS Safari — inputType이 undefined/null이거나 다중 insertText일 때 강제 재렌더 시 모델–DOM 동기화 깨짐
description: "iOS Safari에서 input/beforeinput이 inputType undefined 또는 null로 오거나, insertText가 여러 번(음성 등) 올 수 있다. 이때 에디터가 강제 재렌더나 선택 변경을 하면 모델과 DOM이 어긋나 이후 입력이 깨져 보인다."
tags: ["ios", "safari", "input", "inputType", "voice", "dictation", "re-render", "model-sync"]
status: draft
domSteps:
  - label: "1단계: 사용자가 텍스트 입력 (키보드 또는 음성)"
    html: '<div contenteditable="true">Hello </div>'
    description: "첫 input 이벤트 발생; inputType이 'insertText' 또는 undefined/null일 수 있음."
  - label: "2단계: 에디터가 강제 재렌더 또는 선택 변경"
    html: '<div contenteditable="true">Hello </div>'
    description: "에디터가 모델을 DOM에 쓰거나 선택을 복원; DOM/선택이 덮어쓰이거나 이동함."
  - label: "3단계: 다음 입력이 잘못된 위치에 적용 (버그)"
    html: '<div contenteditable="true">World Hello </div>'
    description: "이어지는 insertText(또는 다음 덩어리)가 잘못된 오프셋에 적용되어 모델과 DOM이 일치하지 않음."
  - label: "✅ 예상"
    html: '<div contenteditable="true">Hello World </div>'
    description: "에디터는 입력만 관찰하고 모델만 갱신; 스트림 중 재렌더/선택 변경 없음; 텍스트가 올바른 순서로 유지됨."
---

## 현상

iOS Safari에서는 `input`·`beforeinput` 이벤트에 항상 유효한 `event.inputType`이 붙지 않는다. 음성 받아쓰기나 일부 시스템 텍스트 삽입 경로에서는 `inputType`이 `undefined` 또는 `null`인데도 브라우저는 DOM에 변경을 적용한다. 또한 음성 받아쓰기는 `insertText` 이벤트를 연속으로 여러 번 보낸다(단어 단위나 덩어리로). 이때 에디터가 이 중 어떤 이벤트에 대해 강제 재렌더(현재 모델을 DOM에 다시 쓰기, 또는 React에서 state 기준 재렌더)나 선택(selection)을 프로그램적으로 바꾸면:

1. **inputType이 undefined/null일 때**: 에디터가 "inputType을 모를 때"를 "모델 기준 동기화" 또는 "선택 복원"으로 처리하면, 방금 브라우저가 적용한 내용을 덮어쓰거나 캐럿을 옮긴다. 그다음 input이 잘못된 위치에 적용되고, 그 시점부터 모델과 DOM이 영구적으로 어긋난다. 사용자에게는 글자 순서가 뒤바뀌거나 중복되거나 "전부 깨진" 것처럼 보인다.
2. **insertText가 여러 번 올 때**: 첫 insertText 직후 에디터가 재렌더하거나 선택을 옮기면, 두 번째 이후 insertText가 (이미 잘못된) 선택 위치나 방금 모델로 교체된 DOM에 적용된다. 최종 텍스트가 틀리고 모델과 DOM을 다시 맞출 수 없게 된다.

iOS 음성 받아쓰기에서는 composition 이벤트가 오지 않아, 에디터가 composition 구간으로 입력을 "묶어서" 처리할 수 없다. 안전한 방법은 입력 스트림 동안 강제 재렌더와 선택 변경을 하지 않고, 관찰만 하며 모델만 갱신하는 것이다.

## 재현 단계

1. iPhone 또는 iPad의 iOS Safari에서, 매 `input`마다 모델 state로 재렌더하는 contenteditable 기반 에디터(예: 제어 컴포넌트인 React) 또는 매 input 후 선택을 복원하는 에디터를 사용한다.
2. 다음 중 하나를 수행한다.
   - 키보드로 여러 글자를 빠르게 입력하거나,
   - 음성 받아쓰기로 문구를 넣는다(예: "Hello world").
3. 입력 스트림 중간에 에디터가 DOM을 강제 갱신하거나 선택을 바꾸는 경우(예: `event.inputType`이 undefined/null인 이벤트에서, 또는 받아쓰기 문구의 첫 insertText 직후) 다음을 확인한다.
   - 이어지는 글자나 덩어리가 잘못된 위치에 나타난다.
   - 화면 텍스트와 에디터 내부 모델이 갈라진다.
   - 포커스를 잃거나 새로고침할 때까지 추가 타이핑/받아쓰기가 잘못된 위치에 적용되어 에디터가 "깨진" 것처럼 보인다.

## 관찰된 동작

- **이벤트 순서**: `inputType: 'insertText'`(또는 undefined/null)와 텍스트 일부를 담은 `data`로 `beforeinput`/`input` 발생 → 브라우저가 DOM 갱신. 이때 에디터가 "모델에서 동기화" 또는 "선택 복원"을 실행하면 DOM 또는 선택이 덮어쓰인다. 그다음 `beforeinput`/`input`에 더 많은 텍스트가 오면, 이전 또는 잘못된 오프셋에 적용된다. 결과: 텍스트 중복, 순서 뒤바뀜, 캐럿 잘못된 위치에서 이후 입력 전부 깨짐.
- **inputType undefined/null**: iOS Safari에서 음성 받아쓰기 및 일부 입력 경로에서 확인됨. 스펙상 inputType은 비어 있을 수 있으며, MDN에서도 null/undefined 반환 가능을 기술함. "inputType 없음 → 강제 동기화"를 하면 첫 덮어쓰기와 영구적 동기화 깨짐이 발생함.
- **다중 insertText**: 음성 받아쓰기는 여러 번의 insertText(예: 단어별·구간별)를 보낸다. 첫 번째 직후 재렌더나 선택 변경 시 나머지가 잘못 적용됨.

## 예상 동작

에디터는 input 핸들러에서 DOM(또는 이벤트)만 읽어 모델을 갱신해야 한다. 같은 입력 "폭발" 동안에는 모델을 DOM에 다시 쓰지 않고 Selection도 바꾸지 않아야 한다. inputType이 undefined 또는 null이어도 "알 수 없으니 모델로 DOM 덮어쓰기"로 해석하지 않는다. 입력이 안정된 뒤(debounce, blur 등)에만 필요 시 모델 기준으로 DOM을 맞출 수 있다.

## 영향

- **모델–DOM 영구적 어긋남**: 잘못된 순간에 강제 재렌더나 선택 변경이 한 번이라도 일어나면, 세션 동안 모델과 DOM을 안정적으로 맞출 수 없고 글자가 깨지거나 순서가 틀려 보인다.
- **음성 입력 불안정**: 음성 받아쓰기가 다중 insertText와 가끔 undefined inputType의 대표 사례이므로, 매 input마다 재렌더하거나 선택을 건드리는 에디터는 iOS Safari에서 음성 입력을 불안정하게 만든다.
- **제어 컴포넌트**: 매 input마다 state로 DOM을 맞추는 React 등은 iOS에서 재렌더가 입력 스트림 중에 발생하지 않도록(관찰 전용 + debounce/blur 동기화) 하지 않으면 위험도가 높다.

## 브라우저 비교

- **iOS Safari**: inputType이 undefined/null일 수 있음; 음성 시 insertText 다중; 입력 중 강제 재렌더·선택 변경 시 동기화 깨짐 및 이후 입력 깨짐.
- **macOS Safari / Chrome / Firefox**: inputType은 보통 설정됨; 매 input 재렌더는 캐럿 점프 등은 유발할 수 있으나 iOS Safari만큼 영구적 동기화 깨짐을 일으키지는 않을 수 있음.

## 해결 방법

1. **관찰 전용**: `input`/`beforeinput`에서는 DOM 또는 이벤트에서만 모델을 갱신하고, 같은 틱 또는 빠른 연속 이벤트 동안에는 모델을 DOM에 쓰지 않으며 선택도 바꾸지 않는다.
2. **inputType이 falsy일 때 강제 동기화 금지**: `event.inputType`이 undefined 또는 null이면 "모델→DOM 동기화" 또는 "선택 복원"을 실행하지 않고, 읽기만 하고 모델만 갱신한다.
3. **모델→DOM은 지연**: DOM에 모델을 반영해야 하면 입력이 안정된 뒤(debounce, blur, 명시적 flush)에 수행하고, input 핸들러 안에서는 하지 않는다.
4. **비제어 또는 하이브리드**: 편집 중에는 contenteditable을 진실의 원천으로 두고, blur나 debounce 시점에만 프레임워크 state와 동기화해 재렌더가 입력 스트림 중에 발생하지 않게 한다.

## 참고 자료

- [WebKit Bug 261764: iOS/iPadOS dictation doesn't trigger composition events](https://bugs.webkit.org/show_bug.cgi?id=261764)
- [MDN: InputEvent.inputType](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/inputType)
- [Stack Overflow: Safari에서 재렌더 시 캐럿 위치 복원](https://stackoverflow.com/questions/40537746/caret-position-reverts-to-start-of-contenteditable-span-on-re-render-in-react-in)
- [시나리오: iOS Safari contenteditable 입력 중 강제 재렌더·선택 변경 금지](scenario-ios-safari-contenteditable-do-not-force-rerender-or-change-selection-during-input)
