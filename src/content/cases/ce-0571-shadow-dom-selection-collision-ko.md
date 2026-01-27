---
id: ce-0571
scenarioId: scenario-contenteditable-shadow-dom
locale: ko
os: macOS
osVersion: "14.6"
device: Desktop
deviceVersion: Any
browser: All Browsers
browserVersion: "Latest (2024)"
keyboard: US QWERTY
caseTitle: "Shadow DOM 내 다중 선택 영역 충돌 현상"
description: "contenteditable을 Shadow DOM 내부에 배치할 때 Selection API가 일관성 없게 동작하며, 문서와 Shadow Root가 서로 다른 범위를 보고하는 '유령 선택' 현상이 발생합니다."
tags: ["shadow-dom", "selection", "api-collision", "isolation"]
status: confirmed
domSteps:
  - label: "1단계: Shadow Root 설정"
    html: '<div id="host">#shadow-root <div contenteditable="true">Shadow 내부 텍스트</div></div>'
    description: "웹 컴포넌트를 통해 에디터가 Shadow Root 내부에 캡슐화되어 있습니다."
  - label: "2단계: 외부 선택"
    html: '<span>문서 텍스트</span> <div id="host">#shadow-root ...</div>'
    description: "사용자가 Shadow Host 외부의 텍스트를 선택합니다."
  - label: "3단계: Shadow 내부 선택 (버그 발생)"
    html: '<span>문서 텍스트</span> <div id="host">#shadow-root <div contenteditable="true">[Shadow 내부 텍스트]</div></div>'
    description: "사용자가 Shadow 에디터 내부를 클릭합니다. 일부 브라우저에서는 외부 선택 영역이 시각적/논리적으로 유지되는 반면, window.getSelection()은 실제 캐럿과 일치하지 않는 '비워진' 또는 '재타겟팅된' 범위를 반환합니다."
  - label: "✅ 예상 동작"
    html: '<span>문서 텍스트</span> <div id="host">#shadow-root <div contenteditable="true">[Shadow 내부 텍스트]</div></div>'
    description: "예상: window.getSelection()이 Shadow Root 내부의 범위를 정확히 반영하거나, 브라우저가 통합된 Selection 프록시를 제공해야 합니다."
---

## 현상
웹의 Selection API는 기본적으로 '문서당 하나의 선택 영역' 모델을 기반으로 설계되었습니다. `contenteditable`이 Shadow Root 내부에 배치되면 이 모델이 깨집니다. 2024년에 집중적으로 논의된 바에 따르면, 많은 브라우저에서 전역 `window.getSelection()`이 Shadow 트리 내부까지 탐색하지 못하고 Shadow Host 자체를 반환하거나 null 범위를 반환하는 문제가 발생합니다. 반대로 `shadowRoot.getSelection()`(지원되는 경우)은 전역 문서가 인지하지 못하는 범위를 보고할 수 있어, 시각적으로 두 개의 선택 영역이 나타나거나 명령어 실행이 실패하는 등의 혼란을 야기합니다.

## 재현 단계
1. Shadow Root를 가진 커스텀 엘리먼트를 생성합니다.
2. Shadow Root 내부에 `contenteditable="true"`가 설정된 `div`를 추가합니다.
3. 커스텀 엘리먼트 외부에 텍스트를 추가합니다.
4. 외부 텍스트를 드래그하여 선택합니다.
5. Shadow 기반 에디터 내부를 클릭하고 타이핑을 시작합니다.
6. `window.getSelection()`과 `this.shadowRoot.getSelection()`의 값을 비교합니다.

## 관찰된 동작
1. **선택 영역 충돌**: 캐럿이 Shadow Root 내부에서 활성화되어 있음에도 불구하고 외부 텍스트의 파란색 하이라이트가 유지될 수 있습니다.
2. **API 불일치**:
   - `window.getSelection()`: 종종 `#host` 엘리먼트를 `startContainer`로, 오프셋을 0으로 반환하여 내부의 실제 범위를 가립니다.
   - `document.activeElement`: `#host`를 정확히 식별하지만, 내부 텍스트 노드까지는 도달하지 못합니다.
3. **명령어 실패**: 전역 선택 영역이 Shadow Root 내부의 텍스트 노드를 "보지" 못하기 때문에 `document.execCommand('bold')` 호출이 실패합니다.

## 예상 동작
Selection API는 가장 깊은 곳의 활성 범위까지 일관된 경로를 제공해야 하며, 브라우저는 Shadow Root의 선택 의도를 전역 문서로 자동 전달(forwarding)해야 합니다.

## 영향
- **프레임워크 무력화**: `window.getSelection()`에 의존하여 캐럿 위치를 찾는 현대적인 에디터(Lexical, Slate 등)들이 웹 컴포넌트 내부에서 사용될 때 에러를 발생시키거나 노드를 잘못 배치합니다.
- **접근성 저하**: 스크린 리더가 Shadow Root 외부의 선택 영역에 멈춰있을 수 있습니다.
- **기능 오작동**: 브라우저의 내장 기능인 "페이지 내 찾기"나 "선택 영역 인쇄"가 Shadow 기반의 `contenteditable` 영역 내용을 확인하지 못하는 경우가 많습니다.

## 브라우저 비교
- **Chrome/Edge**: `shadowRoot.getSelection()` 지원 등에서 가장 앞서 있으나, 여전히 전역 동기화 문제를 보입니다.
- **Safari**: 역사적으로 일관성이 없으며, 경계를 넘나드는 클릭 시 `window.getSelection()`을 신뢰하기 어렵습니다.
- **Firefox**: 가장 제한적이며, Shadow 경계를 가로지르는 선택 영역과 관련해 오래된 버그들이 존재합니다.

## 참고 및 해결 방법
### 해결책: 선택 영역 프록싱(Proxying)
Shadow Root 내부의 선택 변화를 감지하여 수동으로 동기화하거나 에디터용 프록시 객체를 사용합니다.

```javascript
this.shadowRoot.addEventListener('selectionchange', () => {
    const internalSel = this.shadowRoot.getSelection();
    // 프레임워크에 맞는 수동 동기화 로직
    if (internalSel.rangeCount > 0) {
        editor.updateSelection(internalSel.getRangeAt(0));
    }
});
```

- [W3C 이슈: Selection API와 Shadow DOM](https://github.com/w3c/selection-api/issues/173)
- [Stack Overflow: Shadow DOM 내부에서 선택 영역 가져오기](https://stackoverflow.com/questions/43171542/get-selection-inside-of-a-shadow-dom)
