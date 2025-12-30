---
id: ce-0154
scenarioId: scenario-image-insertion
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 드래그 앤 드롭에서 이미지 드롭 위치가 올바르지 않음
description: "Chrome에서 contenteditable 요소에 이미지 파일을 드래그 앤 드롭할 때 이미지가 잘못된 위치에 삽입될 수 있습니다. 드롭 위치가 커서 위치나 드롭 위치와 일치하지 않습니다."
tags:
  - image
  - drag-drop
  - position
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello World'
    description: "Text, cursor positioned between 'Hello' and 'World'"
  - label: "After Drop (Bug)"
    html: 'Hello World<img src="image.jpg" alt="Image">'
    description: "Image inserted at end regardless of drop position"
  - label: "✅ Expected"
    html: 'Hello <img src="image.jpg" alt="Image"> World'
    description: "Expected: Image inserted at drop position (cursor position)"
---

## 현상

Chrome에서 contenteditable 요소에 이미지 파일을 드래그 앤 드롭할 때 이미지가 잘못된 위치에 삽입될 수 있습니다. 드롭 위치가 커서 위치나 드롭 위치와 일치하지 않습니다.

## 재현 예시

1. 텍스트가 있는 contenteditable을 만듭니다
2. 특정 위치에 커서를 놓습니다
3. 이미지 파일을 드래그 앤 드롭합니다

## 관찰된 동작

- 이미지가 잘못된 위치에 삽입됩니다
- 드롭 위치가 커서와 일치하지 않습니다
- 또는 이미지가 콘텐츠 끝에 삽입됩니다
- 위치가 예측 불가능합니다

## 예상 동작

- 이미지가 드롭 위치에 삽입되어야 합니다
- 또는 커서 위치에 삽입되어야 합니다
- 위치가 예측 가능해야 합니다
- 드롭이 직관적으로 작동해야 합니다

## 브라우저 비교

- **Chrome/Edge**: 위치가 올바르지 않을 수 있음 (이 케이스)
- **Firefox**: 유사한 위치 문제
- **Safari**: 드롭 위치가 가장 예측 불가능함

## 참고 및 해결 방법 가능한 방향

- 드롭 이벤트 가로채기
- 이벤트 좌표에서 드롭 위치 계산
- 계산된 위치에 이미지 삽입
- 사용 가능한 경우 `document.caretRangeFromPoint` 사용
