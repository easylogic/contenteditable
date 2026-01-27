---
id: ce-0565-chrome-121-oninput-offset-0-ko
scenarioId: scenario-input-event-missing
locale: ko
os: Windows
osVersion: "11"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "121.0.6167.86"
keyboard: US QWERTY
caseTitle: "오프셋 0에서 타이핑 시 onInput 이벤트 누락"
description: "크롬 121 버전에서 블록의 맨 시작 부분(오프셋 0)에 문자를 입력할 때 input 이벤트가 발생하지 않아 프레임워크 동기화가 깨지는 현상입니다."
tags: ["input", "events", "regression", "chrome-121", "windows"]
status: confirmed
domSteps:
  - label: "시작 전"
    html: '<div contenteditable="true">|world</div>'
    description: "캐럿이 'world' 앞, 오프셋 0에 위치함"
  - label: "'H' 입력 중"
    html: '<div contenteditable="true">H|world</div>'
    description: "beforeinput(insertText)은 발생하고 DOM은 변경되지만, input 이벤트가 누락됨"
  - label: "✅ 예상 결과"
    html: '<div contenteditable="true">H|world</div>'
    description: "예상: beforeinput과 input 이벤트가 순차적으로 모두 발생해야 함"
---

## 현상
윈도우 환경의 Chrome 121 버전에서 문장이나 텍스트 노드의 맨 앞부분(오프셋 0)에 글자를 입력할 때, `beforeinput` 이벤트는 발생하지만 그 뒤를 이어야 할 `input` 이벤트(React의 `onInput` 포함)가 트리거되지 않는 회귀 버그가 발견되었습니다. 이는 DOM의 변경 사항을 감지하여 내부 모델을 업데이트하는 에디터 프레임워크들에게 치명적인 동기화 문제를 야기합니다.

## 재현 단계
1. 텍스트가 포함된 `contenteditable` 요소를 생성합니다 (예: "world").
2. 캐럿을 맨 앞(오프셋 0, "w" 앞)에 위치시킵니다.
3. 키보드로 글자 하나를 입력합니다 (예: "H").
4. 브라우저의 이벤트 로그를 확인합니다.

## 관찰된 동작
1. **`keydown` 이벤트**: 정상 발생.
2. **`beforeinput` 이벤트**: `inputType: "insertText"`, `data: "H"`로 정상 발생.
3. **DOM 변경**: 브라우저 기본 동작에 의해 "H"가 DOM에 정상적으로 삽입됨.
4. **`input` 이벤트**: **발생하지 않음 (MISSING)**.
5. **결과**: React나 Slate.js 같은 프레임워크가 변경을 감지하지 못해, State와 DOM 간의 불일치가 발생함.

## 예상 동작
브라우저는 캐럿의 위치와 상관없이, `insertText` 조작으로 DOM이 수정된 직후 반드시 `input` 이벤트를 디스패치해야 합니다.

## 영향
- **데이터 유실**: `onInput`이 발생하지 않아 애플리케이션의 상태(State)가 업데이트되지 않습니다. 이 상태에서 저장을 하거나 다른 작업을 수행하면 앞서 입력한 글자가 사라질 수 있습니다.
- **실행 취소(Undo) 파손**: 브라우저 기반의 Undo 스택과 프레임워크 기반의 history 관리가 꼬이게 됩니다.
- **프레임워크 오작동**: Slate.js 등 가상 모델을 사용하는 에디터의 핵심 로직이 실행되지 않아 구문 강조, 자동 저장 등의 부가 기능이 멈춥니다.

## 브라우저 비교
- **Chrome 120 이하**: 정상 동작.
- **Chrome 122 이상**: 수정됨.
- **Firefox/Safari**: 해당 현상 없음; 정상 동작.

## 참고 및 해결 방법
### 해결책: beforeinput에서 폴백 처리
Chrome 121 버전을 지원해야 하는 경우, `beforeinput` 시점에 플래그를 세우고 일정 시간 내에 `input`이 발생하지 않으면 강제로 모델을 동기화하는 로직이 필요합니다.

```javascript
let inputExpected = false;

element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertText' && getSelectionOffset() === 0) {
    inputExpected = true;
    // input 이벤트가 발생하는지 지켜보는 짧은 타임아웃
    setTimeout(() => {
      if (inputExpected) {
        console.warn('Chrome 121의 input 이벤트 누락 감지. 강제 동기화 실행.');
        forceSyncModelWithDOM();
        inputExpected = false;
      }
    }, 10);
  }
});

element.addEventListener('input', (e) => {
  inputExpected = false;
});
```

- [Slate.js GitHub Issue #5668](https://github.com/ianstormtaylor/slate/issues/5668)
- [Chromium Bug 1521404](https://issues.chromium.org/issues/41492025)
