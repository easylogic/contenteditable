---
id: scenario-selection-range-accuracy-ko
title: 여러 요소에 걸쳐 선택할 때 선택 범위가 부정확함
description: "contenteditable 영역에서 여러 HTML 요소(예: p, div, span)에 걸쳐 텍스트를 선택할 때 선택 범위가 시각적 선택을 정확히 반영하지 않을 수 있습니다. Selection 및 Range API가 잘못된 경계를 반환할 수 있습니다."
category: selection
tags:
  - selection
  - range
  - elements
  - edge
status: draft
locale: ko
---

contenteditable 영역에서 여러 HTML 요소(예: `<p>`, `<div>`, `<span>`)에 걸쳐 텍스트를 선택할 때 선택 범위가 시각적 선택을 정확히 반영하지 않을 수 있습니다. `Selection` 및 `Range` API가 잘못된 경계를 반환할 수 있습니다.

## 참고 자료

- [MDN: Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection/) - Official Selection API documentation
- [MDN: Range.commonAncestorContainer](https://developer.mozilla.org/en-US/docs/Web/API/Range/commonAncestorContainer) - Common ancestor container documentation
- [Stack Overflow: Highlight select multiple divs with ranges](https://stackoverflow.com/questions/4777860/highlight-select-multiple-divs-with-ranges-w-contenteditable) - Multi-element selection
- [Stack Overflow: Set cursor after span element](https://stackoverflow.com/questions/15813895/set-cursor-after-span-element-inside-contenteditable-div) - Offset normalization
- [MDN: Selection.rangeCount](https://developer.mozilla.org/en-US/docs/Web/API/Selection/rangeCount) - Multiple ranges support
- [Mozilla Groups: Selection behavior discussion](https://groups.google.com/a/mozilla.org/g/dev-platform/c/ZJf1XXzalmU/m/CT44iP7RAQAJ) - Firefox selection improvements
- [Medium: ContentEditable click event mystery](https://medium.com/%40tharunbalaji110/the-contenteditable-click-event-mystery-how-event-propagation-nearly-broke-our-text-editor-af386e8cd75c) - Range intersection issues
