---
id: ce-0175
scenarioId: scenario-ime-candidate-list-and-conversion-issues
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Japanese (IME)
caseTitle: Japanese IME kanji conversion candidate list positioning issues in Chrome
description: "When using Japanese IME in Chrome on Windows, the kanji conversion candidate list may appear in an incorrect position relative to the contenteditable element, or arrow key navigation within candidates may move the caret instead of navigating candidates."
tags:
  - ime
  - composition
  - japanese
  - kanji
  - candidate-list
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">かんじ</span>'
    description: "Japanese romaji input in progress (kanji → かんじ), candidate list displayed"
  - label: "After Arrow Keys (Bug)"
    html: 'Hello かんじ|'
    description: "Arrow key attempts candidate navigation, cursor moves causing candidate navigation to fail"
  - label: "✅ Expected"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">かんじ</span>'
    description: "Expected: Arrow key navigates candidates, cursor maintained"
---

### Phenomenon

When composing Japanese text with IME in a contenteditable element in Chrome on Windows, converting romaji to kanji involves displaying a candidate list. The candidate list may appear in an incorrect position, or arrow keys used to navigate candidates may move the caret in the contenteditable instead of navigating the candidate list.

### Reproduction example

1. Create a contenteditable div.
2. Switch to Japanese IME (Microsoft IME or Google Japanese Input).
3. Type romaji text (e.g., "kanji").
4. Press Space or Enter to trigger kanji conversion.
5. Observe the candidate list position and try navigating with arrow keys.

### Observed behavior

- Candidate list may appear far from the input position
- Arrow keys (Up/Down) may move the caret instead of navigating candidates
- Candidate list may disappear when clicking elsewhere
- Selected kanji may not be inserted correctly

### Expected behavior

- Candidate list should appear near the input position
- Arrow keys should navigate candidates without moving the caret
- Candidate selection should work reliably
- Selected kanji should be inserted correctly

### Impact

- Users cannot reliably convert romaji to kanji
- Workflow is disrupted when candidate selection fails
- Inconsistent behavior creates confusion

### Browser Comparison

- **Chrome**: Candidate list positioning can be inconsistent
- **Edge**: Similar to Chrome
- **Firefox**: May have different candidate list behavior
- **Safari**: Not applicable on Windows

### Notes and possible direction for workarounds

- Monitor composition events to detect when candidate list is active
- Prevent default arrow key behavior during candidate navigation
- Use IME-specific APIs if available to detect candidate list state
- Consider using a custom candidate list UI for better control

