---
id: ce-0188
scenarioId: scenario-ime-composition-focus-blur
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: Japanese (IME)
caseTitle: Safari에서 일본어 IME 조합이 포커스 변경 시 손실됨
description: "contenteditable 요소에서 IME로 일본어 텍스트를 조합할 때 다른 곳을 클릭하거나 포커스를 변경하면 불완전한 한자 변환이 손실됩니다. 변환이 완료되기 전에 조합이 취소될 수 있습니다."
tags:
  - composition
  - ime
  - focus
  - blur
  - japanese
  - safari
  - macos
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">かんじ</span>'
    description: "Japanese romaji input in progress (kanji → かんじ), candidate list displayed"
  - label: "After Blur (Bug)"
    html: 'Hello '
    description: "Focus change cancels composition, incomplete kanji conversion lost"
  - label: "✅ Expected"
    html: 'Hello 漢字'
    description: "Expected: Composition preserved or handled gracefully"
---

### 현상

`contenteditable` 요소에서 IME로 일본어 텍스트를 조합할 때 다른 곳을 클릭하거나 포커스를 변경하면 불완전한 한자 변환이 손실됩니다. 변환이 완료되기 전에 조합이 취소될 수 있어 작업이 손실됩니다.

### 재현 예시

1. 편집 가능한 영역에 포커스를 둡니다.
2. 일본어 IME를 활성화합니다.
3. 로마자 텍스트를 입력합니다 (예: "kanji")하고 한자 변환을 시작합니다.
4. 변환을 완료하기 전에 다른 곳을 클릭하거나 포커스를 변경합니다.

### 관찰된 동작

- compositionend 이벤트가 불완전한 데이터로 발생합니다
- 불완전한 한자 변환이 손실됩니다
- blur 이벤트가 compositionend 전 또는 후에 발생할 수 있습니다
- 후보 목록이 선택을 커밋하지 않고 사라집니다

### 예상 동작

- 포커스가 변경될 때 조합이 보존되거나 우아하게 처리되어야 합니다
- 불완전한 변환이 손실되지 않아야 합니다
- 이벤트 순서가 예측 가능하고 일관되어야 합니다

### 브라우저 비교

- **Safari**: 블러 시 조합이 손실될 수 있음, 특히 macOS에서
- **Chrome**: 다른 동작을 가질 수 있음
- **Firefox**: 다른 동작을 가질 수 있음

### 참고 및 해결 방법 가능한 방향

- 조합 손실을 감지하기 위해 blur 및 compositionend 이벤트 모니터링
- 복구를 위해 보류 중인 변환 상태 저장 고려
- 가능한 경우 활성 변환 중 프로그래밍 방식 블러 방지
