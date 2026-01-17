---
id: ce-0035-backspace-deletes-whole-word-ko
scenarioId: scenario-backspace-granularity
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: Backspace가 단일 문자 대신 전체 단어를 삭제함
description: "macOS의 Safari에서 Backspace를 누르면 단일 문자 대신 전체 단어가 삭제될 수 있으며, 특히 캐럿이 단어 경계나 공백 뒤에 위치할 때 그렇습니다."
tags:
  - backspace
  - deletion
  - granularity
  - safari
status: draft
domSteps:
  - label: "Before"
    html: 'Hello world| example'
    description: "텍스트, 커서(|)가 'world' 뒤에 있음"
  - label: "After Backspace (Bug)"
    html: 'Hello | example'
    description: "Backspace가 전체 단어 'world' 삭제 (예상: 한 번에 한 문자씩)"
  - label: "✅ Expected"
    html: 'Hello worl| example'
    description: "예상: Backspace가 한 번에 한 문자씩 삭제 (마지막 'd'만 삭제)"
---

## 현상

macOS의 Safari에서 Backspace를 누르면 단일 문자 대신 전체 단어가 삭제될 수 있으며, 특히 캐럿이 단어 경계나 공백 뒤에 위치할 때 그렇습니다.

## 재현 예시

1. contenteditable div를 만듭니다.
2. 여러 단어가 있는 텍스트를 입력합니다 (예: "Hello world example").
3. 단어 끝에 캐럿을 배치합니다 ("world" 뒤).
4. Backspace를 누릅니다.
5. 얼마나 많은 텍스트가 삭제되는지 관찰합니다.

## 관찰된 동작

- macOS의 Safari에서 Backspace가 전체 단어를 삭제할 수 있습니다.
- 삭제 세분성이 일관되지 않습니다.
- 때로는 단일 문자가 삭제되고, 때로는 전체 단어가 삭제됩니다.

## 예상 동작

- Backspace는 기본적으로 한 번에 한 문자씩 삭제해야 합니다.
- 단어 수준 삭제는 수정자 키(예: Option+Backspace)와 함께만 발생해야 합니다.
- 동작이 일관되고 예측 가능해야 합니다.
