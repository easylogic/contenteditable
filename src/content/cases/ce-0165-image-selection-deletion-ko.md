---
id: ce-0165-image-selection-deletion-ko
scenarioId: scenario-image-deletion
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 이미지 선택 및 삭제에 여러 작업이 필요함
description: "Chrome에서 contenteditable 요소에서 이미지를 선택할 때 삭제하려면 여러 번 Delete 또는 Backspace 키를 눌러야 할 수 있습니다. 이미지가 첫 번째 시도에서 삭제되지 않을 수 있습니다."
tags:
  - image
  - deletion
  - selection
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<div><img src="image.jpg" alt="Image"></div>'
    description: "Image in selected state"
  - label: "After First Delete (Bug)"
    html: '<div><img src="image.jpg" alt="Image"></div>'
    description: "First Delete key press does not delete image"
  - label: "After Multiple Delete"
    html: '<div></div>'
    description: "Deleted after multiple Delete key presses"
  - label: "✅ Expected"
    html: ''
    description: "Expected: Immediately deleted on first Delete key press"
---

## 현상

Chrome에서 contenteditable 요소에서 이미지를 선택할 때 삭제하려면 여러 번 Delete 또는 Backspace 키를 눌러야 할 수 있습니다. 이미지가 첫 번째 시도에서 삭제되지 않을 수 있습니다.

## 재현 예시

1. contenteditable에 이미지를 삽입합니다
2. 이미지를 선택하기 위해 클릭합니다
3. Delete 또는 Backspace를 한 번 누릅니다

## 관찰된 동작

- 이미지가 첫 번째 키 입력에서 삭제되지 않을 수 있습니다
- 여러 번 키 입력이 필요할 수 있습니다
- 또는 이미지 선택이 삭제 전에 손실될 수 있습니다
- 삭제가 불안정합니다

## 예상 동작

- 이미지가 첫 번째 키 입력에서 삭제되어야 합니다
- 삭제가 즉시이고 안정적이어야 합니다
- 선택이 삭제까지 유지되어야 합니다
- 동작이 일관되어야 합니다

## 브라우저 비교

- **Chrome/Edge**: 여러 번 눌러야 할 수 있음 (이 케이스)
- **Firefox**: 유사한 삭제 문제
- **Safari**: 삭제 동작이 가장 일관되지 않음

## 참고 및 해결 방법 가능한 방향

- 선택된 이미지에서 Delete/Backspace 가로채기
- 이미지가 즉시 삭제되도록 보장
- 이미지 선택을 명시적으로 처리
- 안정적인 삭제 동작 제공
