---
id: scenario-contenteditable-shadow-dom
title: contenteditable does not work correctly inside Shadow DOM
description: When a contenteditable region is inside a Shadow DOM, its behavior may be broken or inconsistent. Selection, focus, and editing may not work as expected.
category: other
tags:
  - shadow-dom
  - contenteditable
  - isolation
  - chrome
status: draft
locale: en
---

When a contenteditable region is inside a Shadow DOM, its behavior may be broken or inconsistent. Selection, focus, and editing may not work as expected.

## References

- [CodeMirror Discuss: Firefox shadow DOM contenteditable bug](https://discuss.codemirror.net/t/firefox-shadow-dom-contenteditable-bug/4127) - Firefox caret issues
- [Stack Overflow: contenteditable become unfocusable in Chrome 117](https://stackoverflow.com/questions/77161028/why-does-contenteditable-become-unfocusable-in-chrome-117-and-118-beta) - Chrome focus issues
- [Chromium Blink Dev: delegatesFocus text selection](https://groups.google.com/a/chromium.org/g/blink-dev/c/egWmzZ4MNuU) - Selection fixes
- [Nolan Lawson: Managing focus in Shadow DOM](https://nolanlawson.com/2021/02/13/managing-focus-in-the-shadow-dom/) - Focus management
- [Pablo Berganza: Shadow DOM Firefox contenteditable](https://pablo.berganza.dev/blog/shadow-dom-firefox-contenteditable/) - Dynamic attribute workaround
