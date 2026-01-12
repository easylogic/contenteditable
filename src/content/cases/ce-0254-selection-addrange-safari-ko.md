---
id: ce-0254
scenarioId: scenario-selection-addrange-safari-fail
locale: ko
os: macOS
osVersion: "13+"
device: Desktop (Mac)
deviceVersion: Any
browser: Safari
browserVersion: "17+"
keyboard: English (QWERTY)
caseTitle: Safari에서 selection.addRange 작동 실패
description: "Safari의 WebKit에서 contenteditable 요소 안에 커서 위치를 프로그래매틱으로 설정할 때, selection.addRange()가 의도한 대로 동작하지 않습니다. selection이 의도한 요소 내에 머무르지 않고 인접한 형제 요소의 텍스트 노드로 이동합니다."
tags:
  - selection
  - safari
  - webkit
  - cursor
  - addRange
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc;">
    <span id="marker1" style="background: #fef08a;">[마커 1]</span>
    <span id="marker2" style="background: #ddd;">텍스트</span>
    <span id="marker3" style="background: #fef08a;">[마커 3]</span>
  </div>
  <div style="margin-top: 20px;">
    <button onclick="setCursorToMarker2()">마커 2 앞으로 커서 이동</button>
  </div>
  <script>
    function setCursorToMarker2() {
      const marker2 = document.getElementById('marker2');
      const selection = window.getSelection();
      const range = document.createRange();
      
      // 마커 2 앞으로 커서 위치 설정 시도
      range.setStartBefore(marker2);
      range.collapse(true);
      
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Safari 버그 발생: 커서가 marker2 앞이 아니라 marker3 뒤로 이동
      console.log('Selection:', selection.toString());
    }
  </script>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true"><span id="marker1">[마커 1]</span><span id="marker2">텍스트</span><span id="marker3">[마커 3]</span></div>'
    description: "마커가 포함된 contenteditable 요소"
  - label: "Click button to set cursor"
    html: '<div contenteditable="true"><span id="marker1">[마커 1]</span><span id="marker2">텍스트</span><span id="marker3">[마커 3]</span></div>'
    description: "버튼 클릭 후"
  - label: "❌ Safari Bug: Selection jumps"
    html: '<div contenteditable="true"><span id="marker1">[마커 1]</span><span id="marker2">텍스트</span><span id="marker3"><|</span></div>'
    description: "커서가 의도한 marker2 앞이 아니라 marker3 뒤(|)로 이동함"
  - label: "✅ Expected"
    html: '<div contenteditable="true"><span id="marker1">[마커 1]</span><span id="marker2"><|</span>텍스트</span><span id="marker3">[마커 3]</span></div>'
    description: "예상: 커서가 marker2 앞에 위치해야 함"
---

## 현상

Safari의 WebKit에서 contenteditable 요소 안에 커서 위치를 프로그래매틱으로 설정할 때, selection.addRange()가 의도한 대로 동작하지 않습니다.

## 재현 예시

1. contenteditable 요소에 마커(`<span>` 요소)가 포함되어 있습니다.
2. "마커 2 앞으로 커서 이동" 버튼을 클릭합니다.

## 관찰된 동작

- **의도치 않은 selection 이동**: 커서가 marker2 앞(텍스트 앞)이 아니라 marker3 뒤로 이동함
- **WebKit 특유 버그**: Safari(WebKit)에서만 발생, Chrome/Firefox에서는 정상
- **중첩 요소 문제**: 중첩된 요소가 있을 때 selection 계산이 복잡해질 수 있음

## 예상 동작

- 커서가 지정된 위치(marker2 앞)에 정확히 위치해야 함
- Chrome/Firefox와 동일한 동작이 나타나야 함

## 참고사항 및 가능한 해결 방향

- **selection.collapse() 사용**: addRange() 대신 collapse()를 사용하여 selection 설정
- **setTimeout 사용**: Safari의 버그를 우회하기 위해 짧은 지연 추가
- **focus() 먼저 호출**: selection 설정 전에 명시적으로 focus() 호출
- **DOM 구조 단순화**: 중첩 요소를 최소화하여 selection 계산 단순화
- **브라우저 감지**: Safari에서만 발생하므로 Safari 특유 처리 로직 추가

## 코드 예시

```javascript
function setCursorToMarker2() {
  const marker2 = document.getElementById('marker2');
  
  // Safari 버그 우회: 먼저 focus
  marker2.focus();
  
  setTimeout(() => {
    const selection = window.getSelection();
    const range = document.createRange();
    
    // collapse 사용 (addRange 대신)
    range.setStartBefore(marker2);
    range.collapse(true); // true = collapse to end
    
    selection.removeAllRanges();
    selection.addRange(range);
    
    console.log('Selection:', selection.toString());
  }, 10);
}

// 브라우저 감지
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
```
