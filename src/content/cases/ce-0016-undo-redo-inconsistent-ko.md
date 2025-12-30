---
id: ce-0016
scenarioId: scenario-undo-redo-behavior
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: US
caseTitle: Undo 및 Redo 동작이 브라우저 간에 일관되지 않음
description: "Undo 및 Redo 기능(Ctrl+Z / Ctrl+Y 또는 Cmd+Z / Cmd+Shift+Z)이 브라우저 간에 다르게 동작합니다. 일부 브라우저는 개별 키 입력을 되돌리는 반면, 다른 브라우저는 더 큰 작업을 되돌립니다. Undo 스택이 예상치 못하게 지워질 수도 있습니다."
tags:
  - undo
  - redo
  - browser-compatibility
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <strong>World</strong>'
    description: "서식이 있는 텍스트"
  - label: "After typing more"
    html: 'Hello <strong>World</strong> Test'
    description: "추가 텍스트 입력"
  - label: "After Undo (Bug)"
    html: 'Hello '
    description: "Undo가 전체 서식 작업을 취소함 (개별 키 입력이 아님)"
  - label: "✅ Expected"
    html: 'Hello <strong>World</strong> '
    description: "예상: 개별 키 입력당 Undo (마지막 'Test'만 취소)"
---

## 현상

Undo 및 Redo 기능(Ctrl+Z / Ctrl+Y 또는 Cmd+Z / Cmd+Shift+Z)이 브라우저 간에 다르게 동작합니다. 일부 브라우저는 개별 키 입력을 되돌리는 반면, 다른 브라우저는 더 큰 작업을 되돌립니다. Undo 스택이 예상치 못하게 지워질 수도 있습니다.

## 재현 예시

1. contenteditable div를 만듭니다.
2. 여러 단어를 입력합니다.
3. 서식을 적용합니다 (굵게, 기울임꼴).
4. 더 많은 텍스트를 입력합니다.
5. Undo(Ctrl+Z 또는 Cmd+Z)를 여러 번 누릅니다.
6. 각 단계에서 무엇이 되돌려지는지 관찰합니다.

## 관찰된 동작

- Windows의 Edge에서 undo는 개별 키 입력보다 전체 서식 작업을 되돌릴 수 있습니다.
- contenteditable에서 포커스가 이동할 때 undo 스택이 지워질 수 있습니다.
- 특정 작업 후 redo 동작이 일관되게 작동하지 않을 수 있습니다.

## 예상 동작

- Undo는 예측 가능한 순서로 변경 사항을 되돌려야 합니다 (일반적으로 가장 최근 것부터).
- Undo 스택은 contenteditable이 포커스를 유지하는 동안 지속되어야 합니다.
- Redo는 되돌린 변경 사항을 역순으로 복원해야 합니다.
