---
id: ce-0197-arabic-ime-space-ignored-chrome-ko
scenarioId: scenario-space-during-composition
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Arabic (IME)
caseTitle: 아랍어 IME 조합 중 Space 키가 무시됨
description: "contenteditable 요소에서 IME로 아랍어 텍스트를 조합하는 동안 Space 키를 누르면 무시되거나 조합이 예상치 못하게 커밋될 수 있습니다. 이 동작은 네이티브 텍스트 컨트롤과 다르며 RTL 텍스트에서 단어 경계 감지에 영향을 줄 수 있습니다."
tags:
  - composition
  - ime
  - space
  - arabic
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: '<span dir="rtl">Hello <span style="text-decoration: underline; background: #fef08a;">مرح</span></span>'
    description: "Arabic composition in progress (مرح), RTL direction, characters joining"
  - label: "After Space (Bug)"
    html: '<span dir="rtl">Hello مرح</span>'
    description: "Space key ignored or composition unexpectedly committed"
  - label: "✅ Expected"
    html: '<span dir="rtl">Hello مرح </span>'
    description: "Expected: Space key inserts space or commits composition"
---

## 현상

`contenteditable` 요소에서 IME로 아랍어 텍스트를 조합하는 동안 Space 키를 누르면 무시되거나 조합이 예상치 못하게 커밋될 수 있습니다. 이 동작은 네이티브 텍스트 컨트롤과 다르며 RTL 텍스트에서 단어 경계 감지에 영향을 줄 수 있습니다.

## 재현 예시

1. 편집 가능한 영역에 포커스를 둡니다.
2. 아랍어 IME를 활성화합니다.
3. 문자 결합이 있는 아랍어 텍스트 조합을 시작합니다 (예: "مرحبا").
4. 조합 중에 Space를 한 번 이상 누릅니다.

## 관찰된 동작

- Space 키가 때때로 보이는 공백을 삽입하지 않습니다
- 일부 시퀀스에서 조합이 커밋되고 공백이 삽입되지만 이벤트 순서가 네이티브 컨트롤과 다릅니다
- 문자 결합이 Space 키 입력에 영향을 받을 수 있습니다
- RTL 컨텍스트에서 단어 경계가 올바르게 감지되지 않을 수 있습니다

## 예상 동작

- Space가 `contenteditable`과 네이티브 텍스트 입력 간에 일관되게 동작해야 합니다
- Space가 조합 중 또는 후에 안정적으로 삽입되어야 합니다
- RTL 텍스트에서 단어 경계가 올바르게 감지되어야 합니다

## 브라우저 비교

- **Chrome**: 아랍어 조합 중 Space가 무시될 수 있음
- **Edge**: Chrome과 유사함
- **Firefox**: 다른 동작을 가질 수 있음
- **Safari**: Windows에서 적용되지 않음

## 참고 및 해결 방법 가능한 방향

- Space 키를 적절하게 처리하기 위해 조합 상태 모니터링
- 단어 경계를 처리할 때 RTL 텍스트 방향 고려
- 문자 결합이 있는 활성 조합 중 Space 키 이벤트를 주의 깊게 처리
