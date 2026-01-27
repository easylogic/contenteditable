---
id: ce-0033-selection-range-incorrect-ko
scenarioId: scenario-selection-range-accuracy
locale: ko
os: Windows
osVersion: "11"
device: Desktop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: US
caseTitle: 여러 요소에 걸쳐 선택할 때 선택 범위가 부정확함
description: "하나의 블록(예: <p>)에서 다른 블록으로 걸쳐지는 텍스트를 선택할 때, Edge의 getSelection() API는 시각적으로는 맞지만 논리적으로는 잘못된 노드 오프셋을 가진 범위를 반환할 수 있습니다."
tags: ["selection", "range", "multi-block", "edge"]
status: confirmed
---

## 현상
중첩된 블록 구조를 가로질러 선택하면 `Selection` API가 일관되지 않은 경계를 보고합니다. 시각적으로는 강조 표시가 올바르게 보이지만, 프로그래밍적으로는 `anchorNode`나 `focusNode`가 리프 텍스트 노드가 아닌 부모 컨테이너로 튀어버릴 수 있습니다.

## 재현 단계
1. 두 개의 단락을 생성합니다: `<p>하나</p><p>둘</p>`.
2. "하나"의 중간부터 "둘"의 중간까지 선택합니다.
3. `window.getSelection().getRangeAt(0)`을 호출합니다.
4. `startContainer`가 첫 번째 `<p>`가 아닌 부모 `div`로 나타나는지 확인합니다.

## 관찰된 동작
Edge/Chrome 엔진은 가끔 미세한 텍스트 오프셋을 잃고 가장 가까운 공통 블록으로 경계를 축소하여 범위 계산을 최적화하려고 시도합니다.
