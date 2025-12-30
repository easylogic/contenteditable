---
id: ce-0149
scenarioId: scenario-selection-restoration
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: 콘텐츠 삽입 후 선택 범위가 무효화됨
description: "Firefox에서 contenteditable 요소에 프로그래밍 방식으로 콘텐츠(텍스트, 요소)를 삽입할 때 선택 범위가 무효화됩니다. 커서 위치가 손실되고 복원할 수 없습니다."
tags:
  - selection
  - range
  - insert
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="background: yellow;">World</span>'
    description: "Selected text (World)"
  - label: "After Insert (Bug)"
    html: 'Hello <span style="background: yellow;">World</span> New'
    description: "After programmatic insertion, selection range invalidated, cursor position unclear"
  - label: "✅ Expected"
    html: 'Hello <span style="background: yellow;">World</span> New'
    description: "Expected: Selection range valid, cursor positioned after inserted content"
---

### 현상

Firefox에서 contenteditable 요소에 프로그래밍 방식으로 콘텐츠(텍스트, 요소)를 삽입할 때 선택 범위가 무효화됩니다. 커서 위치가 손실되고 복원할 수 없습니다.

### 재현 예시

1. 일부 텍스트를 선택합니다
2. 선택 위치에 프로그래밍 방식으로 콘텐츠를 삽입합니다
3. 선택 상태를 확인합니다

### 관찰된 동작

- 선택 범위가 무효화됩니다
- 커서 위치가 손실됩니다
- 올바른 위치에서 편집을 계속할 수 없습니다
- 선택을 복원할 수 없습니다

### 예상 동작

- 삽입 후 선택이 유효하게 유지되어야 합니다
- 커서가 삽입된 콘텐츠 뒤에 배치되어야 합니다
- 사용자가 편집을 계속할 수 있어야 합니다
- 선택이 올바르게 복원되어야 합니다

### 브라우저 비교

- **Chrome/Edge**: 선택이 일반적으로 유효하게 유지됨
- **Firefox**: 선택이 무효화됨 (이 케이스)
- **Safari**: 선택 복원이 가장 불안정함

### 참고 및 해결 방법 가능한 방향

- 삽입 전 선택 저장
- 삽입 후 선택 복원
- 유효한 선택을 유지하기 위해 Range API 사용
- 무효한 선택을 우아하게 처리
