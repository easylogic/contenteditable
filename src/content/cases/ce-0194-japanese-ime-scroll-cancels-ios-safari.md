---
id: ce-0194
scenarioId: scenario-ime-composition-scroll
locale: en
os: iOS
osVersion: "17.0"
device: iPhone or iPad
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: Japanese (IME)
caseTitle: Japanese IME composition cancelled by scrolling on iOS Safari
description: "When composing Japanese text with IME in a contenteditable element on iOS Safari, scrolling (touch scroll) cancels the active composition and loses incomplete kanji conversions. This is especially problematic on mobile devices where scrolling is common during text input."
tags:
  - composition
  - ime
  - scroll
  - mobile
  - japanese
  - ios
  - safari
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">かんじ</span>'
    description: "Japanese romaji input in progress, candidate list displayed"
  - label: "After Scroll (Bug)"
    html: 'Hello '
    description: "Scroll cancels composition, incomplete character conversion lost"
  - label: "✅ Expected"
    html: 'Hello かんじ'
    description: "Expected: Composition preserved during scroll or handled gracefully"
---

## Phenomenon

When composing Japanese text with IME in a `contenteditable` element on iOS Safari, scrolling (touch scroll) cancels the active composition and loses incomplete kanji conversions. This is especially problematic on mobile devices where scrolling is common during text input.

## Reproduction example

1. Focus the editable area on an iOS device.
2. Activate Japanese IME.
3. Type romaji text (e.g., "kanji") and start kanji conversion.
4. Scroll the page (touch scroll) before completing the conversion.

## Observed behavior

- The compositionend event fires with incomplete data
- Incomplete kanji conversions are lost
- Scrolling cancels the composition
- Candidate list disappears
- No recovery mechanism for lost composition

## Expected behavior

- Composition should be preserved during scrolling
- Incomplete conversions should not be lost
- Scrolling should not interfere with composition
- IME UI should reposition correctly after scroll

## Browser Comparison

- **iOS Safari**: Scrolling cancels composition
- **Chrome on iOS**: May have different scroll behavior
- **Desktop browsers**: May have different behavior

## Notes and possible direction for workarounds

- Prevent scroll during active composition (may degrade UX)
- Monitor scroll events and preserve composition state
- Handle touch scroll events carefully during composition
- Consider alternative UI patterns for mobile input

