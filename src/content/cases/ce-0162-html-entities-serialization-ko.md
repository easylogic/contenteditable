---
id: ce-0162
scenarioId: scenario-html-entity-encoding
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 직렬화 시 HTML 엔티티가 일관되지 않게 인코딩됨
description: "Chrome에서 contenteditable 콘텐츠를 직렬화할 때(예: innerHTML 사용) 특수 문자가 HTML 엔티티로 인코딩되거나 실제 문자로 유지되는 것이 일관되지 않을 수 있습니다. 이것은 출력 형식을 예측하기 어렵게 만듭니다."
tags:
  - html
  - entity
  - encoding
  - serialization
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<div>Test</div>'
    description: "Content with special characters"
  - label: "After innerHTML (Bug - Encoded)"
    html: '&lt;div&gt;Test&lt;/div&gt;'
    description: "When serializing, encoded as HTML entities"
  - label: "After innerHTML (Bug - Not Encoded)"
    html: '<div>Test</div>'
    description: "When serializing, kept as-is (inconsistent)"
  - label: "✅ Expected"
    html: '<div>Test</div>'
    description: "Expected: Consistent encoding handling"
---

## 현상

Chrome에서 contenteditable 콘텐츠를 직렬화할 때(예: `innerHTML` 사용) 특수 문자가 HTML 엔티티로 인코딩되거나 실제 문자로 유지되는 것이 일관되지 않을 수 있습니다. 이것은 출력 형식을 예측하기 어렵게 만듭니다.

## 재현 예시

1. 특수 문자가 있는 텍스트를 삽입합니다: `<div>Test</div>`
2. `element.innerHTML`를 사용하여 직렬화합니다
3. 출력을 관찰합니다

## 관찰된 동작

- 문자가 인코딩될 수 있습니다: `&lt;div&gt;Test&lt;/div&gt;`
- 또는 문자가 그대로 유지될 수 있습니다: `<div>Test</div>`
- 인코딩이 일관되지 않습니다
- 출력 형식이 예측 불가능합니다

## 예상 동작

- 엔티티 인코딩이 일관되어야 합니다
- 또는 인코딩이 예측 가능해야 합니다
- 특수 문자가 올바르게 처리되어야 합니다
- 출력 형식이 안정적이어야 합니다

## 브라우저 비교

- **Chrome/Edge**: 인코딩이 일관되지 않음 (이 케이스)
- **Firefox**: 유사한 인코딩 불일치
- **Safari**: 인코딩 동작이 다양함

## 참고 및 해결 방법 가능한 방향

- 직렬화 후 엔티티 인코딩 정규화
- 일관된 인코딩 전략 사용
- 예상 인코딩 동작 문서화
- 특수 문자를 명시적으로 처리
