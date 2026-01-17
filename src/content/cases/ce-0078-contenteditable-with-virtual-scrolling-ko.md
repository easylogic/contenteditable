---
id: ce-0078-contenteditable-with-virtual-scrolling-ko
scenarioId: scenario-virtual-scrolling
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: MacBook Pro
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 가상 스크롤링 라이브러리가 contenteditable 선택을 방해함
description: "contenteditable 요소가 가상 스크롤링 라이브러리(예: 큰 문서용)와 함께 사용될 때 가상 스크롤링 메커니즘이 텍스트 선택과 캐럿 위치 지정을 방해할 수 있습니다. 스크롤 중 DOM에서 요소가 제거될 때 선택이 손실될 수 있습니다."
tags:
  - virtual-scrolling
  - performance
  - selection
  - chrome
  - macos
status: draft
---

## 현상

contenteditable 요소가 가상 스크롤링 라이브러리(예: 큰 문서용)와 함께 사용될 때 가상 스크롤링 메커니즘이 텍스트 선택과 캐럿 위치 지정을 방해할 수 있습니다. 스크롤 중 DOM에서 요소가 제거될 때 선택이 손실될 수 있습니다.

## 재현 예시

1. 가상 스크롤링 라이브러리가 있는 contenteditable 영역을 만듭니다.
2. 많은 양의 콘텐츠를 로드합니다.
3. contenteditable에서 텍스트를 선택합니다.
4. 가상 스크롤링을 트리거하도록 스크롤합니다 (DOM 요소가 제거/추가됨).
5. 선택이 유지되는지 관찰합니다.

## 관찰된 동작

- macOS의 Chrome에서 가상 스크롤링이 선택 손실을 일으킬 수 있습니다.
- DOM 요소가 재활용될 때 캐럿 위치가 점프할 수 있습니다.
- 선택 범위가 무효화될 수 있습니다.
- 스크롤 중 편집이 중단될 수 있습니다.

## 예상 동작

- 가상 스크롤링이 contenteditable 선택을 방해하지 않아야 합니다.
- 선택이 DOM 업데이트를 통해 유지되어야 합니다.
- 또는 가상 스크롤링 중 선택을 보존하는 표준 방법이 있어야 합니다.
