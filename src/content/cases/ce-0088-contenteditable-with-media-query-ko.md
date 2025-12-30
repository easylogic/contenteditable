---
id: ce-0088
scenarioId: scenario-media-query-layout
locale: ko
os: iOS
osVersion: "17.0"
device: iPhone
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: 미디어 쿼리 레이아웃 변경이 contenteditable 편집을 방해할 수 있음
description: "contenteditable 요소가 있는 페이지가 미디어 쿼리 변경(예: 방향 변경, 창 크기 조정)에 응답할 때 레이아웃 변경이 편집을 방해할 수 있습니다. 캐럿 위치가 점프하고 선택이 손실될 수 있습니다."
tags:
  - media-query
  - layout
  - mobile
  - ios
  - safari
status: draft
---

### 현상

contenteditable 요소가 있는 페이지가 미디어 쿼리 변경(예: 방향 변경, 창 크기 조정)에 응답할 때 레이아웃 변경이 편집을 방해할 수 있습니다. 캐럿 위치가 점프하고 선택이 손실될 수 있습니다.

### 재현 예시

1. 반응형 페이지에 contenteditable div를 만듭니다.
2. 텍스트가 선택된 상태로 편집을 시작합니다.
3. 기기를 회전하거나 창 크기를 조정하여 미디어 쿼리 변경을 트리거합니다.
4. 편집이 원활하게 계속되는지 관찰합니다.
5. 캐럿 위치와 선택이 유지되는지 확인합니다.

### 관찰된 동작

- iOS의 Safari에서 레이아웃 변경이 편집을 방해할 수 있습니다.
- 레이아웃 재계산 중 캐럿 위치가 점프할 수 있습니다.
- 선택이 손실될 수 있습니다.
- 가상 키보드가 예상치 못하게 닫힐 수 있습니다.

### 예상 동작

- 레이아웃 변경이 편집을 방해하지 않아야 합니다.
- 캐럿 위치가 보존되어야 합니다.
- 선택이 유지되어야 합니다.
- 편집이 원활하게 계속되어야 합니다.
