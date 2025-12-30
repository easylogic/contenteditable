---
id: ce-0193
scenarioId: scenario-ime-composition-paste
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: Korean (IME)
caseTitle: Firefox에서 한글 IME 조합이 붙여넣기 작업으로 취소됨
description: "contenteditable 요소에서 IME로 한글 텍스트를 조합할 때 콘텐츠를 붙여넣으면(Ctrl+V) 활성 조합이 취소되고 조합된 텍스트가 손실됩니다. 붙여넣은 콘텐츠도 예상치 못한 위치에 삽입될 수 있습니다."
tags:
  - composition
  - ime
  - paste
  - korean
  - firefox
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한글</span>'
    description: "Korean composition in progress"
  - label: "After Paste (Bug)"
    html: 'Hello World'
    description: "Paste cancels composition, composition text lost, only pasted content remains"
  - label: "✅ Expected"
    html: 'Hello 한글World'
    description: "Expected: Paste after composition completes or composition text preserved"
---

### 현상

`contenteditable` 요소에서 IME로 한글 텍스트를 조합할 때 콘텐츠를 붙여넣으면(Ctrl+V) 활성 조합이 취소되고 조합된 텍스트가 손실됩니다. 붙여넣은 콘텐츠도 예상치 못한 위치에 삽입될 수 있습니다.

### 재현 예시

1. 편집 가능한 영역에 포커스를 둡니다.
2. 한글 IME를 활성화합니다.
3. 한글 텍스트 조합을 시작합니다 (예: "한글" 입력).
4. 조합을 완료하기 전에 Ctrl+V를 눌러 콘텐츠를 붙여넣습니다.

### 관찰된 동작

- compositionend 이벤트가 불완전한 데이터로 발생합니다
- 조합된 텍스트가 손실됩니다
- 붙여넣은 콘텐츠가 삽입되며, 잘못된 위치에 있을 수 있습니다
- `paste`, `compositionend`, `input` 이벤트의 순서가 일관되지 않을 수 있습니다

### 예상 동작

- 붙여넣기가 발생하기 전에 조합이 완료되거나 붙여넣기가 대기되어야 합니다
- 조합된 텍스트가 손실되지 않아야 합니다
- 붙여넣은 콘텐츠가 올바른 위치에 삽입되어야 합니다
- 이벤트 순서가 예측 가능하고 일관되어야 합니다

### 브라우저 비교

- **Firefox**: 붙여넣기가 조합을 취소할 수 있음
- **Chrome**: 조합 중 다른 붙여넣기 동작을 가질 수 있음
- **Edge**: Chrome과 유사함
- **Safari**: Windows에서 적용되지 않음

### 참고 및 해결 방법 가능한 방향

- 활성 조합 중 붙여넣기 방지
- 조합이 완료될 때까지 대기한 후 붙여넣기 허용
- 조합 중 붙여넣기 이벤트를 주의 깊게 처리
