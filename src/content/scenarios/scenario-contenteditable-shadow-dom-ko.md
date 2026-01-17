---
id: scenario-contenteditable-shadow-dom-ko
title: "Shadow DOM 내부에서 contenteditable이 올바르게 작동하지 않음"
description: "contenteditable 영역이 Shadow DOM 내부에 있을 때 동작이 깨지거나 일관되지 않을 수 있습니다. 선택, 포커스 및 편집이 예상대로 작동하지 않을 수 있습니다."
category: other
tags:
  - shadow-dom
  - contenteditable
  - isolation
  - chrome
status: draft
locale: ko
---

contenteditable 영역이 Shadow DOM 내부에 있을 때 동작이 깨지거나 일관되지 않을 수 있습니다. 선택, 포커스 및 편집이 예상대로 작동하지 않을 수 있습니다.

## 참고 자료

- [CodeMirror Discuss: Firefox shadow DOM contenteditable bug](https://discuss.codemirror.net/t/firefox-shadow-dom-contenteditable-bug/4127) - Firefox caret issues
- [Stack Overflow: contenteditable become unfocusable in Chrome 117](https://stackoverflow.com/questions/77161028/why-does-contenteditable-become-unfocusable-in-chrome-117-and-118-beta) - Chrome focus issues
- [Chromium Blink Dev: delegatesFocus text selection](https://groups.google.com/a/chromium.org/g/blink-dev/c/egWmzZ4MNuU) - Selection fixes
- [Nolan Lawson: Managing focus in Shadow DOM](https://nolanlawson.com/2021/02/13/managing-focus-in-the-shadow-dom/) - Focus management
- [Pablo Berganza: Shadow DOM Firefox contenteditable](https://pablo.berganza.dev/blog/shadow-dom-firefox-contenteditable/) - Dynamic attribute workaround
