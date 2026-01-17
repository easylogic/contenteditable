---
id: ce-0239-chinese-ime-pinyin-table-firefox-en
scenarioId: scenario-ime-table-cell-pinyin-safari
locale: en
os: macOS
osVersion: "13+"
device: Desktop (Mac)
deviceVersion: Any
browser: Firefox
browserVersion: "120+"
keyboard: Chinese (IME) - macOS Chinese Input
caseTitle: IME composition in table cells works correctly in Firefox
description: "In Firefox, when typing Chinese IME text in table cells, composition works correctly and only confirmed Chinese characters appear. This serves as a control case to demonstrate the Safari-specific bug."
tags:
  - composition
  - ime
  - table
  - chinese
  - pinyin
  - firefox
  - working-correctly
status: confirmed
initialHtml: |
  <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%;">
    <tr>
      <td contenteditable="true" style="width: 200px; border: 1px solid #ddd; padding: 10px;">
        Cell 1
      </td>
      <td contenteditable="true" style="width: 200px; border: 1px solid #ddd; padding: 10px;">
        Cell 2
      </td>
    </tr>
  </table>
domSteps:
  - label: "Before"
    html: '<td contenteditable="true"></td>'
    description: "Empty table cell"
  - label: "Step 1: Type Pinyin 'nihao'"
    html: '<td contenteditable="true">nihao</td>'
    description: "Typing Pinyin with IME (candidates shown)"
  - label: "Step 2: Press Space to confirm"
    html: '<td contenteditable="true">你好</td>'
    description: "✅ Correct: Only Chinese '你好' appears"
---

## 현상

In Firefox, Chinese IME composition in table cells works correctly and only confirmed characters appear without duplicate Pinyin.

## 재현 예시

1. Click on a table cell (`<td>` element) to focus.
2. macOS Chinese IME is activated.
3. Type Pinyin "nihao" (for Chinese characters "你好").
4. Press Space to confirm composition.

## 관찰된 동작

- **Correct behavior**: Only Chinese "你好" appears, no Pinyin "nihao" visible
- **No duplicate text**: Pinyin buffer is properly cleared after composition
- **Firefox handles table cells correctly**: Different from Safari behavior

## 참고사항

This is a **control case** demonstrating that the issue is Safari-specific and does not affect Firefox.
