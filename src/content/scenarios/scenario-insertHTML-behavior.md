---
id: scenario-insertHTML-behavior
title: insertHTML breaks DOM structure and formatting
description: "When using document.execCommand('insertHTML', ...) to insert HTML content into a contenteditable region, the DOM structure may be broken or reformatted unexpectedly. Nested elements may be flattened or reorganized."
category: formatting
tags:
  - insertHTML
  - dom
  - formatting
  - chrome
status: draft
locale: en
---

When using `document.execCommand('insertHTML', ...)` to insert HTML content into a contenteditable region, the DOM structure may be broken or reformatted unexpectedly. Nested elements may be flattened or reorganized.

## References

- [W3C Editing: execCommand insertHTML](https://w3c.github.io/editing/docs/execCommand/) - execCommand specification
- [Stack Overflow: Chrome execCommand insertHTML behavior](https://stackoverflow.com/questions/23354903/chrome-execcommandinserthtml-behavior) - Attribute stripping issues
- [Stack Overflow: Weird behaviour with execCommand insertHTML](https://stackoverflow.com/questions/66272074/weird-behaviour-with-document-execcommandinserthtml) - Nested element issues
- [Stack Overflow: Keep execCommand insertHTML from removing attributes](https://stackoverflow.com/questions/25941559/is-there-a-way-to-keep-execcommandinserthtml-from-removing-attributes-in-chr) - Range API alternatives
