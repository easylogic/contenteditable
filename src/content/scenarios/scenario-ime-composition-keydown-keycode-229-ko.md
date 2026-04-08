---
id: scenario-ime-composition-keydown-keycode-229-ko
title: "IME 조합 중 keyCode 229와 Enter"
description: "IME 조합 중 keydown은 여러 키에 대해 keyCode 229(VK_PROCESSKEY)로 올 수 있어 IME 입력 시퀀스의 일부임을 뜻합니다. Enter는 조합 확정·줄바꿈·무시 중 하나로 동작하고 Chrome·Firefox·일본어 배열에 따라 다릅니다. Enter를 항상 문단 나누기로만 처리하면 조합을 깨뜨립니다."
category: ime
tags:
  - ime
  - composition
  - keyCode
  - keydown
  - enter
  - chrome
  - firefox
status: draft
locale: ko
---

IME 조합 중 `keydown`은 여러 키에 대해 **keyCode 229**(`VK_PROCESSKEY`)로 올 수 있어 IME 입력 시퀀스의 일부임을 뜻합니다. **Enter**는 조합 확정·줄바꿈·무시 중 하나로 동작하고 Chrome·Firefox·일본어 배열에 따라 다릅니다. Enter를 항상 문단 나누기로만 처리하면 조합을 깨뜨립니다.

## 문제 개요

레거시 `keyCode`/`which`는 폐기 권고지만 여전히 쓰입니다. **229**는 “IME가 처리 중일 수 있음”에 가깝습니다. `isComposing`인데 Enter만 보고 `insertParagraph`를 실행하면 이중 삽입·조합 취소가 납니다.

## 관찰된 동작

- 조합 중 Enter가 229로 오고, `beforeinput`의 `inputType`은 엔진에 따라 다름.
- 일본어 IME: 첫 후보 확정 vs 줄바꿈은 IME 설정에 좌우됨.

## 영향

줄 중복, 음절 손실, 조합 중 Enter를 아예 막아 버리는 에디터.

## 브라우저 비교

Chrome과 Firefox의 Enter+조합 순서가 다르고, macOS·Windows 키보드 스택도 변수입니다.

## 해결 방법

- 제어 흐름에는 **`e.isComposing`**와 `beforeinput`의 `inputType`을 우선.
- `keydown`만 쓸 때 **229**는 구조적 노드 삽입을 하지 않음.
- **일본어·한국어** Enter를 각각 검증.

## 관련 케이스

- [ce-0210](ce-0210-ime-keydown-keycode-229-enter-chrome)
- [ce-0211](ce-0211-ime-keydown-keycode-229-enter-firefox)
- [ce-0212](ce-0212-ime-keydown-keycode-229-enter-japanese-chrome)

## 참고 자료

- MDN: [KeyboardEvent: keyCode](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode)
- [UI Events](https://www.w3.org/TR/uievents/)
