---
id: ce-0170
scenarioId: scenario-code-block-editing
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 코드 블록 편집 시 코드 들여쓰기가 손실됨
description: "Chrome에서 코드 블록 내에서 텍스트를 편집할 때 들여쓰기(선행 공백 또는 탭)가 손실되거나 잘못 변환될 수 있습니다. 이것은 코드 서식과 구조를 깨뜨립니다."
tags:
  - code
  - pre
  - indentation
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<pre><code>    function test() {<br>        return true;<br>    }</code></pre>'
    description: "Code block with indentation"
  - label: "After Editing (Bug)"
    html: '<pre><code>function test() {<br>return true;<br>}</code></pre>'
    description: "Indentation lost after editing"
  - label: "✅ Expected"
    html: '<pre><code>    function test() {<br>        return true;<br>    }</code></pre>'
    description: "Expected: Indentation preserved"
---

### 현상

Chrome에서 코드 블록 내에서 텍스트를 편집할 때 들여쓰기(선행 공백 또는 탭)가 손실되거나 잘못 변환될 수 있습니다. 이것은 코드 서식과 구조를 깨뜨립니다.

### 재현 예시

1. 들여쓰기가 있는 코드 블록을 만듭니다: `<pre><code>    function test() {</code></pre>`
2. 코드를 편집합니다 (추가, 삭제, 수정)
3. 들여쓰기 보존을 관찰합니다

### 관찰된 동작

- 선행 공백이 손실될 수 있습니다
- 탭이 공백으로 변환되거나 그 반대일 수 있습니다
- 들여쓰기가 보존되지 않습니다
- 코드 구조가 깨집니다

### 예상 동작

- 들여쓰기가 보존되어야 합니다
- 공백과 탭이 유지되어야 합니다
- 코드 구조가 그대로 유지되어야 합니다
- 서식이 보존되어야 합니다

### 브라우저 비교

- **Chrome/Edge**: 들여쓰기가 손실될 수 있음 (이 케이스)
- **Firefox**: 유사한 들여쓰기 문제
- **Safari**: 들여쓰기 보존이 일관되지 않음

### 참고 및 해결 방법 가능한 방향

- `white-space: pre` CSS가 적용되도록 보장
- 편집 중 선행 공백 보존
- 손실된 경우 들여쓰기 모니터링 및 복원
- 탭과 공백을 명시적으로 처리
