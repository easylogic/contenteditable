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

## Observed Behavior
- In Edge/Chrome, the selection range boundaries may not match the visual selection.
- The `Range.startOffset` and `Range.endOffset` may be incorrect when spanning element boundaries.

## Reproduction Steps
1. Create a contenteditable div with nested elements: `<p>First</p><p>Second</p>`.
2. Select text that spans from the middle of the first paragraph to the middle of the second paragraph.
3. Use JavaScript to inspect the `Selection` object.
4. Observe that reported positions mismatch the visual highlight.

## Related Cases
- [ce-0033: multi-element selection mismatch](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0033-selection-range-incorrect.md)

## References

- [MDN: Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection/) - Official Selection API documentation
- [MDN: Range.commonAncestorContainer](https://developer.mozilla.org/en-US/docs/Web/API/Range/commonAncestorContainer) - Common ancestor container documentation
- [Stack Overflow: Highlight select multiple divs with ranges](https://stackoverflow.com/questions/4777860/highlight-select-multiple-divs-with-ranges-w-contenteditable) - Multi-element selection
- [Stack Overflow: Set cursor after span element](https://stackoverflow.com/questions/15813895/set-cursor-after-span-element-inside-contenteditable-div) - Offset normalization
- [MDN: Selection.rangeCount](https://developer.mozilla.org/en-US/docs/Web/API/Selection/rangeCount) - Multiple ranges support
- [Mozilla Groups: Selection behavior discussion](https://groups.google.com/a/mozilla.org/g/dev-platform/c/ZJf1XXzalmU/m/CT44iP7RAQAJ) - Firefox selection improvements
- [Medium: ContentEditable click event mystery](https://medium.com/%40tharunbalaji110/the-contenteditable-click-event-mystery-how-event-propagation-nearly-broke-our-text-editor-af386e8cd75c) - Range intersection issues
