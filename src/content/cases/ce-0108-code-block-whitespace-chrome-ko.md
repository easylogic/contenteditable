---
id: ce-0108
scenarioId: scenario-code-block-editing
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: pre 태그에도 불구하고 코드 블록에서 여러 공백이 축소됨
description: "<pre><code> 코드 블록 내에서 텍스트를 편집할 때 공백을 보존해야 하는 <pre> 태그에도 불구하고 여러 연속 공백이 여전히 축소될 수 있습니다. 이것은 코드 서식을 깨뜨릴 수 있습니다."
tags:
  - code
  - pre
  - whitespace
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<pre><code>    function test() {</code></pre>'
    description: "Code block with indentation (4 spaces)"
  - label: "After Editing (Bug)"
    html: '<pre><code> function test() {</code></pre>'
    description: "After editing, multiple spaces collapsed to one"
  - label: "✅ Expected"
    html: '<pre><code>    function test() {</code></pre>'
    description: "Expected: Spaces preserved with &lt;pre&gt; tag"
---

## 현상

`<pre><code>` 코드 블록 내에서 텍스트를 편집할 때 공백을 보존해야 하는 `<pre>` 태그에도 불구하고 여러 연속 공백이 여전히 축소될 수 있습니다. 이것은 코드 서식을 깨뜨릴 수 있습니다.

## 재현 예시

1. 코드 블록을 만듭니다: `<pre><code>function test() {</code></pre>`
2. 들여쓰기를 위해 여러 공백을 입력하려고 시도합니다
3. DOM을 관찰합니다

## 관찰된 동작

- 여러 공백이 단일 공백으로 축소될 수 있습니다
- `<pre>`가 공백을 보존해야 함에도 불구하고
- 코드 들여쓰기가 손실됩니다
- 서식이 깨집니다

## 예상 동작

- `<pre>` 태그가 모든 공백을 보존해야 합니다
- 여러 공백이 유지되어야 합니다
- 코드 서식이 보존되어야 합니다
- 동작이 네이티브 코드 편집기와 일치해야 합니다

## 브라우저 비교

- **Chrome/Edge**: `<pre>`에도 불구하고 공백을 축소할 수 있음 (이 케이스)
- **Firefox**: 유사한 공백 처리 문제
- **Safari**: 공백 보존이 일관되지 않음

## 참고 및 해결 방법 가능한 방향

- `white-space: pre` CSS가 적용되도록 보장
- 필요한 경우 공백 삽입을 가로채고 `&nbsp;` 사용
- 코드 블록에서 공백 모니터링 및 보존
- 코드 블록에 contenteditable="false"를 사용하고 사용자 정의 편집 고려
