---
id: ce-0567-safari-composition-event-order-ko
scenarioId: scenario-composition-events
locale: ko
os: macOS
osVersion: "15.0"
device: Desktop
deviceVersion: Any
browser: Safari
browserVersion: "18.0"
keyboard: Japanese IME
caseTitle: "Enter 입력 시 compositionend가 keydown보다 먼저 발생"
description: "Safari 브라우저에서 IME 조합 중 Enter 키로 확정할 때, 'compositionend' 이벤트가 'keydown'보다 먼저 발생하여 애플리케이션이 Enter 키를 조기에 처리하게 되는 현상입니다."
tags: ["ime", "composition", "events", "safari", "order-mismatch"]
status: confirmed
domSteps:
  - label: "1단계: 조합 세션"
    html: '<div contenteditable="true">あ|</div>'
    description: "사용자가 'あ'를 조합 중입니다 (일본어 IME). 조합 세션이 활성화된 상태입니다."
  - label: "2단계: Enter 키 입력"
    html: '<div contenteditable="true">あ|</div>'
    description: "사용자가 확정을 위해 Enter를 누릅니다. 브라우저는 조합을 완료한 후 keydown을 보내야 합니다."
  - label: "3단계: 버그 발생 (순서 역전)"
    html: '<div contenteditable="true">あ\n|</div>'
    description: "compositionend가 먼저 발생하여 isComposing이 false가 됩니다. 그 후 keydown이 발생하고, 앱은 조합 중이 아닌 상태의 Enter로 인식하여 줄바꿈을 삽입합니다."
  - label: "✅ 예상 동작"
    html: '<div contenteditable="true">あ|</div>'
    description: "예상: keydown(isComposing: true) -> compositionend 순서로 발생하여 앱이 조합 중의 Enter를 무시해야 함"
---

## 현상
오래된 이슈이지만 2025년 9월 기준으로도 여전히 활발히 보고되고 있는 Safari의 버그입니다. UI Events 명세에 따르면, 조합을 확정하기 위해 사용되는 Enter 키의 `keydown` 이벤트는 `isComposing: true` 상태를 가져야 하며 `compositionend` 이벤트보다 **먼저** 발생해야 합니다. 하지만 Safari는 `compositionend`를 먼저 발생시키고, 그 후에 `isComposing`이 `false`인 `keydown`을 디스패치하는 오류를 범합니다.

## 재현 단계
1. Safari(macOS 또는 iOS)에서 `contenteditable` 영역을 엽니다.
2. IME 조합을 시작합니다 (예: 일본어, 한국어, 중국어).
3. 조합 밑줄이 생기도록 글자를 입력합니다.
4. **Enter** 키를 한 번 눌러 조합을 확정합니다.
5. `keydown`, `compositionupdate`, `compositionend` 이벤트의 발생 순서를 로그로 확인합니다.

## 관찰된 동작
1. **`compositionend`**: Enter를 누르는 즉시 가장 먼저 발생합니다. 이 시점에 브라우저의 내부 "조합 중" 상태가 `false`로 변경됩니다.
2. **`keydown`**: 그 **이후에** 발생합니다.
   - `e.key`: "Enter"
   - `e.isComposing`: **`false`** (명세 불일치!)
3. **결과**: 채팅 앱이나 에디터에서 "Enter"를 감지하여 특정 동작(메시지 전송, 줄바꿈 등)을 수행하는 로직이 있다면, 사용자는 단지 조합을 *끝내고* 싶었을 뿐인데도 불필요한 전송이나 줄바꿈이 실행되어 버립니다.

## 예상 동작
`keydown` 이벤트가 `isComposing: true` 상태로 먼저 발생하여, 애플리케이셔이 `preventDefault()`를 호출하거나 해당 키 입력을 무시할 수 있는 기회를 주어야 합니다. 그 다음 `compositionend`가 발생하여 세션 종료를 알려야 합니다.

## 영향
- **조기 전송**: 사용자가 글자를 확정만 하려 했을 뿐인데 채팅 메시지가 전송됨.
- **이중 줄바꿈**: 텍스트가 확정됨과 동시에 에디터에 원치 않는 줄바꿈이 삽입됨.
- **상태 오염**: 특정 수명 주기(Lifecycle)를 기대하는 프레임워크들이 키 이벤트 전에 세션이 종료되는 현상으로 인해 오작동함.

## 브라우저 비교
- **Safari (18.0 포함 모든 버전)**: 순서 역전 현상 발생.
- **Chrome / Firefox**: 정상적으로 `keydown(isComposing: true)`이 `compositionend`보다 먼저 발생함.

## 참고 및 해결 방법
### 해결책: keyCode 229 또는 디바운싱(Debouncing) 활용
Safari에서는 `isComposing`을 믿을 수 없기 때문에, 개발자들은 `keyCode: 229`(IME 처리 중)를 확인하거나 별도의 "잠금(Lock)" 매커니즘을 사용합니다.

```javascript
let isSafariIME = false;

element.addEventListener('compositionstart', () => { isSafariIME = true; });
element.addEventListener('compositionend', () => {
  // Safari의 뒤처진 keydown을 잡기 위해 잠금 해제를 약간 지연시킴
  setTimeout(() => { isSafariIME = false; }, 50);
});

element.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.isComposing || isSafariIME || e.keyCode === 229)) {
    // 이 Enter가 확정 용도임을 정확히 식별하여 차단
    e.preventDefault();
  }
});
```

- [WebKit Bugzilla #165231](https://bugs.webkit.org/show_bug.cgi?id=165231)
- [MDN: compositionend (Safari 동작 관련 노트)](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event)
