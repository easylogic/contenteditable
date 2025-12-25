---
id: ce-0205
scenarioId: scenario-ime-composition-scroll
locale: en
os: Android
osVersion: "14.0"
device: Phone or Tablet
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Chinese (IME - Pinyin)
caseTitle: Chinese IME composition cancelled by scrolling on Android Chrome
description: "When composing Chinese text with Pinyin IME in a contenteditable element on Android Chrome, scrolling (touch scroll) cancels the active composition and loses incomplete character conversions. This is especially problematic on mobile devices where scrolling is common during text input."
tags:
  - composition
  - ime
  - scroll
  - mobile
  - chinese
  - android
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">nihao</span>'
    description: "Chinese Pinyin input in progress (nihao), candidate list displayed"
  - label: "After Scroll (Bug)"
    html: 'Hello '
    description: "Scroll cancels composition, incomplete character conversion lost"
  - label: "✅ Expected"
    html: 'Hello 你好'
    description: "Expected: Composition preserved during scroll or handled gracefully"
---

### Phenomenon

When composing Chinese text with Pinyin IME in a `contenteditable` element on Android Chrome, scrolling (touch scroll) cancels the active composition and loses incomplete character conversions. This is especially problematic on mobile devices where scrolling is common during text input.

### Reproduction example

1. Focus the editable area on an Android device.
2. Activate Chinese Pinyin IME.
3. Type Pinyin text (e.g., "nihao") and start character conversion.
4. Scroll the page (touch scroll) before completing the conversion.

### Observed behavior

- The compositionend event fires with incomplete data
- Incomplete character conversions are lost
- Scrolling cancels the composition
- Candidate list disappears
- No recovery mechanism for lost composition

### Expected behavior

- Composition should be preserved during scrolling
- Incomplete conversions should not be lost
- Scrolling should not interfere with composition
- IME UI should reposition correctly after scroll

### Browser Comparison

- **Android Chrome**: Scrolling cancels composition
- **iOS Safari**: Similar behavior
- **Desktop browsers**: May have different behavior

### Notes and possible direction for workarounds

- Prevent scroll during active composition (may degrade UX)
- Monitor scroll events and preserve composition state
- Handle touch scroll events carefully during composition
- Consider alternative UI patterns for mobile input

