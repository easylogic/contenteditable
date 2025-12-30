---
id: ce-0157
scenarioId: scenario-code-block-editing
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 코드 블록 내에서 서식을 적용할 수 있음
description: "Chrome에서 코드 블록 내에서 텍스트를 편집할 때 서식 작업(굵게, 기울임꼴 등)을 여전히 적용할 수 있습니다. 이것은 코드 서식을 깨뜨리고 유효하지 않은 코드 구조를 만듭니다."
tags:
  - code
  - pre
  - formatting
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<pre><code>function test() {</code></pre>'
    description: "Code block structure"
  - label: "After Bold (Bug)"
    html: '<pre><code>function <b>test</b>() {</code></pre>'
    description: "Formatting applied inside code block, code structure damaged"
  - label: "✅ Expected"
    html: '<pre><code>function test() {</code></pre>'
    description: "Expected: Formatting blocked inside code block, plain text maintained"
---

## 현상

Chrome에서 코드 블록 내에서 텍스트를 편집할 때 서식 작업(굵게, 기울임꼴 등)을 여전히 적용할 수 있습니다. 이것은 코드 서식을 깨뜨리고 유효하지 않은 코드 구조를 만듭니다.

## 재현 예시

1. 코드 블록을 만듭니다: `<pre><code>function test() {</code></pre>`
2. 코드 블록 내에서 텍스트를 선택합니다
3. 굵게 서식을 적용합니다 (Ctrl+B)

## 관찰된 동작

- 서식이 적용됩니다: `<pre><code>function <b>test</b>() {</code></pre>`
- 코드 구조가 깨집니다
- 서식이 코드에 있으면 안 됩니다
- 유효하지 않은 코드 구조

## 예상 동작

- 코드 블록에서 서식이 방지되어야 합니다
- 코드가 일반 텍스트로 유지되어야 합니다
- 구조가 보존되어야 합니다
- 서식 작업이 차단되어야 합니다

## 브라우저 비교

- **모든 브라우저**: 서식을 적용할 수 있음 (기본 동작)
- 서식 방지를 위한 사용자 정의 구현 필요

## 참고 및 해결 방법 가능한 방향

- 코드 블록에서 서식 작업 가로채기
- 서식에 대한 기본 동작 방지
- 서식 명령 차단 (굵게, 기울임꼴 등)
- 코드를 일반 텍스트로 보존
