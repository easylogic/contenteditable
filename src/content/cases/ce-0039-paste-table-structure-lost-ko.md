---
id: ce-0039
scenarioId: scenario-paste-formatting-loss
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: 테이블 붙여넣기 시 구조와 서식이 손실됨
description: "Firefox의 contenteditable 영역에 테이블 콘텐츠(Excel, Google Sheets 또는 HTML 테이블에서)를 붙여넣을 때 테이블 구조가 손실됩니다. 콘텐츠가 일반 텍스트로 붙여넣어지거나 서식이 손실될 수 있습니다."
tags:
  - paste
  - table
  - structure
  - firefox
status: draft
domSteps:
  - label: "Clipboard"
    html: '<table><tr><td>Cell 1</td><td>Cell 2</td></tr><tr><td>Cell 3</td><td>Cell 4</td></tr></table>'
    description: "복사된 테이블 구조"
  - label: "❌ After Paste"
    html: 'Cell 1 Cell 2<br>Cell 3 Cell 4'
    description: "테이블 구조 손실, 일반 텍스트로 변환됨"
  - label: "✅ Expected"
    html: '<table><tr><td>Cell 1</td><td>Cell 2</td></tr><tr><td>Cell 3</td><td>Cell 4</td></tr></table>'
    description: "테이블 구조 유지됨"
---

### 현상

Firefox의 contenteditable 영역에 테이블 콘텐츠(Excel, Google Sheets 또는 HTML 테이블에서)를 붙여넣을 때 테이블 구조가 손실됩니다. 콘텐츠가 일반 텍스트로 붙여넣어지거나 서식이 손실될 수 있습니다.

### 재현 예시

1. Excel 또는 Google Sheets에서 테이블을 복사합니다.
2. contenteditable div를 만듭니다.
3. 테이블 콘텐츠를 붙여넣습니다 (Ctrl+V).
4. 붙여넣은 콘텐츠의 구조를 관찰합니다.

### 관찰된 동작

- Windows의 Firefox에서 테이블 구조가 보존되지 않습니다.
- 테이블 셀이 일반 텍스트로 변환되거나 관계가 손실될 수 있습니다.
- 서식(테두리, 색상, 정렬)이 손실됩니다.

### 예상 동작

- 테이블은 구조가 그대로 유지된 상태로 붙여넣어져야 합니다 (`<table>`, `<tr>`, `<td>` 요소).
- 가능한 경우 서식이 보존되어야 합니다.
- 또는 테이블이 붙여넣어지는 방식을 제어하는 방법이 있어야 합니다.
