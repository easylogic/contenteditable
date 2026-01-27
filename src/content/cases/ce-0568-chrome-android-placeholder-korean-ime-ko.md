---
id: ce-0568-chrome-android-placeholder-korean-ime-ko
scenarioId: scenario-placeholder-behavior
locale: ko
os: Android
osVersion: "14.0"
device: Smartphone
deviceVersion: Any
browser: Chrome
browserVersion: "131.0"
keyboard: Korean (IME)
caseTitle: "Placeholder가 있으면 한글 조합 첫 글자가 파손됨"
description: "안드로이드 크롬(2024년 말/2025년 기준)에서 'placeholder' 속성이 존재할 경우, 한글 조합의 첫 음절이 깨지거나 중복 입력되는 현상입니다."
tags: ["ime", "composition", "placeholder", "android", "chrome-131"]
status: confirmed
domSteps:
  - label: "1단계: Placeholder가 있는 빈 셀 포커스"
    html: '<div contenteditable="true" placeholder="내용을 입력하세요..."></div>'
    description: "에디터가 비어 있고 CSS를 통해 placeholder가 표시된 상태입니다."
  - label: "2단계: 조합 시작 ('ㅎ')"
    html: '<div contenteditable="true" placeholder="내용을 입력하세요...">ㅎ|</div>'
    description: "사용자가 'ㅎ'을 입력합니다. 이때 placeholder는 즉시 사라져야 합니다."
  - label: "3단계: 버그 발생 (데이터 유실)"
    html: '<div contenteditable="true" placeholder="내용을 입력하세요...">|</div>'
    description: "크롬 131 버전에서 placeholder 상태가 전환되면서 첫 글자 'ㅎ'이 지워지거나 조합 세션이 초기화됩니다."
  - label: "✅ 예상 동작"
    html: '<div contenteditable="true">ㅎ|</div>'
    description: "예상: 글자가 유지되고 '하', '한' 등으로 정상적으로 조합되어야 함"
---

## 현상
2025년 12월 보고된 안드로이드용 Chrome의 특정 회귀 버그로, CSS 기반의 placeholder 구현과 한국어 IME 간의 상호작용 문제입니다. `contenteditable` 요소가 비어 있어 placeholder를 표시하고 있을 때, 한국어 조합 세션을 시작하면 브라우저가 placeholder를 제거하는 과정에서 DOM을 재설정(reset)하게 되고, 이 과정에서 첫 번째 글자의 활성 조합 세션이 강제로 종료되어 버립니다.

## 재현 단계
1. `placeholder` 속성이나 CSS `:empty:before` 규칙이 적용된 `contenteditable` 요소를 생성합니다.
2. 안드로이드 Chrome(v131 이상)에서 페이지를 엽니다.
3. 비어 있는 요소를 클릭하여 포커스를 줍니다.
4. 한글 자모 하나를 입력합니다 (예: "ㅎ").
5. 해당 글자가 유지되는지 아니면 사라지는지 관찰합니다.

## 관찰된 동작
1. **`compositionstart`**: 정상적으로 발생합니다.
2. **Placeholder 로직**: 브라우저가 요소가 더 이상 비어 있지 않음을 감지하고 `:before` 또는 내부 placeholder 노드를 제거합니다.
3. **충돌**: Placeholder를 제거하는 DOM 변이(Mutation)가 IME의 첫 글자 내부 버퍼와 충돌합니다.
4. **결과**: 첫 글자 "ㅎ"이 유실되거나 IME 입력을 방해하여 사용자가 첫 글자를 두 번 입력하게 만듭니다.

## 예상 동작
Placeholder 제거 작업은 원자적(Atomic)으로 수행되어야 하며, 활성화된 IME 조합 세션을 방해해서는 안 됩니다. 첫 글자는 유실되지 않고 뒤따르는 입력과 정상적으로 결합되어야 합니다.

## 영향
- **심각한 사용자 경험 저하**: 사용자가 모든 새로운 문장이나 필드를 입력할 때마다 첫 글자를 다시 입력해야 하는 불편함을 겪습니다.
- **데이터 오염**: 경우에 따라 에디터 프레임워크가 정리할 수 없는 "죽은 텍스트(dead text)"가 음절의 일부로 남게 됩니다.

## 브라우저 비교
- **Android Chrome (v131/v132)**: 버그 발생.
- **Android Firefox**: 정상 동작.
- **iOS Safari**: 정상 동작 (다른 방식의 placeholder 주입 메커니즘 사용).

## 참고 및 해결 방법
### 해결책: 포커스 시 Placeholder 숨기기
`:empty` 상태에만 의존하지 말고, 요소가 포커스를 받는 즉시 (조합이 시작되기 전에) placeholder를 숨기도록 처리합니다.

```css
/* 한국어 IME 사용 시 이 방식은 피하는 것이 좋습니다 */
[contenteditable]:empty::before {
  content: attr(placeholder);
}

/* 개선된 워크라운드 */
[contenteditable]:focus::before {
  content: "" !important; /* 포커스 시 즉시 placeholder 제거 */
}
```

- [Chromium Bug #40285641 (관련 이슈)](https://issues.chromium.org/issues/40285641)
- [GitHub Issue: Chrome Android Hangul Placeholder](https://github.com/facebook/lexical/issues/6821)
