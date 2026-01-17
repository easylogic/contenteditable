---
id: scenario-paste-event-handling
title: preventDefault on paste event does not prevent default paste behavior
description: In Chrome on Windows, calling `preventDefault()` on the `paste` event does not always prevent the default paste behavior. Content may still be pasted despite the prevention.
category: paste
tags:
  - paste
  - events
  - preventDefault
  - chrome
status: draft
locale: en
---

In Chrome on Windows, calling `preventDefault()` on the `paste` event does not always prevent the default paste behavior. Content may still be pasted despite the prevention.

## References

- [MDN: Window paste event](https://developer.mozilla.org/docs/Web/API/Window/paste_event) - Paste event documentation
- [MDN: Element beforeinput event](https://developer.mozilla.org/en-US/docs/Web/API/Element/beforeinput_event) - beforeinput cancelability
- [Stack Overflow: preventDefault cannot block clipboard paste](https://stackoverflow.com/questions/78986568/event-preventdefault-cannot-block-clipboard-paste-in-chatgpt-com-prompt-box) - Capture phase solutions
