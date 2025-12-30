---
id: ce-0207
scenarioId: scenario-ime-rtl-and-character-joining
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: Hebrew (IME)
caseTitle: Hebrew IME RTL text direction and character composition issues
description: "When composing Hebrew text with IME in a contenteditable element, RTL text direction may not be handled correctly, and Hebrew characters may not compose properly. Character joining and text direction can be problematic."
tags:
  - ime
  - composition
  - rtl
  - text-direction
  - hebrew
  - firefox
  - windows
status: draft
domSteps:
  - label: "Before"
    html: '<span dir="rtl">Hello <span style="text-decoration: underline; background: #fef08a;">של</span></span>'
    description: "Hebrew composition in progress (שלום), RTL direction"
  - label: "After (Bug)"
    html: '<span dir="rtl">Hello של</span>'
    description: "RTL direction error or character composition failed"
  - label: "✅ Expected"
    html: '<span dir="rtl">Hello שלום</span>'
    description: "Expected: RTL direction and character composition work correctly"
---
---

## Phenomenon

When composing Hebrew text with IME in a `contenteditable` element, RTL text direction may not be handled correctly, and Hebrew characters may not compose properly. Character joining and text direction can be problematic.

## Reproduction example

1. Focus the editable area.
2. Set direction to RTL or use auto direction.
3. Activate Hebrew IME.
4. Type Hebrew text (e.g., "שלום").
5. Observe RTL direction and character composition.

## Observed behavior

- RTL text direction may not be handled correctly
- Hebrew characters may not compose properly
- Text may display left-to-right instead of right-to-left
- Caret movement may be incorrect in RTL context

## Expected behavior

- RTL text direction should be handled correctly
- Hebrew characters should compose properly
- Text should display right-to-left correctly
- Caret should move correctly in RTL context

## Browser Comparison

- **Firefox**: May have issues with Hebrew RTL and composition
- **Chrome**: Generally better RTL support
- **Edge**: Similar to Chrome
- **Safari**: Not applicable on Windows

## Notes and possible direction for workarounds

- Ensure proper RTL direction is set (dir="rtl")
- Monitor for Hebrew text and set direction automatically
- Handle mixed-direction text carefully
- Use Unicode bidirectional algorithm (bidi) for complex cases

