---
id: ce-0010
scenarioId: scenario-space-during-composition
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: Korean (IME)
caseTitle: 컴포지션 중 Space 키가 무시되거나 일관되지 않게 커밋됨
description: "contenteditable 요소에서 한국어 IME로 텍스트를 컴포지션하는 동안 Space 키를 누르면 무시되거나 네이티브 텍스트 컨트롤과 비교하여 일관되지 않은 방식으로 컴포지션이 커밋됩니다."
tags:
  - composition
  - ime
  - space
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한</span>'
    description: "한국어 컴포지션 진행 중"
  - label: "After Space (Bug)"
    html: 'Hello 한'
    description: "Space 키가 무시되거나 컴포지션이 예상치 못하게 커밋됨"
  - label: "✅ Expected"
    html: 'Hello 한 '
    description: "예상: Space 키가 공백을 삽입하거나 컴포지션을 커밋"
---

### 현상

`contenteditable` 요소에서 한국어 IME로 텍스트를 컴포지션하는 동안 Space 키를 누르면 무시되거나 네이티브 텍스트 컨트롤과 비교하여 일관되지 않은 방식으로 컴포지션이 커밋됩니다.

### 재현 예시

1. 편집 가능한 영역에 포커스합니다.
2. 한국어 IME를 활성화합니다.
3. 단어 컴포지션을 시작하지만 완료하지 않습니다.
4. Space 키를 한 번 이상 누릅니다.

### 관찰된 동작

- Space 키가 때로는 보이는 공백을 삽입하지 않습니다.
- 일부 시퀀스에서 컴포지션이 커밋되고 공백이 삽입되지만, 이벤트 순서가 네이티브 컨트롤과 다릅니다.

### 예상 동작

- Space는 동일한 환경에서 `contenteditable`과 네이티브 텍스트 입력 간에 일관되게 동작하거나, 차이가 있으면 명확하게 문서화되어야 합니다.

### 참고사항

- 이 동작은 제품이 단어 경계를 해석하고 자동 완성 또는 제안 기능을 트리거하는 방식에 영향을 줄 수 있습니다.
