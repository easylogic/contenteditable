---
id: ce-0570-chromium-rtl-scroll-alignment-bug-ko
scenarioId: scenario-rtl-text-direction-inconsistent
locale: ko
os: Windows
osVersion: "11"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "124.0"
keyboard: Arabic/Hebrew (RTL)
caseTitle: "contenteditable 내 RTL 스크롤 및 캐럿 정렬 오류"
description: "Chromium 124+ 버전에서 contenteditable 영역 내 RTL(Right-to-Left) 텍스트 사용 시 캐럿이 텍스트 경계를 벗어나거나 자동 스크롤이 작동하지 않는 현상입니다."
tags: ["rtl", "layout", "chrome-124", "caret", "scrolling"]
status: confirmed
domSteps:
  - label: "1단계: RTL 텍스트 입력"
    html: '<div contenteditable="true" dir="rtl" style="overflow: auto;">שלום עולם</div>'
    description: "사용자가 히브리어/아랍어 등 RTL 텍스트를 입력합니다. 흐름은 오른쪽에서 왼쪽입니다."
  - label: "2단계: 연속 타이핑"
    html: '<div contenteditable="true" dir="rtl" style="overflow: auto; width: 50px;">...שלום עולם|</div>'
    description: "텍스트가 컨테이너 너비를 초과할 때, 캐럿 위치로의 자동 스크롤이 실패하고 캐럿이 텍스트 끝에서 분리됩니다."
  - label: "3단계: 버그 결과"
    html: '<div contenteditable="true" dir="rtl">...שלום| עולם</div>'
    description: "시각적 캐럿이 단어 중간에 나타나거나 실제 삽입 지점보다 훨씬 왼쪽에 위치하게 됩니다."
  - label: "✅ 예상 결과"
    html: '<div contenteditable="true" dir="rtl">|שלום עולם...</div>'
    description: "예상: 스크롤 시 캐럿이 가장 왼쪽(RTL의 끝)에 유지되어야 하며, 캐럿 위치가 노드 오프셋과 일치해야 함."
---

## 현상
Blink 레이아웃 엔진의 회귀 버그(2024년 4월 보고)는 스크롤이 발생하는 `contenteditable` 컨테이너 내의 RTL(오른쪽에서 왼쪽으로 읽는) 언어에 심각한 영향을 미칩니다. 텍스트가 가로 범위를 초과할 때, 브라우저가 캐럿을 화면 안에 유지하기 위한 `scrollLeft` 오프셋 계산에 실패합니다. 또한 "시각적(Visual)-논리적(Logical)" 매핑이 깨지면서, 깜빡이는 커서 바가 글자 위치와 무관한 엉뚱한 픽셀 좌표에 나타나는 현상이 발생합니다.

역사적으로 이는 동적 DOM 업데이트 중이나 LTR/RTL 텍스트가 혼용될 때 `dir="rtl"` 속성이 간헐적으로 무시되는 광범위한 일관성 문제의 연장선상에 있습니다.

## 재현 단계
1. `contenteditable="true"`, `dir="rtl"`, `overflow: auto; width: 200px;` 속성을 가진 `div`를 생성합니다.
2. 가로로 넘칠 때까지 긴 RTL 문자열(예: 히브리어 또는 아랍어)을 입력합니다.
3. 왼쪽 경계(RTL 흐름의 끝부분)에 도달했을 때 캐럿의 동작을 관찰합니다.
4. 편집 중에 자바스크립트로 `dir` 속성을 `rtl`에서 `ltr`로, 다시 반대로 동적으로 전환해 봅니다.

## 관찰된 동작
1. **스크롤 실패**: 캐럿이 왼쪽으로 이동함에 따라 컨테이너가 자동으로 스크롤되지 않아 입력 지점이 화면 밖으로 사라집니다.
2. **캐럿 위치 불일치**: 캐럿이 해당 글자에서 수 픽셀 떨어져 나타나거나, "음수" 스크롤 영역으로 잘못 넘어가 아예 보이지 않게 됩니다.
3. **동적 렌더링 지연(Stall)**: Firefox나 구형 Edge 등에서 `dir` 속성을 즉석에서 변경해도 BiDi 레이아웃이 즉시 재렌더링되지 않는 경우가 많습니다.
4. **혼용 콘텐츠 혼란**: RTL 텍스트 사이에 LTR 숫자나 영어를 섞어 쓸 때, 마우스 드래그 방향과 반대로 텍스트가 선택되는 "반전 선택" 현상이 발생합니다.

## 영향
- **RTL 에디터 사용 불가**: 사이드바나 댓글창 같은 좁은 컨테이너에서 사용자가 자신이 무엇을 타이핑하고 있는지 확인할 수 없습니다.
- **선택 영역 파손**: RTL 텍스트 선택 시 하이라이트가 계단식으로 깨지거나 마우스 움직임과 일치하지 않게 됩니다.

## 브라우저 비교
- **Chrome 124+**: 스크롤 및 캐럿 배치 계산에서 심각한 회귀 버그가 보고되었습니다.
- **Safari**: 대체로 우수한 BiDi 레이아웃을 제공하며, 혼용 방향 선택 영역을 가장 일관되게 처리합니다.
- **Firefox**: RTL 인덱스 매핑은 가장 안정적이지만, `dir` 속성 변경 시 수동으로 `blur/focus`를 해주어야 반영되는 "렌더링 지연" 현상이 있을 수 있습니다.

## 참고 및 해결 방법
### 해결책: BiDi 정규화 (Normalization)
방향 변경 시 레이아웃 새로고침을 강제하고, 혼용 콘텐츠에는 `dir`이 명시된 `<span>` 태그를 사용하십시오.

```javascript
/* 레이아웃 새로고침 강제 실행 */
function setDirection(element, dir) {
    element.dir = dir;
    // Firefox/Chrome에서 BiDi 재계산을 강제하기 위한 트릭
    const display = element.style.display;
    element.style.display = 'none';
    element.offsetHeight; // 리플로우 유발
    element.style.display = display;
}
```

- [Chromium 이슈 #333630733](https://issues.chromium.org/issues/333630733)
- [W3C I18N: RTL 편집 관련 과제](https://www.w3.org/International/questions/qa-html-dir)
- [이전 ce-0060 및 ce-0556 통합본]
