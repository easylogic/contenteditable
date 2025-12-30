---
id: ce-0060
scenarioId: scenario-text-direction
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: Arabic
caseTitle: 편집 중 텍스트 방향(dir 속성) 변경이 적용되지 않음
description: "contenteditable 영역의 dir 속성을 동적으로 변경할 때(예: ltr와 rtl 사이 전환) Firefox에서 활성 편집 중 텍스트 방향이 올바르게 업데이트되지 않을 수 있습니다."
tags:
  - direction
  - rtl
  - ltr
  - firefox
status: draft
---

### 현상

contenteditable 영역의 `dir` 속성을 동적으로 변경할 때(예: `ltr`와 `rtl` 사이 전환) Firefox에서 활성 편집 중 텍스트 방향이 올바르게 업데이트되지 않을 수 있습니다. 캐럿 위치와 텍스트 흐름이 잘못될 수 있습니다.

### 재현 예시

1. `dir="ltr"`이 있는 contenteditable div를 만듭니다.
2. 일부 텍스트 입력을 시작합니다.
3. 프로그래밍 방식으로 `dir`을 `"rtl"`로 변경합니다.
4. 계속 입력합니다.
5. 텍스트 방향과 캐럿 위치를 관찰합니다.

### 관찰된 동작

- Windows의 Firefox에서 편집 중 `dir`을 변경하면 즉시 적용되지 않을 수 있습니다.
- 캐럿 위치가 잘못될 수 있습니다.
- 텍스트 흐름이 올바르게 업데이트되지 않을 수 있습니다.

### 예상 동작

- `dir` 속성이 텍스트 방향을 즉시 업데이트해야 합니다.
- 캐럿 위치가 올바르게 조정되어야 합니다.
- 텍스트 흐름이 새로운 방향을 반영해야 합니다.
