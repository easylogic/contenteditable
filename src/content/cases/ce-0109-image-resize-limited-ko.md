---
id: ce-0109-image-resize-limited-ko
scenarioId: scenario-image-resize
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 네이티브 이미지 크기 조정 핸들이 제한되거나 사용할 수 없음
description: "contenteditable 요소에서 이미지를 선택할 때 네이티브 크기 조정 핸들이 나타나지 않거나 제한될 수 있습니다. 사용자 정의 구현 없이는 사용자가 이미지를 쉽게 크기 조정할 수 없습니다."
tags:
  - image
  - resize
  - drag
  - chrome
status: draft
---

## 현상

contenteditable 요소에서 이미지를 선택할 때 네이티브 크기 조정 핸들이 나타나지 않거나 제한될 수 있습니다. 사용자 정의 구현 없이는 사용자가 이미지를 쉽게 크기 조정할 수 없습니다.

## 재현 예시

1. contenteditable에 이미지를 삽입합니다
2. 이미지를 클릭하여 선택합니다
3. 크기 조정 핸들을 찾습니다

## 관찰된 동작

- 크기 조정 핸들이 전혀 나타나지 않을 수 있습니다
- 또는 핸들이 나타나지만 제대로 작동하지 않을 수 있습니다
- 이미지 크기 조정이 직관적이지 않습니다
- 사용자가 이미지 크기를 쉽게 조정할 수 없습니다

## 예상 동작

- 이미지가 선택되면 크기 조정 핸들이 나타나야 합니다
- 핸들이 부드럽게 작동해야 합니다
- 이미지가 종횡비를 유지하면서 크기 조정되어야 합니다 (선택적으로)
- 동작이 브라우저 간에 일관되어야 합니다

## 브라우저 비교

- **Chrome/Edge**: 네이티브 크기 조정 핸들이 제한되거나 없음
- **Firefox**: 네이티브 크기 조정 지원 없음
- **Safari**: 다른 크기 조정 동작을 가질 수 있음

## 참고 및 해결 방법 가능한 방향

- 사용자 정의 크기 조정 핸들 구현
- 드래그 작업을 추적하기 위해 마우스 이벤트 사용
- 이미지 width/height 속성 또는 CSS 업데이트
- 원하는 경우 종횡비 유지
- 크기 조정 중 시각적 피드백 제공
