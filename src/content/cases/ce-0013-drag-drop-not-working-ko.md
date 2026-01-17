---
id: ce-0013-drag-drop-not-working-ko
scenarioId: scenario-drag-drop-behavior
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable 내부에서 텍스트 드래그 앤 드롭이 예상대로 작동하지 않음
description: "contenteditable 영역 내에서 선택한 텍스트를 다른 위치로 이동하기 위해 드래그하는 것이 일관되게 작동하지 않습니다. 때로는 텍스트가 이동하는 대신 복사되거나 드롭 대상이 예상 위치가 아닙니다."
tags:
  - drag-drop
  - selection
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<p>Paragraph 1</p><p>Paragraph 2</p>'
    description: "두 개의 단락, 'Paragraph 1' 선택됨"
  - label: "After Drag-Drop (Bug)"
    html: '<p>Paragraph 1</p><p>Paragraph 1</p><p>Paragraph 2</p>'
    description: "드래그 앤 드롭이 복사함 (이동하지 않음), 원본 텍스트 유지됨"
  - label: "✅ Expected"
    html: '<p>Paragraph 2</p><p>Paragraph 1</p>'
    description: "예상: 드래그 앤 드롭이 이동함, 원본 위치에서 제거됨"
---

## 현상

contenteditable 영역 내에서 선택한 텍스트를 다른 위치로 이동하기 위해 드래그하는 것이 일관되게 작동하지 않습니다. 때로는 텍스트가 이동하는 대신 복사되거나 드롭 대상이 마우스 포인터가 나타내는 위치가 아닙니다.

## 재현 예시

1. 여러 단락이 있는 contenteditable div를 만듭니다.
2. 텍스트 단락을 선택합니다.
3. 동일한 contenteditable 영역 내의 다른 위치로 드래그합니다.
4. 결과를 관찰합니다.

## 관찰된 동작

- macOS의 Chrome에서 텍스트를 드래그하면 때로는 이동하는 대신 복사됩니다.
- 드롭 위치가 시각적 표시기와 일치하지 않을 수 있습니다.
- 드롭 후 원본 선택이 계속 보일 수 있습니다.

## 예상 동작

- 선택한 텍스트를 드래그하면 드롭 위치로 이동해야 합니다.
- 원본 텍스트가 소스 위치에서 제거되어야 합니다.
- 캐럿이 드롭 위치에 배치되어야 합니다.
