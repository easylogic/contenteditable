---
id: ce-0081
scenarioId: scenario-resize-observer-interference
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: ResizeObserver가 contenteditable 편집 중 레이아웃 이동을 일으킬 수 있음
description: "ResizeObserver가 contenteditable 요소에 연결되어 있을 때 콘텐츠 크기가 변경되면서 편집 중 관찰자가 트리거될 수 있습니다. 특히 관찰자가 크기 변경에 응답하여 DOM을 수정할 때 레이아웃 재계산과 시각적 점프를 일으킬 수 있습니다."
tags:
  - resize-observer
  - layout
  - performance
  - chrome
  - windows
status: draft
---

### 현상

ResizeObserver가 contenteditable 요소에 연결되어 있을 때 콘텐츠 크기가 변경되면서 편집 중 관찰자가 트리거될 수 있습니다. 특히 contenteditable에 동적 높이가 있을 때 레이아웃 재계산과 시각적 점프를 일으킬 수 있습니다.

### 재현 예시

1. 자동 높이가 있는 contenteditable div를 만듭니다.
2. 크기 변경을 모니터링하는 ResizeObserver를 연결합니다.
3. contenteditable이 커지도록 텍스트를 입력합니다.
4. 레이아웃 이동이나 시각적 점프를 관찰합니다.
5. 관찰자 콜백이 편집 성능에 영향을 주는지 확인합니다.

### 관찰된 동작

- Windows의 Chrome에서 ResizeObserver가 편집 중 자주 트리거될 수 있습니다.
- 레이아웃 재계산이 시각적 점프를 일으킬 수 있습니다.
- 캐럿 위치가 예상치 못하게 이동할 수 있습니다.
- 빈번한 크기 조정 이벤트로 인해 성능이 영향을 받을 수 있습니다.

### 예상 동작

- ResizeObserver가 편집 중 레이아웃 이동을 일으키지 않아야 합니다.
- 또는 크기 조정 이벤트가 디바운스되거나 일괄 처리되어야 합니다.
- 크기 조정 중 캐럿 위치가 안정적으로 유지되어야 합니다.
