---
id: ce-0110
scenarioId: scenario-selection-restoration
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 프로그래밍 방식 DOM 조작 후 텍스트 선택이 손실됨
description: "프로그래밍 방식으로 DOM을 조작한 후(예: 콘텐츠 삽입, 서식 적용) 텍스트 선택(커서 위치)이 손실되거나 잘못된 위치로 이동합니다. 이것은 사용자 정의 편집 기능을 구현하기 어렵게 만듭니다."
tags:
  - selection
  - range
  - cursor
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="background: yellow;">World</span>'
    description: "Selected text (World)"
  - label: "After DOM Update (Bug)"
    html: 'Hello <strong>World</strong>'
    description: "After DOM manipulation, selection lost, cursor position unclear"
  - label: "✅ Expected"
    html: 'Hello <strong>World</strong>'
    description: "Expected: Selection restored, cursor at correct position"
---

### 현상

프로그래밍 방식으로 DOM을 조작한 후(예: 콘텐츠 삽입, 서식 적용) 텍스트 선택(커서 위치)이 손실되거나 잘못된 위치로 이동합니다. 이것은 사용자 정의 편집 기능을 구현하기 어렵게 만듭니다.

### 재현 예시

1. contenteditable에서 일부 텍스트를 선택합니다
2. 프로그래밍 방식으로 콘텐츠를 삽입하거나 서식을 적용합니다
3. 커서 위치를 확인합니다

### 관찰된 동작

- 선택이 손실됩니다 (커서가 보이지 않음)
- 또는 커서가 예상치 못한 위치로 이동합니다
- 선택 범위가 무효화됩니다
- 사용자가 편집 위치를 잃습니다

### 예상 동작

- DOM 조작 후 선택이 복원되어야 합니다
- 커서가 올바른 위치에 있어야 합니다
- 선택이 유효하게 유지되어야 합니다
- 사용자가 원활하게 편집을 계속할 수 있어야 합니다

### 브라우저 비교

- **Chrome/Edge**: 선택이 손실될 수 있음 (이 케이스)
- **Firefox**: 선택을 잃을 가능성이 더 높음
- **Safari**: 선택 복원이 가장 불안정함

### 참고 및 해결 방법 가능한 방향

- DOM 조작 전 선택 저장
- 조작 후 선택 복원
- 선택을 저장/복원하기 위해 `Range` API 사용
- 무효한 선택을 우아하게 처리
- 타이밍을 위해 `requestAnimationFrame` 사용
