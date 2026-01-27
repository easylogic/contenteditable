---
id: ce-0580-ko
scenarioId: scenario-ime-ui-experience
locale: ko
os: iOS
osVersion: "18.0"
device: iPhone / iPad
deviceVersion: Any
browser: Safari
browserVersion: "18.x"
keyboard: 가상 키보드
caseTitle: "iOS Safari: 긴 문서 편집 시 스크롤 고정 알고리즘 오류"
description: "긴 문서 내부의 contenteditable 영역에 포커스를 주거나 명령을 실행할 때, 화면이 캐럿을 중심으로 유지되지 않고 에디터 최상단으로 강제 점프하는 현상입니다."
tags: ["ios", "safari-18", "scrolling", "focus", "ux-jump"]
status: confirmed
domSteps:
  - label: "1. 긴 문서 준비"
    html: '<div contenteditable="true" style="height: 2000px;">... 스크롤 발생 중 ... |</div>'
    description: "화면 높이를 초과하는 대량의 텍스트가 포함된 에디터를 초기화합니다."
  - label: "2. 포커스/명령 실행"
    html: '<!-- Script: element.focus() 또는 execCommand 실행 -->'
    description: "프로그래밍 방식으로 에디터에 포커스를 주거나, 선택 영역을 업데이트하는 서식 명령을 실행합니다."
  - label: "3. 결과 (버그)"
    html: '<!-- 뷰포트가 에디터 맨 위로 점프 -->'
    description: "Safari가 가상 뷰포트를 캐럿에 고정하지 못하고, 부모 컨테이너의 (0,0) 좌표로 스크롤을 초기화합니다."
  - label: "✅ 예상 결과"
    html: '<!-- 캐럿이 화면 중앙에 유지됨 -->'
    description: "예상: 부드러운 스크롤 고정(Scroll Anchoring) 기능을 통해 활성화된 선택 영역이 뷰포트 중앙에 계속 보여야 합니다."
---

## 현상
iOS 18(Safari)에서 `contenteditable` 내부의 스크롤 고정 로직과 관련된 고질적인 회귀 버그가 발생하고 있습니다. 전통적으로 요소에 포커스가 가면 브라우저는 캐럿(커서)이 화면에 보이도록 스크롤을 조정해야 합니다. 그러나 최신 버전에서는 에디터가 스크롤 가능한 컨테이너 내부에 있거나 문서 자체가 길 경우, 포커스를 주거나 `bold` 같은 명령을 실행하면 뷰포트가 에디터의 맨 위로 "탁" 하고 튀어 오르는 현상이 발생합니다. 이로 인해 사용자는 자신의 입력 위치를 찾기 위해 다시 수동으로 스크롤을 내려야 합니다.

## 재현 단계
1. 세로 스크롤이 발생할 정도로 긴 콘텐츠가 있는 웹페이지를 만듭니다.
2. 페이지 하단에 `contenteditable` `div`를 배치합니다.
3. 바닥까지 스크롤한 후 에디터 내부를 클릭합니다.
4. 툴바 버튼 등을 통해 `document.execCommand('italic')`을 실행해 봅니다.
5. 명령 실행 후의 뷰포트 위치를 관찰합니다.

## 관찰된 동작
- **화면 점프**: `window` 또는 부모 `div`의 스크롤 위치가 에디터 컨테이너의 상단 모서리로 리셋됩니다.
- **스크롤 관성 파괴**: 사용자가 스크롤 중인 상태에서 포커스가 트리거되면, 관성이 취소되고 즉시 상단으로 스냅(Snap)됩니다.

## 영향
- **혼란스러운 UX**: 사용자는 맥락을 잃어버리고 활성 라인을 유지하기 위해 브라우저와 싸워야 합니다.
- **폼 제출 오류**: '저장' 버튼이 하단에 있는 경우, 화면 점프로 인해 사용자가 실수로 헤더의 엉뚱한 링크를 클릭할 수 있습니다.

## 브라우저 비교
- **iOS Safari 18**: 고정(Anchoring) 실패 빈도가 매우 높음.
- **안드로이드용 Chrome**: 대체로 캐럿을 시야 내에 유지하지만, 고정 요소에 영향을 주는 레이아웃 "Resize"를 트리거하기도 합니다.

## 참고 및 해결 방법
### 해결책: Visual Viewport 수동 동기화
**Visual Viewport API**를 사용하여 포커스 발생을 감지하고, 선택 영역에 임시 스팬(span)을 생성하여 `scrollIntoView({ behavior: 'smooth', block: 'center' })`를 수동으로 호출하십시오.

- [WebKit 이슈 #270634: 편집 가능 영역의 스크롤 고정 문제](https://bugs.webkit.org/show_bug.cgi?id=270634)
- [ProseMirror 포럼: iOS Safari의 협업 편집 시 점프 현상](https://discuss.prosemirror.net/t/collaborative-jumping-issues/1531)
