---
id: scenario-autofocus-behavior
title: autofocus attribute does not work on contenteditable
description: "The autofocus attribute, which automatically focuses form inputs on page load, does not work on contenteditable elements. There is no built-in way to automatically focus a contenteditable region when a page loads."
category: focus
tags:
  - autofocus
  - focus
  - chrome
  - windows
status: draft
locale: en
---

The `autofocus` attribute, which automatically focuses form inputs on page load, does not work on contenteditable elements. There is no built-in way to automatically focus a contenteditable region when a page loads.

## References

- [WHATWG HTML: autofocus attribute](https://html.spec.whatwg.org/multipage/interaction.html) - autofocus specification
- [MDN: HTMLElement.autofocus](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/autofocus) - autofocus property documentation
- [Stack Overflow: Can I use autofocus on contenteditable?](https://stackoverflow.com/questions/11475398/can-i-use-autofocus-on-an-element-with-contenteditable) - Focus solutions
- [Stack Overflow: WebView with contenteditable cannot be focused programmatically](https://stackoverflow.com/questions/10685395/webview-with-contenteditable-cannot-be-focused-programmatically) - WebView focus issues
