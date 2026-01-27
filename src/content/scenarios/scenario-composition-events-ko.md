---
id: scenario-composition-events-ko
title: "브라우저별 조합 이벤트 수명 주기 불일치"
description: "순서가 어긋나거나 누락된 조합 이벤트가 에디터 상태 동기화를 어떻게 방해하는지에 대한 분석입니다."
category: "ime"
tags: ["ime", "composition", "events", "order", "reliability"]
status: "confirmed"
locale: "ko"
---

## 문제 개요
CJK(한국어, 중국어, 일본어) 사용자에게 `Composition` 이벤트 수명 주기는 `Input` 이벤트 루프만큼이나 중요합니다. 프레임워크들은 브라우저의 중간 DOM 상태가 내부 모델을 오염시키지 않도록 조합 중에 상태를 "잠금(Lock)" 처리하곤 합니다. 만약 이벤트가 잘못된 순서로 발생하거나 `isComposing` 플래그가 부정확하게 설정되면, 프레임워크가 조기에 잠금을 해제하여 파괴적인 동기화를 수행할 위험이 있습니다.

## 관찰된 동작
### 시나리오 1: 이벤트 순서 역전 (Safari)
Safari에서는 Enter 키로 조합을 확정할 때, 대응하는 `keydown` 이벤트보다 `compositionend`가 먼저 발생합니다. 이로 인해 `isComposing` 플래그가 너무 빨리 초기화됩니다.

```javascript
/* 기대되는 시퀀스 */
// 1. keydown (key: Enter, isComposing: true)
// 2. compositionend

/* Safari 시퀀스 */
// 1. compositionend (상태 잠금 해제!)
// 2. keydown (key: Enter, isComposing: false) -> 줄바꿈/전송 트리거!
```

### 시나리오 2: 이벤트 누락 (받아쓰기/자동 수정)
iOS 받아쓰기나 macOS 자동 수정(두 번 띄어쓰기로 마침표 입력 등)과 같은 OS 레벨의 기능은 문자를 직접 삽입하며, 가끔 `compositionupdate` 과정을 완전히 건너뛰기도 합니다.

## 영향
- **조기 명령어 실행**: 조합용 Enter 키가 에디터 명령어(예: 새 문단)로 처리됨.
- **히스토리 오염**: 실행 취소(Undo) 스택이 마지막 글자를 조합과 별개의 작업으로 인식함.
- **시각적 깜빡임**: 에디터 모델과 DOM이 아직 확정되지 않은 텍스트를 두고 충돌함.

## 브라우저 비교
- **WebKit (Safari)**: Enter 확정 시 "순서 역전" 버그로 유명함.
- **Blink (Chrome)**: 가장 표준을 잘 따르지만, 빠른 타이핑 시 "유령" `compositionupdate`가 발생하는 경우가 있음.
- **Gecko (Firefox)**: 일관되게 `keyCode 229`와 함께 `keydown`을 발생시켜 IME 활동 감지에 가장 유리함.

## 해결 방법
### 1. "잠금 지연" (Safari 대응)
`compositionend` 발생 후 아주 짧은 타임아웃을 두어 Safari의 뒤처진 `keydown` 이벤트를 걸러냅니다.

```javascript
let imeLock = false;
element.addEventListener('compositionstart', () => { imeLock = true; });
element.addEventListener('compositionend', () => {
  setTimeout(() => { imeLock = false; }, 40); // Safari의 keydown을 기다림
});
```

### 2. keyCode 229 확인
표준에서 제외(deprecated)되었으나 여전히 모든 엔진이 지원하는 `keyCode 229`를 통해 IME 입력을 안정적으로 감지합니다.

## 관련 사례
- [ce-0567: Enter 입력 시 compositionend가 keydown보다 먼저 발생](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0567-safari-composition-event-order-ko.md)

## 참고 자료
- [W3C UI Events: Composition Events](https://www.w3.org/TR/uievents/#events-compositionevents)
- [WebKit Bug 165231](https://bugs.webkit.org/show_bug.cgi?id=165231)
