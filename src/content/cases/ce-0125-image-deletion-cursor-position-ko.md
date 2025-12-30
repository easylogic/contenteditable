---
id: ce-0125
scenarioId: scenario-image-deletion
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Firefox에서 이미지 삭제 후 커서 위치가 올바르지 않음
description: "Firefox에서 contenteditable 요소에서 이미지를 삭제할 때 삭제 후 커서 위치가 올바르지 않거나 예상치 못합니다. 커서가 잘못된 위치에 있거나 무효화될 수 있습니다."
tags:
  - image
  - deletion
  - cursor
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <img src="image.jpg" alt="Image">| World'
    description: "Cursor (|) positioned after image"
  - label: "After Delete (Bug)"
    html: 'Hello | World'
    description: "After image deletion, cursor position is incorrect (moved before image)"
  - label: "✅ Expected"
    html: 'Hello | World'
    description: "Expected: Cursor maintained at image position"
---

## 현상

Firefox에서 contenteditable 요소에서 이미지를 삭제할 때 삭제 후 커서 위치가 올바르지 않거나 예상치 못합니다. 커서가 잘못된 위치에 있거나 무효화될 수 있습니다.

## 재현 예시

1. contenteditable에 이미지를 삽입합니다
2. 이미지 뒤에 커서를 놓습니다
3. 이미지를 삭제하기 위해 Backspace를 누릅니다

## 관찰된 동작

- 이미지가 삭제됩니다
- 커서 위치가 올바르지 않거나 손실됩니다
- 커서가 이미지 위치 앞에 끝날 수 있습니다
- 또는 커서가 무효화될 수 있습니다

## 예상 동작

- 삭제 후 커서가 올바른 위치에 있어야 합니다
- 커서가 이미지가 있던 위치에 있어야 합니다
- 커서가 유효하게 유지되어야 합니다
- 사용자가 계속 입력할 수 있어야 합니다

## 브라우저 비교

- **Chrome/Edge**: 커서 위치가 일반적으로 올바름
- **Firefox**: 커서 위치가 올바르지 않음 (이 케이스)
- **Safari**: 커서 위치가 가장 예측 불가능함

## 참고 및 해결 방법 가능한 방향

- 이미지 삭제 가로채기
- 삭제 후 커서 위치를 수동으로 설정
- 커서를 올바르게 배치하기 위해 Range API 사용
- DOM 조작 후 선택 복원
