---
id: ce-0200
scenarioId: scenario-ime-backspace-granularity
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: Vietnamese (IME)
caseTitle: 베트남어 IME Backspace가 분음 기호가 있는 전체 문자를 제거함
description: "contenteditable 요소에서 IME로 베트남어 텍스트를 편집할 때 Backspace를 누르면 구성 요소 수준 편집을 허용하는 대신 분음 기호 표시를 포함한 전체 문자가 제거됩니다. 이것은 세밀한 수정을 어렵게 만듭니다."
tags:
  - composition
  - ime
  - backspace
  - vietnamese
  - edge
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello xin chào'
    description: "Vietnamese text input completed (includes accent marks)"
  - label: "After Backspace (Bug)"
    html: 'Hello xin '
    description: "Entire character 'chào' deleted (single Backspace)"
  - label: "✅ Expected"
    html: 'Hello xin chà'
    description: "Expected: Delete one character at a time (first Backspace deletes only 'o')"
---

### 현상

`contenteditable` 요소에서 IME로 베트남어 텍스트를 편집할 때 Backspace를 누르면 구성 요소 수준 편집을 허용하는 대신 분음 기호 표시를 포함한 전체 문자가 제거됩니다. 이것은 세밀한 수정을 어렵게 만들고 네이티브 입력 필드와 다릅니다.

### 재현 예시

1. 편집 가능한 영역에 포커스를 둡니다.
2. 베트남어 IME를 활성화합니다 (Telex 또는 VNI 입력 방법).
3. 분음 기호가 있는 베트남어 문자를 입력합니다 (예: "xin chào").
4. Backspace를 한 번 누릅니다.

### 관찰된 동작

- 모든 분음 기호를 포함한 전체 문자가 단일 Backspace 입력으로 제거됩니다
- 구성 요소 수준 편집(예: 분음 기호만 편집)이 불가능합니다
- 이벤트 로그는 삭제에 대해 하나의 `beforeinput` / `input` 쌍만 표시합니다
- 동작이 네이티브 입력 필드와 다릅니다

### 예상 동작

- 각 Backspace 입력이 더 세밀한 삭제를 허용해야 하며, 네이티브 입력이 동작하는 방식과 일치해야 합니다
- 구성 요소 수준 편집이 가능해야 합니다
- 동작이 네이티브 입력 필드와 일관되어야 합니다

### 브라우저 비교

- **Edge**: 분음 기호가 있는 전체 문자를 제거할 수 있음
- **Chrome**: Edge와 유사함
- **Firefox**: 다른 세밀도 동작을 가질 수 있음
- **Safari**: Windows에서 적용되지 않음

### 참고 및 해결 방법 가능한 방향

- 같은 환경에서 일반 `<input>` 요소와 동작을 비교하여 차이를 확인합니다
- 이 동작은 커서 이동, 실행 취소 세밀도 및 diff 계산에 영향을 줄 수 있습니다
- 분음 기호가 있는 더 세밀한 제어를 위해 사용자 정의 backspace 처리 구현 고려
