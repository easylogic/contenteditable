---
id: ce-0030-backspace-composition-chrome
scenarioId: scenario-ime-backspace-granularity
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Japanese IME
caseTitle: Backspace removes a whole composed syllable instead of a single character
description: "When using a Japanese IME in Chrome on macOS, pressing Backspace during composition removes the entire composed syllable (hiragana/katakana) instead of removing individual characters one at a time."
tags:
  - ime
  - backspace
  - composition
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">こんに</span>'
    description: "Japanese composition in progress (こんに), hiragana syllable composition"
  - label: "After Backspace (Bug)"
    html: 'Hello '
    description: "Backspace deletes entire syllable 'こんに' (single Backspace)"
  - label: "✅ Expected"
    html: 'Hello こん'
    description: "Expected: Delete one character at a time (first Backspace deletes only 'に')"
---

## Phenomenon

When using a Japanese IME in Chrome on macOS, pressing Backspace during composition removes the entire composed syllable (hiragana/katakana) instead of removing individual characters one at a time.

## Reproduction example

1. Create a contenteditable div.
2. Switch to Japanese IME.
3. Start typing Japanese characters (e.g., "こんにちは").
4. While the composition is active, press Backspace.

## Observed behavior

- In Chrome on macOS with Japanese IME, Backspace removes the entire composed syllable.
- Individual characters within the syllable cannot be deleted one at a time.
- The granularity of deletion is coarser than expected.

## Expected behavior

- Backspace should remove characters one at a time, even during composition.
- Or, the deletion granularity should be consistent and predictable.
- Users should have fine control over text deletion.

