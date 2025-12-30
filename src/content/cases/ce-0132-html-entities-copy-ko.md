---
id: ce-0132
scenarioId: scenario-html-entity-encoding
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 복사 시 HTML 엔티티가 일관되지 않게 인코딩됨
description: "contenteditable 요소에서 특수 문자가 포함된 콘텐츠를 복사할 때 문자가 HTML 엔티티로 인코딩되거나 실제 문자로 복사되는 것이 일관되지 않을 수 있습니다. 이것은 다른 곳에 붙여넣을 때 문제를 일으킵니다."
tags:
  - html
  - entity
  - encoding
  - copy
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<div>Test</div>'
    description: "Content with special characters"
  - label: "Clipboard (Bug - Encoded)"
    html: '&lt;div&gt;Test&lt;/div&gt;'
    description: "When copying, encoded as HTML entities"
  - label: "Clipboard (Bug - Not Encoded)"
    html: '<div>Test</div>'
    description: "When copying, copied as-is (inconsistent)"
  - label: "✅ Expected"
    html: '<div>Test</div>'
    description: "Expected: Consistent encoding handling"
---

## 현상

contenteditable 요소에서 특수 문자가 포함된 콘텐츠를 복사할 때 문자가 HTML 엔티티로 인코딩되거나 실제 문자로 복사되는 것이 일관되지 않을 수 있습니다. 이것은 다른 곳에 붙여넣을 때 문제를 일으킵니다.

## 재현 예시

1. 특수 문자가 있는 콘텐츠를 만듭니다: `<div>Test</div>`
2. 콘텐츠를 선택하고 복사합니다
3. 클립보드 데이터를 확인합니다

## 관찰된 동작

- 문자가 인코딩될 수 있습니다: `&lt;div&gt;Test&lt;/div&gt;`
- 또는 문자가 그대로 복사될 수 있습니다: `<div>Test</div>`
- 동작이 일관되지 않습니다
- 다른 곳에 붙여넣을 때 다른 결과가 표시될 수 있습니다

## 예상 동작

- 엔티티 인코딩이 일관되어야 합니다
- 또는 동작이 예측 가능해야 합니다
- 특수 문자가 올바르게 보존되어야 합니다
- 복사/붙여넣기가 안정적으로 작동해야 합니다

## 브라우저 비교

- **Chrome/Edge**: 엔티티 인코딩이 일관되지 않음 (이 케이스)
- **Firefox**: 유사한 일관되지 않은 동작
- **Safari**: 엔티티 처리가 다양함

## 참고 및 해결 방법 가능한 방향

- 복사 전 엔티티 인코딩 정규화
- 인코딩을 제어하기 위해 Clipboard API 사용
- 특수 문자를 명시적으로 처리
- 예상 복사 동작 문서화
