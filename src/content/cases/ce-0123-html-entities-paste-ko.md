---
id: ce-0123
scenarioId: scenario-html-entity-encoding
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 붙여넣기 시 HTML 엔티티가 일관되지 않게 디코딩됨
description: "HTML 엔티티(&lt;, &gt;, &amp; 등)가 포함된 콘텐츠를 붙여넣을 때 엔티티가 실제 문자로 디코딩되거나 엔티티로 보존되는 것이 일관되지 않을 수 있습니다. 이것은 특수 문자에 문제를 일으킵니다."
tags:
  - html
  - entity
  - encoding
  - paste
  - chrome
status: draft
domSteps:
  - label: "Clipboard"
    html: '&lt;div&gt;'
    description: "Copied HTML entities"
  - label: "❌ After Paste (Bug - Decoded)"
    html: '<div>'
    description: "Entities decoded and inserted as actual HTML tags"
  - label: "❌ After Paste (Bug - Preserved)"
    html: '&lt;div&gt;'
    description: "Entities preserved as-is and displayed as text (inconsistent)"
  - label: "✅ Expected"
    html: '&lt;div&gt;'
    description: "Expected: Consistent entity handling (preserve or decode)"
---

## 현상

HTML 엔티티(`&lt;`, `&gt;`, `&amp;` 등)가 포함된 콘텐츠를 붙여넣을 때 엔티티가 실제 문자로 디코딩되거나 엔티티로 보존되는 것이 일관되지 않을 수 있습니다. 이것은 특수 문자에 문제를 일으킵니다.

## 재현 예시

1. HTML 엔티티가 포함된 텍스트를 복사합니다 (예: `&lt;div&gt;`)
2. contenteditable 요소에 붙여넣습니다
3. DOM을 관찰합니다

## 관찰된 동작

- 엔티티가 디코딩될 수 있습니다: DOM에 `<div>`가 나타남
- 또는 엔티티가 보존될 수 있습니다: DOM에 `&lt;div&gt;`가 있음
- 동작이 일관되지 않습니다
- 특수 문자가 손실되거나 변경될 수 있습니다

## 예상 동작

- 엔티티 처리가 일관되어야 합니다
- 또는 동작이 예측 가능해야 합니다
- 특수 문자가 올바르게 보존되어야 합니다
- 인코딩/디코딩이 명시적이어야 합니다

## 브라우저 비교

- **Chrome/Edge**: 엔티티 처리가 일관되지 않음 (이 케이스)
- **Firefox**: 유사한 일관되지 않은 동작
- **Safari**: 엔티티 처리가 다양함

## 참고 및 해결 방법 가능한 방향

- 붙여넣기 후 엔티티 인코딩 정규화
- 엔티티를 명시적으로 디코딩하거나 인코딩
- 특수 문자를 주의 깊게 처리
- 예상 엔티티 동작 문서화
