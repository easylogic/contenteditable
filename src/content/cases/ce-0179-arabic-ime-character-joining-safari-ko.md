---
id: ce-0179-arabic-ime-character-joining-safari-ko
scenarioId: scenario-ime-rtl-and-character-joining
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: Arabic (IME)
caseTitle: Safari에서 아랍어 IME 문자 결합 및 RTL 방향 문제
description: "macOS의 Safari에서 아랍어 IME를 사용할 때 아랍어 문자가 올바르게 결합되지 않아 별도의 연결되지 않은 문자로 나타날 수 있습니다. RTL 텍스트 방향도 올바르게 처리되지 않을 수 있으며 캐럿 이동이 잘못될 수 있습니다."
tags:
  - ime
  - composition
  - arabic
  - rtl
  - text-direction
  - character-joining
  - safari
  - macos
status: draft
domSteps:
  - label: "Before"
    html: '<span dir="rtl">Hello <span style="text-decoration: underline; background: #fef08a;">مرح</span></span>'
    description: "Arabic composition in progress (مرح), RTL direction"
  - label: "After (Bug)"
    html: '<span dir="rtl">Hello م ر ح</span>'
    description: "Character joining failed, separated into individual characters"
  - label: "✅ Expected"
    html: '<span dir="rtl">Hello مرحبا</span>'
    description: "Expected: Characters correctly joined (مرحبا)"
---

## 현상

macOS의 Safari에서 contenteditable 요소에서 IME로 아랍어 텍스트를 조합할 때 아랍어 문자가 컨텍스트에 따라 올바르게 결합되지 않아 연결된 단어를 형성하는 대신 별도의 연결되지 않은 문자로 나타날 수 있습니다. RTL(오른쪽에서 왼쪽으로) 텍스트 방향도 올바르게 처리되지 않을 수 있으며 RTL 컨텍스트에서 캐럿 이동이 잘못될 수 있습니다.

## 재현 예시

1. contenteditable div를 만듭니다.
2. 방향을 RTL로 설정하거나 자동 방향을 사용합니다.
3. 아랍어 IME로 전환합니다.
4. 아랍어 텍스트를 입력합니다 (예: "مرحبا").
5. 문자 결합과 텍스트 방향을 관찰합니다.

## 관찰된 동작

- 아랍어 문자가 올바르게 결합되지 않아 연결되지 않은 것으로 나타날 수 있습니다
- 텍스트가 오른쪽에서 왼쪽 대신 왼쪽에서 오른쪽으로 표시될 수 있습니다
- RTL 텍스트에서 캐럿이 잘못 이동할 수 있습니다
- RTL 컨텍스트에서 텍스트 선택이 올바르게 작동하지 않을 수 있습니다
- 아랍어와 라틴어 텍스트가 혼합된 경우 방향 처리가 잘못될 수 있습니다

## 예상 동작

- 아랍어 문자가 위치에 따라 컨텍스트적으로 결합되어야 합니다
- 텍스트가 오른쪽에서 왼쪽으로 올바르게 표시되어야 합니다
- RTL 컨텍스트에서 캐럿이 올바르게 이동해야 합니다
- RTL에서 텍스트 선택이 올바르게 작동해야 합니다
- 혼합 방향 텍스트가 방향을 올바르게 처리해야 합니다

## 영향

- 아랍어 텍스트가 읽을 수 없거나 읽기 어려울 수 있습니다
- 사용자가 올바른 아랍어 텍스트를 안정적으로 입력할 수 없습니다
- 혼합 방향 텍스트(아랍어 + 영어)가 잘못 표시될 수 있습니다

## 브라우저 비교

- **Safari**: RTL과 문자 결합이 일관되지 않을 수 있음, 특히 macOS에서
- **Chrome**: 일반적으로 더 나은 RTL 지원이지만 문자 결합이 여전히 실패할 수 있음
- **Firefox**: RTL 지원이 좋지만 일부 엣지 케이스가 존재함

## 참고 및 해결 방법 가능한 방향

- 적절한 RTL 방향이 설정되도록 보장 (dir="rtl")
- 아랍어 텍스트를 모니터링하고 방향을 자동으로 설정
- 조합 후 문자 결합 검증
- 혼합 방향 텍스트를 주의 깊게 처리
- 복잡한 경우에 Unicode 양방향 알고리즘(bidi) 사용
- getComputedStyle로 텍스트 방향 확인
