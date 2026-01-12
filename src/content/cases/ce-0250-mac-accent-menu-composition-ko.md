---
id: ce-0250
scenarioId: scenario-mac-accent-menu-composition
locale: ko
os: macOS
osVersion: "13+"
device: Desktop (Mac)
deviceVersion: Any
browser: Safari
browserVersion: "17+"
keyboard: Korean (IME) - macOS Korean Input
caseTitle: macOS에서 accent menu 사용 시 composition 이벤트 불일치 (한국어)
description: "macOS에서 모음 키나 option 키 조합으로 accent 문자(예: á, é, ü 등)를 입력할 때, IME 컴포지션 이벤트(compositionstart, compositionupdate, compositionend)가 일정하게 발생하지 않거나 누락되는 경우가 있습니다. 이로 인해 accent menu 사용인지 IME 사용인지 구분하기 어렵습니다."
tags:
  - composition
  - ime
  - macos
  - accent-menu
  - keyboard
  - korean
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    여기에 텍스트를 입력하세요. accent menu(모음 키 길게 누르기 또는 option+키)를 사용하여 특수 문자를 입력해보세요.
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true"></div>'
    description: "빈 편집기"
  - label: "Step 1: Use accent menu (hold vowel + option)"
    html: '<div contenteditable="true">é</div>'
    description: "Accent menu로 'é' 입력 (composition 이벤트 없을 수 있음)"
  - label: "Step 2: Type more characters"
    html: '<div contenteditable="true">é안녕하세요</div>'
    description: "계속 타이핑"
  - label: "Observation"
    html: '<div contenteditable="true">é안녕하세요</div>'
    description: "compositionstart 이벤트 누락 또는 불일치"
  - label: "✅ Expected"
    html: '<div contenteditable="true">안녕하세요</div>'
    description: "IME로 입력할 때는 composition 이벤트가 발생해야 함"
---

## 현상

macOS에서 accent menu를 사용하여 특수 문자(예: á, é, ü, ö 등)를 입력할 때, IME 컴포지션 이벤트가 일정하게 발생하지 않습니다.

## 재현 예시

1. contenteditable 요소에 포커스합니다.
2. 모음 키를 길게 누르거나 option+키 조합을 사용하여 accent menu를 엽니다.
3. 원하는 문자를 선택하여 입력합니다 (예: 'é').
4. 일반 키보드로 계속 타이핑합니다.

## 관찰된 동작

- **compositionstart 누락**: accent menu 사용 시 `compositionstart` 이벤트가 발생하지 않음
- **compositionupdate 불일치**: `compositionupdate`가 발생하지 않거나 불일치하게 발생
- **compositionend 누락 또는 지연**: `compositionend`가 발생하지 않거나 예상치 못하게 지연됨
- **IME vs 구분 어려**: 이 동작이 IME 컴포지션인지 accent menu 사용인지 프로그래매틱적으로 구분하기 어렵게 만듭니다

## 예상 동작

- accent menu 사용 시에도 IME 사용 시과 동일한 이벤트 패턴이 발생해야 함
- `beforeinput`의 `inputType`으로 구분 가능해야 함
- composition 이벤트는 일관적으로 발생해야 함

## 참고사항 및 가능한 해결 방향

- **beforeinput inputType 사용**: `inputType = 'insertCompositionText'`인지 확인하여 IME 입력인지 식별
- **키보드 상태 감지**: keydown/keyup 이벤트 조합으로 accent menu 사용 감지
- **대안적 상태 관리**: 별도의 상태 플래그 사용
- **macOS 특유 이해**: macOS의 accent menu가 시스템 레벨에서 처리되는 이해가 필요

## 코드 예시

```javascript
const editor = document.querySelector('div[contenteditable]');
let isComposing = false;
let lastInputType = '';
let keyDownCount = 0;
let keyUpCount = 0;

editor.addEventListener('beforeinput', (e) => {
  lastInputType = e.inputType || '';
  if (e.inputType === 'insertCompositionText') {
    // IME 컴포지션
    isComposing = true;
  } else if (e.inputType === 'insertText') {
    // 일반 키보드 입력
    if (isComposing && lastInputType !== 'insertCompositionText') {
      // compositionstart 없이 insertText가 온 경우 = 아마 accent menu
      console.warn('Potential accent menu usage without composition events');
    }
  }
});

editor.addEventListener('compositionstart', () => {
  isComposing = true;
  console.log('Composition started');
});

editor.addEventListener('compositionupdate', (e) => {
  console.log('Composition update:', e.data);
});

editor.addEventListener('compositionend', () => {
  isComposing = false;
  console.log('Composition ended');
});

// accent menu 감지 (대안적 방법)
editor.addEventListener('keydown', (e) => {
  keyDownCount++;
  
  // option 키 또는 모음 키 길게 누르기 감지
  const isAccentMenu = e.altKey || isVowelKey(e.key) || isLongKeyPress();
  
  if (isAccentMenu) {
    console.log('Potential accent menu usage detected');
  }
});

editor.addEventListener('keyup', (e) => {
  keyUpCount++;
});

// 특정 키 감지 헬퍼
function isVowelKey(key) {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  return vowels.includes(key.toLowerCase());
}

function isLongKeyPress() {
  // 키보드 이벤트 패턴 분석
  return keyDownCount > keyUpCount + 1;
}
```
