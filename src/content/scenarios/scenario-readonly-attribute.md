---
id: scenario-readonly-attribute
title: readonly attribute does not prevent editing in contenteditable
description: The `readonly` attribute, which should prevent editing on form inputs, does not work on contenteditable regions in Firefox. Users can still edit the content even when `readonly` is set.
category: other
tags:
  - readonly
  - editing
  - firefox
status: draft
locale: en
---

The `readonly` attribute, which should prevent editing on form inputs, does not work on contenteditable regions in Firefox. Users can still edit the content even when `readonly` is set.

## References

- [MDN: contenteditable global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/contenteditable) - contenteditable documentation
- [MDN: readonly attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/readonly) - readonly attribute documentation
- [MDN: HTMLInputElement.readOnly](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/readOnly) - readOnly property
- [Stack Overflow: Why does contenteditable false not work?](https://stackoverflow.com/questions/78133863/why-does-contenteditable-false-not-work) - contenteditable="false" issues
- [MDN: aria-readonly](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-readonly) - ARIA readonly attribute
