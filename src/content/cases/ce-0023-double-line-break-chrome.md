---
id: ce-0023-double-line-break-chrome
scenarioId: scenario-double-line-break
locale: en
os: ["macOS", "Linux", "Windows"]
osVersion: "Any"
device: Desktop
deviceVersion: Any
browser: ["Chrome", "Edge", "Opera"]
browserVersion: "Latest"
keyboard: US
caseTitle: Pressing Enter inserts two line breaks in contenteditable
description: "In Chromium-based browsers, pressing Enter in a contenteditable region can insert two line breaks (br elements) instead of one, causing unexpected spacing between paragraphs."
tags: ["line-break", "enter", "chromium", "double-br"]
status: confirmed
domSteps:
  - label: "Before"
    html: 'Hello'
    description: "First line"
  - label: "After Enter (Bug)"
    html: 'Hello<br><br>'
    description: "Single Enter inserts two &lt;br&gt; elements (Chromium macOS/Linux)"
  - label: "✅ Expected"
    html: 'Hello<br>'
    description: "Expected: Single Enter inserts only one line break"
---

## Phenomenon

When a user presses the `Enter` key in a `contenteditable` container, Chromium-based browsers (Chrome, Edge) sometimes insert two `<br>` elements instead of one. This behavior typically occurs when the browser attempts to ensure the new line is "visible" or when it mismanages the "default paragraph separator". This leads to a "double-spacing" effect that is difficult to manage in custom editors.

## Reproduction example

1. Create a `contenteditable` div with no initial content or a single line of text.
2. Type some text (e.g., "Hello").
3. Press the `Enter` key.
4. Inspect the DOM. In many cases, you will see `Hello<br><br>` if the editor is in a state that forces `<br>` usage.

## Observed behavior

- **Double <br> Insertion**: A single `keydown` for Enter results in two `<br>` tags being appended.
- **Mix of Div/Br**: Depending on the `defaultParagraphSeparator` setting, Chrome might wrap lines in `<div>` but still insert a `<br>` inside or between them, leading to inconsistent vertical spacing.
- **Platform Specificity**: This is particularly prevalent on macOS and Linux, where the default system line-ending expectations might conflict with Chrome's internal DOM conversion logic.

## Expected behavior

- Pressing Enter should insert exactly one logical line break.
- If `document.execCommand('defaultParagraphSeparator', false, 'p')` or `'div'` is set, it should consistently wrap the new block without stray `<br>` elements causing extra height.
- The visual result should match standard word processor behavior (single spacing unless specifically configured otherwise).

## Solution and Workarounds

1. **Manual Enter Handling**:
   - Intercept the `keydown` event for Enter (keyCode 13).
   - Use `event.preventDefault()` to stop the browser's default insertion.
   - Programmatically insert a single `<br>` using `document.execCommand('insertHTML', false, '<br>')` or by manually manipulating the text nodes and selection.
2. **Default Paragraph Separator**:
   - Set `document.execCommand('defaultParagraphSeparator', false, 'p')` globally when the editor initializes. This encourages Chrome to use `<p>` tags for new lines, which is generally more stable than raw `<br>` tags.
3. **Trailing Br Management**:
   - Some editors maintain a "padding" `<br>` at the end of every block to ensure the height is rendered correctly even if the block is empty. Ensure your logic accounts for this "magic" `<br>` so it doesn't get duplicated.

