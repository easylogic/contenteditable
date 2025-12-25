---
id: ce-0185
scenarioId: scenario-ime-backspace-granularity
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Japanese (IME)
caseTitle: Japanese IME Backspace removes entire character instead of component
description: "When editing Japanese text with IME in a contenteditable element, pressing Backspace removes the entire character or word instead of allowing component-level editing. This makes fine-grained correction difficult and differs from native input fields."
tags:
  - composition
  - ime
  - backspace
  - japanese
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello 漢字'
    description: "일본어 한자 입력 완료"
  - label: "After Backspace (Bug)"
    html: 'Hello '
    description: "전체 문자 '漢字' 삭제됨 (한 번의 Backspace)"
  - label: "✅ Expected"
    html: 'Hello 漢'
    description: "정상: 한 글자씩 삭제 (첫 번째 Backspace로 '字'만 삭제)"
---

### Phenomenon

When editing Japanese text with IME in a `contenteditable` element, pressing Backspace removes the entire character or word instead of allowing component-level editing. This makes fine-grained correction difficult and differs from native input fields on the same platform.

### Reproduction example

1. Focus the editable area.
2. Activate Japanese IME.
3. Type a Japanese character or word (e.g., "漢字").
4. Press Backspace once.

### Observed behavior

- The entire character or word is removed by a single Backspace press
- Component-level editing (e.g., editing individual kanji or hiragana) is not possible
- The event log shows only one `beforeinput` / `input` pair for the deletion
- Behavior differs from native input fields

### Expected behavior

- Each Backspace press should allow more granular deletion, matching how native inputs behave
- Component-level editing should be possible
- Behavior should be consistent with native input fields

### Browser Comparison

- **Chrome**: May remove entire characters instead of components
- **Edge**: Similar to Chrome
- **Firefox**: May have different granularity behavior
- **Safari**: Not applicable on Windows

### Notes and possible direction for workarounds

- Compare behavior with a plain `<input>` element in the same environment to confirm the difference
- This behavior can affect cursor movement, undo granularity, and diff calculation
- Consider implementing custom backspace handling for finer control

