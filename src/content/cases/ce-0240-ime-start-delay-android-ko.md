---
id: ce-0240-ime-start-delay-android-ko
scenarioId: scenario-ime-start-delay-android
locale: ko
os: Android
osVersion: "10-14"
device: Mobile (Samsung Galaxy Tab S9)
deviceVersion: Any
browser: Chrome for Android
browserVersion: "120+"
keyboard: Korean (IME) - Samsung Keyboard
caseTitle: Android에서 전체 선택 후 IME 시작 지연 (한국어)
description: "Android 가상 키보드에서 contenteditable 요소에서 Ctrl+A로 전체 텍스트를 선택한 후, 첫 글자를 입력하면 IME 컴포지션이 즉시 시작되지 않고 일반 텍스트로 입력됩니다. 두 번째 글자부터 IME 후보창이 나타납니다."
tags:
  - ime
  - composition
  - android
  - mobile
  - korean
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    여기에 텍스트를 입력하세요. 예를 들어 "안녕하세요"라고 입력한 후, 전체 선택(Ctrl+A)을 하고 첫 글자를 입력해보세요.
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true">안녕하세요</div>'
    description: "텍스트 입력됨"
  - label: "Step 1: Select All (Ctrl+A)"
    html: '<div contenteditable="true">안녕하세요</div>'
    description: "전체 텍스트 선택됨"
  - label: "Step 2: Type first letter '가'"
    html: '<div contenteditable="true">안녕하세요가</div>'
    description: "❌ 버그: '가'가 일반 텍스트로 추가됨, IME 후보창 없음"
  - label: "Step 3: Type second letter '녕'"
    html: '<div contenteditable="true">안녕하세요가녕</div>'
    description: "두 번째 글자부터 IME 후보창이 나타남"
  - label: "✅ Expected"
    html: '<div contenteditable="true">안녕하세요</div>'
    description: "예상: 첫 글자부터 IME 컴포지션 시작되어야 함"
---

## 현상

Android 가상 키보드에서 contenteditable 요소에서 전체 텍스트 선택 후 첫 글자를 입력하면, IME 컴포지션이 지연되어 시작합니다.

## 재현 예시

1. contenteditable 요소에 텍스트를 입력합니다 (예: "안녕하세요").
2. Ctrl+A를 눌러 전체 텍스트를 선택합니다.
3. 첫 글자를 입력합니다 (예: '가').
4. 두 번째 글자를 입력합니다 (예: '녕').

## 관찰된 동작

- **첫 글자 일반 텍스트**: '가'가 IME 컴포지션 없이 일반 텍스트로 입력됨
- **전체 선택 유지**: Ctrl+A로 선택된 영역이 그대로 유지됨
- **IME 지연 시작**: 두 번째 글자부터 IME 후보창이 나타나고 컴포지션이 시작됨
- **첫 글자 누락**: 컴포지션이 시작되면 첫 글자가 사라지거나 대체되어야 하지만, '가'가 그대로 남아 있음

## 예상 동작

- 첫 글자를 입력하자마자 IME 후보창이 나타나야 함
- 전체 선택이 IME 컴포지션으로 대체되어야 함

## 참고사항 및 가능한 해결 방향

- **선택 영역 해제**: 타이핑 시작 전에 기존 선택을 해제
- **beforeinput 이벤트 감지**: `inputType = 'insertText'`를 감지하여 일반 텍스트 입력인지 확인
- **compositionstart 이벤트 모니터링**: IME 컴포지션이 시작되었는지 추적
- **사용자 안내**: 전체 선택 후 타이핑을 시작할 때 UI 메시지 표시

## 코드 예시

```javascript
const editor = document.querySelector('div[contenteditable]');
let imeStarted = false;
let wasSelectAll = false;

// 전체 선택 감지
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'a') {
    wasSelectAll = true;
  }
});

// 컴포지션 시작 추적
editor.addEventListener('compositionstart', () => {
  imeStarted = true;
  // 전체 선택이 있으면 해제
  const selection = window.getSelection();
  if (selection.rangeCount > 0 && !selection.isCollapsed) {
    selection.removeAllRanges();
  }
});

// 일반 텍스트 vs IME 구분
editor.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertText' && !imeStarted && wasSelectAll) {
    // 일반 텍스트가 입력되었음, IME가 아직 시작되지 않음
    console.warn('Plain text inserted before IME started:', e.data);
  }
});

editor.addEventListener('keydown', (e) => {
  if (wasSelectAll) {
    // 전체 선택 후 첫 글자 입력 감지
    console.log('First letter after select all:', e.key);
    // 필요하다면 텍스트 정리 로직 추가
  }
});
```
