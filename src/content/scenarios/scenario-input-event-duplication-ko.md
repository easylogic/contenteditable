---
id: scenario-input-event-duplication-ko
title: "단일 키 입력에 대해 input 이벤트가 여러 번 발생함"
description: "Windows의 Edge에서 단일 키 입력에 대해 `input` 이벤트가 여러 번 발생하여 이벤트 핸들러가 예상보다 더 많이 실행될 수 있습니다. 이로 인해 성능 문제와 잘못된 동작이 발생할 수 있습니다."
category: other
tags:
  - input
  - events
  - duplication
  - edge
status: draft
locale: ko
---

Windows의 Edge에서 단일 키 입력에 대해 `input` 이벤트가 여러 번 발생하여 이벤트 핸들러가 예상보다 더 많이 실행될 수 있습니다. 이로 인해 성능 문제와 잘못된 동작이 발생할 수 있습니다.

## 참고 자료

- [Rishan Digital: Key down event fires twice](https://rishandigital.com/jquery/key-down-event-fires-twice-ensure-event-is-not-bound-multiple-times/) - Event listener duplication
- [MDN: Element keydown event](https://developer.mozilla.org/docs/Web/API/Element/keydown_event) - Keydown event documentation
- [Microsoft Support: preventDefault doesn't work with IME in Edge](https://support.microsoft.com/en-us/topic/preventdefault-doesn-t-work-in-internet-explorer-11-or-microsoft-edge-with-ime-enabled-11908d69-b7e6-00c0-8664-62f2b3bcce0a) - IME-related event issues
