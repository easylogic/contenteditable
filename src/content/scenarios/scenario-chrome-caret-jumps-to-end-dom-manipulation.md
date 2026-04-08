---
id: scenario-chrome-caret-jumps-to-end-dom-manipulation
title: Caret jumps to end after DOM manipulation in Chrome
description: "In Chromium, programmatic DOM updates (normalization, wrapping, React reconciliation) while the user is typing can move the caret to the end of the contenteditable or to an unexpected boundary—especially when the mutation happens between keystrokes."
category: input
tags:
  - chrome
  - caret
  - dom
  - react
  - contenteditable
status: draft
locale: en
---

In **Chromium**, programmatic **DOM updates** (normalization, wrapping, React reconciliation) while the user is typing can move the **caret to the end** of the `contenteditable` or to an unexpected **boundary**—especially when the mutation happens between keystrokes.

## Related Cases

- [ce-0317](ce-0317-chrome-caret-jumps-to-end-dom-manipulation)

## References

- [scenario-react-caret-jumps-on-rerender](scenario-react-caret-jumps-on-rerender)
