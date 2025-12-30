---
id: ce-0092
scenarioId: scenario-css-filter
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: MacBook Pro
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: CSS filter가 contenteditable 성능에 영향을 줄 수 있음
description: "contenteditable 요소에 CSS filter(blur, brightness 등)가 적용되어 있을 때 편집 성능이 저하될 수 있습니다. 입력이 지연될 수 있으며, 선택이 느리게 업데이트될 수 있습니다."
tags:
  - css-filter
  - performance
  - chrome
  - macos
status: draft
---

## 현상

contenteditable 요소에 CSS filter(blur, brightness 등)가 적용되어 있을 때 편집 성능이 저하될 수 있습니다. 입력이 지연될 수 있으며, 선택이 느리게 업데이트될 수 있습니다.

## 재현 예시

1. `filter: blur(2px) brightness(1.2)`가 있는 contenteditable div를 만듭니다.
2. 빠르게 텍스트를 입력합니다.
3. 입력 지연이나 버벅임을 관찰합니다.
4. 텍스트를 선택하고 반응성을 관찰합니다.
5. 필터가 없는 contenteditable과 성능을 비교합니다.

## 관찰된 동작

- macOS의 Chrome에서 CSS filter가 성능 문제를 일으킬 수 있습니다.
- 입력이 지연되거나 버벅일 수 있습니다.
- 선택 업데이트가 느릴 수 있습니다.
- 빠른 편집 중 UI가 반응하지 않을 수 있습니다.

## 예상 동작

- CSS filter가 편집 성능에 큰 영향을 주지 않아야 합니다.
- 또는 filter가 contenteditable 사용 사례에 최적화되어야 합니다.
- filter가 적용되어도 성능이 허용 가능한 수준을 유지해야 합니다.
