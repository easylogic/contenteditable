---
id: ce-0585-chrome-web-speech-api-contenteditable-insertion-ko
scenarioId: scenario-voice-input-contenteditable
locale: ko
os: Windows
osVersion: "10+"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "120+"
keyboard: US QWERTY (음성 입력용 마이크)
caseTitle: Web Speech API 최종 결과가 인식 중 선택이 바뀌면 잘못된 Range에 삽입될 수 있음
description: "Speech Recognition API로 contenteditable에 transcript를 넣을 때 핸들러는 비동기로 실행된다. 사용자가 말하는 동안 에디터 blur나 캐럿 이동이 있으면, 저장해 둔 Range 기반 삽입이 잘못된 노드에 쓰이거나 에디터 상태와 어긋난다."
tags:
  - chrome
  - web-speech-api
  - voice
  - selection
  - async
  - contenteditable
status: draft
domSteps:
  - label: "1단계: 에디터 안 캐럿, 인식 시작"
    html: '<div id="editor" contenteditable="true"><p>Hello </p></div>'
    description: "사용자가 'Hello ' 뒤에 캐럿을 두고 음성 인식을 시작하며, 이후 onresult가 비동기로 온다."
  - label: "2단계: onresult 전에 바깥 클릭"
    html: '<div id="editor" contenteditable="true"><p>Hello </p></div><button type="button">Outside</button>'
    description: "포커스가 버튼으로 이동하고, getSelection()이 #editor 안에 의미 있는 Range를 갖지 않을 수 있다."
  - label: "3단계: 버그 — 여전히 오래된 Range 사용"
    html: '<div id="editor" contenteditable="true"><p>Hello world</p></div><button type="button">Outside</button>'
    description: "1단계에서 복제한 Range로 삽입할 때 재검증이 없으면 Chromium에서 예외가 나거나 잘못된 위치에 삽입되거나, 폴백이 getSelection()을 쓰면 포커스된 버튼 맥락 기준으로 동작해 앱마다 불일치가 난다."
  - label: "✅ 예상"
    html: '<div id="editor" contenteditable="true"><p>Hello </p></div><button type="button">Outside</button>'
    description: "예상: 에디터가 활성이 아님을 감지하고 transcript를 큐에 두거나 삽입을 생략해 DOM을 망가뜨리지 않는다."
---

## 현상

[Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)는 `SpeechRecognitionResult`를 비동기로 넘긴다. 에디터는 흔히 인식 시작 시점에 `window.getSelection().getRangeAt(0)`을 복제해 두고, `result.isFinal`일 때 `insertNode` / `insertText`를 호출한다. 그 사이 사용자가 탭 이동, 툴바 클릭, 다른 필드 포커스를 할 수 있어 저장한 `Range`가 무효화되거나, 사용자가 말하던 위치를 더 이상 나타내지 않을 수 있다. Chrome은 “이 transcript를 이 contenteditable에 묶는다”는 내장 프리미티브가 없어 정확성은 전부 앱 책임이다. 게다가 스크립트가 DOM을 직접 바꾸면 `beforeinput` / `input`이 나지 않을 수 있어, 프레임워크가 평소 파이프라인으로 동기화하지 못한다.

## 재현 단계

1. `contenteditable` 영역과 바깥의 포커스 가능한 컨트롤(예: `<button>`)을 만든다.
2. 음성 인식 스크립트: `start` 시 선택이 에디터 안에 있으면 Range를 복제한다.
3. 최종 결과가 올 때까지 말하거나 `onresult`를 시뮬레이션한다.
4. 최종 결과가 오기 전에 바깥 컨트롤을 클릭해 `document.activeElement`가 에디터가 아니게 한다.
5. `onresult`에서 `editor.contains(range.startContainer)`나 `document.activeElement` 확인 없이 복제한 Range로 transcript를 적용한다.
6. 콘솔의 DOM 오류, 예기치 않은 위치 삽입, 폴백에 따른 무반응 등을 관찰한다.

## 관찰된 동작

- **오래된 Range**: 경계 노드가 리렌더로 제거되면 `Range` 조작이 `InvalidNodeTypeError`를 내거나 무반응일 수 있다.
- **잘못된 activeElement**: `getSelection()`을 다시 읽는 폴백은 포커스가 옮겨진 위치 기준으로 삽입한다.
- **input 이벤트 부재**: 스크립트 돌 변이는 키보드 `beforeinput`/`input`과 같지 않아 `input`에서만 모델을 맞추는 리스너가 돌지 않는다.
- **composition 없음**: IME와 달리 Speech API는 `composition*`을 내지 않는다. `compositionend`에만 동기화하는 에디터는 갱신을 놓친다.

## 예상 동작

에디터에 포커스가 없고, 선택이 인식 시작 시점과 같은 편집 루트에 있다고 확신할 수 없으면 애플리케이션은 **오래된 Range에 transcript를 적용하면 안 된다**. 취소하거나 사용자가 에디터를 다시 포커스할 때까지 큐에 두거나, 안내해야 한다. 의도적인 프로그래매틱 삽입은 키보드 입력과 동일한 상태 갱신 경로(커스텀 이벤트나 명시적 모델 패치)를 타야 한다.

## 영향

- **문서 손상**: 텍스트가 잘못된 블록이나 래퍼 밖에 생긴다.
- **프레임워크 불일치**: 가상 DOM은 발생하지 않은 이벤트를 가정한다.
- **접근성**: 발화 중 툴바·다이얼로그로 포커스가 옮겨지면 음성 사용자 데이터가 조용히 잘못 들어갈 수 있다.

## 브라우저 비교

- **Chrome / Edge**: Speech Recognition API 사용 가능. 비동기 타이밍 이슈는 통합 수준에서 매우 흔하다.
- **Safari / Firefox**: API 가용성·동작이 다르다. Chrome과 동일하다고 가정하면 안 된다.
- **OS 디테이션**: Speech API를 완전히 우회해 네이티브 편집 경로를 쓸 수 있어 버그 표면이 다르다.

## 해결 방법

1. **삽입마다 가드** (영문 케이스 본문과 동일한 `safeInsert` 패턴).
2. **세션 버전**: 인식 시작 시 `sessionId`를 올리고, 에디터 `blur`에서 다시 올리면 이전 결과는 무시한다.
3. **합성 파이프라인**: 프로그래매틱 삽입 후 `InputEvent`를 디스패치하거나 모델 업데이터를 직접 호출해 단일 진실 경로를 유지한다.

## 참고

- [MDN: SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
- [시나리오: contenteditable에서 음성·발화 기반 입력](scenario-voice-input-contenteditable)
