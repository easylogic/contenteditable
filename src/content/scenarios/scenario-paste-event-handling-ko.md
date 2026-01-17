---
id: scenario-paste-event-handling-ko
title: "paste 이벤트에서 preventDefault가 기본 붙여넣기 동작을 방지하지 않음"
description: "Windows의 Chrome에서 `paste` 이벤트에서 `preventDefault()`를 호출해도 항상 기본 붙여넣기 동작을 방지하지 않습니다. 방지에도 불구하고 콘텐츠가 여전히 붙여넣어질 수 있습니다."
category: paste
tags:
  - paste
  - events
  - preventDefault
  - chrome
status: draft
locale: ko
---

Windows의 Chrome에서 `paste` 이벤트에서 `preventDefault()`를 호출해도 항상 기본 붙여넣기 동작을 방지하지 않습니다. 방지에도 불구하고 콘텐츠가 여전히 붙여넣어질 수 있습니다.

## 참고 자료

- [MDN: Window paste event](https://developer.mozilla.org/docs/Web/API/Window/paste_event) - Paste event documentation
- [MDN: Element beforeinput event](https://developer.mozilla.org/en-US/docs/Web/API/Element/beforeinput_event) - beforeinput cancelability
- [Stack Overflow: preventDefault cannot block clipboard paste](https://stackoverflow.com/questions/78986568/event-preventdefault-cannot-block-clipboard-paste-in-chatgpt-com-prompt-box) - Capture phase solutions
