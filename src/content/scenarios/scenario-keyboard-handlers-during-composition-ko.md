---
id: scenario-keyboard-handlers-during-composition-ko
title: 키보드 핸들러는 조합 중 브라우저 기본 동작을 허용해야 함
description: "키보드 핸들러(Enter, Backspace, Delete)를 재정의하는 에디터는 IME 조합 중 브라우저 기본 동작을 허용해야 합니다. 그러나 iOS Safari는 조합 이벤트를 발생시키지 않아 isComposing이 항상 false가 됩니다. iOS Safari는 항상 브라우저 기본 동작을 허용하도록 특별한 처리가 필요합니다."
category: ime
tags:
  - ime
  - composition
  - keyboard
  - beforeinput
  - input
  - isComposing
  - safari
status: draft
locale: ko
---

Enter, Backspace, Delete와 같은 키에 대한 키보드 핸들러를 재정의하는 에디터는 IME 조합 중 브라우저 기본 동작을 허용해야 합니다. 그러나 iOS Safari는 조합 이벤트를 발생시키지 않아 `isComposing`이 항상 false가 되어 표준 조합 감지 패턴이 작동하지 않습니다.

## 문제

많은 에디터가 동작을 사용자 정의하기 위해 키보드 핸들러를 재정의합니다:
- **Enter**: 사용자 정의 줄바꿈 처리, 블록 생성
- **Backspace**: 사용자 정의 삭제 로직, 블록 병합
- **Delete**: 사용자 정의 삭제 로직
- **기타 키**: 다양한 사용자 정의 동작

IME 조합 중에는 이러한 사용자 정의 핸들러를 우회하여 브라우저의 기본 조합 동작을 허용해야 합니다. 표준 접근 방법은 `isComposing` 플래그를 확인하거나 조합 이벤트를 수신하는 것입니다.

## 플랫폼별 동작

### 표준 브라우저 (Chrome, Edge, Firefox, Desktop Safari)
- 조합 이벤트(`compositionstart`, `compositionupdate`, `compositionend`)가 정상적으로 발생함
- `beforeinput`/`input` 이벤트의 `isComposing` 플래그가 조합 상태를 정확하게 반영함
- 조합 상태를 안정적으로 감지하고 브라우저 기본 동작을 허용할 수 있음

### iOS Safari
- 한글 IME에 대해 조합 이벤트가 발생하지 않음
- 한글 IME에 대해 `beforeinput`/`input` 이벤트의 `isComposing` 플래그가 항상 `false`임
- 표준 방법으로 조합 상태를 안정적으로 감지할 수 없음
- 키보드 핸들러에 대해 항상 브라우저 기본 동작을 허용해야 함

## 관찰된 동작

### 표준 브라우저
1. 사용자가 IME 조합을 시작함 (예: 한글 문자 입력)
2. `compositionstart` 발생 → `isComposing = true`
3. 사용자가 조합 중 Enter/Backspace/Delete를 누름
4. `beforeinput`이 `isComposing: true`와 함께 발생함
5. 사용자 정의 키보드 핸들러가 `isComposing`을 확인하고 브라우저 기본 동작을 허용함
6. 브라우저가 조합의 일부로 키 입력을 처리함
7. `compositionend` 발생 → `isComposing = false`

### iOS Safari (한글 IME)
1. 사용자가 IME 조합을 시작함 (예: 한글 문자 입력)
2. `compositionstart`가 발생하지 않음
3. 모든 이벤트에서 `isComposing`이 `false`로 유지됨
4. 사용자가 조합 중 Enter/Backspace/Delete를 누름
5. `beforeinput`이 `isComposing: false`와 함께 발생함
6. 사용자 정의 키보드 핸들러가 조합이 활성화되지 않았다고 생각함
7. 사용자 정의 핸들러가 기본 동작을 방지하고 키 입력을 처리함
8. 이것이 조합 동작을 깨뜨림

## 영향

- **깨진 조합**: 사용자 정의 키보드 핸들러가 IME 조합을 방해함
- **손실된 텍스트**: 조합 텍스트가 손실되거나 잘못 처리될 수 있음
- **잘못된 동작**: Enter/Backspace/Delete가 조합 중 예상대로 작동하지 않을 수 있음
- **플랫폼별 버그**: 다른 브라우저에서 작동하는 코드가 iOS Safari에서 실패함
- **IME별 버그**: 다른 IME에서 작동하는 코드가 iOS Safari의 한글 IME에서 실패함

## 브라우저 비교

- **Chrome/Edge/Firefox/Desktop Safari**: 조합 이벤트 발생, `isComposing`이 정확함, 조합 상태를 감지할 수 있음
- **iOS Safari (한글 IME)**: 조합 이벤트가 발생하지 않음, `isComposing`이 항상 `false`임, 조합 상태를 감지할 수 없음
- **iOS Safari (일본어/한자 IME)**: 조합 이벤트 발생, `isComposing`이 정확함

## 해결 방법

### 표준 브라우저 - isComposing 확인
```javascript
let isComposing = false;

element.addEventListener('compositionstart', () => {
  isComposing = true;
});

element.addEventListener('compositionend', () => {
  isComposing = false;
});

element.addEventListener('beforeinput', (e) => {
  // 조합 중 브라우저 기본 동작 허용
  if (e.isComposing || isComposing) {
    return; // 브라우저가 처리하도록 함
  }
  
  // 사용자 정의 키보드 처리
  if (e.inputType === 'insertParagraph') {
    e.preventDefault();
    handleCustomEnter();
  } else if (e.inputType === 'deleteContentBackward') {
    e.preventDefault();
    handleCustomBackspace();
  } else if (e.inputType === 'deleteContentForward') {
    e.preventDefault();
    handleCustomDelete();
  }
});
```

### iOS Safari - 항상 브라우저 기본 동작 허용
```javascript
const isIOSSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) && 
                    /Safari/.test(navigator.userAgent) && 
                    !/Chrome/.test(navigator.userAgent);

element.addEventListener('beforeinput', (e) => {
  // iOS Safari: 키보드 핸들러에 대해 항상 브라우저 기본 동작 허용
  // isComposing이 항상 false이고 조합 이벤트가 발생하지 않기 때문
  if (isIOSSafari) {
    // 한글 IME 패턴 감지: isComposing: false인 deleteContentBackward + insertText
    // 이것은 isComposing이 false임에도 조합이 활성화되어 있음을 나타냄
    if (e.inputType === 'deleteContentBackward' || 
        e.inputType === 'insertText' ||
        e.inputType === 'insertParagraph' ||
        e.inputType === 'deleteContentForward') {
      // 브라우저 기본 동작 허용 - 기본 동작 방지하지 않음
      return;
    }
  }
  
  // 표준 브라우저: isComposing 확인
  if (e.isComposing || isComposing) {
    return; // 브라우저가 처리하도록 함
  }
  
  // 조합이 아닌 경우에 대한 사용자 정의 키보드 처리
  if (e.inputType === 'insertParagraph') {
    e.preventDefault();
    handleCustomEnter();
  } else if (e.inputType === 'deleteContentBackward') {
    e.preventDefault();
    handleCustomBackspace();
  } else if (e.inputType === 'deleteContentForward') {
    e.preventDefault();
    handleCustomDelete();
  }
});
```

### 대안: iOS Safari 한글 IME 패턴 감지
```javascript
let lastDeleteBackward = null;
const isIOSSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) && 
                    /Safari/.test(navigator.userAgent) && 
                    !/Chrome/.test(navigator.userAgent);

element.addEventListener('beforeinput', (e) => {
  if (isIOSSafari) {
    // iOS Safari 한글 IME 패턴: deleteContentBackward 다음에 insertText
    // 둘 다 isComposing: false이지만 활성 조합을 나타냄
    if (e.inputType === 'deleteContentBackward') {
      lastDeleteBackward = e;
      return; // 브라우저 기본 동작 허용
    }
    
    if (e.inputType === 'insertText' && lastDeleteBackward) {
      // 이것은 조합 업데이트의 일부임
      lastDeleteBackward = null;
      return; // 브라우저 기본 동작 허용
    }
    
    // 잠재적 조합 중 Enter/Backspace/Delete에 대해 브라우저 기본 동작 허용
    if (e.inputType === 'insertParagraph' || 
        e.inputType === 'deleteContentBackward' ||
        e.inputType === 'deleteContentForward') {
      // 보수적 접근: 브라우저 기본 동작 허용
      return;
    }
  }
  
  // 표준 브라우저: isComposing 확인
  if (e.isComposing || isComposing) {
    return;
  }
  
  // 사용자 정의 키보드 처리
  // ...
});
```

**중요**: 
- iOS Safari에서는 키보드 핸들러에 대해 항상 브라우저 기본 동작을 허용해야 함
- iOS Safari의 한글 IME에 대해 `isComposing` 플래그나 조합 이벤트에 의존하지 않음
- 플랫폼 감지를 사용하여 올바른 전략을 적용함
- 조합 상태 감지를 위해 `keydown` 이벤트 대신 `beforeinput` 이벤트 사용을 고려함

## 참고 자료

- [Lexical Issue #5841: isComposing always false on iOS Safari Korean IME](https://github.com/facebook/lexical/issues/5841) - iOS Safari Korean IME issues
- [W3C UI Events: Composition events](https://www.w3.org/TR/2016/WD-uievents-20160804/) - Composition event specification
- [WebKit Bug 261764: iOS dictation doesn't trigger composition events](https://bugs.webkit.org/show_bug.cgi?id=261764) - Related dictation issues
- [WebKit Bug 43020: Korean Hangul composition test](https://bugs.webkit.org/show_bug.cgi?id=43020) - Korean IME composition issues
- [Tanishiking: IME event handling](https://tanishiking.github.io/posts/ime-event-handling/) - IME detection heuristics
