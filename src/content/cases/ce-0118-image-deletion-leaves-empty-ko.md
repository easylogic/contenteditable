---
id: ce-0118
scenarioId: scenario-image-deletion
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 이미지 삭제가 빈 래퍼 요소를 남김
description: "contenteditable 요소에서 이미지를 삭제할 때 빈 래퍼 div나 다른 요소가 DOM에 남을 수 있습니다. 이러한 빈 요소는 레이아웃 문제를 일으키고 HTML을 비대하게 만듭니다."
tags:
  - image
  - deletion
  - empty
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<div><img src="image.jpg" alt="Image"></div>'
    description: "Structure with image"
  - label: "After Delete (Bug)"
    html: '<div></div>'
    description: "After image deletion, empty wrapper div remains"
  - label: "✅ Expected"
    html: ''
    description: "Expected: Empty elements removed, clean DOM"
---

## 현상

contenteditable 요소에서 이미지를 삭제할 때 빈 래퍼 div나 다른 요소가 DOM에 남을 수 있습니다. 이러한 빈 요소는 레이아웃 문제를 일으키고 HTML을 비대하게 만듭니다.

## 재현 예시

1. contenteditable에 이미지를 삽입합니다
2. 이미지를 선택합니다
3. Delete 또는 Backspace를 누릅니다

## 관찰된 동작

- 이미지가 삭제됩니다
- 빈 래퍼 `<div>` 요소가 남을 수 있습니다
- 또는 빈 `<p>` 요소가 남을 수 있습니다
- DOM 구조가 비대해집니다

## 예상 동작

- 이미지가 깨끗하게 삭제되어야 합니다
- 빈 요소가 남지 않아야 합니다
- DOM이 깨끗해야 합니다
- 커서 위치가 올바르게 설정되어야 합니다

## 브라우저 비교

- **Chrome/Edge**: 빈 요소를 남길 수 있음 (이 케이스)
- **Firefox**: 빈 구조를 남길 가능성이 더 높음
- **Safari**: 빈 요소를 남길 가능성이 가장 높음

## 참고 및 해결 방법 가능한 방향

- 이미지 삭제 가로채기
- 빈 래퍼 요소 정리
- 비어 있으면 부모 요소 제거
- 삭제 후 커서 위치 올바르게 설정
