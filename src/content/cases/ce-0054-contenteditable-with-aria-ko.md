---
id: ce-0054
scenarioId: scenario-accessibility-aria
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable의 ARIA 속성이 제대로 알려지지 않음
description: "contenteditable 영역에 ARIA 속성(role, aria-label, aria-describedby 등)을 적용할 때 Safari에서 스크린 리더가 이를 제대로 알리지 않을 수 있습니다. 접근성 정보가 사용자에게 전달되지 않습니다."
tags:
  - accessibility
  - aria
  - screen-reader
  - safari
status: draft
---

## 현상

contenteditable 영역에 ARIA 속성(예: `role`, `aria-label`, `aria-describedby`)을 적용할 때 Safari에서 스크린 리더가 이를 제대로 알리지 않을 수 있습니다. 접근성 정보가 손실됩니다.

## 재현 예시

1. ARIA 속성이 있는 contenteditable div를 만듭니다:
   ```html
   <div contenteditable role="textbox" aria-label="Editor" aria-describedby="help-text">
     Content here
   </div>
   ```
2. VoiceOver를 활성화합니다.
3. contenteditable로 이동합니다.
4. 알려지는 내용을 관찰합니다.

## 관찰된 동작

- macOS의 Safari에서 스크린 리더가 ARIA 속성을 알리지 않을 수 있습니다.
- 역할과 레이블 정보가 손실됩니다.
- 스크린 리더에 의존하는 사용자가 요소의 목적을 이해하지 못할 수 있습니다.

## 예상 동작

- 스크린 리더가 ARIA 속성을 제대로 알려야 합니다.
- 역할, 레이블 및 설명이 전달되어야 합니다.
- 요소가 보조 기술에 접근 가능해야 합니다.
