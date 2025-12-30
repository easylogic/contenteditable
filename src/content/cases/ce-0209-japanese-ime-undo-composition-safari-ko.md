---
id: ce-0209
scenarioId: scenario-undo-with-composition
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: Japanese (IME)
caseTitle: 일본어 IME 조합 중 실행 취소가 예상보다 더 많은 텍스트를 지움
description: "contenteditable 요소에서 일본어 IME 조합이 활성화된 상태에서 실행 취소를 누르면 예상보다 더 많은 텍스트가 제거되며, 현재 조합 또는 불완전한 한자 변환뿐만 아니라 이전에 커밋된 문자도 포함됩니다."
tags:
  - undo
  - composition
  - ime
  - japanese
  - safari
  - macos
status: draft
domSteps:
  - label: "Before"
    html: 'Hello 漢 <span style="text-decoration: underline; background: #fef08a;">字</span>'
    description: "Already committed '漢' and composing '字'"
  - label: "After Undo (Bug)"
    html: 'Hello '
    description: "Undo deletes both '漢' and '字'"
  - label: "✅ Expected"
    html: 'Hello 漢'
    description: "Expected: Only cancel composing '字', '漢' should be preserved"
---

### 현상

`contenteditable` 요소에서 일본어 IME 조합이 활성화된 상태에서 실행 취소를 누르면 예상보다 더 많은 텍스트가 제거되며, 현재 조합 또는 불완전한 한자 변환뿐만 아니라 이전에 커밋된 문자도 포함됩니다.

### 재현 예시

1. 편집 가능한 영역에 포커스를 둡니다.
2. 일본어 문자를 입력하고 완료합니다 (예: "漢").
3. 일본어 IME를 활성화하고 다른 문자 조합을 시작합니다 (예: "字"), 하지만 완료하지 않습니다.
4. Cmd+Z(또는 플랫폼별 실행 취소 단축키)를 누릅니다.

### 관찰된 동작

- 활성 조합과 이전에 커밋된 문자가 모두 제거됩니다
- 불완전한 한자 변환이 손실될 수 있습니다
- 이벤트 로그는 사용자 의도에 깔끔하게 매핑되지 않는 `beforeinput` / `input` 이벤트 시퀀스를 표시합니다
- 실행 취소 세밀도가 잘못되었습니다

### 예상 동작

- 실행 취소는 마지막 커밋된 편집 단계만 되돌리거나, 최소한 같은 환경의 네이티브 컨트롤과 같은 방식으로 동작해야 합니다
- 활성 조합은 취소되어야 하지만 이전에 커밋된 텍스트는 남아 있어야 합니다

### 브라우저 비교

- **Safari**: 조합 중 실행 취소가 예상보다 더 많은 것을 제거할 수 있음, 특히 macOS에서
- **Chrome**: 다른 실행 취소 동작을 가질 수 있음
- **Firefox**: 다른 실행 취소 동작을 가질 수 있음

### 참고 및 해결 방법 가능한 방향

- 이 동작은 예측 가능한 텍스트 편집 및 실행 취소/다시 실행 스택에 간섭할 수 있습니다
- 실행 취소 작업을 처리할 때 조합 상태 모니터링
- 더 나은 제어를 위해 사용자 정의 실행 취소/다시 실행 로직 구현 고려
