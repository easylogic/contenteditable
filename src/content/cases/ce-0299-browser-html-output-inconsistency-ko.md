---
id: ce-0299-browser-html-output-inconsistency-ko
scenarioId: scenario-browser-html-output-inconsistency
locale: ko
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: Latest
keyboard: US
caseTitle: Browser generates inconsistent HTML output for same editing actions
description: "Different browsers generate varying HTML structures for the same editing actions. For instance, applying bold and italic formatting can result in multiple HTML representations, complicating content consistency."
tags:
  - html-output
  - formatting
  - cross-browser
  - bold
  - italic
status: draft
---

## Phenomenon

Different browsers generate varying HTML structures for the same editing actions. For instance, applying bold and italic formatting can result in multiple HTML representations, complicating content consistency and collaborative editing.

## Reproduction example

1. Create a contenteditable div with some text.
2. Select text and apply bold formatting (Ctrl+B or Cmd+B).
3. Apply italic formatting to the same text (Ctrl+I or Cmd+I).
4. Inspect the generated HTML structure.
5. Repeat the same actions in different browsers (Chrome, Firefox, Safari, Edge).

## Observed behavior

- **Chrome**: May generate `<strong><em>text</em></strong>` or `<b><i>text</i></b>` depending on context.
- **Firefox**: May generate `<em><strong>text</strong></em>` (different nesting order).
- **Safari**: May use `<span>` tags with inline styles instead of semantic tags.
- **Edge**: Behavior may vary between Chromium-based and legacy versions.
- The same formatting action produces different HTML structures across browsers.
- This inconsistency makes it difficult to maintain consistent content structure.

## Expected behavior

- All browsers should generate semantically equivalent HTML for the same formatting actions.
- The nesting order of formatting tags should be consistent.
- Browsers should prefer semantic tags (`<strong>`, `<em>`) over presentational tags (`<b>`, `<i>`).
- HTML output should be predictable and consistent across browsers.

## Analysis

This inconsistency stems from each browser implementing its own contenteditable rendering engine. The HTML5 specification does not mandate a specific HTML structure for formatting operations, leading to browser-specific implementations.

## Workarounds

- Normalize HTML output after editing operations.
- Use libraries like ProseMirror, Slate, or Lexical that abstract browser differences.
- Implement custom formatting handlers that generate consistent HTML.
- Sanitize and normalize content on the backend before storage.
