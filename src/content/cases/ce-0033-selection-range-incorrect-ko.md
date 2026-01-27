---
id: ce-0033-selection-range-incorrect-ko
scenarioId: scenario-selection-range-accuracy
locale: ko
os: ["Windows", "macOS", "Linux"]
osVersion: "Any"
device: Desktop
deviceVersion: Any
browser: ["Chrome", "Edge", "Opera"]
browserVersion: "Latest"
keyboard: Any
caseTitle: 여러 요소에 걸쳐 선택할 때 선택 범위가 부정확함
description: "하나의 블록(예: <p>)에서 다른 블록으로 걸쳐지는 텍스트를 선택할 때, Chromium 기반 엔진의 getSelection() API는 시각적으로는 맞지만 논리적으로는 부적절한 노드 오프셋을 가진 범위를 반환할 수 있습니다."
tags: ["selection", "range", "multi-block", "chromium"]
status: confirmed
---

## 현상
중첩된 블록 구조(예: `<p>`, `<div>`)를 가로질러 텍스트를 선택할 때, Chromium 기반 브라우저(Chrome, Edge)의 `Selection` API가 시각적인 선택 영역과 일치하지 않는 논리적 경계를 반환하는 현상이 발생합니다. 특히 선택 영역의 시작점(startContainer)이나 끝점(endContainer)이 실제 텍스트 노드가 아닌 부모 요소인 블록 컨테이너를 가리키게 되어, 후속 편집 작업(텍스트 삽입, 삭제 등) 시 돔(DOM)이 깨지거나 엉뚱한 위치가 수정되는 원인이 됩니다.

## 재현 단계
1. 다음과 같은 중첩된 구조의 HTML을 준비합니다:
   ```html
   <div contenteditable="true">
     <p id="p1">첫 번째 단락입니다.</p>
     <p id="p2">두 번째 단락입니다.</p>
   </div>
   ```
2. 마우스를 사용하여 "첫 번째"의 중간부터 "두 번째"의 중간까지 드래그하여 선택합니다.
3. JavaScript 콘솔을 열고 `window.getSelection().getRangeAt(0)`을 호출하여 반환된 `Range` 객체를 확인합니다.
4. `startContainer`가 `#text "첫 번째 단락입니다."`가 아닌 부모 `<p>` 또는 `<div>`를 가리키는지 확인합니다.

## 관찰된 동작
- **컨테이너 점프**: 브라우저는 종종 선택 영역의 경계를 가장 가까운 공통 조상 블록 요소로 "스냅(Snap)" 처리합니다. 이로 인해 `startContainer`가 텍스트 노드 대신 `p` 요소를 가리키고, `startOffset`이 텍스트 내의 글자 위치가 아닌 자식 노드의 인덱스로 변질됩니다.
- **오프셋 불일치**: 시각적으로는 텍스트 일부만 선택된 것처럼 보임에도 불구하고, 내부 논리적으로는 요소 전체가 포함된 것으로 계산되어 `deleteContents()` 등의 명령을 실행할 때 원치 않는 요소가 통째로 삭제되기도 합니다.
- **레이아웃 종속성**: 이 문제는 CSS의 `line-height`, `display: block`, 또는 `user-select` 속성에 따라 재현 빈도가 달라집니다.

## 예상되는 동작
- `startContainer`와 `endContainer`는 사용자가 선택을 시작하고 끝낸 정확한 리프(leaf) 텍스트 노드를 가리켜야 합니다.
- `startOffset`은 해당 텍스트 노드 내에서의 유니코드 코드 포인트 기반의 정확한 글자 위치를 나타내야 합니다.

## 해결책 및 회피 방법
1. **범위 정규화 (Range Normalization)**:
   - `selectionchange` 이벤트를 모니터링하여, 선택 컨테이너가 요소 노드(Node.ELEMENT_NODE)인 경우 재귀적으로 깊이 우선 탐색을 수행하여 가장 적절한 자식 텍스트 노드로 범위를 재조정합니다.
2. **보이지 않는 문자(ZWS) 활용**:
   - 빈 블록 내부에서 커서가 튄다면 Zero Width Space(`\u200B`)를 삽입하여 선택 영역이 항상 텍스트 노드에 고정되도록 유도합니다.
3. **가상 모델 기반 동기화**:
   - ProseMirror나 Lexical과 같은 현대적 에디터처럼, 브라우저의 DOM Selection을 직접 신뢰하지 않고 내부적인 가상 문서 모델(State)을 기준으로 선택 영역을 매번 다시 렌더링(re-sync)하는 방식을 권장합니다.
