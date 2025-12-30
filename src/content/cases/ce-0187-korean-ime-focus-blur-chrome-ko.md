---
id: ce-0187
scenarioId: scenario-ime-composition-focus-blur
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Korean (IME)
caseTitle: Chrome에서 한글 IME 조합이 포커스 변경 시 손실됨
description: "contenteditable 요소에서 IME로 한글 텍스트를 조합할 때 다른 곳을 클릭하거나 프로그래밍 방식으로 포커스를 변경하면 조합이 취소되고 조합된 텍스트가 손실됩니다. 이것은 조합이 보존될 수 있는 네이티브 입력 필드와 다릅니다."
tags:
  - composition
  - ime
  - focus
  - blur
  - korean
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한</span>'
    description: "Korean composition in progress"
  - label: "After Blur (Bug)"
    html: 'Hello '
    description: "Focus change cancels composition, text lost"
  - label: "✅ Expected"
    html: 'Hello 한'
    description: "Expected: Composition preserved or handled gracefully"
---

## 현상

`contenteditable` 요소에서 IME로 한글 텍스트를 조합할 때 다른 곳을 클릭하거나 프로그래밍 방식으로 포커스를 변경하면 조합이 취소되고 조합된 텍스트가 손실됩니다. 이것은 조합이 보존되거나 더 우아하게 처리될 수 있는 네이티브 입력 필드와 다릅니다.

## 재현 예시

1. 편집 가능한 영역에 포커스를 둡니다.
2. 한글 IME를 활성화합니다.
3. 한글 텍스트 조합을 시작합니다 (예: "한" 입력).
4. 조합을 완료하기 전에 다른 곳을 클릭하거나 프로그래밍 방식으로 요소를 블러 처리합니다.

## 관찰된 동작

- compositionend 이벤트가 불완전한 데이터로 발생합니다
- 조합된 텍스트가 손실됩니다
- blur 이벤트가 compositionend 전 또는 후에 발생할 수 있습니다
- 손실된 조합에 대한 복구 메커니즘이 없습니다

## 예상 동작

- 포커스가 변경될 때 조합이 보존되거나 우아하게 처리되어야 합니다
- 조합된 텍스트가 손실되지 않아야 합니다
- 이벤트 순서가 예측 가능하고 일관되어야 합니다

## 브라우저 비교

- **Chrome**: 블러 시 조합이 손실될 수 있음
- **Edge**: Chrome과 유사함
- **Firefox**: 다른 동작을 가질 수 있음
- **Safari**: Windows에서 적용되지 않음

## 참고 및 해결 방법 가능한 방향

- 조합 손실을 감지하기 위해 blur 및 compositionend 이벤트 모니터링
- 복구를 위해 보류 중인 조합 텍스트 저장 고려
- 가능한 경우 활성 조합 중 프로그래밍 방식 블러 방지
