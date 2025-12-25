---
id: ce-0199
scenarioId: scenario-ime-backspace-granularity
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Thai (IME)
caseTitle: Thai IME Backspace removes entire character with combining marks
description: "When editing Thai text with IME in a contenteditable element, pressing Backspace removes the entire character including tone marks and vowel marks instead of allowing component-level editing. This makes fine-grained correction difficult."
tags:
  - composition
  - ime
  - backspace
  - thai
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello สวัสดี'
    description: "태국어 텍스트 입력 완료 (톤 마크와 모음 마크 포함)"
  - label: "After Backspace (Bug)"
    html: 'Hello '
    description: "전체 문자 'สวัสดี' 삭제됨 (한 번의 Backspace)"
  - label: "✅ Expected"
    html: 'Hello สวัส'
    description: "정상: 한 글자씩 삭제 (첫 번째 Backspace로 'ดี'만 삭제)"
---

### Phenomenon

When editing Thai text with IME in a `contenteditable` element, pressing Backspace removes the entire character including tone marks and vowel marks instead of allowing component-level editing. This makes fine-grained correction difficult and differs from native input fields.

### Reproduction example

1. Focus the editable area.
2. Activate Thai IME.
3. Type a Thai character with tone marks and vowel marks (e.g., "สวัสดี").
4. Press Backspace once.

### Observed behavior

- The entire character with all combining marks is removed by a single Backspace press
- Component-level editing (e.g., editing just the tone mark) is not possible
- The event log shows only one `beforeinput` / `input` pair for the deletion
- Behavior differs from native input fields

### Expected behavior

- Each Backspace press should allow more granular deletion, matching how native inputs behave
- Component-level editing should be possible
- Behavior should be consistent with native input fields

### Browser Comparison

- **Chrome**: May remove entire characters with combining marks
- **Edge**: Similar to Chrome
- **Firefox**: May have different granularity behavior
- **Safari**: Not applicable on Windows

### Notes and possible direction for workarounds

- Compare behavior with a plain `<input>` element in the same environment to confirm the difference
- This behavior can affect cursor movement, undo granularity, and diff calculation
- Consider implementing custom backspace handling for finer control with combining characters

