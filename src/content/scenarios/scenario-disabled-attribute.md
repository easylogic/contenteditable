---
id: scenario-disabled-attribute
title: disabled attribute does not disable contenteditable
description: The `disabled` attribute, which disables form inputs, does not work on contenteditable regions in Safari. The contenteditable remains editable and interactive even when `disabled` is set.
category: other
tags:
  - disabled
  - editing
  - safari
status: draft
locale: en
---

The `disabled` attribute, which disables form inputs, does not work on contenteditable regions in Safari. The contenteditable remains editable and interactive even when `disabled` is set.

## References

- [MDN: contenteditable global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/contenteditable) - contenteditable documentation
- [MDN: HTMLElement.contentEditable](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/contentEditable) - contentEditable property
- [Stack Overflow: Why does contenteditable false not work?](https://stackoverflow.com/questions/78133863/why-does-contenteditable-false-not-work) - Safari nested contenteditable issues
- [CKEditor Issue #12128: contenteditable false in Safari](https://dev.ckeditor.com/ticket/12128) - Safari deletion issues
