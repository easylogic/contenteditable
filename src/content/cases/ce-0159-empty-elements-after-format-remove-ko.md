---
id: ce-0159-empty-elements-after-format-remove-ko
scenarioId: scenario-empty-element-cleanup
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Safari에서 서식 제거 후 빈 요소가 누적됨
description: "Safari에서 서식(굵게, 기울임꼴, 색상 등)을 제거할 때 빈 래퍼 요소가 DOM에 누적됩니다. 이러한 빈 요소는 레이아웃 문제를 일으키고 HTML을 크게 비대하게 만듭니다."
tags:
  - empty
  - formatting
  - cleanup
  - safari
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <b><i><span style="color: red;">World</span></i></b>'
    description: "Text with multiple formatting applied"
  - label: "After Removing Formats (Bug)"
    html: 'Hello <b></b><i></i><span style="color: red;"></span>World'
    description: "After formatting removal, empty wrapper elements (&lt;b&gt;, &lt;i&gt;, &lt;span&gt;) remain"
  - label: "✅ Expected"
    html: 'Hello World'
    description: "Expected: Empty elements removed, clean DOM"
---

## 현상

Safari에서 서식(굵게, 기울임꼴, 색상 등)을 제거할 때 빈 래퍼 요소가 DOM에 누적됩니다. 이러한 빈 요소는 레이아웃 문제를 일으키고 HTML을 크게 비대하게 만듭니다.

## 재현 예시

1. 텍스트에 여러 서식을 적용합니다
2. 서식을 하나씩 제거합니다
3. DOM 구조를 관찰합니다

## 관찰된 동작

- 빈 `<span>`, `<b>`, `<i>` 요소가 남습니다
- style 속성이 있는 빈 요소가 남습니다
- DOM이 크게 비대해집니다
- 레이아웃에 예상치 못한 간격이 있습니다

## 예상 동작

- 빈 요소가 제거되어야 합니다
- DOM이 깨끗해야 합니다
- 불필요한 요소가 남지 않아야 합니다
- 구조가 정규화되어야 합니다

## 브라우저 비교

- **Chrome/Edge**: 일부 빈 요소를 남길 수 있음
- **Firefox**: 빈 요소를 남길 가능성이 더 높음
- **Safari**: 빈 요소를 누적할 가능성이 가장 높음 (이 케이스)

## 참고 및 해결 방법 가능한 방향

- 적극적인 정리 로직 구현
- 모든 빈 서식 요소 제거
- DOM 구조를 정기적으로 정규화
- 각 서식 작업 후 정리
