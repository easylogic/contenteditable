---
id: ce-0028-mobile-touch-focus-ko
scenarioId: scenario-mobile-touch-behavior
locale: ko
os: iOS
osVersion: "Ubuntu 22.04"
device: Mobile
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: System virtual keyboard
caseTitle: 터치 이벤트가 모바일에서 contenteditable 포커스를 방해함
description: "iOS Safari에서 contenteditable 영역의 터치 이벤트(탭, 길게 누르기)가 요소를 제대로 포커스하지 않을 수 있습니다. 가상 키보드가 나타나지 않거나 포커스가 예상치 못하게 손실될 수 있습니다."
tags:
  - mobile
  - touch
  - focus
  - ios
status: draft
---

## 현상

iOS Safari에서 contenteditable 영역의 터치 이벤트(탭, 길게 누르기)가 요소를 제대로 포커스하지 않을 수 있습니다. 가상 키보드가 나타나지 않거나 포커스가 예상치 못하게 손실될 수 있습니다.

## 재현 예시

1. iOS Safari에서 contenteditable 영역을 엽니다.
2. contenteditable 영역을 탭합니다.
3. 요소가 포커스를 받고 키보드가 나타나는지 관찰합니다.
4. 텍스트를 선택하기 위해 길게 누르기를 시도합니다.

## 관찰된 동작

- iOS Safari에서 탭해도 contenteditable이 포커스되지 않을 수 있습니다.
- 가상 키보드가 나타나지 않을 수 있습니다.
- 텍스트 선택을 위한 길게 누르기가 대신 브라우저 컨텍스트 메뉴를 트리거할 수 있습니다.
- 다른 페이지 요소와 상호작용할 때 포커스가 손실될 수 있습니다.

## 예상 동작

- 탭하면 contenteditable에 포커스가 설정되고 가상 키보드가 표시되어야 합니다.
- 길게 누르기는 텍스트 선택을 허용해야 합니다.
- 일반 편집 작업 중 포커스가 유지되어야 합니다.
