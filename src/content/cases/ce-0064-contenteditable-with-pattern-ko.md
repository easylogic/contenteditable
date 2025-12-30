---
id: ce-0064
scenarioId: scenario-pattern-validation
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: pattern 속성이 contenteditable 콘텐츠를 검증하지 않음
description: "양식 입력에서 정규식 기반 검증을 허용하는 pattern 속성이 contenteditable 영역에서 작동하지 않습니다. 콘텐츠를 패턴에 대해 검증할 수 없습니다."
tags:
  - pattern
  - validation
  - regex
  - firefox
status: draft
---

## 현상

양식 입력에서 정규식 기반 검증을 허용하는 `pattern` 속성이 contenteditable 영역에서 작동하지 않습니다. 콘텐츠를 패턴에 대해 검증할 수 없습니다.

## 재현 예시

1. `pattern="[0-9]+"`(숫자만)이 있는 contenteditable div를 만듭니다.
2. 숫자가 아닌 문자를 입력합니다.
3. 검증이 발생하는지 관찰합니다.

## 관찰된 동작

- Windows의 Firefox에서 contenteditable의 `pattern` 속성이 무시됩니다.
- 검증이 발생하지 않습니다.
- 잘못된 콘텐츠를 자유롭게 입력할 수 있습니다.

## 예상 동작

- `pattern` 속성이 contenteditable 콘텐츠를 검증해야 합니다.
- 잘못된 콘텐츠가 거부되거나 표시되어야 합니다.
- 또는 패턴에 대해 콘텐츠를 검증하는 표준 방법이 있어야 합니다.
