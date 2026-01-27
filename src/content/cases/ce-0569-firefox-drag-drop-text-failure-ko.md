---
id: ce-0569
scenarioId: scenario-firefox-drag-drop-issues
locale: ko
os: Linux
osVersion: "Ubuntu 24.04"
device: Desktop
deviceVersion: Any
browser: Firefox
browserVersion: "132.0"
keyboard: US QWERTY
caseTitle: "텍스트 드래그 앤 드롭 시 콘텐츠 이동 실패"
description: "최신 Firefox(2024/2025) 버전에서 contenteditable 영역 내의 텍스트를 선택하여 드래그할 때, Chromium 기반 브라우저와 달리 '이동(move)' 작업이 정상적으로 수행되지 않는 현상입니다."
tags: ["drag-drop", "firefox", "ux", "reliability"]
status: confirmed
domSteps:
  - label: "1단계: 텍스트 선택"
    html: '<div contenteditable="true">[선택된 텍스트]와 다른 내용들.</div>'
    description: "이동할 텍스트 영역을 마우스로 드래그하여 선택합니다."
  - label: "2단계: 드래그 중"
    html: '<div contenteditable="true">선택된 텍스트와 [드롭 대상] 다른 내용들.</div>'
    description: "선택 영역을 클릭한 채로 새 위치로 끌어다 놓습니다. Firefox는 드래그 이미지는 보여주지만 내부 이동 로직을 트리거하지 않습니다."
  - label: "3단계: 버그 결과"
    html: '<div contenteditable="true">선택된 텍스트와 [드롭 대상] 다른 내용들.</div>'
    description: "마우스를 떼었을 때 아무 일도 일어나지 않습니다. DOM은 드래그 시작 전과 동일한 상태를 유지합니다."
  - label: "✅ 예상 동작"
    html: '<div contenteditable="true">와 [선택된 텍스트] 다른 내용들.</div>'
    description: "예상: 원본 위치에서 텍스트가 제거되고 목적지 위치에 삽입되어야 합니다."
---

## 현상
Firefox에서 보고된 회귀 버그 또는 장기적인 동작 차이(2025년 11월 Lexical Playground에서 활성 확인)로 인해, `contenteditable` 내에서 기본 "드래그하여 이동" 기능이 작동하지 않습니다. Chromium 및 WebKit 엔진은 사용자가 드래그 앤 드롭으로 텍스트 블록의 위치를 직관적으로 변경할 수 있게 허용하지만, Firefox는 텍스트를 순간 이동시키는 데 필요한 `drop` 이벤트나 내부 DOM 업데이트를 디스패치하지 못하는 경우가 잦습니다.

## 재현 단계
1. Firefox(v130 이상)에서 `contenteditable` 에디터를 엽니다.
2. 두 개의 문장을 입력합니다.
3. 첫 번째 문장을 마우스로 선택합니다.
4. 선택 영역을 길게 클릭한 후 두 번째 문장 끝으로 끌어다 놓습니다.
5. 마우스 버튼을 놓습니다.

## 관찰된 동작
1. **`dragstart`**: 정상적으로 발생합니다.
2. **Ghost Image (미리보기 이미지)**: 나타나서 마우스를 따라다닙니다.
3. **`drop`**: 대상 지점에서 아예 발생하지 않거나, 발생하더라도 브라우저의 기본 동작(텍스트 이동)이 실행되지 않습니다.
4. **결과**: 선택 영역이 원본 위치에 그대로 남아 있으며 아무것도 이동하지 않습니다. `deleteByDrag`나 `insertFromDrop` 타입의 `beforeinput` 이벤트도 트리거되지 않습니다.

## 예상 동작
브라우저는 원본 파편의 삭제와 목적지로의 삽입 작업을 자동으로 처리해야 하며, 두 작업 모두에 대해 `beforeinput` 이벤트를 발생시켜야 합니다.

## 영향
- **사용자 경험 단절**: 마우스 기반 편집에 의존하는 사용자(노령층이나 특정 작업 흐름을 가진 사용자)는 에디터가 "고장 났다"고 느낍니다.
- **프레임워크 비호환성**: Lexical, Slate와 같은 현대적인 프레임워크들은 브라우저가 기본적인 이동 작업을 관리하거나, 드롭 시 유효한 `DataTransfer` 객체를 제공할 것을 기대합니다.

## 브라우저 비교
- **Firefox 130-132**: 이동 작업 실패 보고됨.
- **Chrome / Edge**: 기본적으로 매끄럽게 작동함.
- **Safari**: macOS 환경에서 정상 작동함.

## 참고 및 해결 방법
### 해결책: 수동 드래그 앤 드롭 핸들러 구현
브라우저가 텍스트 이동에 실패하는 경우, `DataTransfer` API를 사용하여 완전한 드래그 앤 드롭 관리자를 직접 구현해야 합니다.

```javascript
element.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', window.getSelection().toString());
    e.dataTransfer.effectAllowed = 'move';
});

element.addEventListener('drop', (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const range = document.caretRangeFromPoint(e.clientX, e.clientY);
    
    // 수동으로 원본 삭제 및 대상 범위에 삽입
    // 참고: 프레임워크에서는 보통 복잡한 트랜잭션 로직이 필요합니다.
    dispatchMoveTransaction(sourceRange, range, data);
});
```

- [Lexical 이슈 #8014: Firefox에서 텍스트 드래그 앤 드롭 깨짐](https://github.com/facebook/lexical/issues/8014)
- [Mozilla Bugzilla #1898711 (관련 이슈)](https://bugzilla.mozilla.org/show_bug.cgi?id=1898711)
