---
id: scenario-accessibility-screen-reader-role-textbox
title: role="textbox" and screen reader behavior with contenteditable
description: "Assistive technologies map contenteditable to textbox-like semantics when authors use role=textbox or aria-multiline—conflicts with actual HTML semantics and browser AX trees can confuse announcements."
category: accessibility
tags:
  - a11y
  - aria
  - screen-reader
  - contenteditable
status: draft
locale: en
---

Assistive technologies map `contenteditable` to **textbox-like** semantics when authors use **`role="textbox"`** or **`aria-multiline`**—conflicts with actual HTML semantics and browser **AX** trees can confuse announcements.

## Related Cases

- [ce-0323](ce-0323-accessibility-screen-reader-role-textbox)

## References

- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
