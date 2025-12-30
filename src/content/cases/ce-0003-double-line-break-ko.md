---
id: ce-0003
scenarioId: scenario-double-line-break
locale: ko
os: macOS
osVersion: "14.0"
device: Laptop
deviceVersion: MacBook Pro
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Enter 키 입력 시 contenteditable에 두 개의 줄바꿈이 삽입됨
description: "일반 contenteditable 요소에서 Enter 키를 누르면 하나가 아닌 두 개의 보이는 줄바꿈이 삽입됩니다. 결과 DOM에는 추가 빈 줄로 렌더링되는 중첩된 div 또는 br 요소가 포함됩니다."
tags:
  - enter
  - newline
status: draft
domSteps:
  - label: "Before"
    html: 'Hello'
    description: "첫 번째 줄"
  - label: "After Enter (Bug)"
    html: 'Hello<br><br>'
    description: "단일 Enter가 두 개의 줄바꿈을 삽입"
  - label: "✅ Expected"
    html: 'Hello<br>'
    description: "예상: 단일 Enter가 하나의 줄바꿈만 삽입"
---

### 현상

일반 `contenteditable` 요소에서 Enter 키를 누르면 하나가 아닌 두 개의 보이는 줄바꿈이 삽입됩니다. 결과 DOM에는 추가 빈 줄로 렌더링되는 중첩된 `<div>` 또는 `<br>` 요소가 포함됩니다.

### 재현 예시

1. 편집 가능한 영역에 포커스합니다.
2. 첫 번째 줄에 짧은 단어를 입력합니다.
3. Enter 키를 한 번 누릅니다.
4. 두 번째 줄로 보이는 위치에 다른 단어를 입력합니다.

### 관찰된 동작

- 줄 사이의 시각적 간격이 단일 줄 높이보다 큽니다.
- DOM을 검사하면 두 개의 연속된 블록 레벨 컨테이너 또는 두 개의 줄바꿈에 해당하는 `<br>` 요소 시퀀스가 표시됩니다.

### 예상 동작

- Enter 키를 한 번 누르면 단일 단락 구분이 삽입됩니다.

### 참고사항 및 가능한 해결 방향

- 이 구성에서 브라우저가 단락 구분을 나타내기 위해 `<div>`, `<p>`, 또는 `<br>`을 사용하는지 확인합니다.
- CSS line-height와 margin을 조정하여 효과가 DOM 구조에서 오는지 스타일링에서 오는지 확인합니다.
- 마크업을 정규화해야 하는 제품의 경우, 콘텐츠를 저장하거나 diff하기 전에 네이티브 구조를 제어된 모델(예: 줄당 단일 `<p>`)로 변환하는 것을 고려합니다.
