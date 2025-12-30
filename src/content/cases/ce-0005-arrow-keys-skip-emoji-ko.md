---
id: ce-0005
scenarioId: scenario-caret-movement-with-emoji
locale: ko
os: macOS
osVersion: "14.0"
device: Laptop
deviceVersion: MacBook Pro
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable에서 화살표 키가 이모지를 건너뜀
description: "이모지를 포함하는 contenteditable 요소에서 좌우 화살표 키를 사용할 때 캐럿이 단일 시각적 위치로 이동하는 대신 전체 이모지 클러스터를 건너뛰는 경우가 있습니다."
tags:
  - caret
  - emoji
  - navigation
status: draft
domSteps:
  - label: "Before"
    html: 'Hello| 👋 World 🌍'
    description: "텍스트와 이모지, 커서(|)가 'Hello' 뒤에 있음"
  - label: "After Right Arrow (Bug)"
    html: 'Hello 👋| World 🌍'
    description: "오른쪽 화살표가 전체 이모지 클러스터를 건너뜀"
  - label: "✅ Expected"
    html: 'Hello |👋 World 🌍'
    description: "예상: 오른쪽 화살표가 한 번에 한 문자씩 이동 (이모지 포함)"
---

## 현상

이모지를 포함하는 `contenteditable` 요소에서 좌우 화살표 키를 사용할 때 캐럿이 단일 시각적 위치로 이동하는 대신 전체 이모지 클러스터를 건너뛰는 경우가 있습니다.

## 재현 예시

1. 편집 가능한 영역에 포커스합니다.
2. 짧은 ASCII 단어를 입력합니다.
3. 하나 이상의 이모지 문자를 삽입합니다 (예: macOS 이모지 선택기에서).
4. 좌우 화살표 키를 사용하여 텍스트와 이모지 전체에서 캐럿을 이동합니다.

## 관찰된 동작

- 캐럿이 이모지를 건너뛰어 전체 이모지 클러스터의 앞이나 뒤에 위치합니다.
- 화살표 키로 클러스터 내부의 중간 캐럿 위치에 도달할 수 없습니다.

## 예상 동작

- 캐럿이 시각적 위치 전체에서 일관되게 이동하거나, 최소한 동일한 환경에서 네이티브 `<textarea>`와 동일한 방식으로 동작해야 합니다.

## 참고사항

- 이 동작은 특히 사용자가 이모지 주변의 텍스트를 선택하려고 할 때 선택 세분성에 영향을 줄 수 있습니다.
- `contenteditable`에서 브라우저가 다른 편집 가능한 컨트롤과 비교하여 그래프 클러스터에 대한 캐럿 위치를 정의하는 방법을 조사합니다.
