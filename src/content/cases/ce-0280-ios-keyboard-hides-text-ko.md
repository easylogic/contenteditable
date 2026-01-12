---
id: ce-0280
scenarioId: scenario-ios-keyboard-hides-text
locale: ko
os: iOS
osVersion: "16+"
device: Mobile (iPhone/iPad)
deviceVersion: Any
browser: Safari
browserVersion: "16+"
keyboard: English (QWERTY) or iOS Virtual Keyboard
caseTitle: iOS에서 소프트웨어 키보드가 텍스트를 숨김
description: "iPhone/iPad Safari에서 contenteditable 요소 안에 텍스트를 입력하거나 Enter 키를 여러 번 누를 때, 소프트웨어 키보드가 나타나지만 입력되는 텍스트가 숨겨집니다. 페이지가 자동으로 스크롤되지 않아 사용자가 타이핑하는 텍스트를 볼 수 없습니다. Android에서는 정상 작동합니다."
tags:
  - ios
  - safari
  - keyboard
  - mobile
  - auto-scroll
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 200px;">
    여기에 텍스트를 입력하세요.
    <br><br>
    Enter 키를 여러 번 눌러 여러 줄을 만들어보세요.
    <br><br>
    iOS Safari에서는 키보드가 텍스트를 숨길 수 있습니다.
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true">안녕하세요</div>'
    description: "빈 에디터"
  - label: "Step 1: Type text"
    html: '<div contenteditable="true">안녕하세요 반갑습</div>'
    description: "텍스트 입력됨"
  - label: "Step 2: Press Enter multiple times"
    html: '<div contenteditable="true">안녕하세요<br><br>반갑습<br><br>니다</div>'
    description: "❌ iOS 버그! 키보드가 텍스트를 숨기고 있음"
  - label: "Observation"
    html: '<div contenteditable="true">안녕하세요<br><br>반갑습<br><br>니다</div>'
    description: "입력점이 키보드 아래에 숨겨 있어 사용자는 보지 못함"
  - label: "✅ Expected"
    html: '<div contenteditable="true">안녕하세요<br><br>반갑습<br><br>니다</div>'
    description: "예상: 입력점이 항상 보여야 함 (Android에서는 정상)"
---

## 현상

iPhone/iPad Safari에서 contenteditable 요소 안에 텍스트를 입력하거나 Enter 키를 여러 번 누를 때, 소프트웨어 키보드가 나타나지만 입력되는 텍스트가 숨겨집니다.

## 재현 예시

1. iPhone 또는 iPad에서 Safari 브라우저를 엽니다.
2. contenteditable 요소에 포커스합니다.
3. 텍스트를 입력합니다 (예: "안녕하세요").
4. Enter 키를 여러 번 눌러 여러 줄을 만듭니다.

## 관찰된 동작

- **텍스트 숨김**: 키보드가 입력되는 텍스트를 덮어서 사용자가 볼 수 없음
- **자동 스크롤 없음**: 페이지가 자동으로 스크롤되지 않아 입력점이 키보드 아래에 남음
- **맹목 타이핑**: 사용자가 타이핑하는 내용을 볼 수 없어 맹목 타이핑하게 됨
- **iOS 특유**: iPhone/iPad Safari에서만 발생
- **Android 정상**: Android 브라우저에서는 정상 작동

## 예상 동작

- 소프트웨어 키보드가 나타나야 함
- 입력점이 항상 보여야 함
- 페이지가 자동으로 스크롤되어 입력점이 키보드 위에 유지되어야 함

## 참고사항 및 가능한 해결 방향

- **input 이벤트로 스크롤**: 입력 발생할 때마다 캐럿 위치로 스크롤
- **focus 이벤트로 스크롤**: 포커스 시 캐럿 위치로 스크롤
- **resize observer 사용**: 키보드 높이 변화를 감지하여 스크롤
- **CSS viewport 설정**: height: 100vh 등으로 viewport 높이 설정 시도
- **시각적 피드백 제공**: 텍스트가 숨겨도 캐럿 위치를 볼 수 있는 인디케이터 제공

## 코드 예시

```javascript
const editor = document.querySelector('div[contenteditable]');
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// input 이벤트로 스크롤
editor.addEventListener('input', (e) => {
  if (!isIOS) return;
  
  setTimeout(() => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // 캐럿 위치로 스크롤 (200px 버퍼)
      window.scrollTo({
        top: rect.top + window.scrollY - 200,
        behavior: 'smooth'
      });
      
      console.log('Scrolled to caret position:', rect.top);
    }
  }, 100);
});

// focus 이벤트로 스크롤
editor.addEventListener('focus', () => {
  if (!isIOS) return;
  
  setTimeout(() => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      window.scrollTo({
        top: rect.top + window.scrollY - 200,
        behavior: 'smooth'
      });
    }
  }, 300);
});

// 시각적 캐럿 인디케이터 (iOS에서만 활성화)
if (isIOS) {
  const caret = document.createElement('span');
  caret.className = 'ios-caret-indicator';
  caret.style.cssText = `
    position: absolute;
    width: 2px;
    height: 20px;
    background: rgba(0, 120, 255, 0.5);
    pointer-events: none;
    transition: top 0.1s, left 0.1s;
  `;
  
  // 캐럿 위치 업데이트
  const updateCaretPosition = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      caret.style.top = rect.top + 'px';
      caret.style.left = rect.left + 'px';
    }
  };
  
  editor.addEventListener('input', updateCaretPosition);
  editor.addEventListener('selectionchange', updateCaretPosition);
  document.body.appendChild(caret);
}
```

```css
/* CSS 해결책 시도 */
html, body {
  height: 100vh;
  overflow: auto;
}

[contenteditable] {
  min-height: 200px;
}

.ios-caret-indicator {
  /* iOS에서만 보이는 캐럿 인디케이터 */
  z-index: 9999;
}
```
