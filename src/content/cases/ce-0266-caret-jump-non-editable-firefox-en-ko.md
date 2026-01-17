---
id: ce-0266-caret-jump-non-editable-firefox-en-ko
scenarioId: scenario-caret-jump-non-editable
locale: ko
os: macOS
osVersion: "13+"
device: Desktop (Mac)
deviceVersion: Any
browser: Firefox
browserVersion: "120+"
keyboard: English (QWERTY)
caseTitle: Caret stays in correct position when deleting next to non-editable in Firefox
description: "In Firefox, when deleting the last character before a non-editable element (contenteditable=false) in a contenteditable div, the caret correctly stays adjacent to the remaining content instead of jumping to the end. This serves as a control case demonstrating the issue is Chrome-specific."
tags:
  - caret
  - cursor
  - non-editable
  - firefox
  - delete
  - working-correctly
status: confirmed
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; display: inline-block;">
    Hello
    <span contenteditable="false" style="background: #fef08a; padding: 2px 8px; border-radius: 4px; margin: 0 4px;">
      @user
    </span>
    again
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true">Hello<span contenteditable="false">@user</span> again</div>'
    description: "Text + non-editable '@user' tag"
  - label: "Step 1: Delete 'a' character"
    html: '<div contenteditable="true">Hello<span contenteditable="false">@user</span> aga|in</div>'
    description: "✅ Correct: Caret stays next to '@user' tag"
  - label: "Observation"
    html: '<div contenteditable="true">Hello<span contenteditable="false">@user</span> aga|in</div>'
    description: "Expected: Caret remains adjacent to non-editable element"
---

## 현상

In Firefox, when deleting the last character before a non-editable element in a contenteditable div, the caret correctly stays adjacent to the remaining content instead of jumping to the end.

## 재현 예시

1. Focus on contenteditable element.
2. Text contains non-editable element (e.g., "Hello @user again").
3. Delete character just before the non-editable element (Backspace or Delete key).

## 관찰된 동작

- **Correct behavior**: Caret stays adjacent to the non-editable element
- **No jumping**: Caret doesn't jump to end of editor
- **User can continue typing**: Can immediately type next character
- **Works correctly**: Firefox handles deletion properly

## 참고사항

This is a **control case** demonstrating that the issue is Chrome-specific and Firefox works correctly.
