---
id: ce-0037-undo-stack-cleared-ko
scenarioId: scenario-undo-redo-behavior
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: 프로그래밍 방식으로 콘텐츠를 수정할 때 Undo 스택이 지워짐
description: "contenteditable 영역의 콘텐츠를 프로그래밍 방식으로 수정할 때(예: innerHTML 또는 textContent 사용) Safari에서 undo 스택이 지워집니다. 이로 인해 사용자가 이전 편집을 되돌릴 수 없습니다."
tags:
  - undo
  - programmatic
  - safari
status: draft
domSteps:
  - label: "Before"
    html: 'Hello World'
    description: "수동으로 입력한 텍스트"
  - label: "After Programmatic Change"
    html: 'New content'
    description: "innerHTML이 프로그래밍 방식으로 변경됨"
  - label: "After Undo (Bug)"
    html: 'New content'
    description: "Undo 스택이 지워짐, 이전 수동 편집을 취소할 수 없음"
  - label: "✅ Expected"
    html: 'Hello World'
    description: "예상: 이전 수동 편집을 Undo로 복원할 수 있음"
---

## 현상

contenteditable 영역의 콘텐츠를 프로그래밍 방식으로 수정할 때(예: `innerHTML` 또는 `textContent` 사용) Safari에서 undo 스택이 지워집니다. 이로 인해 사용자가 이전 수동 편집을 되돌릴 수 없습니다.

## 재현 예시

1. contenteditable div를 만듭니다.
2. 수동으로 일부 텍스트를 입력합니다.
3. JavaScript를 사용하여 콘텐츠를 수정합니다: `element.innerHTML = 'New content'`.
4. 되돌리기를 시도합니다 (Cmd+Z).
5. 이전 수동 편집을 되돌릴 수 있는지 관찰합니다.

## 관찰된 동작

- macOS의 Safari에서 프로그래밍 방식 콘텐츠 변경이 undo 스택을 지웁니다.
- 프로그래밍 방식 변경 후 사용자가 이전 수동 편집을 되돌릴 수 없습니다.
- undo 기록이 예상치 못하게 손실됩니다.

## 예상 동작

- 프로그래밍 방식 변경이 수동 편집에 대한 undo 스택을 지우지 않아야 합니다.
- 또는 프로그래밍 방식 수정을 통해 undo 기록을 보존하는 방법이 있어야 합니다.
- undo 스택이 더 지능적으로 관리되어야 합니다.
