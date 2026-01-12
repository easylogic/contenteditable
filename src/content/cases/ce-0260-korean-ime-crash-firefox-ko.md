---
id: ce-0260
scenarioId: scenario-ime-korean-crash-firefox
locale: ko
os: Windows
osVersion: "10"
device: Desktop
deviceVersion: Any
browser: Firefox
browserVersion: "120+"
keyboard: Korean (IME) - Microsoft IME
caseTitle: Firefox에서 한국어 IME 컴포지션 중 특정 키 조합 시 에디터 크래시
description: "Firefox에서 Windows 10과 한국어 IME(Microsoft IME)를 사용할 때, IME 컴포지션 중 특정 키 조합(예: Ctrl+Shift+Home)을 누르면 contenteditable 에디터가 크래시합니다."
tags:
  - composition
  - ime
  - korean
  - firefox
  - crash
  - windows
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    여기에 텍스트를 입력하세요.
    <br><br>
    재현 순서:<br>
    1. 한국어 IME 활성화<br>
    2. ㅀ (f + g) 입력<br>
    3. Enter 입력으로 컴포지션 확정<br>
    4. Ctrl+Shift+Home 입력 (여기서 크래시 발생)
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true"></div>'
    description: "빈 에디터"
  - label: "Step 1: Type 'ㅀ'"
    html: '<div contenteditable="true">ㅀ</div>'
    description: "한국어 IME로 'ㅀ' 입력 중"
  - label: "Step 2: Press Enter"
    html: '<div contenteditable="true">ㅀ</div>'
    description: "컴포지션 완료"
  - label: "Step 3: Press Ctrl+Shift+Home"
    html: '<div contenteditable="true">ㅀ</div>'
    description: "❌ 에디터 크래시! 페이지가 응답하지 않음"
  - label: "✅ Expected"
    html: '<div contenteditable="true">ㅀ</div>'
    description: "예상: 에디터 크래시 없이 정상 작동"
---

## 현상

Firefox에서 Windows 10과 한국어 IME를 사용할 때, IME 컴포지션 중 특정 키 조합을 누르면 contenteditable 에디터가 크래시합니다.

## 재현 예시

1. contenteditable 요소에 포커스합니다.
2. Windows 10에서 한국어 IME(Microsoft IME)를 활성화합니다.
3. ㅀ (QWERTY 키보드에서 f를 누른 다음 g를 입력합니다.
4. Enter 키를 눌러 컴포지션을 확정합니다.
5. **Ctrl+Shift+Home**을 누릅니다.
6. ❌ 에디터가 크래시되어 응답하지 않습니다. 페이지를 다시 로드해야 함

## 관찰된 동작

- **특정 키 조합 크래시**: Ctrl+Shift+Home 조합이 에디터 크래시를 유발
- **자바스크립트 실행 중단**: 크래시 발생 시 자바스크립트 실행이 완전히 중단됨
- **페이지 응답 없음**: 에디터가 멈추고 브라우저는 사용자 입력에 응답하지 않음
- **Firefox 특유**: 이 문제는 Firefox에서만 발생

## 예상 동작

- 특정 키 조합에도 에디터가 크래시 없이 정상 작동해야 함
- IME 컴포지션이 중단되더라도 에디터가 응답하지 않아야 함
- 자바스크립트 오류를 적절히 처리하여 graceful recovery 구현해야 함

## 참고사항 및 가능한 해결 방향

- **위험한 키 조합 막기**: IME 컴포지션 중 Ctrl+Shift+Home 같은 위험한 조합을 막음
- **try-catch 사용**: input 이벤트 등을 try-catch로 감싸서 크래시 방지
- **에러 보고**: 크래시 발생 시 에러를 console.error로 기록하고 사용자에게 알림
- **fallback 상태**: 크래시 발생 시 비상 모드로 전환하는 메커니즘 고려

## 코드 예시

```javascript
const editor = document.querySelector('div[contenteditable]');
let isComposing = false;

// IME 상태 추적
editor.addEventListener('compositionstart', () => {
  isComposing = true;
});

editor.addEventListener('compositionend', () => {
  isComposing = false;
});

// 위험한 키 조합 막기
editor.addEventListener('keydown', (e) => {
  if (isComposing && e.ctrlKey && e.shiftKey && e.key === 'Home') {
    e.preventDefault();
    console.warn('Dangerous key combination blocked during IME composition:', e.key);
  }
});

// 크래시 방지
editor.addEventListener('input', (e) => {
  try {
    // input 처리 로직
  } catch (error) {
    console.error('Input error:', error);
    // 에러 복구 가능하면
    alert('입력 처리 중 오류가 발생했습니다. 페이지를 다시 로드하세요.');
  }
});
```
