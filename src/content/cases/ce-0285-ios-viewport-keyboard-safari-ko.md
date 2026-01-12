---
id: ce-0285
scenarioId: scenario-ios-viewport-keyboard
locale: ko
os: iOS
osVersion: "16+"
device: Mobile (iPhone/iPad)
deviceVersion: Any
browser: Safari
browserVersion: "16+"
keyboard: English (QWERTY) or iOS Virtual Keyboard
caseTitle: iOS Safari에서 키보드 가시 시 viewport 메커니즘 이상
description: "iOS Safari에서 소프트웨어 키보드가 가시적일 때, `position:fixed` 요소가 깨지고, `window.innerHeight`가 올바르지 않은 값을 반환합니다. 래딩 툴바나 플로팅 UI 요소를 사용하는 에디터에서 사용자가 편집 불가능해집니다."
tags:
  - ios
  - safari
  - keyboard
  - viewport
  - position-fixed
status: draft
initialHtml: |
  <div style="position: fixed; top: 20px; right: 20px; padding: 10px; background: rgba(0, 0, 0, 0.8); border-radius: 8px; z-index: 100;">
    Fixed Toolbar
  </div>
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 150px;">
    여기에 텍스트를 입력하세요.
    <br><br>
    iOS Safari에서는 키보드가 나타나면 position:fixed 요소의 위치가 이상해질 수 있습니다.
    <br><br>
    window.innerHeight: <span id="height-display">--</span> px
  </div>
  <script>
    // viewport 높이 표시
    function updateHeightDisplay() {
      document.getElementById('height-display').textContent = window.innerHeight;
    }
    
    // 페이지 로드 시 업데이트
    updateHeightDisplay();
    
    // 키보드 표시/숨김 감지
    window.addEventListener('resize', () => {
      updateHeightDisplay();
    });
  </script>
domSteps:
  - label: "Before"
    html: '<div style="position: fixed; top: 20px;">Fixed Toolbar</div><div contenteditable="true">텍스트 입력 영역</div><span id="height-display">--</span>'
    description: "페이지 로드: position:fixed 요소 정상, 높이 표시됨"
  - label: "Step 1: Show keyboard"
    html: '<div style="position: fixed; top: -200px;">Fixed Toolbar (위치 이상)</div><div contenteditable="true">텍스트 입력 영역</div><span id="height-display">600</span>'
    description: "❌ 키보드 가시: position:fixed 요소가 화면 밖으로 이동하거나 틀린 위치에 감, viewport 높이 변했음"
  - label: "Step 2: Hide keyboard (tap outside)"
    html: '<div style="position: fixed; top: -200px;">Fixed Toolbar (위치 이상 지속)</div><div contenteditable="true">텍스트 입력 영역</div><span id="height-display">900</span>'
    description: "❌ 키보드 숨김: viewport 높이 복구되지 않음"
  - label: "✅ Expected"
    html: '<div style="position: fixed; top: 20px;">Fixed Toolbar</div><div contenteditable="true">텍스트 입력 영역</div><span id="height-display">--</span>'
    description: "예상: 키보드 상태와 상관없이 요소들이 올바르게 위치해야 함"
---

## 현상

iOS Safari에서 소프트웨어 키보드가 가시적일 때, viewport 메커니즘이 깨져서 position:fixed 요소와 viewport 계산이 올바르게 동작하지 않습니다.

## 재현 예시

1. iPhone 또는 iPad의 Safari 브라우저를 엽니다.
2. 페이지 로드합니다. position:fixed 요소가 올바르게 표시됩니다.
3. contenteditable 요소에 탭하여 키보드를 나타냅니다.
4. ❌ position:fixed 요소가 화면 밖으로 이동하거나 틀린 위치에 감습니다.
5. window.innerHeight 값이 이상하게 변합니다.

## 관찰된 동작

- **position:fixed 깨짐**: 키보드가 나타나면 fixed 요소의 위치가 계산이 틀려짐
- **viewport 높이 오차**: window.innerHeight가 올바르지 않은 값을 반환 (키보드 영역을 제대로 반영 안함)
- **UI 사용 불가**: 래딩 툴바나 메뉴가 제대로 작동하지 않아 사용자가 편집 불가
- **키보드 숨김 후 복구 안됨**: 키보드를 숨겨도 viewport 높이가 복구되지 않음
- **iOS Safari 특유**: iPhone/iPad Safari에서만 심하게 발생

## 예상 동작

- position:fixed 요소가 키보드 상태와 상관없이 항상 올바른 위치에 있어야 함
- viewport 관련 CSS 속성이 올바르게 계산되어야 함
- 사용자는 키보드가 있든 없든 UI를 정상적으로 사용할 수 있어야 함

## 참고사항 및 가능한 해결 방향

- **resize 이벤트 모니터링**: 키보드 표시/숨김 감지
- **iOS Visual Viewport API**: experimental이지만 더 정확한 viewport 정보 제공 가능
- **CSS viewport-fit 사용**: `<meta name="viewport" content="viewport-fit=cover">` 시도
- **position: absolute로 대안**: position:fixed 대신 position: absolute 사용
- **사용자 제어**: "완료" 버튼 추가하여 사용자가 직접 키보드 조작
- **안전 영역 확보**: 래딩 UI에 충분한 여백(margin/padding) 추가
- **transform 사용**: position 대신 transform: translate 사용 시도 (일부 경우 도움)

## 코드 예시

```javascript
const editor = document.querySelector('[contenteditable]');
const fixedElement = document.querySelector('[style*="position: fixed"]');

let initialHeight = window.innerHeight;
let keyboardVisible = false;

// 키보드 감지 (iOS 특유)
window.addEventListener('resize', () => {
  const currentHeight = window.innerHeight;
  const heightDiff = initialHeight - currentHeight;
  
  if (heightDiff > 150) {
    // 키보드 나타남
    keyboardVisible = true;
    console.log('키보드 가시:', currentHeight, '원래:', initialHeight);
    
    // UI 위치 조정
    adjustUIForKeyboard(true);
  } else if (heightDiff < 100 && keyboardVisible) {
    // 키보드 숨김
    keyboardVisible = false;
    console.log('키보드 숨김:', currentHeight);
    
    // UI 위치 복구
    adjustUIForKeyboard(false);
  }
  
  initialHeight = currentHeight;
});

// UI 조정 함수
function adjustUIForKeyboard(isKeyboardVisible) {
  if (isKeyboardVisible) {
    // 키보드가 있을 때: UI를 위로 이동
    // position:fixed 요소를 안전한 위치로 조정
    if (fixedElement) {
      fixedElement.style.transform = 'translateY(0)';
      // 또는 position: absolute로 변경 시도
    }
  } else {
    // 키보드가 없을 때: UI 원위치 복구
    if (fixedElement) {
      fixedElement.style.transform = 'none';
    }
  }
}

// Visual Viewport API (iOS 지원 시)
if (window.visualViewport) {
  console.log('Visual Viewport:', window.visualViewport);
}

// 완료 버튼 추가 (사용자가 키보드 직접 조작 가능하게)
const doneButton = document.createElement('button');
doneButton.textContent = '완료';
doneButton.style.cssText = 'margin-top: 10px; padding: 10px 20px; background: #007AFF; color: white; border: none; border-radius: 4px;';

doneButton.addEventListener('click', () => {
  editor.blur(); // 키보드 숨김
  
  setTimeout(() => {
    // 키보드가 숨길 때까지 기다린 후 포커스 복구
    editor.focus();
  }, 300);
});

document.body.appendChild(doneButton);
```

```css
/* CSS 해결책 시도 */
.fixed-element {
  /* 대안 1: position: absolute로 변경 */
  /* position: absolute;
     bottom: 10vh;
  */
  
  /* 대안 2: transform 사용 */
  transform: translate3d(0, 0, 0);
  
  /* 안전 영역 확보 */
  margin-bottom: 50px; /* 래딩 UI를 위한 여백 */
}

[contenteditable] {
  /* 충분한 최소 높이 확보 */
  min-height: 200px;
  padding-bottom: 300px; /* 키보드 공간 확보 */
}

/* viewport meta 태그 */
/* <meta name="viewport" content="viewport-fit=cover"> */
```
