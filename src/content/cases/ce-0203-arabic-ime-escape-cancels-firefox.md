---
id: ce-0203
scenarioId: scenario-ime-composition-escape-key
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: Arabic (IME)
caseTitle: Arabic IME composition cancelled by Escape key in Firefox
description: "When composing Arabic text with IME in a contenteditable element, pressing Escape cancels the composition and loses the composed text including character joining. This can interfere with UI interactions that use Escape for cancellation."
tags:
  - composition
  - ime
  - escape
  - arabic
  - firefox
  - windows
status: draft
domSteps:
  - label: "Before"
    html: '<span dir="rtl">Hello <span style="text-decoration: underline; background: #fef08a;">مرح</span></span>'
    description: "아랍어 조합 중 (مرح), RTL 방향, 문자 연결 중"
  - label: "After Escape (Bug)"
    html: '<span dir="rtl">Hello </span>'
    description: "Escape 키로 조합 취소, 문자 연결 포함 조합 텍스트 손실"
  - label: "✅ Expected"
    html: '<span dir="rtl">Hello مرحبا</span>'
    description: "정상: 조합이 우아하게 처리되거나 보존됨"
---

### Phenomenon

When composing Arabic text with IME in a `contenteditable` element, pressing Escape cancels the composition and loses the composed text including character joining. This can interfere with UI interactions that use Escape for cancellation or closing dialogs.

### Reproduction example

1. Focus the editable area (e.g., in a modal dialog or dropdown).
2. Activate Arabic IME.
3. Start composing Arabic text with character joining (e.g., "مرحبا").
4. Press Escape to close the dialog or cancel an action.

### Observed behavior

- The compositionend event fires with incomplete data
- The composed text including character joining is lost
- Escape may trigger both composition cancellation and other UI actions
- No recovery mechanism for lost composition

### Expected behavior

- Composition should be handled gracefully when Escape is pressed
- Composed text including character joining should not be lost
- Escape key behavior should be consistent and predictable

### Browser Comparison

- **Firefox**: Escape may cancel composition
- **Chrome**: May have different Escape key behavior during composition
- **Edge**: Similar to Chrome
- **Safari**: Not applicable on Windows

### Notes and possible direction for workarounds

- Prevent Escape during active composition if composition preservation is critical
- Consider committing composition before allowing Escape
- Handle Escape key events carefully during composition, especially in modal contexts and with RTL text

