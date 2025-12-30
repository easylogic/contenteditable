---
id: ce-0017
scenarioId: scenario-touch-selection-mobile
locale: ko
os: iOS
osVersion: "Ubuntu 22.04"
device: Mobile
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: System virtual keyboard
caseTitle: 모바일 기기에서 터치 선택 핸들이 사용하기 어려움
description: "모바일 기기에서 contenteditable 영역의 텍스트를 터치로 선택하는 것이 어렵습니다. 선택 핸들이 작고 잡기 어려우며, 조정하려고 할 때 선택 범위가 예상치 못하게 변경될 수 있습니다."
tags:
  - mobile
  - touch
  - selection
  - ios
status: draft
---

## 현상

모바일 기기에서 contenteditable 영역의 텍스트를 터치로 선택하는 것이 어렵습니다. 선택 핸들이 작고 잡기 어려우며, 조정하려고 할 때 선택 범위가 예상치 못하게 변경될 수 있습니다.

## 재현 예시

1. 모바일 기기(iOS Safari)에서 contenteditable 영역을 엽니다.
2. 길게 눌러 텍스트 선택을 시작합니다.
3. 핸들을 드래그하여 선택을 조정하려고 시도합니다.
4. 선택을 정확하게 제어하는 어려움을 관찰합니다.

## 관찰된 동작

- 선택 핸들이 작고 손가락으로 잡기 어렵습니다.
- 핸들을 드래그하면 선택을 조정하는 대신 페이지가 스크롤되는 경우가 많습니다.
- 미세 조정을 시도할 때 선택이 예상치 못한 위치로 점프할 수 있습니다.
- 가상 키보드가 나타날 때 선택이 손실될 수 있습니다.

## 예상 동작

- 선택 핸들이 손가락으로 쉽게 잡을 수 있을 만큼 충분히 커야 합니다.
- 핸들을 드래그하면 페이지를 스크롤하지 않고 선택을 조정해야 합니다.
- 선택이 안정적이고 제어 가능해야 합니다.
