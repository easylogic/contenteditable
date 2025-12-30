---
id: ce-0207
scenarioId: scenario-ime-rtl-and-character-joining
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: Hebrew (IME)
caseTitle: 히브리어 IME RTL 텍스트 방향 및 문자 조합 문제
description: "contenteditable 요소에서 IME로 히브리어 텍스트를 조합할 때 RTL 텍스트 방향이 올바르게 처리되지 않을 수 있으며 히브리어 문자가 올바르게 조합되지 않을 수 있습니다. 문자 결합과 텍스트 방향이 문제가 될 수 있습니다."
tags:
  - ime
  - composition
  - rtl
  - text-direction
  - hebrew
  - firefox
  - windows
status: draft
domSteps:
  - label: "Before"
    html: '<span dir="rtl">Hello <span style="text-decoration: underline; background: #fef08a;">של</span></span>'
    description: "Hebrew composition in progress (שלום), RTL direction"
  - label: "After (Bug)"
    html: '<span dir="rtl">Hello של</span>'
    description: "RTL direction error or character composition failed"
  - label: "✅ Expected"
    html: '<span dir="rtl">Hello שלום</span>'
    description: "Expected: RTL direction and character composition work correctly"
---

### 현상

`contenteditable` 요소에서 IME로 히브리어 텍스트를 조합할 때 RTL 텍스트 방향이 올바르게 처리되지 않을 수 있으며 히브리어 문자가 올바르게 조합되지 않을 수 있습니다. 문자 결합과 텍스트 방향이 문제가 될 수 있습니다.

### 재현 예시

1. 편집 가능한 영역에 포커스를 둡니다.
2. 방향을 RTL로 설정하거나 자동 방향을 사용합니다.
3. 히브리어 IME를 활성화합니다.
4. 히브리어 텍스트를 입력합니다 (예: "שלום").
5. RTL 방향과 문자 조합을 관찰합니다.

### 관찰된 동작

- RTL 텍스트 방향이 올바르게 처리되지 않을 수 있습니다
- 히브리어 문자가 올바르게 조합되지 않을 수 있습니다
- 텍스트가 오른쪽에서 왼쪽 대신 왼쪽에서 오른쪽으로 표시될 수 있습니다
- RTL 컨텍스트에서 캐럿이 잘못 이동할 수 있습니다

### 예상 동작

- RTL 텍스트 방향이 올바르게 처리되어야 합니다
- 히브리어 문자가 올바르게 조합되어야 합니다
- 텍스트가 오른쪽에서 왼쪽으로 올바르게 표시되어야 합니다
- RTL 컨텍스트에서 캐럿이 올바르게 이동해야 합니다

### 브라우저 비교

- **Firefox**: 히브리어 RTL과 조합에 문제가 있을 수 있음
- **Chrome**: 일반적으로 더 나은 RTL 지원
- **Edge**: Chrome과 유사함
- **Safari**: Windows에서 적용되지 않음

### 참고 및 해결 방법 가능한 방향

- 적절한 RTL 방향이 설정되도록 보장 (dir="rtl")
- 히브리어 텍스트를 모니터링하고 방향을 자동으로 설정
- 혼합 방향 텍스트를 주의 깊게 처리
- 복잡한 경우에 Unicode 양방향 알고리즘(bidi) 사용
