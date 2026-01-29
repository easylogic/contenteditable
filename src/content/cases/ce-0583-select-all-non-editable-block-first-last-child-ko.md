---
id: ce-0583-ko
scenarioId: scenario-select-all-non-editable-block
locale: ko
os: macOS
osVersion: "14"
device: Desktop
deviceVersion: Any
browser: Safari
browserVersion: "17"
keyboard: US QWERTY
caseTitle: 비편집 블록이 첫/끝 자식일 때 Ctrl+A(전체 선택) 실패
description: "Safari(및 Chrome)에서 contenteditable의 첫 번째 또는 마지막 자식이 비편집 블록일 때 Ctrl+A를 누르면 전체가 선택되지 않고 선택이 잘못된 방향으로 접힘."
tags: ["selection", "select-all", "non-editable", "safari", "chrome", "wysiwyg"]
status: draft
domSteps:
  - label: "1단계: 비편집 첫 자식이 있는 contenteditable"
    html: '<div contenteditable="true"><div contenteditable="false">[위젯]</div><p>문단 1.</p><p>문단 2.</p></div>'
    description: "편집 루트의 첫 자식이 임베드 비편집 블록, 그 다음 두 개의 편집 가능 문단."
  - label: "2단계: 사용자가 Ctrl+A 입력"
    html: '<div contenteditable="true"><div contenteditable="false">[위젯]</div><p>문단 1.</p><p>문단 2.</p></div>'
    description: "예상: 전체 내용 선택. 실제: 선택이 편집 가능 쪽으로 접히며 위젯이 제외될 수 있음."
  - label: "✅ 예상"
    html: '<div contenteditable="true"><div contenteditable="false">[위젯]</div><p>문단 1.</p><p>문단 2.</p></div>'
    description: "비편집 블록을 포함한 루트 전체가 선택되어 복사/삭제가 문서 전체에 적용되어야 함."
---

## 현상

contenteditable 컨테이너의 **첫** 또는 **마지막** 자식이 블록 수준 비편집 자식(예: `contenteditable="false"`)일 때, 네이티브 전체 선택(Ctrl+A 또는 Cmd+A)이 전체 내용을 선택하지 않습니다. 대신 선택이 비편집 블록에서 반대 방향으로 접혀, 비편집 블록 및 일부 노드가 범위에서 빠집니다. Safari, Chrome, Opera에서 재현되었으며, 2022년 기준 Safari 15.5에서도 유지됩니다. 문서 경계에 위젯·이미지 등 비편집 블록을 두는 WYSIWYG 에디터에서 치명적입니다.

## 재현 단계

1. 첫 자식이 `contenteditable="false"`인 블록(임베드 위젯 또는 이미지)이고 그 다음에 편집 가능 문단 두 개 이상인 contenteditable div를 만듦.
2. 편집 가능 문단 안에 캐럿을 둠.
3. Ctrl+A(Windows/Linux) 또는 Cmd+A(macOS)를 누름.
4. 선택을 확인함: 편집 가능 문단만 선택되고 첫 자식이 빠지거나, 전체 범위 대신 한 지점으로 접힐 수 있음.
5. 비편집 블록을 **마지막** 자식으로 두고(예: 끝에 위젯) 같은 방식으로 Ctrl+A를 누르면 역시 전체 선택이 실패함.

## 관찰된 동작

- **이벤트 순서**: `keydown` (Ctrl+A / Cmd+A) → 브라우저 기본 "전체 선택" 실행 → 선택이 비편집 첫/끝 자식을 포함하지 않는 범위로 갱신되거나, 범위가 접힘.
- **방향**: 선택이 비편집 블록 "반대" 쪽으로 접히는 경향(예: 블록이 첫 자식이면 선택은 끝 쪽으로 접히지만 블록을 포함하지 않음).
- **일관성**: Safari 17, Safari 15.5, Chrome에서 재현됨; Firefox는 다를 수 있음.

## 예상 동작

사용자 기대 및 접근성에 따르면, 전체 선택은 contenteditable 루트 안의 모든 노드(비편집 블록 포함)를 선택해야 합니다. 그 결과 Range는 첫 자식의 시작부터 마지막 자식의 끝까지 이어져, 복사·잘라내기·교체가 문서 전체에 적용되어야 합니다.

## 영향

- **WYSIWYG**: "전체 선택 → 삭제" 또는 "전체 선택 → 복사"가 임베드 위젯을 포함하지 않아 문서가 전부 교체·복사되지 않음.
- **접근성**: 키보드만 사용하는 사용자가 문서 전체를 교체하거나 클립보드 복사를 위해 안정적으로 선택할 수 없음.
- **일관성**: 네이티브 `<textarea>` 및 사용자 모델과 다름.

## 브라우저 비교

- **Safari (WebKit)**: 재현됨; 비편집 블록 기준 선택이 잘못된 방향으로 접힘; Safari 15.5, 17에서도 유지.
- **Chrome (Blink)**: 비편집 블록이 첫/끝 자식일 때 동일 실패.
- **Firefox (Gecko)**: 동일 버그가 없을 수 있음; 버전별 테스트 권장.

## 해결 방법

1. **커스텀 Ctrl+A / Cmd+A 핸들러**: `keydown`에서 Ctrl+A(또는 Cmd+A)를 감지하고 `preventDefault()` 후 `range.selectNodeContents(editor)`로 Range를 만들어 Selection에 설정. 이렇게 하면 비편집 블록을 포함한 루트 전체가 선택됨.
2. **비편집 경계 피하기**: 가능하면 비편집 블록만이 유일한 첫/끝 자식이 되지 않도록 하고, 편집 가능 블록으로 감싸거나 플레이스홀더를 두어 엔진의 전체 선택이 모든 노드를 포함하도록 함.
3. **네이티브 전체 선택 후 폴백**: Ctrl+A 직후 `selectionchange` 또는 짧은 지연 후 현재 선택이 루트 전체를 덮는지 검사하고, 아니면 프로그램적 전체 선택 로직 실행.

## 참고 자료

- [WebKit Bug 124765: Select all is broken when non-editable block is first/last child](https://bugs.webkit.org/show_bug.cgi?id=124765)
- [MDN: Range.selectNodeContents](https://developer.mozilla.org/en-US/docs/Web/API/Range/selectNodeContents)
- [MDN: Selection](https://developer.mozilla.org/en-US/docs/Web/API/Selection)
