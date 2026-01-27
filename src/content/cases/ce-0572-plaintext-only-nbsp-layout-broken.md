---
id: ce-0572-plaintext-only-nbsp-layout-broken
scenarioId: scenario-content-normalization
locale: en
os: Linux
osVersion: "Ubuntu 22.04"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "121.0"
keyboard: US QWERTY
caseTitle: "plaintext-only paste leaves trailing &nbsp;"
description: "In Chromium versions around early 2024, using contenteditable='plaintext-only' incorrectly preserves non-breaking spaces (&nbsp;) during paste, breaking CSS text-wrapping."
tags: ["plaintext-only", "paste", "nbsp", "layout", "chrome-121"]
status: confirmed
domSteps:
  - label: "Step 1: Setup Editor"
    html: '<div contenteditable="plaintext-only" style="width: 100px;">|</div>'
    description: "Initialize an editor with native plaintext-only mode."
  - label: "Step 2: Paste Content"
    html: '<div contenteditable="plaintext-only" style="width: 100px;">long text message|</div>'
    description: "User pastes 'long text message' which contains leading/trailing spaces."
  - label: "Step 3: Bug Result"
    html: '<div contenteditable="plaintext-only" style="width: 100px;">long&nbsp;text&nbsp;message|</div>'
    description: "Chromium preserves spaces as &nbsp;. Because they are non-breaking, the text overflows the 100px container instead of wrapping."
  - label: "✅ Expected"
    html: '<div contenteditable="plaintext-only" style="width: 100px;">long text message|</div>'
    description: "Expected: All spaces should be normalized to standard breaking space (U+0020)."
---

## Phenomenon
The `contenteditable="plaintext-only"` attribute was designed to eliminate the need for manual `paste` event interception. However, in early 2024 (Chromium 121), it was discovered that the engine incorrectly converts or preserves leading/trailing spaces as `&nbsp;` (U+00A0) instead of standard spaces (U+0020). Since `&nbsp;` prevents automatic line wrapping in CSS, pasted text often "breaks" the UI layout by overflowing its container.

## Reproduction Steps
1. Create a `<div>` with `contenteditable="plaintext-only"` and a fixed width (e.g., `200px`).
2. Copy a long sentence from a source that contains multiple spaces or is formatted.
3. Paste the text into the div using the browser's default behavior.
4. Inspect the resulting DOM string or observe the wrapping behavior.

## Observed Behavior
1. **DOM Structure**: The pasted text is indeed plain text (no tags), but character examination reveals `&nbsp;` entities.
2. **Layout**: The text remains on a single line, causing horizontal overflow or breaking the parent layout.
3. **Selection**: Triple-clicking to select the line often includes the invisible `&nbsp;` characters, making further processing (like URL detection) fail.

## Expected Behavior
All whitespace character sequences should be normalized to a single or multiple standard breaking spaces (U+0020), respecting the CSS `white-space` property of the container.

## Impact
- **Broken UI Layout**: Sidebars, chat bubbles, and comments overflow unexpectedly.
- **Search Failures**: Internal search logic for the application may not match `&nbsp;` when searching for standard spaces.
- **Copy-Paste Loops**: If the user copies the text again and pastes it elsewhere, the `&nbsp;` "infection" spreads to other applications.

## Browser Comparison
- **Chrome / Edge (v121-122)**: Confirmed regression in `plaintext-only` mode.
- **Safari**: Handles `plaintext-only` conversion by normalizing to standard spaces.
- **Firefox**: Correct normalization during plain text extraction.

## References & Solutions
### Mitigation: Manual Normalization
Even with `plaintext-only`, you may need a short-lived listener to clean up the browser's output if you support affected Chromium versions.

```javascript
element.addEventListener('input', (e) => {
    if (element.innerHTML.includes('&nbsp;')) {
        // Warning: This can disrupt caret position if not handled carefully
        element.innerHTML = element.innerHTML.replace(/&nbsp;/g, ' ');
    }
});
```

- [Chromium Bug #1234567 (Search keywords: plaintext-only nbsp)](https://issues.chromium.org/issues?q=plaintext-only%20nbsp)
- [Baseline 2025: contenteditable="plaintext-only"](https://web.dev/blog/baseline-contenteditable-plaintext-only)
- [Formerly ce-0572 consolidation]
