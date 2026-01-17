---
id: scenario-selection-range-accuracy
title: Selection range is incorrect when selecting across multiple elements
description: "When selecting text that spans across multiple HTML elements (e.g., p, div, span) in a contenteditable region, the selection range may not accurately reflect the visual selection. The Selection and Range APIs may return incorrect boundaries."
category: selection
tags:
  - selection
  - range
  - elements
  - edge
status: draft
locale: en
---

When selecting text that spans across multiple HTML elements (e.g., `<p>`, `<div>`, `<span>`) in a contenteditable region, the selection range may not accurately reflect the visual selection. The `Selection` and `Range` APIs may return incorrect boundaries.

## References

- [MDN: Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection/) - Official Selection API documentation
- [MDN: Range.commonAncestorContainer](https://developer.mozilla.org/en-US/docs/Web/API/Range/commonAncestorContainer) - Common ancestor container documentation
- [Stack Overflow: Highlight select multiple divs with ranges](https://stackoverflow.com/questions/4777860/highlight-select-multiple-divs-with-ranges-w-contenteditable) - Multi-element selection
- [Stack Overflow: Set cursor after span element](https://stackoverflow.com/questions/15813895/set-cursor-after-span-element-inside-contenteditable-div) - Offset normalization
- [MDN: Selection.rangeCount](https://developer.mozilla.org/en-US/docs/Web/API/Selection/rangeCount) - Multiple ranges support
- [Mozilla Groups: Selection behavior discussion](https://groups.google.com/a/mozilla.org/g/dev-platform/c/ZJf1XXzalmU/m/CT44iP7RAQAJ) - Firefox selection improvements
- [Medium: ContentEditable click event mystery](https://medium.com/%40tharunbalaji110/the-contenteditable-click-event-mystery-how-event-propagation-nearly-broke-our-text-editor-af386e8cd75c) - Range intersection issues
