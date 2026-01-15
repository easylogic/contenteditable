---
id: scenario-ios-dictation-duplicate-events
title: iOS 음성 인식이 완료 후 중복 입력 이벤트를 발생시킴
description: "iOS에서 contenteditable 요소에 음성 인식으로 텍스트를 입력할 때, 시스템이 초기 음성 인식 완료 후 beforeinput과 input 이벤트를 중복으로 발생시킬 수 있습니다. 텍스트가 단어로 나뉘어 이벤트가 다시 발생하여 동기화 문제가 발생합니다. 음성 인식 중에는 composition 이벤트가 발생하지 않아 음성 인식과 키보드 입력을 구분하기 어렵습니다."
category: ime
tags:
  - ime
  - dictation
  - voice-input
  - beforeinput
  - input
  - ios
  - safari
  - duplicate-events
  - sync-issue
status: draft
locale: ko
---

iOS에서 내장 음성 인식 기능을 사용하여 `contenteditable` 요소에 텍스트를 입력할 때, 시스템이 초기 음성 인식 완료 후 `beforeinput`과 `input` 이벤트를 중복으로 발생시킬 수 있습니다. 음성 인식된 텍스트가 개별 단어로 분할되어 이벤트가 다시 발생하여, 이벤트 시퀀스와 실제 DOM 상태 간의 동기화 문제가 발생합니다.

## 문제

iOS 음성 인식 사용 시:
1. 사용자가 음성 인식을 활성화하고 텍스트를 말함(예: "만나서 반갑습니다")
2. 초기 `beforeinput`과 `input` 이벤트가 전체 텍스트로 발생
3. 초기 입력 완료 후, 시스템이 텍스트를 단어로 나눠서 이벤트를 다시 발생시킴
4. 예시: "만나서 반갑습니다" → "만나서" + 공백 + "반갑습니다"로 이벤트가 다시 발생
5. 이벤트 시퀀스가 실제 DOM 상태와 동기화되지 않음
6. 이벤트 핸들러가 동일한 입력을 여러 번 처리할 수 있음

## 플랫폼별 동작

### iOS/iPadOS (Safari, Chrome iOS)
- 음성 인식 중 composition 이벤트(`compositionstart`, `compositionupdate`, `compositionend`)가 발생하지 않음
- 음성 인식 중에는 `beforeinput`과 `input` 이벤트만 발생
- 음성 인식 완료 후 텍스트를 단어로 나눠서 이벤트가 다시 발생할 수 있음
- 웹 API를 통해 음성 인식 입력과 키보드 입력을 구분할 신뢰할 수 있는 방법이 없음

### macOS Safari
- 음성 인식 중 composition 이벤트가 발생함
- 표준 IME 입력과 더 일관된 동작
- 완료 후 이벤트가 다시 발생하지 않음

## 관찰된 동작

iOS 음성 인식 사용 시 다음과 같은 이벤트 패턴이 관찰됩니다:

- **초기 입력**: 전체 텍스트가 한 번에 삽입되며 `beforeinput` → `input` 이벤트가 발생
- **중복 이벤트**: 초기 입력 완료 후 텍스트가 단어별로 나뉘어 `beforeinput` → `input` 이벤트가 다시 발생
- **DOM 상태**: 초기 입력에서만 DOM이 실제로 변경되고, 중복 이벤트에서는 DOM이 변경되지 않음
- **Composition 이벤트**: 모든 단계에서 `compositionstart`, `compositionupdate`, `compositionend` 이벤트가 발생하지 않음

자세한 이벤트 발생 순서는 아래 "이벤트 발생 순서" 섹션을 참조하세요.

## 영향

- **중복 처리**: 이벤트 핸들러가 동일한 입력에 대해 여러 번 실행됨
- **상태 동기화 문제**: 애플리케이션 상태가 DOM 상태와 일치하지 않을 수 있음
- **성능 문제**: 중복 이벤트의 불필요한 처리
- **실행 취소/다시 실행 손상**: 실행 취소 스택에 중복되거나 잘못된 항목이 포함될 수 있음
- **검증 문제**: 검증 로직이 동일한 입력에 대해 여러 번 실행될 수 있음
- **포맷팅 문제**: 분할된 텍스트로 인해 포맷팅 로직이 잘못 적용될 수 있음

## 음성 인식과 키보드 입력 구분

**중요**: iOS의 웹 애플리케이션에서 음성 인식 입력을 감지하는 신뢰할 수 있는 방법은 없습니다. 다음 특성은 잠재적 음성 인식 입력을 식별하는 데 도움이 될 수 있지만 확정적이지 않습니다:

### 잠재적 지표 (신뢰할 수 없음)
- composition 이벤트 부재(하지만 iOS의 한국어 IME에서도 발생)
- 여러 단어의 빠른 삽입
- 텍스트가 분할되어 다시 삽입되는 것처럼 보임
- 완전한 단어로 빠르게 연속 발생하는 이벤트

### 제한사항
- `UITextInputContext.isDictationInputExpected`와 같은 네이티브 iOS API는 웹 컨텍스트에서 사용할 수 없음
- 웹 API는 음성 인식 감지 기능을 제공하지 않음
- 패턴 기반 감지는 신뢰할 수 없으며 거짓 양성을 생성할 수 있음

## 브라우저 비교

- **iOS Safari**: 음성 인식 중 composition 이벤트가 발생하지 않음, 완료 후 이벤트가 다시 발생할 수 있음
- **iOS Chrome**: Safari와 동일한 동작(WebKit 엔진 사용)
- **macOS Safari**: 음성 인식 중 composition 이벤트가 발생함, 더 일관된 동작
- **Chrome/Edge/Firefox (데스크톱)**: 음성 인식 동작이 다양하지만 일반적으로 더 일관적

## 이벤트 발생 순서

iOS 음성 인식으로 "만나서 반갑습니다"를 입력할 때 발생하는 이벤트 순서:

### 1단계: 초기 음성 인식 입력

```
사용자: 음성 인식 활성화 → "만나서 반갑습니다" 말함

이벤트 1: beforeinput
  - inputType: 'insertText'
  - data: '만나서 반갑습니다'
  - isComposing: false
  - DOM 상태: (변경 전) ""

이벤트 2: input
  - inputType: 'insertText'
  - data: '만나서 반갑습니다'
  - isComposing: false
  - DOM 상태: (변경 후) "만나서 반갑습니다"
```

### 2단계: 중복 이벤트 발생 (버그)

초기 입력 완료 후 짧은 지연(일반적으로 100-500ms) 후, 텍스트가 단어별로 나뉘어 이벤트가 다시 발생:

```
이벤트 3: beforeinput
  - inputType: 'insertText'
  - data: '만나서'
  - isComposing: false
  - DOM 상태: (변경 전) "만나서 반갑습니다" (이미 존재)

이벤트 4: input
  - inputType: 'insertText'
  - data: '만나서'
  - isComposing: false
  - DOM 상태: (변경 후) "만나서 반갑습니다" (변경 없음)

이벤트 5: beforeinput
  - inputType: 'insertText'
  - data: ' ' (공백)
  - isComposing: false
  - DOM 상태: (변경 전) "만나서 반갑습니다"

이벤트 6: input
  - inputType: 'insertText'
  - data: ' '
  - isComposing: false
  - DOM 상태: (변경 후) "만나서 반갑습니다" (변경 없음)

이벤트 7: beforeinput
  - inputType: 'insertText'
  - data: '반갑습니다'
  - isComposing: false
  - DOM 상태: (변경 전) "만나서 반갑습니다"

이벤트 8: input
  - inputType: 'insertText'
  - data: '반갑습니다'
  - isComposing: false
  - DOM 상태: (변경 후) "만나서 반갑습니다" (변경 없음)
```

### 전체 이벤트 시퀀스 요약

| 순서 | 이벤트 | inputType | data | DOM 변경 여부 |
|------|--------|-----------|------|--------------|
| 1 | beforeinput | insertText | '만나서 반갑습니다' | - |
| 2 | input | insertText | '만나서 반갑습니다' | ✅ 변경됨 |
| 3 | beforeinput | insertText | '만나서' | - |
| 4 | input | insertText | '만나서' | ❌ 변경 없음 |
| 5 | beforeinput | insertText | ' ' | - |
| 6 | input | insertText | ' ' | ❌ 변경 없음 |
| 7 | beforeinput | insertText | '반갑습니다' | - |
| 8 | input | insertText | '반갑습니다' | ❌ 변경 없음 |

### 주요 특징

- **초기 입력**: 이벤트 1-2에서 전체 텍스트가 한 번에 삽입됨 (DOM 실제 변경)
- **중복 이벤트**: 이벤트 3-8에서 텍스트가 단어별로 재발생하지만 DOM은 변경되지 않음
- **Composition 이벤트**: 모든 단계에서 `compositionstart`, `compositionupdate`, `compositionend` 이벤트가 발생하지 않음
- **isComposing**: 모든 이벤트에서 `isComposing: false`
- **이벤트 간 지연**: 초기 입력(이벤트 2)과 중복 이벤트 시작(이벤트 3) 사이에 100-500ms 지연

## 전체 이벤트 모니터링

iOS 음성 인식 입력 시 발생하는 모든 이벤트를 모니터링하는 코드 예시:

```javascript
const element = document.querySelector('[contenteditable]');
const eventLog = [];

// 모든 관련 이벤트 모니터링
const eventsToMonitor = [
  'compositionstart',
  'compositionupdate', 
  'compositionend',
  'beforeinput',
  'input',
  'keydown',
  'keyup',
  'keypress'
];

eventsToMonitor.forEach(eventType => {
  element.addEventListener(eventType, (e) => {
    const eventData = {
      timestamp: Date.now(),
      type: eventType,
      inputType: e.inputType || null,
      data: e.data || null,
      isComposing: e.isComposing || false,
      textContent: element.textContent,
      selectionStart: window.getSelection()?.anchorOffset || null,
      selectionEnd: window.getSelection()?.focusOffset || null
    };
    
    eventLog.push(eventData);
    console.log(`[${eventType}]`, eventData);
  }, { capture: true });
});

// 이벤트 로그 출력
function printEventLog() {
  console.table(eventLog);
  return eventLog;
}
```

### 실제 모니터링 결과 예시

iOS Safari에서 "만나서 반갑습니다"를 음성 인식으로 입력할 때의 실제 이벤트 시퀀스:

```
[beforeinput] {
  timestamp: 1000,
  type: 'beforeinput',
  inputType: 'insertText',
  data: '만나서 반갑습니다',
  isComposing: false,
  textContent: '',
  selectionStart: 0,
  selectionEnd: 0
}

[input] {
  timestamp: 1001,
  type: 'input',
  inputType: 'insertText',
  data: '만나서 반갑습니다',
  isComposing: false,
  textContent: '만나서 반갑습니다',
  selectionStart: 8,
  selectionEnd: 8
}

// 약 200ms 지연 후

[beforeinput] {
  timestamp: 1201,
  type: 'beforeinput',
  inputType: 'insertText',
  data: '만나서',
  isComposing: false,
  textContent: '만나서 반갑습니다',
  selectionStart: 8,
  selectionEnd: 8
}

[input] {
  timestamp: 1202,
  type: 'input',
  inputType: 'insertText',
  data: '만나서',
  isComposing: false,
  textContent: '만나서 반갑습니다',  // 변경 없음
  selectionStart: 8,
  selectionEnd: 8
}

[beforeinput] {
  timestamp: 1203,
  type: 'beforeinput',
  inputType: 'insertText',
  data: ' ',
  isComposing: false,
  textContent: '만나서 반갑습니다',
  selectionStart: 8,
  selectionEnd: 8
}

[input] {
  timestamp: 1204,
  type: 'input',
  inputType: 'insertText',
  data: ' ',
  isComposing: false,
  textContent: '만나서 반갑습니다',  // 변경 없음
  selectionStart: 8,
  selectionEnd: 8
}

[beforeinput] {
  timestamp: 1205,
  type: 'beforeinput',
  inputType: 'insertText',
  data: '반갑습니다',
  isComposing: false,
  textContent: '만나서 반갑습니다',
  selectionStart: 8,
  selectionEnd: 8
}

[input] {
  timestamp: 1206,
  type: 'input',
  inputType: 'insertText',
  data: '반갑습니다',
  isComposing: false,
  textContent: '만나서 반갑습니다',  // 변경 없음
  selectionStart: 8,
  selectionEnd: 8
}
```

### 발생하지 않는 이벤트

다음 이벤트들은 iOS 음성 인식 중에 **발생하지 않습니다**:

- ❌ `compositionstart`
- ❌ `compositionupdate`
- ❌ `compositionend`
- ❌ `keydown` (음성 인식 입력에 대해)
- ❌ `keyup` (음성 인식 입력에 대해)
- ❌ `keypress` (음성 인식 입력에 대해)

### 이벤트 발생 패턴 요약

| 이벤트 타입 | 초기 입력 | 중복 이벤트 | 발생 여부 |
|-----------|----------|------------|----------|
| `beforeinput` | ✅ 1회 | ✅ 3회 | 발생함 |
| `input` | ✅ 1회 | ✅ 3회 | 발생함 |
| `compositionstart` | ❌ | ❌ | 발생하지 않음 |
| `compositionupdate` | ❌ | ❌ | 발생하지 않음 |
| `compositionend` | ❌ | ❌ | 발생하지 않음 |
| `keydown` | ❌ | ❌ | 발생하지 않음 |
| `keyup` | ❌ | ❌ | 발생하지 않음 |
| `keypress` | ❌ | ❌ | 발생하지 않음 |

## 다른 에디터: ProseMirror

ProseMirror가 iOS Safari에서 입력 이벤트를 처리하는 방식:

### iOS Dictation에 대한 특별한 처리 없음

- **ProseMirror는 dictation을 구분하지 않음**: iOS dictation은 composition 이벤트를 발생시키지 않으므로, ProseMirror는 이를 일반 `insertText` 입력으로 처리합니다.
- **동일한 문제 발생**: 이 시나리오에서 관찰한 것처럼, dictation 입력 시 `beforeinput`/`input` 이벤트만 발생하고 composition 이벤트는 발생하지 않습니다.
- **별도 우회 로직 없음**: ProseMirror 코드베이스에는 dictation 입력을 특별히 처리하는 전용 로직이 없습니다.

### IME Composition 처리 개선

ProseMirror는 iOS Safari에서 IME composition 관련 문제를 해결하기 위해 다음과 같은 수정을 적용했습니다:

**문제**: Safari에서 IME composition 중에 selection을 재설정하면 `compositionend` 이벤트가 발생하지 않고, 중복 `compositionstart`/`compositionupdate` 이벤트가 발생하여 문자가 중복 입력되는 문제

**해결 방법**: `prosemirror-view`에서 composition 중에는 selection을 재설정하지 않도록 수정:

```javascript
// ProseMirror의 setSelection 수정 예시
if (!view.composing) {
  view.docView.setSelection(anchor, head, view.root, force);
}
```

이 수정은 composition 중에 selection을 변경하지 않아 IME lifecycle을 유지합니다.

### iOS Safari의 제약사항

- **`isComposing` 상태 동기화 문제**: iOS Safari에서 `isComposing`가 항상 `false`이거나 composition 이벤트가 발생하지 않아, ProseMirror의 `view.composing` 상태가 정확하게 추적되지 않을 수 있습니다.
- **IME 입력 중 포맷팅 문제**: iOS Safari에서 IME composition 중에 포맷팅(예: bold)을 적용하면 `isComposing`가 잘못된 상태로 설정되어 후속 입력이 제대로 표시되지 않을 수 있습니다.

### 관련 이슈 및 토론

- **GitHub Issue #944**: Safari에서 IME 입력 시 중복 문자 문제 ([github.com/ProseMirror/prosemirror/issues/944](https://github.com/ProseMirror/prosemirror/issues/944))
- **ProseMirror Discuss**: iOS Safari에서 `isComposing` 상태 동기화 문제 ([discuss.prosemirror.net](https://discuss.prosemirror.net/t/iscomposing-gets-out-of-sync-on-ios/4067))

### 결론

ProseMirror도 iOS dictation의 제약사항(composition 이벤트 부재, `isComposing` 부정확)을 그대로 겪고 있으며, dictation에 대한 특별한 해결책은 없습니다. 대신 IME composition 관련 문제는 composition 중 selection 재설정을 피하는 방식으로 해결하고 있습니다.

## 추가 고려사항

### 선택/커서 관점

음성 인식 완료 후 커서 위치와 선택 상태에 대한 고려사항:

- **커서 위치**: 음성 인식 후 커서가 예상 위치로 이동하는지, 아니면 중복 이벤트 발생 시 커서가 재설정되는지 확인 필요
- **Selection 상태**: 중복 이벤트 발생 시 `window.getSelection()`이 예상과 다른 상태를 반환할 수 있음

### Undo/Redo 관점

iOS 음성 인식이 undo/redo 스택에 미치는 영향:

- **OS 레벨 동작**: iOS에서 음성 인식은 OS 레벨에서 하나의 undo step으로 묶일 수도 있고, 단어별로 쪼개질 수도 있음
- **에디터의 undo 스택 관리**: 에디터에서 자체 undo 스택을 관리하는 경우, 중복 이벤트를 그대로 기록하면 문제 발생

**문제 시나리오**:
1. 사용자가 "만나서 반갑습니다"를 음성 인식으로 입력
2. 초기 이벤트: undo 스택에 "만나서 반갑습니다" 삽입 기록
3. 중복 이벤트: "만나서" 삽입, 공백 삽입, "반갑습니다" 삽입이 각각 undo 스택에 기록됨
4. 사용자가 undo 실행 시: 4번의 undo가 필요하거나, 중복된 undo 항목이 생성됨

### Voice Control / Dictation 동시 사용

iOS 설정에서 Voice Control과 Dictation을 동시에 활성화한 경우:

- **실제 중복 삽입**: 일부 사용자 보고에 따르면, Voice Control과 Dictation을 동시에 활성화하면 텍스트가 실제로 두 번 삽입될 수 있음
- **이벤트 시퀀스**: Voice Control + Dictation으로 인한 실제 중복 삽입은 DOM이 실제로 변경되므로, 이벤트 발생 순서가 다를 수 있음

**사용자 안내**:
- Voice Control과 Dictation을 동시에 사용하는 경우 문제가 발생할 수 있음을 안내
- iOS 설정에서 하나만 활성화하도록 권장

### 테스트 매트릭스

다양한 환경에서의 재현 여부:

| iOS 버전 | 브라우저 | 언어 | 재현 여부 | 비고 |
|---------|---------|------|----------|------|
| iOS 16.x | Safari | 한국어 | ✅ 확인됨 | 텍스트 단어별 재발생 확인 |
| iOS 16.x | Safari | 영어 | ✅ 확인됨 | 텍스트 단어별 재발생 확인 |
| iOS 16.x | Chrome iOS | 한국어 | ✅ 확인됨 | Safari와 동일 (WebKit 엔진) |
| iOS 17.x | Safari | 한국어 | ✅ 확인됨 | iOS 16과 동일한 동작 |
| iOS 17.x | Safari | 영어 | ✅ 확인됨 | iOS 16과 동일한 동작 |
| iOS 17.x | Chrome iOS | 한국어 | ✅ 확인됨 | Safari와 동일 |
| iOS 18.x | Safari | 한국어 | ⚠️ 미확인 | 테스트 필요 |
| iOS 18.x | Safari | 영어 | ⚠️ 미확인 | 테스트 필요 |

**테스트 방법**:
1. iOS 기기에서 Safari 또는 Chrome iOS 실행
2. `contenteditable` 요소에 포커스
3. 음성 인식 활성화 (스페이스바 길게 누르기 또는 마이크 아이콘)
4. 여러 단어로 구성된 문구 음성 인식 (예: "만나서 반갑습니다")
5. 브라우저 콘솔에서 `beforeinput`과 `input` 이벤트 로그 확인
6. 초기 입력 후 텍스트가 단어별로 재발생하는지 확인

**참고**: 
- 모든 iOS 버전에서 동일한 문제가 발생할 가능성이 높음 (WebKit 엔진 공유)
- 언어에 관계없이 문제가 발생하는 것으로 보임
- macOS Safari에서는 composition 이벤트가 발생하므로 문제가 발생하지 않음

## WebKit 버그 리포트

이 문제는 WebKit 버그 트래커에 공식적으로 보고되어 있습니다:

- **WebKit Bug 261764**: "iOS/iPadOS dictation doesn't trigger composition events"
  - URL: https://bugs.webkit.org/show_bug.cgi?id=261764
  - 상태: 아직 해결되지 않음
  - 설명: iOS/iPadOS에서 dictation 사용 시 `compositionstart`, `compositionupdate`, `compositionend` 이벤트가 발생하지 않음

이 버그 리포트는 iOS dictation이 composition 이벤트를 발생시키지 않는 문제를 문서화하고 있으며, macOS Safari에서는 정상적으로 동작한다는 점을 확인하고 있습니다.

## 다른 에디터 프레임워크

### Slate, Lexical, Quill

다른 주요 에디터 프레임워크들도 iOS dictation의 제약사항을 겪고 있습니다:

- **Slate**: iOS dictation에 대한 특별한 처리가 문서화되어 있지 않음
- **Lexical**: iOS dictation 입력을 식별하지만 Speech Kit의 전사 결과를 표시하지 못하는 문제가 보고됨
- **Quill**: iOS dictation과의 호환성을 개선하기 위한 업데이트가 있지만, 근본적인 문제(composition 이벤트 부재)는 해결되지 않음

### 공통 제약사항

모든 에디터 프레임워크가 공통으로 겪는 문제:

- iOS dictation은 composition 이벤트를 발생시키지 않음
- `isComposing` 플래그가 정확하지 않음
- 웹 API로 dictation 입력을 구분할 수 없음
- 이벤트 시퀀스가 예상과 다를 수 있음

### React Native에서의 유사 문제

React Native 애플리케이션에서도 iOS dictation과 관련된 유사한 문제가 보고되었습니다:

- **단어 간 dictation 세션 종료**: 컴포넌트 재렌더링 중에 dictation 세션이 예기치 않게 종료될 수 있음
- **해결 방법**: dictation 중 재렌더링을 방지하기 위한 디바운싱 메커니즘 구현

이는 웹 애플리케이션에서도 유사한 문제가 발생할 수 있음을 시사합니다.
