---
id: ce-0176
scenarioId: scenario-ime-candidate-list-and-conversion-issues
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: Chinese (IME - Pinyin)
caseTitle: Safari에서 중국어 IME 변환 지연 및 부분 변환
description: "macOS의 Safari에서 중국어 병음 IME를 사용할 때 문자 변환이 지연되거나 입력의 일부만 변환되고 나머지는 병음으로 남을 수 있습니다. 변환 프로세스는 사용자 상호작용에 의해 중단될 수도 있습니다."
tags:
  - ime
  - composition
  - chinese
  - pinyin
  - conversion
  - safari
  - macos
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">nihao</span>'
    description: "Chinese Pinyin input in progress (nihao), conversion pending"
  - label: "After Partial Conversion (Bug)"
    html: 'Hello 你hao'
    description: "Only partial conversion completed, some remains as Pinyin"
  - label: "✅ Expected"
    html: 'Hello 你好'
    description: "Expected: Entire Pinyin converted to Chinese characters"
---

### 현상

macOS의 Safari에서 contenteditable 요소에서 병음 IME로 중국어 텍스트를 조합할 때 문자 변환이 크게 지연되거나 병음 입력의 일부만 중국어 문자로 변환되고 나머지는 병음으로 남을 수 있습니다. 변환 프로세스는 클릭, 화살표 키 또는 기타 상호작용에 의해 중단될 수도 있습니다.

### 재현 예시

1. contenteditable div를 만듭니다.
2. 중국어 병음 IME로 전환합니다.
3. 병음 텍스트를 입력합니다 (예: 你好의 경우 "nihao").
4. 변환을 기다리거나 Space/Enter를 눌러 변환을 트리거합니다.
5. 변환 타이밍과 완전성을 관찰합니다.

### 관찰된 동작

- 변환이 몇 초가 걸리거나 완료되지 않을 수 있습니다
- 첫 번째 문자만 변환되고 나머지는 병음으로 남을 수 있습니다
- 클릭이나 화살표 키에 의해 변환이 취소될 수 있습니다
- 여러 후보 선택이 올바르게 작동하지 않을 수 있습니다
- 텍스트에 병음과 중국어 문자가 혼합되어 나타날 수 있습니다

### 예상 동작

- 변환이 빠르고 안정적으로 완료되어야 합니다
- 모든 병음 입력이 중국어 문자로 변환되어야 합니다
- 변환이 일반 상호작용에 의해 중단되지 않아야 합니다
- 후보 선택이 올바르게 작동해야 합니다

### 영향

- 사용자가 느리거나 불완전한 변환으로 인해 좌절감을 경험합니다
- 변환이 실패할 때 워크플로가 중단됩니다
- 텍스트에 의도하지 않은 병음과 중국어 문자가 혼합될 수 있습니다

### 브라우저 비교

- **Safari**: 변환 지연과 중단이 더 흔함
- **Chrome**: 일반적으로 더 안정적인 변환
- **Firefox**: 다른 변환 동작을 가질 수 있음

### 참고 및 해결 방법 가능한 방향

- 변환 상태를 감지하기 위해 조합 이벤트 모니터링
- 변환 중 사용자 상호작용 처리 지연
- 조합 후 텍스트를 검증하여 실패한 변환 감지
- 변환이 지연된 것으로 보일 때 사용자 피드백 제공
