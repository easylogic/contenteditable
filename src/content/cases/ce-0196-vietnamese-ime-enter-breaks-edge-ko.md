---
id: ce-0196
scenarioId: scenario-ime-enter-breaks
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: Vietnamese (IME)
caseTitle: 베트남어 IME 조합이 Enter 키를 누르면 취소됨
description: "contenteditable 요소에서 IME로 베트남어 텍스트를 조합할 때 Enter를 누르면 조합이 취소되고 조합 중이던 분음 기호 표시(악센트)가 손실될 수 있습니다. 캐럿이 다음 줄로 이동하지만 마지막 조합 문자가 손실될 수 있습니다."
tags:
  - composition
  - ime
  - enter
  - vietnamese
  - edge
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">xin chao</span>'
    description: "Vietnamese input in progress (xin chao), accent marks composing"
  - label: "After Enter (Bug)"
    html: 'Hello xin chao<br>'
    description: "Enter key cancels composition, accent marks lost"
  - label: "✅ Expected"
    html: 'Hello xin chào<br>'
    description: "Expected: Line break after composition completes, all accent marks preserved"
---

## 현상

`contenteditable` 요소에서 IME로 베트남어 텍스트를 조합할 때 Enter를 누르면 조합이 취소되고 조합 중이던 분음 기호 표시(악센트)가 손실될 수 있습니다. 캐럿이 다음 줄로 이동하지만 마지막 조합 문자 또는 분음 기호가 손실될 수 있습니다.

## 재현 예시

1. 편집 가능한 영역에 포커스를 둡니다.
2. 베트남어 IME를 활성화합니다 (Telex 또는 VNI 입력 방법).
3. 분음 기호가 있는 베트남어 텍스트를 입력합니다 (예: "xin chào").
4. 조합 중 새 줄을 삽입하기 위해 Enter를 누릅니다.

## 관찰된 동작

- compositionend 이벤트가 불완전한 데이터로 발생합니다
- 캐럿이 다음 줄로 이동합니다
- 분음 기호 표시가 손실될 수 있습니다
- 기본 문자와 분음 기호가 올바르게 결합되지 않을 수 있습니다

## 예상 동작

- IME가 줄바꿈을 삽입하기 전에 현재 조합을 완료해야 합니다
- 모든 분음 기호 표시가 보존되어야 합니다
- 마지막 조합 문자가 DOM 텍스트 콘텐츠에 남아 있어야 합니다

## 브라우저 비교

- **Edge**: Enter를 누르면 조합이 취소될 수 있음
- **Chrome**: Edge와 유사함
- **Firefox**: 다른 동작을 가질 수 있음
- **Safari**: Windows에서 적용되지 않음

## 참고 및 해결 방법 가능한 방향

- `beforeinput`, `compositionend`, `input` 이벤트의 순서를 관찰합니다
- 분음 기호가 올바르게 보존되는지 확인합니다
- 가능한 해결 방법은 `keydown`에서 Enter를 가로채고 조합이 완료될 때까지 기본 동작을 방지하는 것입니다
