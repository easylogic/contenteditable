---
id: ce-0025-caret-position-emoji-edge-ko
scenarioId: scenario-caret-movement-with-emoji
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable에서 화살표 키가 이모지를 건너뜀
description: "Windows의 Edge에서 이모지를 포함하는 텍스트를 화살표 키로 탐색할 때 캐럿 위치가 예상치 못하게 동작합니다. 화살표 키가 이모지 문자를 건너뛰거나 캐럿을 잘못된 위치에 배치할 수 있습니다."
tags:
  - emoji
  - caret
  - arrow-keys
  - edge
status: draft
domSteps:
  - label: "Before"
    html: 'Hello| 👋 world 🌍'
    description: "텍스트와 이모지, 커서(|)가 'Hello' 뒤에 있음"
  - label: "After Right Arrow (Bug)"
    html: 'Hello 👋| world 🌍'
    description: "오른쪽 화살표가 이모지를 건너뛰며 이동"
  - label: "✅ Expected"
    html: 'Hello |👋 world 🌍'
    description: "예상: 오른쪽 화살표가 한 번에 한 문자씩 이동 (이모지 포함)"
---

## 현상

Windows의 Edge에서 이모지를 포함하는 텍스트를 화살표 키로 탐색할 때 캐럿 위치가 예상치 못하게 동작합니다. 화살표 키가 이모지 문자를 건너뛰거나 캐럿을 잘못된 위치에 배치할 수 있습니다.

## 재현 예시

1. contenteditable div를 만듭니다.
2. 이모지가 있는 텍스트를 입력합니다 (예: "Hello 👋 world 🌍").
3. 좌우 화살표 키를 사용하여 텍스트 전체에서 캐럿을 이동합니다.
4. 이모지에 대한 캐럿 위치를 관찰합니다.

## 관찰된 동작

- Windows의 Edge에서 화살표 키가 이모지 문자를 건너뛸 수 있습니다.
- 캐럿이 문자별로 이동하는 대신 이모지를 건너뛰어 점프할 수 있습니다.
- 캐럿의 시각적 위치가 실제 텍스트 위치와 일치하지 않을 수 있습니다.

## 예상 동작

- 화살표 키는 이모지를 포함하여 한 번에 한 문자씩 캐럿을 이동해야 합니다.
- 캐럿이 이모지 문자에 대해 올바르게 배치되어야 합니다.
- 탐색이 예측 가능하고 일관되어야 합니다.
