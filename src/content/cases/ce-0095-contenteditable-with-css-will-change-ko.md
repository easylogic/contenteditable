---
id: ce-0095
scenarioId: scenario-css-will-change
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: MacBook Pro
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: CSS will-change가 contenteditable 성능을 개선하거나 저하시킬 수 있음
description: "contenteditable 요소에 CSS will-change 속성이 설정되어 있을 때 성능이 영향을 받을 수 있습니다. 경우에 따라 다가오는 변경에 대해 브라우저에 힌트를 제공하여 성능을 개선할 수 있지만, 다른 경우에는 불필요한 레이어 생성을 일으켜 성능을 저하시킬 수 있습니다."
tags:
  - css-will-change
  - performance
  - chrome
  - macos
status: draft
---

## 현상

contenteditable 요소에 CSS `will-change` 속성이 설정되어 있을 때 성능이 영향을 받을 수 있습니다. 경우에 따라 다가오는 변경에 대해 브라우저에 힌트를 제공하여 성능을 개선할 수 있지만, 다른 경우에는 불필요한 레이어를 생성하여 성능을 저하시킬 수 있습니다.

## 재현 예시

1. `will-change: contents` 또는 `will-change: transform`이 있는 contenteditable div를 만듭니다.
2. 빠르게 텍스트를 입력하고 성능을 측정합니다.
3. 다른 will-change 값을 시도합니다.
4. will-change가 있는 경우와 없는 경우의 성능을 비교합니다.
5. 메모리 사용량을 확인합니다.

## 관찰된 동작

- macOS의 Chrome에서 will-change가 성능에 혼합된 영향을 줄 수 있습니다.
- 일부 값은 성능을 개선할 수 있습니다.
- 다른 값은 성능을 저하시킬 수 있습니다.
- 메모리 사용량이 증가할 수 있습니다.

## 예상 동작

- will-change가 일관된 성능 이점을 제공해야 합니다.
- 또는 동작이 명확하게 문서화되어야 합니다.
- 메모리 사용량이 합리적으로 유지되어야 합니다.
