---
id: scenario-ime-composition-duplicate-events-ko
title: IME 컴포지션 중 중복되거나 예상치 못한 이벤트 시퀀스 발생
description: "IME 컴포지션 중 일부 브라우저와 IME 조합에서 예상치 못한 이벤트 시퀀스가 발생합니다 (예: insertCompositionText 대신 deleteContentBackward 다음에 insertText). 이로 인해 단일 컴포지션 업데이트에 대해 이벤트 핸들러가 여러 번 실행될 수 있습니다. 여러 언어와 브라우저 조합에 영향을 미칩니다."
category: ime
tags:
  - ime
  - composition
  - beforeinput
  - duplicate-events
status: draft
locale: ko
---

IME 컴포지션 중 일부 브라우저와 IME 조합에서 표준 동작과 다른 예상치 못한 이벤트 시퀀스가 발생합니다. 이로 인해 단일 컴포지션 업데이트에 대해 이벤트 핸들러가 여러 번 실행될 수 있습니다.

## 언어별 특성

이 문제는 언어와 브라우저에 따라 다르게 나타납니다:

- **iOS Safari의 한국어 IME**: 각 컴포지션 업데이트마다 `deleteContentBackward` 다음에 `insertText` (not `insertCompositionText`)가 발생합니다
- **일본어 IME**: 브라우저에 따라 다른 이벤트 시퀀스가 발생할 수 있습니다
- **중국어 IME**: 브라우저에 따라 다른 이벤트 시퀀스가 발생할 수 있습니다
- **기타 IME**: 다른 언어에서도 유사한 문제가 발생할 수 있습니다

## 관찰된 동작

한국어 텍스트를 컴포지션할 때 (예: "한글" 입력):

1. 사용자가 컴포지션을 업데이트하는 문자를 입력합니다
2. 이전 컴포지션 텍스트를 제거하기 위해 `inputType: 'deleteContentBackward'`인 `beforeinput` 이벤트가 발생합니다
3. 새로운 컴포지션 텍스트를 삽입하기 위해 `inputType: 'insertText'` (not `insertCompositionText`)인 `beforeinput` 이벤트가 다시 발생합니다
4. 두 이벤트 모두 `e.isComposing === true`입니다

## 영향

- `deleteContentBackward`와 `insertText`를 모두 처리하는 이벤트 핸들러는 각 컴포지션 업데이트마다 두 번 실행됩니다
- 이로 인해 다음 문제가 발생할 수 있습니다:
  - 성능 문제 (이중 처리)
  - 잘못된 실행 취소/다시 실행 스택 관리 (하나 대신 두 개의 작업)
  - 중복된 유효성 검사 또는 포맷팅 로직 실행
  - 상태 동기화 문제
- 컴포지션 중 `insertCompositionText`가 아닌 `insertText`가 발생한다는 사실은 `insertCompositionText`를 기대하는 핸들러가 이러한 이벤트를 놓칠 수 있게 합니다

## 브라우저 비교

- **iOS Safari**: 컴포지션 업데이트 중 `deleteContentBackward` 다음에 `insertText` (not `insertCompositionText`)가 발생합니다
- **Chrome/Edge**: 컴포지션 업데이트 중 `insertCompositionText`만 발생합니다
- **Firefox**: 동작이 다를 수 있지만 일반적으로 Chrome과 더 일관됩니다 (`insertCompositionText` 발생)

## 해결 방법

iOS Safari에서 컴포지션 중 `beforeinput` 이벤트를 처리할 때, 이벤트가 컴포지션 시퀀스의 일부인지 확인하고 `insertText` 이벤트 바로 다음에 오는 `deleteContentBackward` 이벤트를 처리하지 않도록 합니다:

```javascript
let lastCompositionDelete = null;

element.addEventListener('beforeinput', (e) => {
  if (e.isComposing) {
    if (e.inputType === 'deleteContentBackward') {
      // insertText와의 잠재적 페어링을 위해 저장
      lastCompositionDelete = e;
      return; // 컴포지션 중 deleteContentBackward 처리하지 않음
    }
    
    if (e.inputType === 'insertText') {
      // iOS Safari는 컴포지션 중 insertText (not insertCompositionText)를 발생시킵니다
      if (lastCompositionDelete) {
        // 이 insertText는 이전 deleteContentBackward와 페어링됩니다
        // 단일 컴포지션 업데이트로 insertText 이벤트만 처리합니다
        lastCompositionDelete = null;
      }
      // 컴포지션 텍스트 삽입 처리
      // 참고: e.data에 컴포지션된 텍스트가 포함됩니다
    }
  }
});
```

**중요**: iOS Safari에서는 컴포지션 중 `insertCompositionText`가 아닌 `insertText`가 발생하므로, 핸들러는 컴포지션 업데이트를 처리할 때 `insertText`와 `insertCompositionText`를 모두 확인해야 합니다.

## 참고 자료

- [ProseMirror Issue #944: Duplicated characters in Safari with IME](https://github.com/ProseMirror/prosemirror/issues/944) - Related duplication issues when marks are active
- [WebKit Bug 31902: DOM modified again after compositionend](https://bugs.webkit.org/show_bug.cgi?id=31902) - Extra deletions/insertions after composition
- [WebKit Bug 261764: Dictation doesn't trigger composition events](https://bugs.webkit.org/show_bug.cgi?id=261764) - Dictation bypasses composition events
- [Stack Overflow: Safari event order during composition](https://stackoverflow.com/questions/79501572/safari-is-theres-any-way-to-detect-that-this-particular-keydown-event-triggere) - Event ordering issues
- [ProseMirror Discuss: iOS replace causes handleTextInput to receive single letter](https://discuss.prosemirror.net/t/ios-replace-causes-handletextinput-to-receive-a-single-letter-rather-than-the-replacement-text/6695) - beforeinput type mismatches
- [Apple Discussions: Japanese Kana keyboard duplicating digits](https://discussions.apple.com/thread/255011682) - Related duplication issues
