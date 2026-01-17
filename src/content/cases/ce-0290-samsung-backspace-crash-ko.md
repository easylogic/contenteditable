---
id: ce-0290-samsung-backspace-crash-ko
scenarioId: scenario-samsung-backspace-crash
locale: ko
os: Android
osVersion: "10-14"
device: Mobile (Samsung Galaxy S9, Note series, etc.)
deviceVersion: Any
browser: Chrome for Android
browserVersion: "120+"
keyboard: Korean (IME) - Samsung Keyboard
caseTitle: 삼성 키보드에서 백스페이스 길게 누르면 에디터 크래시
description: "안드로이드 삼성 키보드를 사용할 때, 백스페이스 키를 길게 누르면 backspace 이벤트가 빠르게 연속 발생하여 contenteditable 에디터가 크래시합니다. 자바스크립트 실행이 중단되고 페이지가 응답하지 않습니다."
tags:
  - backspace
  - crash
  - android
  - samsung
  - samsung-keyboard
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    여기에 텍스트를 입력하세요.
    <br><br>
    백스페이스 키를 길게 눌러보세요 (삼성 키보드에서는 에디터가 크래시할 수 있습니다).
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true">안녕하세요</div>'
    description: "빈 에디터"
  - label: "Step 1: Type text"
    html: '<div contenteditable="true">안녕하세요 테스트입니다</div>'
    description: "텍스트 입력됨"
  - label: "Step 2: Hold backspace to delete"
    html: '<div contenteditable="true">안녕하세요 테스트입니다</div>'
    description: "❌ 에디터 크래시! 자바스크립트 실행 중단, 페이지 응답 없음"
  - label: "Observation"
    html: '<div contenteditable="true">안녕하세요 테스트입니다</div>'
    description: "백스페이스 길게 누르면 크래시 발생, 페이지 다시 로드 필요"
  - label: "✅ Expected"
    html: '<div contenteditable="true">안녕하세요|</div>'
    description: "예상: 백스페이스로 텍스트 삭제되고 에디터 정상 작동"
---

## 현상

안드로이드 삼성 키보드를 사용할 때, 백스페이스 키를 길게 누르면 contenteditable 에디터가 크래시합니다.

## 재현 예시

1. 삼성 갤럭시(S9, S10, Note 시리즈 등) 또는 삼성 키보드가 설치된 안드로이드 기기에서 Chrome 브라우저를 엽니다.
2. contenteditable 요소에 텍스트를 입력합니다 (예: "안녕하세요 테스트입니다").
3. 백스페이스 키를 길게 누릅니다 (문자를 빠르게 삭제하려는 의도).

## 관찰된 동작

- **백스페이스 이벤트 폭주**: 키를 길게 누르면 backspace 이벤트가 빠르게 연속으로 발생함
- **에디터 크래시**: DOM 조작 도중 내부 상태 불일치로 인해 에디터가 완전히 크래시됨
- **자바스크립트 중단**: 모든 자바스크립트 실행이 멈추고 스크립트가 더 이상 작동하지 않음
- **페이지 응답 없음**: 브라우저가 사용자 입력에 응답하지 않고 페이지가 응답하지 않음
- **페이지 재로드 필요**: 계속하려면 페이지를 새로고침해야 함
- **삼성 키보드 특유**: Gboard, SwiftKey 등 다른 키보드에서는 발생하지 않음

## 예상 동작

- 백스페이스로 텍스트가 빠르게 삭제되어야 함
- 에디터가 크래시 없이 정상 작동해야 함
- 자바스크립트 실행이 중단되지 않아야 함
- 사용자가 계속 타이핑할 수 있어야 함

## 참고사항 및 가능한 해결 방향

- **백스페이스 이벤트 속도 제한**: 빠르게 연속되는 백스페이스 이벤트를 막음
- **try-catch 래핑**: input 이벤트 등 DOM 조작을 try-catch로 감싸서 크래시 방지
- **디바운스**: 백스페이스 이벤트 처리에 지연(debounce) 추가하여 DOM 부하 줄임
- **사용자 안내**: 삼성 키보드 사용 시 경고 메시지 표시
- **대안 키보드 권장**: Gboard, SwiftKey 등 다른 키보드 사용 권장
- **MutationObserver 사용**: DOM 변경 감시하여 이상 조기 감지

## 코드 예시

```javascript
const editor = document.querySelector('div[contenteditable]');
let lastBackspaceTime = 0;
const BACKSPACE_DELAY = 50; // 50ms 이내의 이벤트만 허용

// 백스페이스 속도 제한
editor.addEventListener('keydown', (e) => {
  if (e.key === 'Backspace') {
    const now = Date.now();
    
    if (now - lastBackspaceTime < BACKSPACE_DELAY) {
      e.preventDefault();
      console.warn('백스페이스 이벤트 속도 제한됨');
      
      // 사용자에게 알림
      showWarning('백스페이스를 너무 빠르게 누르지 마세요. 삼성 키보드 사용 시 권장되는 키보드: Gboard, SwiftKey 등');
      return;
    }
    
    lastBackspaceTime = now;
  }
});

// 크래시 방지를 위한 try-catch
editor.addEventListener('input', (e) => {
  try {
    // input 처리 로직
    console.log('Input event:', e);
  } catch (error) {
    console.error('Input error:', error);
    
    // 에러 복구 및 사용자에게 알림
    alert('입력 처리 중 오류가 발생했습니다. 페이지를 새로고침하세요.');
  }
});

// 디바운스 처리
let backspaceTimeout = null;

editor.addEventListener('keydown', (e) => {
  if (e.key === 'Backspace') {
    clearTimeout(backspaceTimeout);
    
    // 10ms 디바운스로 DOM 부하 줄임
    backspaceTimeout = setTimeout(() => {
      // 기본 백스페이스 동작을 그대로 수행
      // 브라우저의 네이티브 삭제를 막지 않음
      console.log('Debounced backspace action');
    }, 10);
  }
});

// MutationObserver로 DOM 감시
const observer = new MutationObserver((mutations) => {
  try {
    // DOM 변경 유효성 검사
    for (const mutation of mutations) {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        // DOM 변화 확인
      }
    }
  } catch (error) {
    console.error('MutationObserver error:', error);
  }
});

observer.observe(editor, {
  childList: true,
  subtree: true,
  characterData: true
});

// 경고 메시지 표시
function showWarning(message) {
  const warning = document.createElement('div');
  warning.textContent = message;
  warning.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 200, 0, 0.9);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 9999;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  `;
  
  document.body.appendChild(warning);
  
  // 3초 후 자동으로 사라짐
  setTimeout(() => {
    warning.remove();
  }, 3000);
}
```
