---
id: scenario-memory-leak-prevention
title: Memory growth in long-running contenteditable sessions
description: "Large documents, retained DOM references, MutationObserver chains, and undo stacks can leak memory if not detached—especially in single-page apps that keep the editor mounted for hours."
category: performance
tags:
  - memory
  - performance
  - observer
  - spa
status: draft
locale: en
---

**Large documents**, retained DOM references, **MutationObserver** chains, and **undo stacks** can **leak memory** if not detached—especially in **single-page apps** that keep the editor mounted for hours.

## Related Cases

- [ce-0225](ce-0225-memory-leak-large-docs)

## References

- [scenario-performance-large-content](scenario-performance-large-content)
