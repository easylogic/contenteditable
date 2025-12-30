---
id: ce-0168
scenarioId: scenario-line-break-element-type
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Firefox에서 Enter 키가 단락 요소를 만듦
description: "Firefox에서 contenteditable 요소에서 Enter를 누르면 <div> 대신 새로운 <p> 단락 요소가 생성됩니다. 이것은 <div> 요소를 만드는 Chrome과 다르며 CSS 스타일링 차이를 일으킬 수 있습니다."
tags:
  - line-break
  - paragraph
  - div
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: '<div>Hello</div>'
    description: "First line"
  - label: "After Enter (Firefox)"
    html: '<div>Hello</div><p><br></p>'
    description: "Enter key creates &lt;p&gt; element (Firefox)"
  - label: "After Enter (Chrome)"
    html: '<div>Hello</div><div><br></div>'
    description: "Enter key creates &lt;div&gt; element (Chrome)"
  - label: "✅ Expected"
    html: '<div>Hello</div><div><br></div>'
    description: "Expected: Consistent element type used (or selectable)"
---

## 현상

Firefox에서 contenteditable 요소에서 Enter를 누르면 `<div>` 대신 새로운 `<p>` 단락 요소가 생성됩니다. 이것은 `<div>` 요소를 만드는 Chrome과 다르며 CSS 스타일링 차이를 일으킬 수 있습니다.

## 재현 예시

1. contenteditable 요소에 포커스를 둡니다
2. 일부 텍스트를 입력합니다
3. Enter를 누릅니다

## 관찰된 동작

- 새로운 `<p>` 요소가 생성됩니다 (예: `<p><br></p>`)
- Chrome은 대신 `<div>` 요소를 만듭니다
- CSS 기본 여백이 `<p>`와 `<div>` 사이에서 다릅니다
- DOM 구조가 브라우저 간에 일관되지 않습니다

## 예상 동작

- `<div>` 또는 `<p>`가 일관되게 사용되어야 합니다
- 또는 동작이 구성 가능해야 합니다
- CSS 스타일링이 요소 유형 차이를 고려해야 합니다
- DOM 구조가 정규화되어야 합니다

## 브라우저 비교

- **Chrome/Edge**: `<div>` 요소를 만듦
- **Firefox**: `<p>` 요소를 만듦 (이 케이스)
- **Safari**: 컨텍스트에 따라 `<div>`, `<p>` 또는 `<br>`을 만들 수 있음

## 참고 및 해결 방법 가능한 방향

- Enter 키 후 DOM 구조 정규화
- Chrome과의 일관성을 위해 모든 `<p>` 요소를 `<div>`로 변환
- 또는 Firefox와 일치하도록 모든 `<div>`를 `<p>`로 변환
- 요소 유형에 관계없이 여백을 정규화하기 위해 CSS 사용
