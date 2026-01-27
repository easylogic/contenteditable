---
id: ce-0004-ime-backspace-removes-whole-syllable-ko
scenarioId: scenario-ime-interaction-patterns
locale: ko
os: ["Windows", "macOS", "Android", "iOS", "Linux"]
osVersion: "Any"
device: ["Desktop", "Mobile"]
deviceVersion: Any
browser: ["Chrome", "Edge", "Safari", "Firefox"]
browserVersion: "Latest"
keyboard: Korean (IME)
caseTitle: Backspace가 단일 자모 대신 전체 컴포지션된 음절을 제거함
description: "contenteditable 요소에서 한국어 텍스트를 편집할 때 Backspace 키를 누르면 단일 자모 대신 전체 컴포지션된 음절이 제거됩니다. 이로 인해 세밀한 수정이 어렵고 예상 동작과 다릅니다."
tags: ["composition", "ime", "backspace", "korean"]
status: confirmed
domSteps:
  - label: "Before"
    html: 'Hello 한글'
    description: "한국어 텍스트 입력 완료"
  - label: "After Backspace (Bug)"
    html: 'Hello '
    description: "전체 음절 '한글' 삭제됨 (단일 Backspace로 과도하게 삭제)"
  - label: "✅ Expected"
    html: 'Hello 한'
    description: "예상: 한 번에 한 문자(자모)씩 삭제 (첫 번째 Backspace는 '글'의 종성 'ㄹ'만 삭제)"
---

## 현상
`contenteditable` 요소에서 한국어 텍스트를 편집할 때, 조합 중인 음절이나 이미 입력된 음절에서 `Backspace` 키를 누르면 마지막 자모(자음/모음) 하나만 삭제되는 대신, 음절 전체가 통째로 지워지는 현상이 발생합니다. 이는 사용자가 미세한 오타를 수정하는 것을 불가능하게 만들며, 동일한 플랫폼의 네이티브 입력 필드(`input`, `textarea`)와는 확연히 다른 부정적인 사용자 경험을 초래합니다.

## 재현 단계
1. `contenteditable="true"` 영역에 포커스합니다.
2. 한국어 IME를 사용하여 "한"이라고 입력합니다. (ㅎ + ㅏ + ㄴ 의 조합)
3. "한"이라는 글자가 완성되었거나 아직 조합 중인 상태에서 `Backspace`를 한 번 누릅니다.
4. "하"가 남는 대신 "한" 전체가 순식간에 사라지고 빈 칸이 되는지 관찰합니다.

## 관찰된 동작
- **음절 단위 삭제 (Syllable Deletion)**: 브라우저의 기본 삭제 로직이 조합형 문자의 내부 구조를 무시하고 하나의 'Grapheme Cluster'로 인식하여 일괄 삭제 처리합니다.
- **이벤트 범위 오류**: `beforeinput` 이벤트의 `inputType`이 `deleteContentBackward`로 발생할 때, `getTargetRanges()`가 반환하는 범위가 실제 자모 하나가 아닌 음절 전체를 포함하고 있는 경우가 많습니다.
- **포맷팅 노드 간섭**: 삭제하려는 텍스트가 `<span>`이나 `<strong>` 같은 태그로 감싸져 있을 경우, 브라우저가 태그 경계를 처리하는 방식과 IME의 조합 로직이 충돌하면서 삭제 범위가 비정상적으로 확장되기도 합니다.

## 예상되는 동작
- `Backspace` 키를 한 번 누를 때마다, 가장 최근에 입력된 자모 하나(종성 -> 중성 -> 초성 순)만 단계적으로 삭제되어야 합니다.
- 예를 들어 "한"에서 `Backspace`를 누르면 "하"가 되어야 하고, "하"에서 또 누르면 "ㅎ"이 남아야 합니다.

## 해결책 및 회피 방법
1. **수동 자모 분해 처리 (Decomposition)**:
   - `Backspace` 키 입력을 감지했을 때, 현재 커서 앞의 문자가 한국어 음절이라면 이를 유니코드 공식(NFD 분해 등)을 이용해 자모 단위로 쪼갠 뒤, 마지막 자모를 제외한 나머지 조합으로 텍스트를 즉시 교체하는 로직을 구현합니다.
2. **BeforeInput 가로채기 및 보정**:
   - `beforeinput` 이벤트에서 삭제 범위를 가로채고, 만약 브라우저가 음절 전체를 삭제하려고 시도한다면 `preventDefault()`를 호출합니다. 그 후 에디터 내부 모델 수준에서 자모 단위 삭제를 수행하고 돔을 갱신합니다.
3. **가상 커서 기반 모델 동기화**:
   - 현대적인 에디터 엔진(ProseMirror, Lexical 등)을 사용하여 브라우저의 전역 `Selection`에만 의존하지 않고, 내부적인 문서 상태(State)를 기준으로 삭제 동작을 정밀하게 제어합니다.
