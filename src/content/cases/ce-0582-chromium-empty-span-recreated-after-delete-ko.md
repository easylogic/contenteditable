---
id: ce-0582-chromium-empty-span-recreated-after-delete-ko
scenarioId: scenario-inline-element-recreation-after-delete
locale: ko
os: Windows
osVersion: "11"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "124.0"
keyboard: US QWERTY
caseTitle: Chromium에서 빈 span 삭제 후 입력 시 span이 다시 생성됨
description: "Chrome에서 contenteditable 안의 빈 인라인 요소(span 등)를 삭제한 뒤 문자를 입력하면, 브라우저가 삭제된 인라인 래퍼를 다시 만들어 새 문자를 감쌈."
tags: ["chromium", "inline", "span", "delete", "dom", "formatting"]
status: draft
domSteps:
  - label: "1단계: 빈 span이 있는 내용"
    html: '<div contenteditable="true">hello <span></span> world</div>'
    description: "contenteditable에 두 텍스트 노드 사이에 빈 span이 있음."
  - label: "2단계: 사용자가 빈 span 삭제 (Backspace)"
    html: '<div contenteditable="true">hello  world</div>'
    description: "캐럿을 world 앞 공백 뒤에 두고 Backspace로 빈 span 제거; DOM은 공백이 접힌 형태일 수 있음."
  - label: "3단계: 사용자가 문자 입력 (버그)"
    html: '<div contenteditable="true">hello <span>x</span> world</div>'
    description: "'x' 입력 후 Chromium이 span을 다시 만들고 새 문자를 감싸서, DOM이 단순 'hello x world' 텍스트 런과 일치하지 않음."
  - label: "✅ 예상"
    html: '<div contenteditable="true">hello x world</div>'
    description: "예상: 새 인라인 래퍼 없이 입력 문자가 일반 텍스트 노드로 들어감."
---

## 현상

Chromium에서 사용자가 contenteditable 안의 빈 인라인 요소(예: `<span>`, `<b>`, `<i>`)를 삭제한 뒤 문자를 입력하면, 편집 엔진이 삭제된 인라인 요소를 다시 만들고 방금 입력한 문자를 그 안에 넣습니다. 이 동작은 레거시 execCommand/editing 스펙의 "오버라이드 기록 및 복원"에 기인합니다. `input` 이벤트는 브라우저가 이미 DOM을 수정한 뒤에 발생하므로, 에디터가 보는 DOM은 삭제 직후 상태(예: span 없음)와 맞지 않습니다. "삭제된 인라인 재생성"을 명시하는 `beforeinput`의 `inputType`은 없으며, 겉으로 보이는 결과는 입력된 문자를 감싼 새 래퍼입니다.

## 재현 단계

1. `hello <span></span> world`(두 텍스트 런 사이에 빈 span)를 포함한 contenteditable div를 만듦.
2. "hello" 뒤 공백 바로 뒤(빈 span 앞)에 캐럿을 둠.
3. Backspace를 한 번 눌러 빈 span을 제거함(또는 span 뒤에 캐럿을 두고 Delete).
4. 문자 하나(예: "x")를 입력함.
5. DOM을 확인하면 plain 텍스트 노드 "x" 대신 `<span>x</span>`(또는 유사)가 나타남.

## 관찰된 동작

- **이벤트 순서**: `keydown` (Backspace) → 기본 삭제로 빈 span 제거 → `input`. 이어서 `keydown` ("x") → 기본 삽입 → `beforeinput` (예: `insertText`) → `input`. `input` 이후 DOM에 입력된 문자를 감싼 새 인라인 래퍼가 포함됨.
- **일관성**: 삭제 전에 span 안에 공백이나 문자를 넣어 span이 "비어 있지 않게" 하면 재생성이 발생하지 않거나 달라짐. span에 `display: block` 등 비인라인을 주면 동작이 바뀌거나 재생성이 없을 수 있음.
- **다른 엔진**: Safari, Firefox는 동일 조건에서 span을 같은 방식으로 재생성하지 않을 수 있음; 실제로는 Chromium 특유 동작에 가깝음.

## 예상 동작

예측 가능한 편집 의미에 따르면, 인라인 요소를 삭제한 뒤 입력하면 입력된 문자가 일반 텍스트 노드(또는 인접 텍스트 노드에 병합)로 삽입되어야 합니다. 브라우저가 이전에 삭제한 인라인 래퍼를 다시 만들어서는 안 됩니다. Input Events 스펙에는 "삭제된 인라인 재생성"이 표준 동작으로 정의되어 있지 않습니다.

## 영향

- **상태 오염**: React/Vue/Svelte는 DOM을 자신의 상태에서 파생된 것으로 다루므로, 예기치 않은 `<span>` 삽입은 재조정을 깨고 중복·잘못된 내용을 유발할 수 있음.
- **실행 취소/다시 실행**: "span 삭제" 후 "텍스트 삽입"을 기록하는 커스텀 히스토리는 최종 DOM(새 span 포함)과 맞지 않음.
- **직렬화**: HTML 내보내기 결과에 사용자가 의도하지 않은 추가 포맷팅(예: `<span>x</span>`)이 포함될 수 있음.

## 브라우저 비교

- **Chrome (Blink)**: 입력 시 빈 인라인 재생성; 124.x에서 확인됨.
- **Safari (WebKit)**: 동일 시나리오에서 같은 방식으로 재생성하지 않을 수 있음; 구조에 따름.
- **Firefox (Gecko)**: 동일 조건에서 삭제된 빈 인라인을 같은 방식으로 재생성하지 않는 경우가 많음.

## 해결 방법

1. **input 시 정규화**: `input` 핸들러에서 편집 루트를 순회하며 불필요한 인라인 요소(예: `span:empty`, 에디터가 만들지 않은 단일 텍스트 노드 span)를 제거하거나 병합.
2. **빈 인라인 피하기**: 콘텐츠를 만들 때 빈 `<span>`/`<b>`/`<i>` 노드를 남기지 않고, ZWSP(`\u200B`)를 넣거나 내용을 넣어 이 경로에서 "빈" 노드로 처리되지 않게 함.
3. **beforeinput + preventDefault**: `insertText`/`insertCompositionText` 시 preventDefault 후 자체 DOM 업데이트를 적용하면 브라우저 기본 삽입(및 인라인 재생성)을 막을 수 있음. 이 경우 `getTargetRanges()` 사용과 캐럿 복원이 필요함.

## 참고 자료

- [W3C editing #468: Contenteditable re-creating deleted children](https://github.com/w3c/editing/issues/468)
- [Stack Overflow: Chrome empty span in contenteditable](https://stackoverflow.com/questions/68914093/chrome-trying-to-delete-empty-span-in-contenteditable-results-in-added-node)
- [Chromium / execCommand 관련 동작](https://w3c.github.io/editing/docs/execCommand/)
