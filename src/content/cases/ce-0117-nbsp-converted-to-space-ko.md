---
id: ce-0117-nbsp-converted-to-space-ko
scenarioId: scenario-non-breaking-space
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 편집 중 줄바꿈 없는 공백이 일반 공백으로 변환됨
description: "줄바꿈 없는 공백(&nbsp;)이 포함된 텍스트를 편집할 때 편집 작업 중 일반 공백으로 변환될 수 있습니다. 이것은 줄바꿈 없는 공백에 의존하는 서식을 깨뜨립니다."
tags:
  - whitespace
  - nbsp
  - space
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello&nbsp;&nbsp;&nbsp;World'
    description: "Text with non-breaking spaces"
  - label: "After Editing (Bug)"
    html: 'Hello World'
    description: "After editing, &nbsp; converted to regular space, multiple spaces collapsed to one"
  - label: "✅ Expected"
    html: 'Hello&nbsp;&nbsp;&nbsp;World'
    description: "Expected: Non-breaking spaces preserved"
---

## 현상

줄바꿈 없는 공백(`&nbsp;`)이 포함된 텍스트를 편집할 때 편집 작업 중 일반 공백으로 변환될 수 있습니다. 이것은 줄바꿈 없는 공백에 의존하는 서식을 깨뜨립니다.

## 재현 예시

1. 줄바꿈 없는 공백이 있는 텍스트를 삽입합니다: `Hello&nbsp;&nbsp;&nbsp;World`
2. 텍스트를 편집합니다 (입력, 삭제 등)
3. DOM을 관찰합니다

## 관찰된 동작

- 줄바꿈 없는 공백이 일반 공백으로 변환됩니다
- 여러 공백이 단일 공백으로 축소됩니다
- nbsp에 의존하는 서식이 깨집니다
- 레이아웃이 예상치 못하게 변경될 수 있습니다

## 예상 동작

- 줄바꿈 없는 공백이 보존되어야 합니다
- 또는 변환이 예측 가능해야 합니다
- 서식이 그대로 유지되어야 합니다
- 동작이 일관되어야 합니다

## 브라우저 비교

- **Chrome/Edge**: nbsp를 공백으로 변환할 수 있음 (이 케이스)
- **Firefox**: 유사한 변환 동작
- **Safari**: 변환 동작이 다양함

## 참고 및 해결 방법 가능한 방향

- 줄바꿈 없는 공백 모니터링 및 보존
- 필요한 경우 일반 공백을 nbsp로 교체
- 간격을 보존하기 위해 CSS `white-space: pre-wrap` 사용
- 붙여넣기 작업에서 nbsp 명시적으로 처리
