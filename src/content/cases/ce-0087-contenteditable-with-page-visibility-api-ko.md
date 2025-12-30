---
id: ce-0087
scenarioId: scenario-page-visibility-api
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: MacBook Pro
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Page Visibility API가 탭 전환 중 contenteditable에 영향을 줄 수 있음
description: "contenteditable 요소가 있는 페이지가 숨겨질 때(탭 전환, 최소화) Page Visibility API가 편집 상태에 영향을 줄 수 있습니다. 포커스가 손실되고 컴포지션이 중단될 수 있습니다."
tags:
  - page-visibility-api
  - focus
  - safari
  - macos
status: draft
---

### 현상

contenteditable 요소가 있는 페이지가 숨겨질 때(탭 전환, 최소화) Page Visibility API가 편집 상태에 영향을 줄 수 있습니다. 포커스가 손실되고 컴포지션이 중단될 수 있습니다.

### 재현 예시

1. 활성 컴포지션(IME)이 있는 contenteditable div를 만듭니다.
2. 다른 탭으로 전환하거나 창을 최소화합니다.
3. 원래 탭으로 다시 전환합니다.
4. 컴포지션이 계속되는지 또는 중단되는지 관찰합니다.
5. 포커스가 유지되는지 확인합니다.

### 관찰된 동작

- macOS의 Safari에서 탭 전환이 컴포지션을 중단할 수 있습니다.
- 페이지가 숨겨질 때 포커스가 손실될 수 있습니다.
- 컴포지션 상태가 보존되지 않을 수 있습니다.
- 편집이 중단될 수 있습니다.

### 예상 동작

- 페이지가 숨겨질 때 컴포지션이 우아하게 일시 중지되어야 합니다.
- 페이지가 표시될 때 포커스가 복원되어야 합니다.
- 편집 상태가 가시성 변경을 통해 보존되어야 합니다.
