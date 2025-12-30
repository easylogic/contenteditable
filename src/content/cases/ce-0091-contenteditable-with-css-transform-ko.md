---
id: ce-0091
scenarioId: scenario-css-transform
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: US
caseTitle: CSS transform가 선택 핸들이 잘못된 위치에 나타나게 할 수 있음
description: "contenteditable 요소에 CSS transform(translate, scale, rotate)이 적용되어 있을 때 선택 핸들과 캐럿이 잘못된 위치에 나타날 수 있습니다. 시각적 위치가 실제 DOM 위치와 일치하지 않을 수 있습니다."
tags:
  - css-transform
  - selection
  - edge
  - windows
status: draft
---

## 현상

contenteditable 요소에 CSS transform(translate, scale, rotate)이 적용되어 있을 때 선택 핸들과 캐럿이 잘못된 위치에 나타날 수 있습니다. 시각적 위치가 실제 선택 위치와 일치하지 않을 수 있습니다.

## 재현 예시

1. `transform: scale(0.8) translateX(50px)`가 있는 contenteditable div를 만듭니다.
2. contenteditable에서 텍스트를 선택합니다.
3. 선택 핸들의 위치를 관찰합니다.
4. 편집 중 캐럿 위치를 관찰합니다.
5. 시각적 위치를 실제 선택과 비교합니다.

## 관찰된 동작

- Windows의 Edge에서 CSS transform이 선택 핸들 정렬 오류를 일으킬 수 있습니다.
- 캐럿 위치가 오프셋되어 나타날 수 있습니다.
- 선택 핸들이 선택된 텍스트와 정렬되지 않을 수 있습니다.
- 모바일의 터치 선택이 영향을 받을 수 있습니다.

## 예상 동작

- CSS transform이 선택 핸들 위치 지정에 영향을 주지 않아야 합니다.
- 캐럿이 올바른 시각적 위치에 나타나야 합니다.
- 선택 핸들이 선택된 텍스트와 정렬되어야 합니다.
