---
id: ce-0186
scenarioId: scenario-ime-backspace-granularity
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: Chinese (IME - Pinyin)
caseTitle: Chinese IME Backspace removes entire character instead of component
description: "When editing Chinese text with Pinyin IME in a contenteditable element, pressing Backspace removes the entire character instead of allowing component-level editing. This makes fine-grained correction difficult and differs from native input fields."
tags:
  - composition
  - ime
  - backspace
  - chinese
  - safari
  - macos
status: draft
domSteps:
  - label: "Before"
    html: 'Hello 你好'
    description: "중국어 문자 입력 완료"
  - label: "After Backspace (Bug)"
    html: 'Hello '
    description: "전체 문자 '你好' 삭제됨 (한 번의 Backspace)"
  - label: "✅ Expected"
    html: 'Hello 你'
    description: "정상: 한 글자씩 삭제 (첫 번째 Backspace로 '好'만 삭제)"
---

### Phenomenon

When editing Chinese text with Pinyin IME in a `contenteditable` element, pressing Backspace removes the entire character instead of allowing component-level editing. This makes fine-grained correction difficult and differs from native input fields on the same platform.

### Reproduction example

1. Focus the editable area.
2. Activate Chinese Pinyin IME.
3. Type a Chinese character (e.g., "你好").
4. Press Backspace once.

### Observed behavior

- The entire character is removed by a single Backspace press
- Component-level editing (e.g., editing Pinyin components) is not possible
- The event log shows only one `beforeinput` / `input` pair for the deletion
- Behavior differs from native input fields

### Expected behavior

- Each Backspace press should allow more granular deletion, matching how native inputs behave
- Component-level editing should be possible
- Behavior should be consistent with native input fields

### Browser Comparison

- **Safari**: May remove entire characters instead of components, especially on macOS
- **Chrome**: May have different granularity behavior
- **Firefox**: May have different granularity behavior

### Notes and possible direction for workarounds

- Compare behavior with a plain `<input>` element in the same environment to confirm the difference
- This behavior can affect cursor movement, undo granularity, and diff calculation
- Consider implementing custom backspace handling for finer control

