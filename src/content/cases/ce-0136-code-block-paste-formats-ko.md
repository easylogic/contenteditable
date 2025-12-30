---
id: ce-0136
scenarioId: scenario-code-block-editing
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: 코드 블록에 서식이 있는 콘텐츠를 붙여넣으면 코드 구조가 손실됨
description: "Firefox에서 코드 블록에 서식이 있는 콘텐츠(HTML 서식 포함)를 붙여넣을 때 서식은 보존되지만 코드 블록 구조가 손실될 수 있습니다. 코드 블록이 일반 단락으로 변환될 수 있습니다."
tags:
  - code
  - pre
  - paste
  - formatting
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: '<pre><code>function test() {</code></pre>'
    description: "Code block structure"
  - label: "Clipboard"
    html: '<strong>Bold</strong> Code'
    description: "Copied formatted text"
  - label: "❌ After Paste (Bug)"
    html: '<p><strong>Bold</strong> Code</p>'
    description: "Code block structure lost, &lt;pre&gt;&lt;code&gt; converted to &lt;p&gt;"
  - label: "✅ Expected"
    html: '<pre><code>Bold Code</code></pre>'
    description: "Expected: Code block structure maintained, formatting removed (plain text)"
---

### 현상

Firefox에서 코드 블록에 서식이 있는 콘텐츠(HTML 서식 포함)를 붙여넣을 때 서식은 보존되지만 코드 블록 구조가 손실될 수 있습니다. 코드 블록이 일반 단락으로 변환될 수 있습니다.

### 재현 예시

1. 코드 블록을 만듭니다: `<pre><code>function test() {</code></pre>`
2. 그 안에 서식이 있는 HTML 콘텐츠를 붙여넣습니다
3. DOM 구조를 관찰합니다

### 관찰된 동작

- 코드 블록 구조가 손실됩니다
- `<pre><code>`가 `<p>` 요소로 변환될 수 있습니다
- 서식은 보존되지만 코드 컨텍스트가 손실됩니다
- 코드 블록이 깨집니다

### 예상 동작

- 코드 블록 구조가 유지되어야 합니다
- 서식이 제거되어야 합니다 (코드는 일반 텍스트여야 함)
- 코드 블록이 `<pre><code>`로 유지되어야 합니다
- 구조가 보존되어야 합니다

### 브라우저 비교

- **Chrome/Edge**: 구조를 보존하거나 깨뜨릴 수 있음
- **Firefox**: 구조를 깨뜨릴 가능성이 더 높음 (이 케이스)
- **Safari**: 구조를 깨뜨릴 가능성이 가장 높음

### 참고 및 해결 방법 가능한 방향

- 코드 블록에서 붙여넣기 가로채기
- 붙여넣은 콘텐츠에서 모든 서식 제거
- 코드 블록 구조 보존
- HTML을 일반 텍스트로 변환
