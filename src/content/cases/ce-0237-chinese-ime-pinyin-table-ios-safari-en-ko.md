---
id: ce-0237-chinese-ime-pinyin-table-ios-safari-en-ko
scenarioId: scenario-ime-table-cell-pinyin-safari
locale: ko
os: iOS
osVersion: "16+"
device: Mobile (iPhone/iPad)
deviceVersion: Any
browser: Safari
browserVersion: "16+"
keyboard: Chinese (IME) - iOS Chinese Input
caseTitle: IME composition shows Pinyin in table cells on iOS Safari
description: "In iOS Safari, when typing Chinese IME text in table cells (<td>), pressing Space to confirm composition causes both raw Pinyin buffer and confirmed Chinese characters to appear together. This is similar to desktop Safari behavior but on mobile devices."
tags:
  - composition
  - ime
  - table
  - chinese
  - pinyin
  - ios
  - mobile
status: draft
initialHtml: |
  <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%;">
    <tr>
      <td contenteditable="true" style="width: 45%; border: 1px solid #ddd; padding: 10px;">
        Cell 1
      </td>
      <td contenteditable="true" style="width: 45%; border: 1px solid #ddd; padding: 10px;">
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
    html: '<td contenteditable="true">nihao 你好</td>'
    description: "❌ Bug: Pinyin 'nihao' and characters '你好' appear together"
  - label: "✅ Expected"
    html: '<td contenteditable="true">你好</td>'
    description: "Expected: Only Chinese characters should remain"
---

## 현상

In iOS Safari, when typing Chinese IME text in table cells (`<td>`), pressing Space to confirm composition causes both raw Pinyin buffer and confirmed Chinese characters to appear together.

## 재현 예시

1. Tap on a table cell (`<td>` element) to focus.
2. Activate Chinese IME (iOS Chinese keyboard).
3. Type Pinyin "nihao" (for Chinese characters "你好").
4. Press Space to confirm composition.

## 관찰된 동작

- **Duplicate text**: Pinyin "nihao" and Chinese "你好" appear together → "nihao 你好"
- **Table cells only**: Behavior does not occur in paragraph elements (`<p>`, `<div>`)
- **iOS Safari specific**: Similar to desktop Safari but on mobile devices
- **Works in Chrome/Firefox**: Other browsers do not exhibit this bug

## 예상 동작

- Pinyin buffer ("nihao") should NOT be visible
- Only confirmed Chinese characters ("你好") should appear

## 참고사항 및 가능한 해결 방향

- **Use div instead of td**: Replace `<td>` with `<div>` for editable content when possible
- **Force DOM cleanup**: Remove Pinyin text after composition completes
- **Avoid direct editing in table cells**: Use modal or overlay for table cell editing
- **Consider non-table structures**: Use CSS grid or flexbox instead of HTML tables

## 코드 예시

```javascript
const cell = document.querySelector('td[contenteditable]');
let isComposing = false;

cell.addEventListener('compositionstart', () => {
  isComposing = true;
});

cell.addEventListener('compositionend', () => {
  isComposing = false;
  setTimeout(() => {
    const text = cell.textContent;
    const cleaned = text.replace(/[a-z]+/g, '');
    cell.textContent = cleaned;
  }, 0);
});

cell.addEventListener('keydown', (e) => {
  if (isComposing && e.key === ' ') {
    e.preventDefault();
    // Let IME complete naturally
  }
});
```
