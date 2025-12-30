---
id: ce-0169
scenarioId: scenario-blockquote-behavior
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Firefox에서 blockquote 내에서 서식 적용이 구조를 깨뜨림
description: "Firefox에서 blockquote 내에서 텍스트에 서식(굵게, 기울임꼴 등)을 적용할 때 blockquote 구조가 깨질 수 있습니다. blockquote가 제거되거나 일반 단락으로 변환될 수 있습니다."
tags:
  - blockquote
  - formatting
  - structure
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: '<blockquote><p>Quoted text</p></blockquote>'
    description: "Blockquote structure"
  - label: "After Bold (Bug)"
    html: '<p><b>Quoted text</b></p>'
    description: "After formatting applied, blockquote structure damaged, &lt;blockquote&gt; removed"
  - label: "✅ Expected"
    html: '<blockquote><p><b>Quoted text</b></p></blockquote>'
    description: "Expected: Blockquote structure maintained, formatting applied inside"
---

### 현상

Firefox에서 blockquote 내에서 텍스트에 서식(굵게, 기울임꼴 등)을 적용할 때 blockquote 구조가 깨질 수 있습니다. blockquote가 제거되거나 일반 단락으로 변환될 수 있습니다.

### 재현 예시

1. blockquote를 만듭니다: `<blockquote><p>Quoted text</p></blockquote>`
2. blockquote 내에서 텍스트를 선택합니다
3. 굵게 서식을 적용합니다

### 관찰된 동작

- blockquote 구조가 깨질 수 있습니다
- blockquote가 단락으로 변환될 수 있습니다
- 서식이 적용되지만 구조가 손실됩니다
- DOM 구조가 다음과 같이 됩니다: `<p><b>Quoted text</b></p>`

### 예상 동작

- blockquote 구조가 유지되어야 합니다
- 서식이 blockquote 내에 적용되어야 합니다
- blockquote가 `<blockquote>`로 유지되어야 합니다
- 구조가 깨지지 않아야 합니다

### 브라우저 비교

- **Chrome/Edge**: 일반적으로 구조를 유지함
- **Firefox**: 구조를 깨뜨릴 가능성이 더 높음 (이 케이스)
- **Safari**: 구조를 깨뜨릴 가능성이 가장 높음

### 참고 및 해결 방법 가능한 방향

- blockquote 컨텍스트에서 서식 가로채기
- blockquote 구조 내에서 서식 적용
- 서식 중 blockquote 보존
- 서식 후 구조 정규화
