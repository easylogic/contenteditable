---
id: ce-0102
scenarioId: scenario-consecutive-spaces
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 여러 연속 공백이 단일 공백으로 축소됨
description: "contenteditable 요소에 여러 연속 공백을 입력할 때 모든 브라우저가 기본적으로 단일 공백으로 축소합니다(HTML 공백 규칙 따름). 이것은 네이티브 텍스트 입력과 다르며 사용자에게 예상치 못할 수 있습니다."
tags:
  - whitespace
  - space
  - html
  - all-browsers
status: draft
domSteps:
  - label: "Before"
    html: 'Hello'
    description: "Basic text"
  - label: "After 5 Spaces (Bug)"
    html: 'Hello '
    description: "5 Space key presses, only one space remains in DOM (HTML whitespace collapse rule)"
  - label: "✅ Expected (with CSS)"
    html: 'Hello     '
    description: "Expected: Multiple spaces preserved when using white-space: pre-wrap"
---

### 현상

contenteditable 요소에 여러 연속 공백을 입력할 때 모든 브라우저가 기본적으로 단일 공백으로 축소합니다(HTML 공백 규칙 따름). 이것은 네이티브 텍스트 입력과 다르며 사용자에게 예상치 못할 수 있습니다.

### 재현 예시

1. contenteditable 요소에 포커스합니다
2. 여러 공백을 입력합니다 (예: Space 키를 5번 누름)
3. DOM을 관찰합니다

### 관찰된 동작

- 모든 연속 공백이 DOM에서 단일 공백으로 축소됩니다
- 이것은 HTML 공백 축소 규칙을 따릅니다
- 시각적 모양은 하나의 공백만 표시합니다
- `<input>` 및 `<textarea>` 동작과 다릅니다

### 예상 동작

- 여러 공백이 보존되어야 합니다 (필요한 경우)
- 또는 동작이 명확하게 문서화되어야 합니다
- 사용자가 공백이 축소되는 이유를 이해해야 합니다

### 브라우저 비교

- **모든 브라우저**: 연속 공백 축소 (HTML 표준)
- **해결 방법**: CSS `white-space: pre-wrap` 또는 `&nbsp;` 엔티티 사용

### 참고 및 해결 방법 가능한 방향

- 공백을 보존하기 위해 CSS `white-space: pre-wrap` 사용
- 공백 삽입을 가로채고 여러 공백에 대해 `&nbsp;` 사용
- 사용자에게 이 동작 문서화
- 사용 사례에 공백 보존이 필요한지 고려
