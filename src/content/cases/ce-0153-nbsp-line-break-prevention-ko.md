---
id: ce-0153
scenarioId: scenario-non-breaking-space
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 줄바꿈 없는 공백이 예상치 못하게 줄바꿈을 방지함
description: "contenteditable에서 줄바꿈 없는 공백을 사용할 때 텍스트가 일반적으로 줄바꿈될 때도 줄바꿈을 방지합니다. 이것은 텍스트 오버플로우를 일으키거나 예상치 못한 레이아웃 문제를 만들 수 있습니다."
tags:
  - whitespace
  - nbsp
  - line-break
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello&nbsp;&nbsp;&nbsp;World'
    description: "Text with non-breaking spaces"
  - label: "After Narrow Container (Bug)"
    html: 'Hello&nbsp;&nbsp;&nbsp;World'
    description: "No line break even when container narrows, text overflow"
  - label: "✅ Expected"
    html: 'Hello World'
    description: "Expected: Line break possible when using regular space (or nbsp behavior clearly documented)"
---

### 현상

contenteditable에서 줄바꿈 없는 공백을 사용할 때 텍스트가 일반적으로 줄바꿈될 때도 줄바꿈을 방지합니다. 이것은 텍스트 오버플로우를 일으키거나 예상치 못한 레이아웃 문제를 만들 수 있습니다.

### 재현 예시

1. 여러 줄바꿈 없는 공백이 있는 텍스트를 삽입합니다: `Hello&nbsp;&nbsp;&nbsp;World`
2. 컨테이너를 좁게 크기 조정합니다
3. 텍스트 줄바꿈을 관찰합니다

### 관찰된 동작

- 텍스트가 줄바꿈 없는 공백에서 줄바꿈되지 않습니다
- 텍스트가 컨테이너를 오버플로우할 수 있습니다
- 줄바꿈이 방지됩니다
- 레이아웃 문제가 발생합니다

### 예상 동작

- 줄바꿈 없는 공백은 줄바꿈을 방지해야 합니다 (설계상)
- 또는 동작이 예측 가능해야 합니다
- 레이아웃이 nbsp를 적절히 처리해야 합니다
- 사용자가 nbsp 동작을 이해해야 합니다

### 브라우저 비교

- **모든 브라우저**: 줄바꿈 없는 공백이 줄바꿈을 방지함 (설계상)
- 이것은 예상되는 HTML 동작입니다
- 줄바꿈이 필요한 경우 일반 공백 또는 CSS 사용 필요할 수 있음

### 참고 및 해결 방법 가능한 방향

- 줄바꿈이 필요한 경우 일반 공백 사용
- 긴 단어에 대해 CSS `word-break` 또는 `overflow-wrap` 사용
- 줄바꿈이 원하는 경우 nbsp를 일반 공백으로 교체
- 사용자에게 nbsp 동작 문서화
