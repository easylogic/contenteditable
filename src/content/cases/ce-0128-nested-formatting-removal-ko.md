---
id: ce-0128
scenarioId: scenario-nested-formatting
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 중첩 서식 제거가 빈 또는 부분 요소를 남김
description: "중첩 서식이 있는 텍스트(예: <b><i>text</i></b>)에서 서식을 제거할 때 빈 또는 부분 서식 요소가 DOM에 남을 수 있습니다. 구조가 깨집니다."
tags:
  - formatting
  - nested
  - removal
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <b><i>World</i></b>'
    description: "Nested formatting (bold + italic)"
  - label: "After Removing Bold (Bug)"
    html: 'Hello <b></b><i>World</i>'
    description: "After bold removal, empty &lt;b&gt; element remains"
  - label: "✅ Expected"
    html: 'Hello <i>World</i>'
    description: "Expected: Empty elements removed, clean nested structure"
---

## 현상

중첩 서식이 있는 텍스트(예: `<b><i>text</i></b>`)에서 서식을 제거할 때 빈 또는 부분 서식 요소가 DOM에 남을 수 있습니다. 구조가 깨집니다.

## 재현 예시

1. 텍스트에 굵게와 기울임꼴을 적용합니다: `<b><i>formatted text</i></b>`
2. 굵게 서식을 제거합니다
3. DOM 구조를 관찰합니다

## 관찰된 동작

- 빈 `<b></b>` 요소가 남을 수 있습니다
- 또는 부분 중첩이 남을 수 있습니다: `<b><i>text</i></b>`가 `<i>text</i>`가 되지만 `<b>` 래퍼가 남을 수 있음
- DOM 구조가 깨집니다
- 빈 요소가 누적됩니다

## 예상 동작

- 서식이 깨끗하게 제거되어야 합니다
- 빈 요소가 남지 않아야 합니다
- 구조가 정규화되어야 합니다
- DOM이 깨끗해야 합니다

## 브라우저 비교

- **Chrome/Edge**: 빈 요소를 남길 수 있음 (이 케이스)
- **Firefox**: 빈 구조를 남길 가능성이 더 높음
- **Safari**: 깨진 구조를 남길 가능성이 가장 높음

## 참고 및 해결 방법 가능한 방향

- 제거 후 서식 구조 정규화
- 빈 서식 요소 제거
- 중첩 구조 병합 또는 언래핑
- DOM을 정기적으로 정리
