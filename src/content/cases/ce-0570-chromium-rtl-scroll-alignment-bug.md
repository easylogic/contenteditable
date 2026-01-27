---
id: ce-0570
scenarioId: scenario-rtl-text-direction-inconsistent
locale: en
os: Windows
osVersion: "11"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "124.0"
keyboard: Arabic/Hebrew (RTL)
caseTitle: "RTL scrolling and caret misalignment in contenteditable"
description: "In Chromium 124+, right-to-left (RTL) text inside a contenteditable region causes the caret to be misplaced beyond text boundaries and breaks automatic scrolling."
tags: ["rtl", "layout", "chrome-124", "caret", "scrolling"]
status: confirmed
domSteps:
  - label: "Step 1: RTL Text Entry"
    html: '<div contenteditable="true" dir="rtl" style="overflow: auto;">שלום עולם</div>'
    description: "User types RTL text (Hebrew/Arabic). The text flows from right to left."
  - label: "Step 2: Continuous Typing"
    html: '<div contenteditable="true" dir="rtl" style="overflow: auto; width: 50px;">...שלום עולם|</div>'
    description: "As text exceeds container width, automatic scroll to caret fails, and the caret 'detaches' from the text end."
  - label: "Step 3: Bug Result"
    html: '<div contenteditable="true" dir="rtl">...שלום| עולם</div>'
    description: "The visual caret appears in the middle of a word or far to the left of the actual logical insertion point."
  - label: "✅ Expected"
    html: '<div contenteditable="true" dir="rtl">|שלום עולם...</div>'
    description: "Expected: Scrolling should keep the caret visible at the left-most (end) edge, and caret position should match the text node offset."
---

## Phenomenon
A layout engine regression in Blink (reported April 2024) specifically affects RTL (Right-to-Left) languages within scrolling `contenteditable` containers. When text overflows the horizontal bounds, the browser fails to correctly calculate the `scrollLeft` offset to keep the caret in view. Furthermore, the "Visual to Logical" mapping breaks, causing the blinking bar to appear at incorrect pixel coordinates relative to the characters.

## Reproduction Steps
1. Create a `<div>` with `contenteditable="true"`, `dir="rtl"`, and `overflow: auto; width: 200px;`.
2. Input a long string of RTL characters (e.g., Hebrew or Arabic) until it wraps or overflows horizontally.
3. Observe the behavior of the caret as it reaches the left boundary (the end of the flow for RTL).
4. Try to click in the middle of the text to reposition the caret.

## Observed Behavior
1. **Scrolling Failure**: The container does not automatically scroll to keep the caret visible as it moves leftward.
2. **Caret Misalignment**: In some cases, the caret appears several pixels away from the character it belongs to, or disappears entirely if it moves into the "negative" scroll area incorrectly.
3. **Pasting Error**: Pasting RTL text into an existing RTL block often inserts the content at the wrong logical index.

## Expected Behavior
The browser should calculate caret coordinates based on the `dir` attribute and the computed BiDi (Bidirectional) layout, ensuring `scrollIntoView()` logic works correctly for the "left" edge (which is the trailing edge in RTL).

## Impact
- **Unusable RTL Editors**: Users cannot see what they are typing in narrow containers (like sidebars or comment boxes).
- **Selection Corruption**: Dragging to select RTL text results in "jagged" or inverted selections that do not match the mouse movement.

## Browser Comparison
- **Chrome 124+**: Significant scrolling and caret placement regressions reported.
- **Safari**: Handles RTL scrolling correctly; better BiDi layout consistency.
- **Firefox**: Most stable for RTL; correctly maps visual offsets to logical indices.

## References & Solutions
### Mitigation: scrollIntoView Polyfill
Manually trigger scrolling based on the selection coordinates if the browser fails to do so.

```javascript
element.addEventListener('input', () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = element.getBoundingClientRect();
    
    if (rect.left < containerRect.left) {
        // Force scroll for RTL end edge
        element.scrollLeft += (rect.left - containerRect.left) - 10;
    }
});
```

- [Chromium Issue #333630733: RTL scrolling broken in contenteditable](https://issues.chromium.org/issues/333630733)
- [W3C I18N: RTL Editing challenges](https://www.w3.org/International/questions/qa-html-dir)
