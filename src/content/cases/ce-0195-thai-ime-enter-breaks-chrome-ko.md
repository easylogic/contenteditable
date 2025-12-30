---
id: ce-0195
scenarioId: scenario-ime-enter-breaks
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Thai (IME)
caseTitle: 태국어 IME 조합이 Enter 키를 누르면 취소됨
description: "contenteditable 요소에서 IME로 태국어 텍스트를 조합할 때 Enter를 누르면 조합이 취소되고 조합 중이던 성조 표시나 모음 표시가 손실될 수 있습니다. 캐럿이 다음 줄로 이동하지만 마지막 조합 문자가 손실될 수 있습니다."
tags:
  - composition
  - ime
  - enter
  - thai
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">สวัส</span>'
    description: "Thai composition in progress (สวัส), includes tone marks and vowel marks"
  - label: "After Enter (Bug)"
    html: 'Hello สวั<br>'
    description: "Enter key cancels composition, tone marks/vowel marks lost"
  - label: "✅ Expected"
    html: 'Hello สวัสดี<br>'
    description: "Expected: Line break after composition completes, all combining characters preserved"
---

### 현상

`contenteditable` 요소에서 IME로 태국어 텍스트를 조합할 때 Enter를 누르면 조합이 취소되고 조합 중이던 성조 표시나 모음 표시가 손실될 수 있습니다. 캐럿이 다음 줄로 이동하지만 마지막 조합 문자 또는 결합 표시가 손실될 수 있습니다.

### 재현 예시

1. 편집 가능한 영역에 포커스를 둡니다.
2. 태국어 IME를 활성화합니다.
3. 성조 표시와 모음 표시가 있는 태국어 텍스트를 입력합니다 (예: "สวัสดี").
4. 조합 중 새 줄을 삽입하기 위해 Enter를 누릅니다.

### 관찰된 동작

- compositionend 이벤트가 불완전한 데이터로 발생합니다
- 캐럿이 다음 줄로 이동합니다
- 성조 표시나 모음 표시가 손실될 수 있습니다
- 결합 문자가 올바르게 커밋되지 않을 수 있습니다

### 예상 동작

- IME가 줄바꿈을 삽입하기 전에 현재 조합을 완료해야 합니다
- 모든 결합 문자(성조 표시, 모음 표시)가 보존되어야 합니다
- 마지막 조합 문자가 DOM 텍스트 콘텐츠에 남아 있어야 합니다

### 브라우저 비교

- **Chrome**: Enter를 누르면 조합이 취소될 수 있음
- **Edge**: Chrome과 유사함
- **Firefox**: 다른 동작을 가질 수 있음
- **Safari**: Windows에서 적용되지 않음

### 참고 및 해결 방법 가능한 방향

- `beforeinput`, `compositionend`, `input` 이벤트의 순서를 관찰합니다
- 결합 문자가 올바르게 보존되는지 확인합니다
- 가능한 해결 방법은 `keydown`에서 Enter를 가로채고 조합이 완료될 때까지 기본 동작을 방지하는 것입니다
