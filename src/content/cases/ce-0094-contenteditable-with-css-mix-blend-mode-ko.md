---
id: ce-0094-contenteditable-with-css-mix-blend-mode-ko
scenarioId: scenario-css-mix-blend-mode
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: CSS mix-blend-mode가 contenteditable 텍스트 렌더링에 영향을 줄 수 있음
description: "contenteditable 요소에 CSS mix-blend-mode가 적용되어 있을 때 텍스트 렌더링이 영향을 받을 수 있습니다. 텍스트가 잘못된 색상으로 나타날 수 있으며, 선택이 보이지 않을 수 있고, 캐럿이 올바르게 렌더링되지 않을 수 있습니다."
tags:
  - css-mix-blend-mode
  - rendering
  - firefox
  - windows
status: draft
---

## 현상

contenteditable 요소에 CSS `mix-blend-mode`가 적용되어 있을 때 텍스트 렌더링이 영향을 받을 수 있습니다. 텍스트가 잘못된 색상으로 나타날 수 있으며, 선택이 보이지 않을 수 있고, 캐럿이 올바르게 렌더링되지 않을 수 있습니다.

## 재현 예시

1. 색상 배경 위에 `mix-blend-mode: multiply`가 있는 contenteditable div를 만듭니다.
2. 텍스트를 입력하고 색상 렌더링을 관찰합니다.
3. 텍스트를 선택하고 선택 가시성을 관찰합니다.
4. 캐럿 렌더링을 관찰합니다.
5. mix-blend-mode가 없는 contenteditable과 비교합니다.

## 관찰된 동작

- Windows의 Firefox에서 mix-blend-mode가 텍스트 렌더링에 영향을 줄 수 있습니다.
- 텍스트 색상이 잘못될 수 있습니다.
- 선택이 보이지 않을 수 있습니다.
- 캐럿이 올바르게 렌더링되지 않을 수 있습니다.

## 예상 동작

- mix-blend-mode가 텍스트 가독성에 영향을 주지 않아야 합니다.
- 선택이 보여야 합니다.
- 캐럿이 올바르게 렌더링되어야 합니다.
