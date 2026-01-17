---
id: ce-0093-contenteditable-with-css-backdrop-filter-ko
scenarioId: scenario-css-backdrop-filter
locale: ko
os: iOS
osVersion: "17.0"
device: iPhone
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: CSS backdrop-filter가 contenteditable에서 렌더링 문제를 일으킬 수 있음
description: "contenteditable 요소에 CSS backdrop-filter가 적용되어 있을 때 렌더링이 영향을 받을 수 있습니다. 텍스트가 흐릿하게 나타날 수 있으며, 선택이 올바르게 렌더링되지 않을 수 있고, 특히 모바일 기기에서 성능이 저하될 수 있습니다."
tags:
  - css-backdrop-filter
  - rendering
  - mobile
  - ios
  - safari
status: draft
---

## 현상

contenteditable 요소에 CSS `backdrop-filter`가 적용되어 있을 때 렌더링이 영향을 받을 수 있습니다. 텍스트가 흐릿하게 나타날 수 있으며, 선택이 올바르게 렌더링되지 않을 수 있고, 특히 모바일 기기에서 성능이 저하될 수 있습니다.

## 재현 예시

1. `backdrop-filter: blur(10px)`가 있는 contenteditable div를 만듭니다.
2. 텍스트를 입력하고 렌더링 품질을 관찰합니다.
3. 텍스트를 선택하고 선택 렌더링을 관찰합니다.
4. contenteditable을 스크롤하고 성능을 관찰합니다.
5. 모바일 기기에서 테스트합니다.

## 관찰된 동작

- iOS의 Safari에서 backdrop-filter가 렌더링 문제를 일으킬 수 있습니다.
- 텍스트가 흐릿하거나 왜곡되어 나타날 수 있습니다.
- 선택이 올바르게 렌더링되지 않을 수 있습니다.
- 특히 모바일에서 성능이 나쁠 수 있습니다.

## 예상 동작

- backdrop-filter가 텍스트 렌더링 품질에 영향을 주지 않아야 합니다.
- 선택이 올바르게 렌더링되어야 합니다.
- 성능이 허용 가능한 수준을 유지해야 합니다.
