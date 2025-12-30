---
id: ce-0086
scenarioId: scenario-fullscreen-api
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Fullscreen API가 contenteditable 포커스와 선택에 영향을 줄 수 있음
description: "contenteditable 요소가 Fullscreen API를 사용하여 전체 화면 모드로 들어가거나 나올 때 포커스와 선택이 손실될 수 있습니다. 캐럿 위치가 재설정되고 편집이 중단될 수 있습니다."
tags:
  - fullscreen-api
  - focus
  - chrome
  - windows
status: draft
---

## 현상

contenteditable 요소가 Fullscreen API를 사용하여 전체 화면 모드로 들어가거나 나올 때 포커스와 선택이 손실될 수 있습니다. 캐럿 위치가 재설정되고 편집이 중단될 수 있습니다.

## 재현 예시

1. 선택된 텍스트가 있는 contenteditable div를 만듭니다.
2. 프로그래밍 방식으로 전체 화면 모드로 들어갑니다.
3. 포커스와 선택이 유지되는지 관찰합니다.
4. 전체 화면 모드를 종료합니다.
5. 포커스와 선택이 복원되는지 확인합니다.

## 관찰된 동작

- Windows의 Chrome에서 전체 화면 전환이 포커스 손실을 일으킬 수 있습니다.
- 전체 화면으로 들어갈 때 선택이 지워질 수 있습니다.
- 캐럿 위치가 재설정될 수 있습니다.
- 전환 중 편집이 중단될 수 있습니다.

## 예상 동작

- 포커스와 선택이 전체 화면 전환 중 유지되어야 합니다.
- 캐럿 위치가 보존되어야 합니다.
- 편집이 원활하게 계속되어야 합니다.
