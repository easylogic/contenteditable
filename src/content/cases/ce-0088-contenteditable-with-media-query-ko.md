---
id: ce-0088-contenteditable-with-media-query-ko
scenarioId: scenario-media-query-layout
locale: ko
os: ["Android", "iOS"]
osVersion: "Any"
device: ["Phone", "Tablet"]
deviceVersion: Any
browser: ["Chrome Mobile", "Safari Mobile", "Samsung Internet"]
browserVersion: "Latest"
keyboard: Any
caseTitle: 미디어 쿼리 레이아웃 변경이 키보드 포커스를 방해함
description: "모바일 장치에서 @media 쿼리에 의해 트리거되는 레이아웃 이동(예: 방향 전환)은 가상 키보드를 닫히게 하고 선택 영역을 소실시킬 수 있습니다."
tags: ["media-query", "layout", "mobile", "keyboard-dismiss"]
status: confirmed
---

## 현상
모바일 브라우저에서 방향 전환(Orientation Change)이나 뷰포트 크기 변경 시 CSS 미디어 쿼리가 트리거되면, 브라우저가 레이아웃을 다시 계산하는 과정에서 `contenteditable` 요소의 포커스를 해제하거나 가상 키보드를 닫는 현상이 발생합니다. 이는 사용자의 입력 흐름을 방해하고 선택 영역(Selection)을 소실시키는 치명적인 UX 문제를 야기합니다.

## 재현 단계
1. 모바일 브라우저(Android Chrome 또는 iOS Safari)에서 `contenteditable`이 적용된 입력을 활성화하고 가상 키보드가 나타나게 합니다.
2. 기기를 가로 모드에서 세로 모드로(또는 그 반대로) 회전합니다.
3. 미디어 쿼리에 의해 스타일이 변경되면서 키보드가 자동으로 닫히는지 확인합니다.
4. 키보드가 닫히지 않더라도 커서(Caret)가 사라지거나 텍스트 선택이 해제되는지 관찰합니다.

## 관찰된 동작
- **포커스 유실**: 브라우저가 `@media` 쿼리에 따라 레이아웃을 재구성할 때, 요소의 기하학적 수치(Bounding Box)가 크게 변하면 포커스된 요소가 더 이상 화면상 유효하지 않다고 판단하여 활성 상태를 해제할 수 있습니다.
- **키보드 강제 해제 (Dismiss)**: 시스템 소프트웨어 키보드가 뷰포트 변경 이벤트를 처리하는 과정에서 에디터와의 연결이 끊기며 키보드가 자동으로 내려갑니다.
- **선택 영역 리셋**: `window.getSelection()`으로 관리되던 범위가 `null`이 되거나 문서의 최상단(오프셋 0)으로 이동하는 현상이 자주 관찰됩니다.

## 예상되는 동작
- 뷰포트 크기나 기기 방향이 변하더라도 현재 활성화된 `contenteditable` 요소의 포커스는 유지되어야 합니다.
- 가상 키보드는 사용자가 편집 영역 밖을 터치하는 등 명시적으로 입력을 종료하기 전까지 열려 있어야 합니다.
- 선택 영역(Caret position)은 레이아웃 변화 전후의 콘텐츠 상대 좌표를 기준으로 복원되어야 합니다.

## 해결책 및 회피 방법
1. **포커스 복원 (Focus Restoration)**:
   - `resize` 또는 `orientationchange` 발생 시 현재 `Selection`의 범위를 스냅샷으로 저장합니다. 레이아웃 안정화 후 `setTimeout` 또는 `requestAnimationFrame`을 써서 포커스를 다시 요청하고 저장된 범위를 복구합니다.
2. **레이아웃 안정화 (Layout Stabilization)**:
   - 미디어 쿼리 변경 시 `contenteditable` 부모 요소의 `min-height`를 일시적으로 고정하여 급격한 리플로우(Reflow)를 방지합니다.
3. **Visual Viewport API 활용**:
   - `window.visualViewport`의 `resize` 이벤트를 사용하여 가상 키보드가 뷰포트를 가리는 시점을 정확히 계산하고, 에디터 영역이 키보드 뒤에 숨지 않도록 스크롤 위치를 동적으로 조절합니다.
