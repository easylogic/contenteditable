---
id: ce-0202
scenarioId: scenario-ime-composition-tab-key
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: Thai (IME)
caseTitle: Safari에서 태국어 IME 조합이 Tab 키로 취소됨
description: "contenteditable 요소에서 IME로 태국어 텍스트를 조합할 때 Tab을 누르면 조합이 취소되고 포커스가 다음 요소로 이동합니다. 성조 표시와 모음 표시를 포함한 조합된 텍스트가 손실될 수 있습니다."
tags:
  - composition
  - ime
  - tab
  - navigation
  - thai
  - safari
  - macos
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">สวัส</span>'
    description: "Thai composition in progress (สวัส), includes tone marks and vowel marks"
  - label: "After Tab (Bug)"
    html: 'Hello '
    description: "Tab key cancels composition, focus moves, composition text lost"
  - label: "✅ Expected"
    html: 'Hello สวัสดี'
    description: "Expected: Tab navigation after composition completes or composition text preserved"
---

### 현상

`contenteditable` 요소에서 IME로 태국어 텍스트를 조합할 때 Tab을 누르면 조합이 취소되고 포커스가 다음 요소로 이동합니다. 성조 표시와 모음 표시를 포함한 조합된 텍스트가 손실되거나 탐색이 발생하기 전에 부분적으로 커밋될 수 있습니다.

### 재현 예시

1. 편집 가능한 영역에 포커스를 둡니다 (예: 폼이나 테이블에서).
2. 태국어 IME를 활성화합니다.
3. 성조 표시와 모음 표시가 있는 태국어 텍스트를 입력합니다 (예: "สวัสดี").
4. 다음 요소로 이동하기 위해 Tab을 누릅니다.

### 관찰된 동작

- compositionend 이벤트가 불완전한 데이터로 발생합니다
- 포커스가 다음 요소로 이동합니다
- 결합 표시를 포함한 조합된 텍스트가 손실될 수 있습니다
- Tab 키 동작이 조합 처리와 충돌합니다

### 예상 동작

- Tab 탐색이 발생하기 전에 조합이 완료되어야 합니다
- 모든 결합 문자가 보존되어야 합니다
- Tab 탐색이 활성 조합이 있든 없든 일관되게 작동해야 합니다

### 브라우저 비교

- **Safari**: Tab이 조합을 취소하고 포커스를 이동시킬 수 있음, 특히 macOS에서
- **Chrome**: 조합 중 다른 Tab 키 동작을 가질 수 있음
- **Firefox**: 조합 중 다른 Tab 키 동작을 가질 수 있음

### 참고 및 해결 방법 가능한 방향

- 활성 조합 중 Tab 방지
- Tab 탐색을 허용하기 전에 조합 완료 대기
- 특히 결합 문자가 있는 조합 중 Tab 키 이벤트를 주의 깊게 처리
