---
id: ce-0104
scenarioId: scenario-line-break-element-type
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Chrome에서 Enter 키가 단락 대신 div 요소를 생성함
description: "Chrome에서 contenteditable 요소에서 Enter를 누르면 <p> 단락 대신 새로운 <div> 요소가 생성됩니다. 이것은 <p> 요소를 생성하는 Firefox와 다르며 CSS 스타일링 차이를 일으킬 수 있습니다."
tags:
  - line-break
  - div
  - paragraph
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<div>Hello</div>'
    description: "Basic text"
  - label: "After Enter (Bug)"
    html: '<div>Hello</div><div><br></div>'
    description: "Enter creates &lt;div&gt; element (Firefox uses &lt;p&gt;)"
  - label: "✅ Expected (Normalized)"
    html: '<p>Hello</p><p></p>'
    description: "Expected: Consistent element type used (all &lt;p&gt; or all &lt;div&gt;)"
---

## 현상

Chrome에서 contenteditable 요소에서 Enter를 누르면 `<p>` 단락 대신 새로운 `<div>` 요소가 생성됩니다. 이것은 `<p>` 요소를 생성하는 Firefox와 다르며 CSS 스타일링 차이를 일으킬 수 있습니다.

## 재현 예시

1. contenteditable 요소에 포커스합니다
2. 일부 텍스트를 입력합니다
3. Enter를 누릅니다

## 관찰된 동작

- 새로운 `<div>` 요소가 생성됩니다 (예: `<div><br></div>`)
- Firefox는 대신 `<p>` 요소를 생성합니다
- CSS 기본 여백이 `<div>`와 `<p>` 간에 다릅니다
- DOM 구조가 브라우저 간에 일관되지 않습니다

## 예상 동작

- `<div>` 또는 `<p>`가 일관되게 사용되어야 합니다
- 또는 동작이 구성 가능해야 합니다
- CSS 스타일링이 요소 유형 차이를 고려해야 합니다

## 브라우저 비교

- **Chrome/Edge**: `<div>` 요소 생성 (이 케이스)
- **Firefox**: `<p>` 요소 생성
- **Safari**: 컨텍스트에 따라 `<div>`, `<p>` 또는 `<br>` 생성할 수 있음

## 참고 및 해결 방법 가능한 방향

- Enter 키 후 DOM 구조 정규화
- 일관성을 위해 모든 `<div>` 요소를 `<p>`로 변환
- 또는 Chrome과 일치하도록 모든 `<p>`를 `<div>`로 변환
- 요소 유형에 관계없이 여백을 정규화하기 위해 CSS 사용
