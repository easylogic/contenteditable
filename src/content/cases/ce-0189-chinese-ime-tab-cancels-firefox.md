---
id: ce-0189
scenarioId: scenario-ime-composition-tab-key
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: Chinese (IME - Pinyin)
caseTitle: Chinese IME composition cancelled by Tab key in Firefox
description: "When composing Chinese text with Pinyin IME in a contenteditable element, pressing Tab cancels the composition and causes focus to navigate to the next element. The composed text may be lost or partially committed."
tags:
  - composition
  - ime
  - tab
  - navigation
  - chinese
  - firefox
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">nihao</span>'
    description: "중국어 병음 입력 중 (nihao)"
  - label: "After Tab (Bug)"
    html: 'Hello '
    description: "Tab 키로 조합 취소, 포커스 이동, 조합 텍스트 손실"
  - label: "✅ Expected"
    html: 'Hello 你好'
    description: "정상: 조합 완료 후 Tab 네비게이션 또는 조합 텍스트 보존"
---

### Phenomenon

When composing Chinese text with Pinyin IME in a `contenteditable` element, pressing Tab cancels the composition and causes focus to navigate to the next element. The composed text may be lost or partially committed before navigation occurs.

### Reproduction example

1. Focus the editable area (e.g., in a form or table).
2. Activate Chinese Pinyin IME.
3. Type Pinyin text (e.g., "nihao") and start character conversion.
4. Press Tab to navigate to the next element.

### Observed behavior

- The compositionend event fires with incomplete data
- Focus moves to the next element
- Composed text may be lost or partially committed
- The Tab key behavior conflicts with composition handling

### Expected behavior

- Composition should complete before Tab navigation occurs
- Composed text should not be lost
- Tab navigation should work consistently with or without active composition

### Browser Comparison

- **Firefox**: Tab may cancel composition and navigate focus
- **Chrome**: May have different Tab key behavior during composition
- **Edge**: Similar to Chrome
- **Safari**: Not applicable on Windows

### Notes and possible direction for workarounds

- Prevent Tab during active composition
- Wait for composition to complete before allowing Tab navigation
- Handle Tab key events carefully during composition

