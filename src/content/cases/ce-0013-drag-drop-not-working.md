---
id: ce-0013
scenarioId: scenario-drag-drop-behavior
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Drag and drop of text within contenteditable does not work as expected
description: "Dragging selected text within a contenteditable region to move it to a different position does not work consistently. Sometimes the text is copied instead of moved, or the drop target is not where expected."
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
    description: "드래그 앤 드롭으로 복사됨 (이동이 아님), 원본 텍스트 유지"
  - label: "✅ Expected"
    html: '<p>Paragraph 2</p><p>Paragraph 1</p>'
    description: "정상: 드래그 앤 드롭으로 이동, 원본 위치에서 제거됨"
---

### Phenomenon

Dragging selected text within a contenteditable region to move it to a different position does not work consistently. Sometimes the text is copied instead of moved, or the drop target is not where the mouse pointer indicates.

### Reproduction example

1. Create a contenteditable div with multiple paragraphs.
2. Select a paragraph of text.
3. Drag it to a different position within the same contenteditable region.
4. Observe the result.

### Observed behavior

- In Chrome on macOS, dragging text sometimes results in copying instead of moving.
- The drop position may not match the visual indicator.
- The original selection may remain visible after the drop.

### Expected behavior

- Dragging selected text should move it to the drop position.
- The original text should be removed from its source location.
- The caret should be positioned at the drop location.

