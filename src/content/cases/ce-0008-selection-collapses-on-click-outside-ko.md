---
id: ce-0008
scenarioId: scenario-selection-collapse-on-blur
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable 외부 클릭 시 선택 영역이 예상치 못하게 축소됨
description: "contenteditable 요소 내부에서 텍스트 범위가 선택된 상태에서 요소 외부를 클릭하면 선택이 완전히 지워지는 대신 편집 가능한 영역 내부의 캐럿 위치로 축소됩니다."
tags:
  - selection
  - caret
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="background: #bfdbfe;">World</span> Test'
    description: "텍스트 선택됨 (World 강조 표시)"
  - label: "After Click Outside (Bug)"
    html: 'Hello World| Test'
    description: "외부 클릭 시 선택이 완전히 지워지지 않고 커서로 축소됨"
  - label: "✅ Expected"
    html: 'Hello World Test'
    description: "예상: 외부 클릭 시 선택이 완전히 지워짐"
---

## 현상

`contenteditable` 요소 내부에서 텍스트 범위가 선택된 상태에서 요소 외부를 클릭하면 선택이 완전히 지워지는 대신 편집 가능한 영역 내부의 캐럿 위치로 축소됩니다.

## 재현 예시

1. 편집 가능한 영역에 포커스합니다.
2. 여러 줄에 걸쳐 몇 단어를 입력합니다.
3. 한 줄의 일부 또는 여러 줄을 선택하기 위해 드래그합니다.
4. 편집 가능한 영역 외부(예: 페이지 배경)를 클릭합니다.

## 관찰된 동작

- 선택이 편집 가능한 요소 내부의 단일 캐럿 위치로 축소됩니다.
- 범위가 지워지지 않아 시각적 피드백에 의존하는 사용자에게 혼란을 줄 수 있습니다.

## 예상 동작

- 요소가 포커스를 잃을 때 선택이 완전히 지워지거나, 최소한 동일한 브라우저와 OS 조합에서 네이티브 텍스트 필드와 유사하게 동작해야 합니다.

## 참고사항

- 이 동작은 선택 상태에 바인딩된 키보드 단축키(예: 복사 또는 삭제)에 영향을 줄 수 있습니다.
