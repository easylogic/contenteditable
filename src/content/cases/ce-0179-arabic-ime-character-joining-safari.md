---
id: ce-0179
scenarioId: scenario-ime-rtl-and-character-joining
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: Arabic (IME)
caseTitle: Arabic IME character joining and RTL direction issues in Safari
description: "When using Arabic IME in Safari on macOS, Arabic letters may not join correctly, appearing as separate disconnected characters. RTL text direction may also not be handled correctly, and caret movement may be incorrect."
tags:
  - ime
  - composition
  - arabic
  - rtl
  - text-direction
  - character-joining
  - safari
  - macos
status: draft
domSteps:
  - label: "Before"
    html: '<span dir="rtl">Hello <span style="text-decoration: underline; background: #fef08a;">مرح</span></span>'
    description: "Arabic composition in progress (مرح), RTL direction"
  - label: "After (Bug)"
    html: '<span dir="rtl">Hello م ر ح</span>'
    description: "Character joining failed, separated into individual characters"
  - label: "✅ Expected"
    html: '<span dir="rtl">Hello مرحبا</span>'
    description: "Expected: Characters correctly joined (مرحبا)"
---

### Phenomenon

When composing Arabic text with IME in a contenteditable element in Safari on macOS, Arabic letters may not join correctly based on their context, appearing as separate disconnected characters instead of forming connected words. RTL (right-to-left) text direction may also not be handled correctly, and caret movement may be incorrect in RTL context.

### Reproduction example

1. Create a contenteditable div.
2. Set direction to RTL or use auto direction.
3. Switch to Arabic IME.
4. Type Arabic text (e.g., "مرحبا").
5. Observe character joining and text direction.

### Observed behavior

- Arabic letters may not join correctly, appearing disconnected
- Text may display left-to-right instead of right-to-left
- Caret may move incorrectly in RTL text
- Text selection may not work correctly in RTL context
- Mixed Arabic and Latin text may have incorrect direction handling

### Expected behavior

- Arabic letters should join contextually based on their position
- Text should display right-to-left correctly
- Caret should move correctly in RTL context
- Text selection should work correctly in RTL
- Mixed-direction text should handle direction correctly

### Impact

- Arabic text may be unreadable or difficult to read
- Users cannot reliably input correct Arabic text
- Mixed-direction text (Arabic + English) may display incorrectly

### Browser Comparison

- **Safari**: RTL and character joining can be inconsistent, especially on macOS
- **Chrome**: Generally better RTL support, but character joining can still fail
- **Firefox**: RTL support is good, but some edge cases exist

### Notes and possible direction for workarounds

- Ensure proper RTL direction is set (dir="rtl")
- Monitor for Arabic text and set direction automatically
- Validate character joining after composition
- Handle mixed-direction text carefully
- Use Unicode bidirectional algorithm (bidi) for complex cases
- Check text direction with getComputedStyle

