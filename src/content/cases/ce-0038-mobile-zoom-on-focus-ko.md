---
id: ce-0038
scenarioId: scenario-mobile-touch-behavior
locale: ko
os: iOS
osVersion: "Ubuntu 22.04"
device: Mobile
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: System virtual keyboard
caseTitle: 모바일에서 contenteditable 포커스 시 페이지가 확대됨
description: "iOS Safari에서 contenteditable 영역이 포커스를 받을 때 페이지가 자동으로 확대될 수 있습니다. 이는 혼란을 줄 수 있으며 레이아웃 문제를 일으킬 수 있습니다."
tags:
  - mobile
  - zoom
  - focus
  - ios
status: draft
---

### 현상

iOS Safari에서 contenteditable 영역이 포커스를 받을 때 페이지가 자동으로 확대될 수 있습니다. 이는 혼란을 줄 수 있으며 레이아웃 문제를 일으킬 수 있습니다.

### 재현 예시

1. iOS Safari에서 contenteditable 영역이 있는 페이지를 엽니다.
2. 뷰포트 메타 태그에 `user-scalable=no` 또는 고정된 `width`가 있는지 확인합니다.
3. contenteditable 영역을 탭하여 포커스합니다.
4. 페이지가 확대되는지 관찰합니다.

### 관찰된 동작

- iOS Safari에서 contenteditable에 포커스하면 자동 확대가 트리거될 수 있습니다.
- 확대 수준이 예상치 못하거나 부적절할 수 있습니다.
- contenteditable이 포커스를 잃은 후에도 확대가 지속될 수 있습니다.

### 예상 동작

- contenteditable에 포커스해도 자동 확대가 트리거되지 않아야 합니다.
- 또는 CSS 또는 메타 태그를 통해 확대 동작을 제어할 수 있어야 합니다.
- 포커스 변경 중 뷰포트가 안정적으로 유지되어야 합니다.
