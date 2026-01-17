---
id: ce-0294-ios-dictation-duplicate-events-safari-ko
scenarioId: scenario-ios-dictation-duplicate-events
locale: ko
os: iOS
osVersion: "17.0+"
device: iPhone 또는 iPad
deviceVersion: 모든 기기
browser: Safari
browserVersion: "17.0+"
keyboard: 음성 인식
caseTitle: iOS 음성 인식이 텍스트를 단어로 나눠서 입력 이벤트를 재발생시킴
description: "iOS Safari에서 contenteditable 요소에 음성 인식으로 텍스트를 입력할 때, 시스템이 처음에는 전체 텍스트로 beforeinput과 input 이벤트를 발생시키고, 이후에 텍스트를 개별 단어로 나눠서 이벤트를 다시 발생시킵니다. 이로 인해 이벤트 핸들러가 여러 번 실행되고 이벤트 시퀀스와 DOM 상태 간의 동기화 문제가 발생합니다."
tags:
  - dictation
  - voice-input
  - beforeinput
  - input
  - ios
  - safari
  - duplicate-events
  - sync-issue
status: draft
domSteps:
  - label: "초기 음성 인식"
    html: '만나서 반갑습니다'
    description: "사용자가 '만나서 반갑습니다'를 음성 인식으로 입력 - 초기 이벤트가 전체 텍스트로 발생"
  - label: "중복 이벤트 후 (버그)"
    html: '만나서 반갑습니다'
    description: "동일한 텍스트이지만 이벤트가 '만나서' + 공백 + '반갑습니다'로 다시 발생"
  - label: "✅ 예상 동작"
    html: '만나서 반갑습니다'
    description: "예상: 전체 텍스트로 이벤트가 한 번만 발생하고, 재발생하지 않음"
---

## 현상

iOS Safari에서 `contenteditable` 요소에 음성 인식으로 텍스트를 입력할 때, 시스템이 처음에는 전체 음성 인식 텍스트로 `beforeinput`과 `input` 이벤트를 발생시킵니다. 초기 입력이 완료된 후, 시스템이 텍스트를 개별 단어로 나눠서 `beforeinput`과 `input` 이벤트를 다시 발생시켜, 동일한 입력에 대해 이벤트 핸들러가 여러 번 실행됩니다.

## 재현 예시

1. iOS Safari(iPhone 또는 iPad)에서 `contenteditable` 요소가 있는 웹 페이지를 엽니다.
2. `contenteditable` 요소에 포커스를 둡니다.
3. 음성 인식을 활성화합니다(스페이스바 길게 누르기 또는 키보드의 마이크 아이콘 탭).
4. 텍스트를 음성 인식으로 입력: "만나서 반갑습니다" (또는 여러 단어로 구성된 문구).
5. 브라우저 콘솔이나 이벤트 로그에서 `beforeinput`과 `input` 이벤트를 관찰합니다.

## 관찰된 동작

### 초기 음성 인식 시퀀스
1. 사용자가 음성 인식을 활성화하고 "만나서 반갑습니다"라고 말함
2. `beforeinput` 이벤트가 다음으로 발생:
   - `inputType: 'insertText'`
   - `data: '만나서 반갑습니다'`
   - `isComposing: false`
3. `input` 이벤트가 발생하고 전체 텍스트 "만나서 반갑습니다"가 DOM에 삽입됨

### 중복 이벤트 시퀀스 (버그)
4. 짧은 지연 후(일반적으로 100-500ms), `beforeinput` 이벤트가 다시 발생:
   - `inputType: 'insertText'`
   - `data: '만나서'`
   - `isComposing: false`
5. `input` 이벤트가 발생하고 "만나서"가 삽입됨
6. `beforeinput` 이벤트가 다시 발생:
   - `inputType: 'insertText'`
   - `data: ' '` (공백 문자)
   - `isComposing: false`
7. `input` 이벤트가 발생하고 공백이 삽입됨
8. `beforeinput` 이벤트가 다시 발생:
   - `inputType: 'insertText'`
   - `data: '반갑습니다'`
   - `isComposing: false`
9. `input` 이벤트가 발생하고 "반갑습니다"가 삽입됨

### 주요 특징
- 음성 인식 중에 composition 이벤트(`compositionstart`, `compositionupdate`, `compositionend`)가 발생하지 않음
- 모든 이벤트에서 `isComposing`가 항상 `false`
- 초기 입력 완료 후 이벤트가 다시 발생함
- 텍스트가 단어 경계(공백)에서 분할됨
- 중복 이벤트 후 DOM 상태는 초기 이벤트 후와 동일함(실제 변경 없음)
- 이벤트 시퀀스가 DOM 상태와 동기화되지 않음

## 예상 동작

- 초기 `beforeinput`과 `input` 이벤트가 전체 음성 인식 텍스트로 한 번만 발생해야 함
- 완료 후 이벤트가 다시 발생하지 않아야 함
- 이벤트가 다시 발생하는 경우, 실제 DOM 변경을 반영해야 함(중복 삽입이 아님)
- 이벤트 시퀀스가 DOM 상태와 동기화를 유지해야 함
- 음성 인식 중에 composition 이벤트가 발생해야 함(macOS Safari에서와 같이)

## 영향

다음과 같은 문제가 발생할 수 있습니다:
- **중복 처리**: 동일한 입력에 대해 이벤트 핸들러가 여러 번 실행됨
- **상태 동기화 문제**: 애플리케이션 상태가 DOM 상태와 일치하지 않을 수 있음
- **성능 문제**: 중복 이벤트의 불필요한 처리
- **실행 취소/다시 실행 스택 손상**: 실행 취소 스택에 중복되거나 잘못된 항목이 포함될 수 있음
- **검증 문제**: 검증 로직이 동일한 입력에 대해 여러 번 실행될 수 있음
- **포맷팅 문제**: 분할된 텍스트로 인해 포맷팅 로직이 잘못 적용될 수 있음
- **이벤트 시퀀스 혼란**: 단일 입력 이벤트를 기대하는 핸들러가 여러 이벤트를 받음

## 브라우저 비교

- **iOS Safari**: 음성 인식 중 composition 이벤트가 발생하지 않음, 완료 후 텍스트를 단어로 나눠서 이벤트가 다시 발생함
- **iOS Chrome**: Safari와 동일한 동작(Apple이 요구하는 WebKit 엔진 사용)
- **macOS Safari**: 음성 인식 중 composition 이벤트가 발생함, 완료 후 이벤트가 다시 발생하지 않음
- **Chrome/Edge/Firefox (데스크톱)**: 음성 인식 동작이 다양하지만 일반적으로 더 일관적이며, 중복 재발생 없음

## 음성 인식 입력 구분

**중요**: iOS의 웹 애플리케이션에서 음성 인식 입력을 감지하는 신뢰할 수 있는 방법은 없습니다. 웹 API는 음성 인식 감지 기능을 제공하지 않으며, `UITextInputContext.isDictationInputExpected`와 같은 네이티브 iOS API는 웹 컨텍스트에서 사용할 수 없습니다.

### 잠재적 지표 (신뢰할 수 없음)
- composition 이벤트 부재(iOS의 한국어 IME에서도 발생)
- 여러 단어의 빠른 삽입
- 텍스트가 분할되어 다시 삽입되는 것처럼 보임
- 완전한 단어로 빠르게 연속 발생하는 이벤트
- `isComposing`가 항상 `false`(iOS의 한국어 IME에서도 마찬가지)

이러한 지표는 확정적이지 않으며 거짓 양성을 생성할 수 있습니다.

## 이벤트 발생 순서

"만나서 반갑습니다"를 음성 인식으로 입력할 때 발생하는 이벤트 순서:

### 1단계: 초기 음성 인식 입력

| 순서 | 이벤트 | inputType | data | DOM 상태 (변경 전) | DOM 상태 (변경 후) |
|------|--------|-----------|------|-------------------|-------------------|
| 1 | beforeinput | insertText | '만나서 반갑습니다' | "" | - |
| 2 | input | insertText | '만나서 반갑습니다' | "" | "만나서 반갑습니다" ✅ |

### 2단계: 중복 이벤트 발생 (버그)

초기 입력 완료 후 약 100-500ms 지연 후, 텍스트가 단어별로 나뉘어 이벤트가 다시 발생:

| 순서 | 이벤트 | inputType | data | DOM 상태 (변경 전) | DOM 상태 (변경 후) |
|------|--------|-----------|------|-------------------|-------------------|
| 3 | beforeinput | insertText | '만나서' | "만나서 반갑습니다" | - |
| 4 | input | insertText | '만나서' | "만나서 반갑습니다" | "만나서 반갑습니다" ❌ |
| 5 | beforeinput | insertText | ' ' | "만나서 반갑습니다" | - |
| 6 | input | insertText | ' ' | "만나서 반갑습니다" | "만나서 반갑습니다" ❌ |
| 7 | beforeinput | insertText | '반갑습니다' | "만나서 반갑습니다" | - |
| 8 | input | insertText | '반갑습니다' | "만나서 반갑습니다" | "만나서 반갑습니다" ❌ |

### 주요 특징

- **이벤트 1-2**: 전체 텍스트가 한 번에 삽입됨 (DOM 실제 변경)
- **이벤트 3-8**: 텍스트가 단어별로 재발생하지만 DOM은 변경되지 않음
- **Composition 이벤트**: 모든 단계에서 `compositionstart`, `compositionupdate`, `compositionend` 이벤트가 발생하지 않음
- **isComposing**: 모든 이벤트에서 `isComposing: false`
- **이벤트 간 지연**: 이벤트 2와 이벤트 3 사이에 100-500ms 지연

## 전체 이벤트 모니터링

iOS 음성 인식 입력 시 발생하는 모든 이벤트를 모니터링하는 코드:

```javascript
const element = document.querySelector('[contenteditable]');
const eventLog = [];

const eventsToMonitor = [
  'compositionstart', 'compositionupdate', 'compositionend',
  'beforeinput', 'input',
  'keydown', 'keyup', 'keypress'
];

eventsToMonitor.forEach(eventType => {
  element.addEventListener(eventType, (e) => {
    const eventData = {
      timestamp: Date.now(),
      type: eventType,
      inputType: e.inputType || null,
      data: e.data || null,
      isComposing: e.isComposing || false,
      textContent: element.textContent
    };
    eventLog.push(eventData);
    console.log(`[${eventType}]`, eventData);
  }, { capture: true });
});
```

### 발생하는 이벤트 vs 발생하지 않는 이벤트

| 이벤트 타입 | 발생 여부 | 초기 입력 | 중복 이벤트 |
|-----------|----------|----------|------------|
| `beforeinput` | ✅ 발생 | 1회 | 3회 |
| `input` | ✅ 발생 | 1회 | 3회 |
| `compositionstart` | ❌ 발생 안 함 | - | - |
| `compositionupdate` | ❌ 발생 안 함 | - | - |
| `compositionend` | ❌ 발생 안 함 | - | - |
| `keydown` | ❌ 발생 안 함 | - | - |
| `keyup` | ❌ 발생 안 함 | - | - |
| `keypress` | ❌ 발생 안 함 | - | - |

## 참고사항 및 가능한 해결 방향

### 이벤트 처리 고려사항
- 이벤트 핸들러가 동일한 입력에 대해 여러 번 실행될 수 있음
- 실제 DOM 변경이 없는 이벤트(이벤트 4, 6, 8)는 처리하지 않아야 함
- `textContent`를 확인하여 실제 DOM 변경 여부를 판단할 수 있음

### Undo/Redo 스택
- 중복 이벤트를 undo 스택에 기록하면 undo 항목이 중복 생성됨
- 실제 DOM 변경이 있는 경우에만 undo 스택에 기록해야 함

### Voice Control 동시 사용
- iOS 설정에서 Voice Control과 Dictation을 동시에 활성화하면 텍스트가 실제로 두 번 삽입될 수 있음
- 이 경우는 DOM이 실제로 변경되므로 `textContent` 기반 중복 제거로는 감지하지 못함
- 사용자에게 하나만 활성화하도록 안내 권장

## 테스트 환경

| iOS 버전 | 브라우저 | 언어 | 재현 여부 |
|---------|---------|------|----------|
| iOS 16.x | Safari | 한국어 | ✅ 확인됨 |
| iOS 16.x | Safari | 영어 | ✅ 확인됨 |
| iOS 16.x | Chrome iOS | 한국어 | ✅ 확인됨 |
| iOS 17.x | Safari | 한국어 | ✅ 확인됨 |
| iOS 17.x | Safari | 영어 | ✅ 확인됨 |
| iOS 17.x | Chrome iOS | 한국어 | ✅ 확인됨 |
| iOS 18.x | Safari | 한국어 | ⚠️ 미확인 |
| iOS 18.x | Safari | 영어 | ⚠️ 미확인 |

**참고**: 모든 iOS 버전에서 동일한 문제가 발생할 가능성이 높음 (WebKit 엔진 공유). 언어에 관계없이 문제가 발생하는 것으로 보임.
