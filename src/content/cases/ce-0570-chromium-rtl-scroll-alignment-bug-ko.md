---
id: ce-0570-ko
scenarioId: scenario-rtl-text-direction-inconsistent
locale: ko
os: Windows
osVersion: "11"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "124.0"
keyboard: Arabic/Hebrew (RTL)
caseTitle: "contenteditable에서 RTL 스크롤 및 캐럿 정렬 오류"
description: "Chromium 124+ 버전에서 contenteditable 영역 내의 우측에서 좌측으로 읽는(RTL) 텍스트가 캐럿을 텍스트 경계 밖으로 배치하고 자동 스크롤을 망가뜨리는 현상입니다."
tags: ["rtl", "layout", "chrome-124", "caret", "scrolling"]
status: confirmed
domSteps:
  - label: "1단계: RTL 텍스트 입력"
    html: '<div contenteditable="true" dir="rtl" style="overflow: auto;">שלום עולם</div>'
    description: "사용자가 RTL 텍스트(히브리어/아랍어)를 입력합니다. 텍스트가 오른쪽에서 왼쪽으로 흐릅니다."
  - label: "2단계: 연속 입력"
    html: '<div contenteditable="true" dir="rtl" style="overflow: auto; width: 50px;">...שלום עולם|</div>'
    description: "텍스트가 컨테이너 너비를 초과함에도 캐럿 위치로의 자동 스크롤이 실패하며, 캐럿이 텍스트 끝에서 '분리'됩니다."
  - label: "3단계: 버그 결과"
    html: '<div contenteditable="true" dir="rtl">...שלום| עולם</div>'
    description: "시각적 캐럿이 단어 중간에 나타나거나, 실제 논리적 삽입 지점보다 훨씬 왼쪽에 배치됩니다."
  - label: "✅ 예상 동작"
    html: '<div contenteditable="true" dir="rtl">|שלום עולם...</div>'
    description: "예상: 스크롤을 통해 캐럿이 가장 왼쪽(끝) 가장자리에 보이게 유지되어야 하며, 캐럿 위치는 텍스트 노드의 오프셋과 일치해야 합니다."
---

## 현상
Blink 레이아웃 엔진의 회귀 버그(2024년 4월 보고)로, 스크롤이 발생하는 `contenteditable` 컨테이너 내의 RTL(Right-to-Left) 언어 처리에 구체적으로 영향을 미칩니다. 텍스트가 수평 범위를 벗어날 때, 브라우저가 캐럿을 화면 안에 유지하기 위한 `scrollLeft` 값을 잘못 계산합니다. 더군다나 "시각적 위치에서 논리적 위치로(Visual to Logical)"의 매핑이 깨지면서, 깜빡이는 캐럿 바가 실제 글자의 픽셀 좌표와 다르게 엉뚱한 곳에 표시됩니다.

## 재현 단계
1. `contenteditable="true"`, `dir="rtl"`, `overflow: auto; width: 200px;`가 설정된 `<div>`를 생성합니다.
2. 긴 RTL 문자열(예: 히브리어 또는 아랍어)을 수평 스크롤이 생길 때까지 입력합니다.
3. 캐럿이 왼쪽 경계(RTL 흐름의 끝부분)에 도달할 때의 동작을 관찰합니다.
4. 텍스트 중간을 클릭하여 캐럿을 재배치해 봅니다.

## 관찰된 동작
1. **스크롤 실패**: 캐럿이 왼쪽으로 이동함에 따라 컨테이너가 자동으로 스크롤되지 않아 입력 중인 내용이 보이지 않게 됩니다.
2. **캐럿 정렬 불일치**: 경우에 따라 캐럿이 해당 글자에서 몇 픽셀 떨어진 곳에 나타나거나, "음수" 스크롤 영역으로 잘못 넘어가면서 완전히 사라지기도 합니다.
3. **붙여넣기 오류**: 기존 RTL 블록에 RTL 텍스트를 붙여넣을 때 논리적 인덱스가 틀어져 엉뚱한 위치에 삽입되는 경우가 빈번합니다.

## 예상 동작
브라우저는 `dir` 속성과 계산된 BiDi(양방향) 레이아웃을 바탕으로 캐럿 좌표를 산출해야 하며, 특히 RTL의 종료 지점인 "왼쪽" 가장자리에 대해 `scrollIntoView()` 로직이 정확히 작동해야 합니다.

## 영향
- **RTL 에디터 사용 불능**: 사이드바나 댓글창 같은 좁은 컨테이너에서 사용자가 무엇을 타이핑하고 있는지 확인할 수 없습니다.
- **선택 영역 파손**: 드래그하여 RTL 텍스트를 선택할 때 마우스 움직임과 일치하지 않는 "들쭉날쭉한" 또는 반전된 선택 영역이 생성됩니다.

## 브라우저 비교
- **Chrome 124+**: 심각한 스크롤 및 캐럿 배치 회귀 버그 보고됨.
- **Safari**: RTL 스크롤을 올바르게 처리하며, BiDi 레이아웃의 일관성이 높음.
- **Firefox**: RTL 처리가 가장 안정적이며, 시각적 오프셋과 논리적 인덱스를 정확하게 매핑함.

## 참고 및 해결 방법
### 해결책: scrollIntoView 폴리필(Polyfill)
브라우저가 자동 스크롤에 실패하는 경우, 선택 영역의 좌표를 기반으로 수동 스크롤을 트리거합니다.

```javascript
element.addEventListener('input', () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = element.getBoundingClientRect();
    
    if (rect.left < containerRect.left) {
        // RTL 종료 부분(왼쪽)에 대한 강제 스크롤
        element.scrollLeft += (rect.left - containerRect.left) - 10;
    }
});
```

- [Chromium 이슈 #333630733: contenteditable에서 RTL 스크롤 깨짐](https://issues.chromium.org/issues/333630733)
- [W3C I18N: RTL 편집의 과제들](https://www.international/questions/qa-html-dir)
