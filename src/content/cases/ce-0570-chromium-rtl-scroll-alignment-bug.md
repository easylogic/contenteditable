---
id: ce-0570-chromium-rtl-scroll-alignment-bug
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

Historically, this is part of a broader inconsistency where `dir="rtl"` is sporadically ignored during dynamic DOM updates or when mixing LTR/RTL text.

## Reproduction Steps
1. Create a `<div>` with `contenteditable="true"`, `dir="rtl"`, and `overflow: auto; width: 200px;`.
2. Input a long string of RTL characters (e.g., Hebrew or Arabic) until it overflows.
3. Observe the behavior of the caret at the left boundary.
4. Programmatically toggle the `dir` attribute from `rtl` to `ltr` and back while editing.

## Observed Behavior
1. **Scrolling Failure**: The container does not automatically scroll to keep the caret visible as it moves leftward.
2. **Caret Misalignment**: The caret appears several pixels away from the character or disappears into "negative" scroll space.
3. **Dynamic Stall**: Changing the `dir` attribute on the fly (e.g., via JavaScript) often fails to re-render the BiDi layout immediately in Firefox and legacy Edge.
4. **Mixed Content Chaos**: Mixing LTR numbers within RTL text often results in "inverted selection" where dragging the mouse rightward selects text to the left.

## Impact
- **Unusable RTL Editors**: Users cannot see their active typing point in responsive containers.
- **Selection Corruption**: Drag-selecting RTL text produces "jagged" highlights.

## Browser Comparison
- **Chrome 124+**: Significant regressions in scrolling and caret placement calculations.
- **Safari**: Generally superior BiDi layout; handles mixed-direction selection most consistently.
- **Firefox**: Most reliable for RTL index mapping, but can suffer from "Dynamic Stall" where `dir` attribute changes require a manual `blur/focus` cycle to take effect.

## References & Solutions
### Mitigation: BiDi Normalization
Force a layout refresh when changing direction and use explicit `<span>` tags with `dir` for mixed-direction content.

```javascript
/* Force Layout Refresh */
function setDirection(element, dir) {
    element.dir = dir;
    // Trick to force BiDi recalculation in Firefox/Chrome
    const display = element.style.display;
    element.style.display = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.display = display;
}
```

- [Chromium Issue #333630733](https://issues.chromium.org/issues/333630733)
- [W3C I18N: RTL Editing challenges](https://www.w3.org/International/questions/qa-html-dir)
- [Formerly ce-0060 and ce-0556]
