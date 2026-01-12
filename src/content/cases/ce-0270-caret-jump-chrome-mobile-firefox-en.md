---
id: ce-0270
scenarioId: scenario-caret-jump-chrome-mobile
locale: en
os: Windows
osVersion: "10/11"
device: Desktop
deviceVersion: Any
browser: Firefox
browserVersion: "120+"
keyboard: English (QWERTY)
caseTitle: Firefox Desktop does not have caret jump issue
description: "In Firefox Desktop, typing punctuation characters in the middle of a word works correctly and the caret stays at the insertion point. This serves as a control case demonstrating that the issue is Chrome Mobile-specific."
tags:
  - caret
  - cursor
  - firefox
  - desktop
  - punctuation
  - working-correctly
status: confirmed
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; font-size: 18px;">
    Type a word here: California
    <br><br>
    Try typing punctuation in the middle: comma (,), colon (:), semicolon (;), exclamation (!), question (?), quote ("), ampersand (&)
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true">California</div>'
    description: "Word entered"
  - label: "Step 1: Type comma in middle (after 'Califor')"
    html: '<div contenteditable="true">Califor|nia</div>'
    description: "✅ Correct: Caret stays after comma at insertion point"
  - label: "Observation"
    html: '<div contenteditable="true">Califor|nia</div>'
    description: "Expected: Caret remains at insertion point"
---

## 현상

In Firefox Desktop, typing punctuation characters in the middle of a word works correctly and the caret stays at the insertion point instead of jumping to the end.

## 재현 예시

1. Focus on contenteditable element on Firefox Desktop.
2. Type a word (e.g., "California").
3. Move cursor to middle of word (e.g., after "Califor", before "nia").
4. Type comma (,).

## 관찰된 동작

- **Correct behavior**: Caret stays after comma at insertion point
- **No jumping**: Caret doesn't jump to end of word
- **User can continue typing**: Can immediately type next character
- **Works correctly**: Firefox handles punctuation input properly

## 참고사항

This is a **control case** demonstrating that the issue is Chrome Mobile-specific and Firefox Desktop works correctly.
