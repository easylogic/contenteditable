---
id: ce-0041
scenarioId: scenario-spellcheck-behavior
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: 맞춤법 검사가 contenteditable 편집을 방해함
description: "Safari의 contenteditable 영역에서 spellcheck=\"true\"가 활성화되어 있을 때 맞춤법 검사 기능이 일반 편집을 방해할 수 있습니다. 빨간 밑줄이 잘못 나타날 수 있으며, 맞춤법 검사 제안이 IME 컴포지션을 방해할 수 있습니다."
tags:
  - spellcheck
  - editing
  - safari
status: draft
---

## 현상

Safari의 contenteditable 영역에서 `spellcheck="true"`가 활성화되어 있을 때 맞춤법 검사 기능이 일반 편집을 방해할 수 있습니다. 빨간 밑줄이 잘못 나타날 수 있으며, 맞춤법 검사 UI가 텍스트 선택이나 편집을 차단할 수 있습니다.

## 재현 예시

1. `spellcheck="true"`가 있는 contenteditable div를 만듭니다.
2. 의도적으로 철자가 틀린 단어를 포함하여 일부 텍스트를 입력합니다.
3. 맞춤법 검사 동작을 관찰합니다.
4. 맞춤법 검사 밑줄이 있는 텍스트를 선택하려고 시도합니다.

## 관찰된 동작

- macOS의 Safari에서 맞춤법 검사 밑줄이 텍스트 선택을 방해할 수 있습니다.
- 맞춤법 검사 UI가 예상치 못한 위치에 나타날 수 있습니다.
- 맞춤법 검사 처리로 인해 편집이 차단되거나 지연될 수 있습니다.

## 예상 동작

- 맞춤법 검사가 일반 편집 작업을 방해하지 않아야 합니다.
- 맞춤법 검사 밑줄에 관계없이 텍스트 선택이 작동해야 합니다.
- 맞춤법 검사 UI가 편집을 차단하거나 지연시키지 않아야 합니다.
