---
id: ce-0096
scenarioId: scenario-ime-composition-duplicate-events
locale: ko
os: iOS
osVersion: "17.0"
device: iPhone or iPad
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: Korean (IME)
caseTitle: iOS Safari에서 IME 컴포지션이 deleteContentBackward와 insertText 이벤트를 순차적으로 트리거함
description: "iOS Safari에서 한국어 IME 컴포지션 중 각 컴포지션 업데이트가 deleteContentBackward 이벤트와 그 다음 insertText 이벤트(insertCompositionText가 아님)를 모두 발생시킵니다. 이 순차적 발생 패턴은 insertCompositionText만 발생하는 다른 브라우저와 다르며, 단일 컴포지션 업데이트에 대해 이벤트 핸들러가 두 번 실행되게 할 수 있습니다."
tags:
  - composition
  - ime
  - beforeinput
  - ios
  - safari
  - duplicate-events
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한</span>'
    description: "Korean composition in progress"
  - label: "After composition update (Bug)"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한글</span>'
    description: "deleteContentBackward + insertText events occur sequentially (double processing)"
  - label: "✅ Expected"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한글</span>'
    description: "Expected: Only insertCompositionText event occurs (single processing)"
---

## 현상

iOS Safari에서 한국어 IME 컴포지션 중 각 컴포지션 업데이트가 `deleteContentBackward` 이벤트와 그 다음 `insertText` 이벤트(insertCompositionText가 아님)를 모두 발생시킵니다. 이 순차적 발생 패턴은 컴포지션 업데이트 중 insertCompositionText만 발생하는 다른 브라우저와 다르며, 단일 컴포지션 업데이트에 대해 이벤트 핸들러가 두 번 실행되게 할 수 있습니다.

## 재현 예시

1. iOS Safari에서 `contenteditable` 요소에 포커스합니다.
2. 한국어 IME를 활성화합니다.
3. 단어 컴포지션을 시작합니다 (예: "ㅎ" 그 다음 "ㅏ" 그 다음 "ㄴ"을 입력하여 "한"을 컴포지션).
4. 브라우저 콘솔이나 이벤트 로그에서 `beforeinput` 이벤트를 관찰합니다.

## 관찰된 동작

한국어 텍스트를 컴포지션할 때 (예: "한글" 입력):
1. 사용자가 컴포지션을 업데이트하는 문자를 입력합니다
2. `beforeinput` 이벤트가 `inputType: 'deleteContentBackward'`로 발생하여 이전 컴포지션 텍스트를 제거합니다
3. `beforeinput` 이벤트가 다시 `inputType: 'insertText'`(insertCompositionText가 아님)로 발생하여 새로운 컴포지션 텍스트를 삽입합니다
4. 두 이벤트 모두 `e.isComposing === true`입니다
5. `deleteContentBackward`와 `insertText`를 모두 처리하는 이벤트 핸들러가 각 컴포지션 업데이트에 대해 두 번 실행됩니다
6. 컴포지션 중 `insertText`(insertCompositionText가 아님)가 발생한다는 사실은 `insertCompositionText`를 기대하는 핸들러가 이러한 이벤트를 놓치게 할 수 있습니다

## 예상 동작

- 컴포지션 업데이트 중 insertCompositionText만 발생해야 합니다 (Chrome/Edge처럼)
- 두 이벤트가 모두 발생하면 단일 원자 작업으로 처리되어야 합니다
- 이벤트 핸들러가 컴포지션 업데이트를 중복 제거하기 위한 특별한 로직이 필요하지 않아야 합니다
- 활성 컴포지션 중 insertText가 발생하지 않아야 합니다 (insertCompositionText만 발생해야 함)

## 영향

이로 인해 다음이 발생할 수 있습니다:
- 성능 문제 (이중 처리)
- 잘못된 실행 취소/다시 실행 스택 관리
- 중복 검증 또는 서식 지정 로직 실행
- 상태 동기화 문제

## 브라우저 비교

- **iOS Safari**: 컴포지션 업데이트 중 deleteContentBackward 다음에 insertText(insertCompositionText가 아님) 발생
- **Chrome/Edge**: 컴포지션 업데이트 중 insertCompositionText만 발생
- **Firefox**: 동작이 다양하지만 일반적으로 Chrome과 더 일관됨 (insertCompositionText 발생)

## 참고 및 해결 방법 가능한 방향

- 이벤트가 컴포지션 시퀀스의 일부인지 확인 (`e.isComposing === true`)
- 컴포지션 중 deleteContentBackward 이벤트가 즉시 insertText 뒤에 올 때 처리하지 않기
- iOS Safari에서 컴포지션 중 insertText 이벤트 처리 (insertCompositionText뿐만 아니라)
- 컴포지션 중 deleteContentBackward 이벤트가 즉시 insertText 이벤트 뒤에 왔는지 추적하는 플래그 사용
- deleteContentBackward + insertText 쌍을 단일 컴포지션 업데이트 작업으로 처리
