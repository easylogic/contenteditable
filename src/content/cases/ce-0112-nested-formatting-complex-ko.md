---
id: ce-0112
scenarioId: scenario-nested-formatting
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 여러 서식 적용이 깊게 중첩된 구조를 만듦
description: "텍스트에 여러 서식 작업(굵게, 기울임꼴, 밑줄)을 적용할 때 깊게 중첩된 HTML 구조가 생성됩니다 (예: <b><i><u>text</u></i></b>). 이것은 DOM을 복잡하고 관리하기 어렵게 만듭니다."
tags:
  - formatting
  - nested
  - bold
  - italic
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Text'
    description: "Basic text"
  - label: "After Bold"
    html: '<b>Text</b>'
    description: "Bold formatting applied"
  - label: "After Italic (Bug)"
    html: '<b><i>Text</i></b>'
    description: "Italic formatting applied, nested structure created"
  - label: "After Underline (Bug)"
    html: '<b><i><u>Text</u></i></b>'
    description: "Underline formatting applied, deep nested structure created"
  - label: "✅ Expected (Normalized)"
    html: '<span style="font-weight: bold; font-style: italic; text-decoration: underline;">Text</span>'
    description: "Expected: Consolidated into style attribute, nesting minimized"
---

## 현상

텍스트에 여러 서식 작업(굵게, 기울임꼴, 밑줄)을 적용할 때 깊게 중첩된 HTML 구조가 생성됩니다 (예: `<b><i><u>text</u></i></b>`). 이것은 DOM을 복잡하고 관리하기 어렵게 만듭니다.

## 재현 예시

1. 일부 텍스트를 선택합니다
2. 굵게 서식을 적용합니다
3. 기울임꼴 서식을 적용합니다
4. 밑줄 서식을 적용합니다
5. DOM 구조를 관찰합니다

## 관찰된 동작

- 깊게 중첩된 구조: `<b><i><u>text</u></i></b>`
- 또는 적용 순서에 따라 다른 중첩 순서
- DOM이 복잡하고 비대해집니다
- 서식 상태를 관리하기 어렵습니다

## 예상 동작

- 서식이 효율적으로 적용되어야 합니다
- 가능한 경우 중첩이 최소화되어야 합니다
- 구조가 정규화되어야 합니다
- 서식 상태를 쿼리하기 쉬워야 합니다

## 브라우저 비교

- **Chrome/Edge**: 중첩 구조 생성 (이 케이스)
- **Firefox**: 유사한 중첩 동작
- **Safari**: 가장 복잡한 중첩

## 참고 및 해결 방법 가능한 방향

- 작업 후 서식 구조 정규화
- 같은 유형의 서식 요소 병합
- 일관된 중첩 순서 사용
- 중첩 요소 대신 데이터 속성 사용 고려
