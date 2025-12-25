---
id: ce-0202
scenarioId: scenario-ime-composition-tab-key
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: Thai (IME)
caseTitle: Thai IME composition cancelled by Tab key in Safari
description: "When composing Thai text with IME in a contenteditable element, pressing Tab cancels the composition and causes focus to navigate to the next element. The composed text including tone marks and vowel marks may be lost."
tags:
  - composition
  - ime
  - tab
  - navigation
  - thai
  - safari
  - macos
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">สวัส</span>'
    description: "태국어 조합 중 (สวัส), 톤 마크와 모음 마크 포함"
  - label: "After Tab (Bug)"
    html: 'Hello '
    description: "Tab 키로 조합 취소, 포커스 이동, 조합 텍스트 손실"
  - label: "✅ Expected"
    html: 'Hello สวัสดี'
    description: "정상: 조합 완료 후 Tab 네비게이션 또는 조합 텍스트 보존"
---

### Phenomenon

When composing Thai text with IME in a `contenteditable` element, pressing Tab cancels the composition and causes focus to navigate to the next element. The composed text including tone marks and vowel marks may be lost or partially committed before navigation occurs.

### Reproduction example

1. Focus the editable area (e.g., in a form or table).
2. Activate Thai IME.
3. Type Thai text with tone marks and vowel marks (e.g., "สวัสดี").
4. Press Tab to navigate to the next element.

### Observed behavior

- The compositionend event fires with incomplete data
- Focus moves to the next element
- Composed text including combining marks may be lost
- The Tab key behavior conflicts with composition handling

### Expected behavior

- Composition should complete before Tab navigation occurs
- All combining characters should be preserved
- Tab navigation should work consistently with or without active composition

### Browser Comparison

- **Safari**: Tab may cancel composition and navigate focus, especially on macOS
- **Chrome**: May have different Tab key behavior during composition
- **Firefox**: May have different Tab key behavior during composition

### Notes and possible direction for workarounds

- Prevent Tab during active composition
- Wait for composition to complete before allowing Tab navigation
- Handle Tab key events carefully during composition, especially with combining characters

