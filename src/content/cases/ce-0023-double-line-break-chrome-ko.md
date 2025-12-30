---
id: ce-0023
scenarioId: scenario-double-line-break
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Enter 키 입력 시 contenteditable에 두 개의 줄바꿈이 삽입됨
description: "macOS의 Chrome에서 contenteditable 영역에서 Enter 키를 누르면 하나가 아닌 두 개의 줄바꿈(br 요소)이 삽입되어 단락 사이에 예상치 못한 간격이 발생합니다."
tags:
  - line-break
  - enter
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello'
    description: "첫 번째 줄"
  - label: "After Enter (Bug)"
    html: 'Hello<br><br>'
    description: "단일 Enter가 두 개의 &lt;br&gt; 요소를 삽입 (Chrome macOS)"
  - label: "✅ Expected"
    html: 'Hello<br>'
    description: "예상: 단일 Enter가 하나의 줄바꿈만 삽입"
---

### 현상

macOS의 Chrome에서 contenteditable 영역에서 Enter 키를 누르면 하나가 아닌 두 개의 줄바꿈(`<br>` 요소)이 삽입되어 단락 사이에 예상치 못한 간격이 발생합니다.

### 재현 예시

1. contenteditable div를 만듭니다.
2. 일부 텍스트를 입력합니다.
3. Enter 키를 눌러 새 줄을 만듭니다.
4. DOM 구조를 관찰합니다.

### 관찰된 동작

- macOS의 Chrome에서 Enter 키를 누르면 두 개의 `<br>` 요소가 생성됩니다.
- 이로 인해 줄 사이에 이중 간격이 발생합니다.
- 동작이 다른 브라우저와 일관되지 않습니다.

### 예상 동작

- Enter 키를 누르면 단일 줄바꿈을 삽입하거나 새 단락 요소를 생성해야 합니다.
- 간격이 표준 텍스트 편집 동작과 일관되어야 합니다.
