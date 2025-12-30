---
id: ce-0203
scenarioId: scenario-ime-composition-escape-key
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: Arabic (IME)
caseTitle: Firefox에서 아랍어 IME 조합이 Escape 키로 취소됨
description: "contenteditable 요소에서 IME로 아랍어 텍스트를 조합할 때 Escape를 누르면 조합이 취소되고 문자 결합을 포함한 조합된 텍스트가 손실됩니다. 이것은 취소 또는 대화상자 닫기에 Escape를 사용하는 UI 상호작용과 간섭할 수 있습니다."
tags:
  - composition
  - ime
  - escape
  - arabic
  - firefox
  - windows
status: draft
domSteps:
  - label: "Before"
    html: '<span dir="rtl">Hello <span style="text-decoration: underline; background: #fef08a;">مرح</span></span>'
    description: "Arabic composition in progress (مرح), RTL direction, characters joining"
  - label: "After Escape (Bug)"
    html: '<span dir="rtl">Hello </span>'
    description: "Escape key cancels composition, composition text including character joining lost"
  - label: "✅ Expected"
    html: '<span dir="rtl">Hello مرحبا</span>'
    description: "Expected: Composition handled gracefully or preserved"
---

### 현상

`contenteditable` 요소에서 IME로 아랍어 텍스트를 조합할 때 Escape를 누르면 조합이 취소되고 문자 결합을 포함한 조합된 텍스트가 손실됩니다. 이것은 취소 또는 대화상자 닫기에 Escape를 사용하는 UI 상호작용과 간섭할 수 있습니다.

### 재현 예시

1. 편집 가능한 영역에 포커스를 둡니다 (예: 모달 대화상자나 드롭다운에서).
2. 아랍어 IME를 활성화합니다.
3. 문자 결합이 있는 아랍어 텍스트 조합을 시작합니다 (예: "مرحبا").
4. 대화상자를 닫거나 작업을 취소하기 위해 Escape를 누릅니다.

### 관찰된 동작

- compositionend 이벤트가 불완전한 데이터로 발생합니다
- 문자 결합을 포함한 조합된 텍스트가 손실됩니다
- Escape가 조합 취소와 기타 UI 작업을 모두 트리거할 수 있습니다
- 손실된 조합에 대한 복구 메커니즘이 없습니다

### 예상 동작

- Escape를 누를 때 조합이 우아하게 처리되어야 합니다
- 문자 결합을 포함한 조합된 텍스트가 손실되지 않아야 합니다
- Escape 키 동작이 일관되고 예측 가능해야 합니다

### 브라우저 비교

- **Firefox**: Escape가 조합을 취소할 수 있음
- **Chrome**: 조합 중 다른 Escape 키 동작을 가질 수 있음
- **Edge**: Chrome과 유사함
- **Safari**: Windows에서 적용되지 않음

### 참고 및 해결 방법 가능한 방향

- 조합 보존이 중요한 경우 활성 조합 중 Escape 방지
- Escape를 허용하기 전에 조합 커밋 고려
- 특히 모달 컨텍스트와 RTL 텍스트에서 조합 중 Escape 키 이벤트를 주의 깊게 처리
