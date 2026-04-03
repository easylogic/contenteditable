---
id: scenario-voice-input-contenteditable
title: contenteditable에서 음성·발화 기반 입력은 안정적인 편집 계약을 제공하지 않음
description: "OS 음성 입력, Web Speech API, 보조 음성 도구는 키보드·IME과 동일한 이벤트 순서로 contenteditable을 바꾸지 않는다. 캐럿·선택·composition 이벤트가 플랫폼마다 달라 beforeinput/input/composition을 전제로 한 에디터가 깨질 수 있다."
category: accessibility
tags:
  - voice
  - speech
  - web-speech-api
  - dictation
  - accessibility
  - beforeinput
  - composition
  - selection
status: draft
locale: ko
---

음성 기반 편집(브라우저 Web Speech API, OS 디테이션, Dragon류 도구)은 물리 키보드·IME과 다른 경로로 `contenteditable`을 변경한다. 앱에서는 종종 덩어리 `insertText`류 갱신, `composition*` 이벤트 부재, 또는 포커스·선택과 경합하는 비동기 삽입을 보게 된다. `input` 요소와 달리 웹 API에 “음성 모드” 플래그가 없어 입력 소스를 신뢰할 수 있게 구분하기 어렵다.

## 문제 개요

에디터 코드는 흔히 다음을 가정한다.

1. `beforeinput` → DOM 변경 → `input`까지 `getTargetRanges()`·선택 스냅샷이 일관된다.
2. IME 경로는 `compositionstart` / `compositionupdate` / `compositionend`를 낸다.

음성 입력은 (1)(2)를 자주 위반한다. 인식 결과가 한 번에 오거나 단어별로 쪼개질 수 있고, 인식 중 사용자가 포커스를 옮기면 선택이 무효화된다. 일부 플랫폼에서는 디테이션에 composition이 전혀 없다. 그 결과 중복 처리, 잘못된 삽입 오프셋, undo 스택 불일치가 생긴다. 모바일 디테이션과 유사하지만 데스크톱·Speech API 통합에서도 동일한 실패 모드가 난다.

## 관찰된 동작

- **Web Speech API**: 최종 결과가 비동기로 전달된다. `recognition.onresult`에서 DOM을 바꿀 때, 의도한 `contenteditable` 안에 활성 Range가 더 이상 없을 수 있다(사용자가 다른 곳을 클릭).
- **OS 디테이션(데스크톱)**: 포커스된 편집 영역에 직접 넣을 수 있으나, 같은 엔진이라도 모바일 WebKit과 이벤트 패턴이 다를 수 있다.
- **표준 감지 없음**: 웹 페이지가 네이티브 “디테이션 여부”를 읽을 수 없다. composition 부재·큰 `data` 등 휴리스틱은 일부 IME와 충돌한다.

```javascript
editable.addEventListener('beforeinput', (e) => {
  console.log(e.inputType, e.data, e.getTargetRanges?.()?.length);
});
```

## 영향

- **상태 동기화**: 이벤트가 중복·배치되면 React/Vue/Svelte 모델이 이중 적용되거나 일부만 반영될 수 있다.
- **캐럿·선택**: 삽입이 잘못된 문단이나 래퍼 밖으로 간다.
- **접근성**: 음성 제어 사용자는 포커스 예측 가능성이 필요하다. blur 경합이 이를 깨뜨린다.
- **Undo/redo**: 삽입이 쪼개지거나 재생될 때 브라우저 히스토리와 커스텀 히스토리가 어긋난다.

## 브라우저 비교

- **iOS Safari**: 디테이션 특이점은 [scenario-ios-dictation-duplicate-events](scenario-ios-dictation-duplicate-events) 참고. iOS에서는 composition이 자주 없다.
- **Chrome(데스크톱)**: Web Speech API 사용 가능. 동작은 앱 코드와 타이밍에 전적으로 의존한다.
- **Firefox**: 음성 인식·OS 연동이 다르다. 출시 전 반드시 테스트한다.
- **Safari(macOS)**: OS 디테이션이 composition을 내는 경우가 iOS와 다를 수 있다.

## 해결 방법

1. **삽입 직렬화**: transcript 조각을 큐에 넣고 `requestAnimationFrame` 등 한 턴에 모아 적용하며, `document.activeElement`와 저장한 `Range`가 여전히 에디터 루트에 속하는지 검증한다.
2. **마이크 시작 시 Range 스냅샷**: 인식 시작 시 선택이 에디터 안에 있으면 `getSelection().getRangeAt(0)`을 복제해 두고, 결과 시 `editor.contains(range.startContainer)`로 재검증 후 DOM을 변경한다.
3. **멱등 재조정**: 음성 이후 DOM과 모델을 diff해 이벤트 개수에 의존하지 않는다.
4. **음성에 composition 의존 금지**: “composition 없이 큰 동기 삽입”만으로 음성을 구분하려면 일부 IME에서 오탐을 감수해야 한다.

## 모범 사례

- 음성·디테이션을 **지연·선택 민감** 입력으로 취급한다. 인식 시작 시점의 선택이 결과 전달 시점과 같다고 가정하지 않는다.
- **단일 편집 루트**와 `data-editor-root` 등 명시적 포함 검사 후에만 돔을 변경한다.
- **iOS 디테이션**, **데스크톱 OS 디테이션**, **Web Speech API**를 각각 교차 테스트한다. 서로 바꿔 쓸 수 있는 동일 경로가 아니다.

## 관련 케이스

- [ce-0585-chrome-web-speech-api-contenteditable-insertion](ce-0585-chrome-web-speech-api-contenteditable-insertion) – Web Speech API 비동기 결과와 선택·포커스 경합(Chrome 데스크톱, draft)

## 관련 시나리오

- [scenario-ios-dictation-duplicate-events](scenario-ios-dictation-duplicate-events) – iOS 디테이션 후 `beforeinput` / `input` 중복

## 참고

- [MDN: Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [W3C Speech API](https://wicg.github.io/speech-api/)
- [MDN: InputEvent](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent)
