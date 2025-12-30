---
id: ce-0139
scenarioId: scenario-image-resize
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 이미지 크기 조정이 기본적으로 종횡비를 보존하지 않음
description: "contenteditable 요소에서 이미지 크기를 조정할 때 기본적으로 종횡비가 보존되지 않습니다. 이미지가 크기 조정될 때 왜곡되어 수동 종횡비 보존이 필요합니다."
tags:
  - image
  - resize
  - aspect-ratio
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<img src="image.jpg" width="200" height="150" alt="Image">'
    description: "Original image (200x150, ratio 4:3)"
  - label: "After Resize (Bug)"
    html: '<img src="image.jpg" width="300" height="150" alt="Image">'
    description: "After resize, ratio damaged (300x150, distorted)"
  - label: "✅ Expected"
    html: '<img src="image.jpg" width="300" height="225" alt="Image">'
    description: "Expected: Ratio maintained (300x225, 4:3 ratio preserved)"
---

## 현상

contenteditable 요소에서 이미지 크기를 조정할 때 기본적으로 종횡비가 보존되지 않습니다. 이미지가 크기 조정될 때 왜곡되어 수동 종횡비 보존이 필요합니다.

## 재현 예시

1. contenteditable에 이미지를 삽입합니다
2. 드래그하여 이미지 크기를 조정합니다
3. 이미지 왜곡을 관찰합니다

## 관찰된 동작

- 이미지 너비와 높이가 독립적으로 변경됩니다
- 종횡비가 유지되지 않습니다
- 이미지가 왜곡됩니다
- 비율을 보존하려면 수동 계산이 필요합니다

## 예상 동작

- 종횡비가 기본적으로 보존되어야 합니다
- 또는 종횡비 보존 옵션
- 이미지가 왜곡되지 않아야 합니다
- 크기 조정이 직관적이어야 합니다

## 브라우저 비교

- **모든 브라우저**: 기본적으로 종횡비가 보존되지 않음
- 종횡비 보존을 위한 사용자 정의 구현 필요

## 참고 및 해결 방법 가능한 방향

- 종횡비 잠금이 있는 사용자 정의 크기 조정 구현
- 너비 변경에 따라 높이 계산
- 종횡비 잠금을 토글하기 위해 Shift 키 수정자 사용
- 크기 조정 중 시각적 피드백 제공
