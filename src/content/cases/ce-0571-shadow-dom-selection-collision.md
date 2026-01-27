---
id: ce-0571-shadow-dom-selection-collision
scenarioId: scenario-contenteditable-shadow-dom
locale: en
os: macOS
osVersion: "14.6"
device: Desktop
deviceVersion: Any
browser: All Browsers
browserVersion: "Latest (2024)"
keyboard: US QWERTY
caseTitle: "Multiple selections collision in Shadow DOM"
description: "Placing contenteditable inside Shadow DOM causes the Selection API to behave inconsistently, often resulting in 'ghost selections' where the document and shadow root report different ranges."
tags: ["shadow-dom", "selection", "api-collision", "isolation"]
status: confirmed
domSteps:
  - label: "Step 1: Shadow Root Setup"
    html: '<div id="host">#shadow-root <div contenteditable="true">Text in Shadow</div></div>'
    description: "An editor is encapsulated inside a Shadow Root via Web Components."
  - label: "Step 2: External Selection"
    html: '<span>Document Text</span> <div id="host">#shadow-root ...</div>'
    description: "User selects text outside the shadow host."
  - label: "Step 3: Shadow Selection (Bug)"
    html: '<span>Document Text</span> <div id="host">#shadow-root <div contenteditable="true">[Text in Shadow]</div></div>'
    description: "User clicks inside the shadow editor. Some browsers maintain the external selection visually or logically, while `window.getSelection()` returns a 'cleared' or 're-targeted' range that does not match the actual caret."
  - label: "✅ Expected"
    html: '<span>Document Text</span> <div id="host">#shadow-root <div contenteditable="true">[Text in Shadow]</div></div>'
    description: "Expected: window.getSelection() should correctly reflect the range within the shadow root, or the browser should provide a unified Selection proxy."
---

## Phenomenon
The Web Selection API was designed for a single-selection-per-document model. When `contenteditable` is placed inside a Shadow Root, this model breaks. In many browsers (discussed heavily in 2024), the global `window.getSelection()` fails to deep-dive into the shadow tree, returning either the shadow host itself or a null range. Conversely, `shadowRoot.getSelection()` (where available) may report a range that the global document remains unaware of, leading to "Double Selection" UI or command execution failures.

Historically, this has also rendered `document.execCommand` ineffective, as it targets the Light DOM selection which may be stuck at the shadow host boundary.

## Reproduction Steps
1. Create a Custom Element with a Shadow Root.
2. Inside the Shadow Root, append a `div` with `contenteditable="true"`.
3. Add some text outside the Custom Element.
4. Select the external text.
5. Click inside the shadow-based editor and start typing.
6. Check `window.getSelection()` vs `this.shadowRoot.getSelection()`.
7. Attempt to run `document.execCommand('bold')`.

## Observed Behavior
1. **Selection Collision**: The blue highlight from the external text may persist even though the caret is active inside the shadow root.
2. **API Inconsistency**:
   - `window.getSelection()`: Often returns the `#host` element as the `startContainer` with an offset of 0, hiding the internal range.
   - `document.activeElement`: Correctly identifies the `#host`, but cannot reach the internal text node.
3. **Command Failure**: Calling `document.execCommand('bold')` fails because the global selection doesn't "see" the text node inside the shadow root.

## Expected Behavior
The Selection API should provide a consistent path to the deepest active range, or browsers should automatically "forward" selection intent from the shadow root to the global document.

## Impact
- **Framework Blindness**: Modern editors (Lexical, Slate) that rely on `window.getSelection()` to find the caret position will throw errors or misplace nodes when used inside Web Components.
- **Accessibility**: Screen readers may remain stuck on the selection outside the shadow root.
- **Broken Features**: Built-in browser features like "Search in Page" or "Print Selection" often ignore content inside shadow-based `contenteditable` regions.

## Browser Comparison
- **Chrome/Edge**: Most advanced in supporting `shadowRoot.getSelection()`, but still exhibits global synchronization issues.
- **Safari**: Historically inconsistent; `window.getSelection()` often becomes entirely unreliable when cross-boundary clicks occur.
- **Firefox**: Most restrictive; has long-running bugs regarding selection crossing shadow boundaries.

## References & Solutions
### Mitigation: Selection Proxying
Capture selection changes inside the shadow root and manually sync them or use a proxy object for your editor.

```javascript
/* Re-routing Selection Logic */
this.shadowRoot.addEventListener('selectionchange', () => {
    const internalSel = this.shadowRoot.getSelection();
    if (internalSel.rangeCount > 0) {
        // Manual sync logic for your framework
        editor.updateSelection(internalSel.getRangeAt(0));
    }
});

/* Proxying execCommand */
function runCommand(cmd, value) {
   // Instead of document.execCommand, target the shadow root node
   document.execCommand(cmd, false, value); // Often fails
   // Preferred: use manual DOM transformation via the model
}
```

- [W3C Issue: Selection API and Shadow DOM](https://github.com/w3c/selection-api/issues/173)
- [Stack Overflow: Get selection in Shadow DOM](https://stackoverflow.com/questions/43171542/get-selection-inside-of-a-shadow-dom)
- [Formerly ce-0051 and ce-0308]
