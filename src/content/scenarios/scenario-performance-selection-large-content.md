---
id: scenario-performance-selection-large-content
title: Selection performance in large contenteditable documents
description: "getSelection(), getRangeAt, and DOM walks over very large contenteditable trees can block the main thread when the user selects all or drags across thousands of nodes—mobile devices suffer first."
category: performance
tags:
  - performance
  - selection
  - large-document
  - mobile
status: draft
locale: en
---

`getSelection()`, `getRangeAt`, and DOM walks over **very large** `contenteditable` trees can **block the main thread** when the user selects all or drags across thousands of nodes—**mobile** devices suffer first.

## Related Cases

- [ce-0226](ce-0226-selection-performance-large)

## References

- [scenario-virtual-scrolling](scenario-virtual-scrolling)
