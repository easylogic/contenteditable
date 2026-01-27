---
id: scenario-performance-foundations
title: "Performance Foundations: Complexity, Memory, and Thrashing"
description: "Managing exponential slowdowns in large documents and browser-specific engine thrashing."
category: "performance"
tags: ["performance", "large-content", "memory-leak", "safari-18", "complex-css"]
status: "confirmed"
locale: "en"
---

## Overview
Contenteditable editors degrade exponentially as content grows. Scaling to 10k+ characters requires moving away from native DOM traversal towards structured indexing and virtualization.

## Technical Bottlenecks

### 1. CSS RuleSet Invalidation (2025 Regression)
Mobile Safari 18.6 exhibits $O(n^2)$ complexity when joining RuleSets for attribute selectors.
- **Result**: Typing inside an editor that triggers class changes (e.g., for syntax highlighting) can hang the UI for seconds on pages with large stylesheets.

### 2. Selection API Exponential Lag
Operations like `window.getSelection().addRange()` become progressively slower as the DOM depth increases. 
- **Cause**: The engine performs linear node searches to resolve offsets for every selection change.

### 3. Memory Leaks in Detached Nodes
Pasting large blocks or performing rapid UNDO operations can leave thousands of detached nodes in memory if event listeners aren't strictly managed.

## Optimization Blueprint

### Structured Indexing
Maintain a flat array of 'text node' metadata to perform O(1) character-to-node lookups, bypassing expensive TreeWalkers.

### Rule Flattening
Avoid complex attribute selectors like `[class*="editor-"]` globally. Use unique class names to prevent the $O(n^2)$ invalidation path in WebKit.

## Related Cases
- [ce-0578: Safari 18.6 performance ruleset regression](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0578-safari-performance-ruleset-regression.md)
- [ce-0026: Performance with large content](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0026-performance-large-content.md)
- [ce-0225: Memory leak in large documents](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0225-memory-leak-large-docs.md)
