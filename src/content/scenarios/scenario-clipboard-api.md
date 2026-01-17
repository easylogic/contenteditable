---
id: scenario-clipboard-api
title: Clipboard API paste does not work in contenteditable
description: "When using the Clipboard API (navigator.clipboard.readText() or navigator.clipboard.read()) to programmatically paste content into a contenteditable region, the paste operation may fail or not work as expected."
category: paste
tags:
  - clipboard
  - api
  - paste
  - chrome
status: draft
locale: en
---

When using the Clipboard API (`navigator.clipboard.readText()` or `navigator.clipboard.read()`) to programmatically paste content into a contenteditable region, the paste operation may fail or not work as expected.

This scenario has been observed in multiple environments with similar behavior.

## References

- [MDN: Clipboard.readText](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/readText) - readText API documentation
- [Web.dev: Image support for async clipboard](https://web.dev/image-support-for-async-clipboard/) - Clipboard API requirements
- [Stack Overflow: When does clipboard readText prompt for permission?](https://stackoverflow.com/questions/79538731/when-exactly-does-navigator-clipboard-readtext-prompt-for-user-permission-in-c) - Permission requirements
- [Stack Overflow: clipboard readText not working in Firefox](https://stackoverflow.com/questions/67440036/navigator-clipboard-readtext-is-not-working-in-firefox) - Firefox compatibility
- [MDN: Clipboard.read](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/read) - read API documentation
- [W3C: Clipboard APIs](https://www.w3.org/TR/2016/WD-clipboard-apis-20161213/) - Clipboard API specification
