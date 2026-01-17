---
id: ce-0046-mobile-double-tap-zoom-ko
scenarioId: scenario-mobile-touch-behavior
locale: ko
os: iOS
osVersion: "Ubuntu 22.04"
device: Mobile
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: System virtual keyboard
caseTitle: contenteditable에서 더블 탭이 페이지 확대를 트리거함
description: "iOS Safari에서 contenteditable 영역을 더블 탭하면 단어 선택 대신 페이지 확대가 트리거됩니다. 이는 예상되는 텍스트 편집 동작을 방해합니다."
tags:
  - mobile
  - zoom
  - double-tap
  - ios
status: draft
---

## 현상

iOS Safari에서 contenteditable 영역을 더블 탭하면 단어 선택 대신 페이지 확대가 트리거됩니다. 이는 예상되는 텍스트 편집 동작을 방해합니다.

## 재현 예시

1. iOS Safari에서 contenteditable 영역이 있는 페이지를 엽니다.
2. contenteditable 내의 단어를 더블 탭합니다.
3. 페이지가 확대되는지 또는 단어가 선택되는지 관찰합니다.

## 관찰된 동작

- iOS Safari에서 더블 탭이 페이지 확대를 트리거합니다.
- 예상대로 단어 선택이 발생하지 않습니다.
- 확대가 텍스트 편집 워크플로우를 방해합니다.

## 예상 동작

- 더블 탭은 페이지를 확대하는 대신 단어를 선택해야 합니다.
- 또는 contenteditable 영역에 대해 확대가 비활성화되어야 합니다.
- 모바일 기기에서 텍스트 선택이 예상대로 작동해야 합니다.
