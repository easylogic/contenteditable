---
id: ce-0186-chinese-ime-backspace-granularity-safari-ko
scenarioId: scenario-ime-backspace-granularity
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: Chinese (IME - Pinyin)
caseTitle: 중국어 IME Backspace가 구성 요소 대신 전체 문자를 제거함
description: "contenteditable 요소에서 병음 IME로 중국어 텍스트를 편집할 때 Backspace를 누르면 구성 요소 수준 편집을 허용하는 대신 전체 문자가 제거됩니다. 이것은 세밀한 수정을 어렵게 만들고 네이티브 입력 필드와 다릅니다."
tags:
  - composition
  - ime
  - backspace
  - chinese
  - safari
  - macos
status: draft
domSteps:
  - label: "Before"
    html: 'Hello 你好'
    description: "Chinese character input completed"
  - label: "After Backspace (Bug)"
    html: 'Hello '
    description: "Entire character '你好' deleted (single Backspace)"
  - label: "✅ Expected"
    html: 'Hello 你'
    description: "Expected: Delete one character at a time (first Backspace deletes only '好')"
---

## 현상

`contenteditable` 요소에서 병음 IME로 중국어 텍스트를 편집할 때 Backspace를 누르면 구성 요소 수준 편집을 허용하는 대신 전체 문자가 제거됩니다. 이것은 세밀한 수정을 어렵게 만들고 같은 플랫폼의 네이티브 입력 필드와 다릅니다.

## 재현 예시

1. 편집 가능한 영역에 포커스를 둡니다.
2. 중국어 병음 IME를 활성화합니다.
3. 중국어 문자를 입력합니다 (예: "你好").
4. Backspace를 한 번 누릅니다.

## 관찰된 동작

- 전체 문자가 단일 Backspace 입력으로 제거됩니다
- 구성 요소 수준 편집(예: 병음 구성 요소 편집)이 불가능합니다
- 이벤트 로그는 삭제에 대해 하나의 `beforeinput` / `input` 쌍만 표시합니다
- 동작이 네이티브 입력 필드와 다릅니다

## 예상 동작

- 각 Backspace 입력이 더 세밀한 삭제를 허용해야 하며, 네이티브 입력이 동작하는 방식과 일치해야 합니다
- 구성 요소 수준 편집이 가능해야 합니다
- 동작이 네이티브 입력 필드와 일관되어야 합니다

## 브라우저 비교

- **Safari**: 구성 요소 대신 전체 문자를 제거할 수 있음, 특히 macOS에서
- **Chrome**: 다른 세밀도 동작을 가질 수 있음
- **Firefox**: 다른 세밀도 동작을 가질 수 있음

## 참고 및 해결 방법 가능한 방향

- 같은 환경에서 일반 `<input>` 요소와 동작을 비교하여 차이를 확인합니다
- 이 동작은 커서 이동, 실행 취소 세밀도 및 diff 계산에 영향을 줄 수 있습니다
- 더 세밀한 제어를 위해 사용자 정의 backspace 처리 구현 고려
