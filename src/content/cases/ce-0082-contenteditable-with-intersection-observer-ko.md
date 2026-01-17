---
id: ce-0082-contenteditable-with-intersection-observer-ko
scenarioId: scenario-intersection-observer-interference
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: MacBook Pro
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: IntersectionObserver가 contenteditable 가시성 감지에 영향을 줄 수 있음
description: "IntersectionObserver를 사용하여 contenteditable 요소가 표시되거나 숨겨지는 시점을 감지할 때 편집 중 관찰자가 올바르게 작동하지 않을 수 있습니다. 편집 중 콘텐츠 크기나 위치 변경이 예상대로 교차 업데이트를 트리거하지 않을 수 있습니다."
tags:
  - intersection-observer
  - visibility
  - safari
  - macos
status: draft
---

## 현상

IntersectionObserver를 사용하여 contenteditable 요소가 표시되거나 숨겨지는 시점을 감지할 때 편집 중 관찰자가 올바르게 작동하지 않을 수 있습니다. 편집 중 콘텐츠 크기나 위치 변경이 예상대로 교차 업데이트를 트리거하지 않을 수 있습니다.

## 재현 예시

1. 보기에서 스크롤될 수 있는 contenteditable div를 만듭니다.
2. 가시성을 감지하는 IntersectionObserver를 연결합니다.
3. 요소 크기를 변경하는 콘텐츠를 편집합니다.
4. contenteditable을 보기 안팎으로 스크롤합니다.
5. 교차 콜백이 올바르게 작동하는지 관찰합니다.

## 관찰된 동작

- macOS의 Safari에서 IntersectionObserver가 편집 중 올바르게 업데이트되지 않을 수 있습니다.
- 콘텐츠 크기 변경이 교차 재계산을 트리거하지 않을 수 있습니다.
- 가시성 감지가 지연되거나 잘못될 수 있습니다.
- 관찰자가 빠른 콘텐츠 변경을 놓칠 수 있습니다.

## 예상 동작

- IntersectionObserver가 contenteditable과 올바르게 작동해야 합니다.
- 콘텐츠 변경이 교차 재계산을 트리거해야 합니다.
- 가시성 감지가 정확하고 시기적절해야 합니다.
