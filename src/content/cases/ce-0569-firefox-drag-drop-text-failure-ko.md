---
id: ce-0569-firefox-drag-drop-text-failure-ko
scenarioId: scenario-firefox-drag-drop-issues
locale: ko
os: Linux
osVersion: "Ubuntu 24.04 / Windows 11"
device: Desktop
deviceVersion: Any
browser: Firefox
browserVersion: "135.0 (Latest)"
keyboard: US QWERTY
caseTitle: "Firefox 드래그 앤 드롭 오류 통합 리포트"
description: "Firefox에서 발생하는 텍스트 이동 실패, 원치 않는 노드 중복, 중첩 span 생성 등 드래그 앤 드롭 관련 결함들의 종합 색인입니다."
tags: ["drag-drop", "firefox", "ux", "reliability", "dom-corruption"]
status: confirmed
domSteps:
  - label: "유형 A: 이동 실패"
    html: '<div contenteditable="true">[이동할 텍스트] ... 목적지</div>'
    description: "표준 텍스트 선택 영역이 시각적으로는 끌어다 놓아지지만, 실제로는 이동되지 않으며 이벤트가 발생하지 않음."
  - label: "유형 B: 노드 중복"
    html: '<div contenteditable="true"><span contenteditable="false">위젯</span></div>'
    description: "편집 불가능한 노드를 드래그했을 때 원본이 삭제되지 않고 목적지에 복제본이 생김."
  - label: "유형 C: 구조적 오염"
    html: '<div contenteditable="true">텍스트 <span>span 내부</span></div>'
    description: "span 내부에서 텍스트를 드래그하면 Firefox가 불필요한 중첩 span 래퍼를 자동으로 생성함."
  - label: "✅ 예상 동작"
    html: "기존 DOM 계층을 유지하면서 원본 삭제와 목적지 삽입이 깔끔하게 이루어지는 이동 작업."
---

## 현상
Firefox(2026년 초 기준)는 `contenteditable` 내 드래그 앤 드롭 동작에 있어 다른 엔진들과 가장 큰 차이를 보입니다. 주요 실패 모드는 다음과 같습니다:
1.  **선택 영역 정체(Selection Stall)**: 표준 텍스트 드래그 시 원본은 그대로 남고 목적지에는 아무것도 입력되지 않는 현상이 잦습니다.
2.  **유령 복제(Ghost Duplication)**: 멘션이나 미디어 위젯과 같은 `contenteditable="false"` 엘리먼트를 드래그할 때, 원본을 제거하지 않고 목적지에 복제본을 삽입합니다.
3.  **캡슐화 누수(Encapsulation Leak)**: `<span>`이나 `<code>` 블록 내부에서 텍스트를 드래그하면 브라우저 내부 로직이 중복된 중첩 엘리먼트(예: `<span><span>내용</span></span>`)를 생성하여 DOM을 오염시킵니다.

## 재현 단계 (일반)
1. Firefox에서 `contenteditable` 에디터를 엽니다.
2. `textarea`에 있는 텍스트를 `div` 에디터로 옮기려고 시도합니다.
3. `contenteditable="false"` 위젯을 끌어다 놓습니다.
4. `deleteByDrag` 유형의 `beforeinput` 이벤트가 발생하는지 관찰합니다.

## 관찰된 동작
- **`textarea`에서 `div`로**: 완전히 실패하며 텍스트가 전송되지 않습니다.
- **노드 잔존**: "이동" 효과가 "복제"로 처리되어 에디터 내부 모델을 손상시킵니다.
- **태그 수프(Tag Soup)**: 불필요한 중첩이 쌓여 CSS 선택자 오작동 및 데이터 직렬화 오류를 유발합니다.

## 영향
- **UX 파괴**: 마우스 기반 편집에 의존하는 사용자들에게 에디터가 완전히 고장 난 것처럼 느껴집니다.
- **모델 불일치**: Lexical이나 Slate 같은 프레임워크가 이러한 "유령 변이(ghost mutations)"를 추적하지 못합니다.

## 참고 및 해결 방법
### 해결책: 고정밀 드래그 매니저 구현
가장 확실한 해결책은 `dragstart`와 `drop` 이벤트를 가로채 에디터의 트랜잭션 엔진을 통해 이동 로직을 수동으로 제어하는 것입니다.

```javascript
/* 통합 핸들러 (유형 A, B, C 모두 대응) */
element.addEventListener('drop', (e) => {
    // 1. 브라우저의 불안정한 기본 동작 차단
    e.preventDefault();
    
    // 2. 유입 데이터 식별
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;

    // 3. 목적지 좌표 계산
    const range = document.caretRangeFromPoint(e.clientX, e.clientY);
    
    // 4. 강제 '이동' 로직 수행
    // 원본 삭제 (dragstart에서 저장한 범위 사용)
    // 목적지 삽입
    editor.applyTransform('move', { text: data, at: range });
});
```

- [Mozilla Bugzilla #1898711](https://bugzilla.mozilla.org/show_bug.cgi?id=1898711)
- [Lexical 이슈 #8014](https://github.com/facebook/lexical/issues/8014)
- [이전 ce-0013, ce-0300, ce-0310, ce-0554 통합본]
