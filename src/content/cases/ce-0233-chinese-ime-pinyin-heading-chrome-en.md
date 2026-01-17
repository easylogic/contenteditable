---
id: ce-0233-chinese-ime-pinyin-heading-chrome-en
scenarioId: scenario-ime-duplicate-text-heading
locale: en
os: Windows
osVersion: "10/11"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "120+"
keyboard: Chinese (IME) - Windows Chinese Input
caseTitle: IME composition causes duplicate Pinyin text in headings
description: "In Chrome (Blink/WebKit), when using Chinese IME to input text in heading elements (H1-H6), pressing Space to confirm composition causes both raw Pinyin buffer AND confirmed characters to appear together, similar to Safari behavior."
tags:
  - composition
  - ime
  - heading
  - chinese
  - webkit
  - duplicate-text
status: draft
initialHtml: |
  <h2 contenteditable="true" style="padding: 20px; border: 1px solid #ccc;">Type Chinese IME here</h2>
domSteps:
  - label: "Before"
    html: '<h2 contenteditable="true"></h2>'
    description: "Empty heading element"
  - label: "Step 1: Type Pinyin 'nihao'"
    html: '<h2 contenteditable="true">nihao</h2>'
    description: "Typing Pinyin with IME (candidates visible)"
  - label: "Step 2: Press Space to confirm"
    html: '<h2 contenteditable="true">nihao 你好</h2>'
    description: "❌ Bug: Pinyin 'nihao' and characters '你好' appear together"
  - label: "✅ Expected"
    html: '<h2 contenteditable="true">你好</h2>'
    description: "Expected: Only Chinese characters should remain"
---

## 현상

In Chrome (Blink/WebKit), when using Chinese IME to input text in heading elements (`<h1>`-`<h6>`), pressing Space to confirm composition causes both the raw Pinyin buffer and the confirmed characters to appear together.

## 재현 예시

1. H2 or other heading element is focused.
2. Windows Chinese IME is activated.
3. Type Pinyin "nihao" (for Chinese characters "你好").
4. Press Space to confirm composition.

## 관찰된 동작

- **Duplicate text**: Pinyin "nihao" and Chinese "你好" appear together → "nihao 你好"
- **Heading elements only**: Behavior does not occur in paragraph elements (`<p>`, `<div>`)
- **WebKit/Chromium issue**: Similar to Safari behavior
- **Firefox unaffected**: Firefox does not exhibit this bug

## 예상 동작

- Pinyin buffer ("nihao") should NOT be visible
- Only confirmed Chinese characters ("你好") should appear

## 참고사항 및 가능한 해결 방향

- **Use semantic paragraphs**: Replace `<h1>`-`<h6>` with `<p>` + CSS styling for headings
- **DOM cleanup in compositionend**: Remove Pinyin text after composition completes
- **Intercept Space key**: Prevent Space key during composition to let IME handle naturally

## 코드 예시

```javascript
const heading = document.querySelector('h2[contenteditable]');
let isComposing = false;

heading.addEventListener('compositionstart', () => {
  isComposing = true;
});

heading.addEventListener('compositionend', () => {
  isComposing = false;
  // DOM cleanup: remove Pinyin
  setTimeout(() => {
    const text = heading.textContent;
    const cleaned = text.replace(/[a-z]+/g, '');
    heading.textContent = cleaned;
  }, 0);
});

heading.addEventListener('keydown', (e) => {
  if (isComposing && e.key === ' ') {
    e.preventDefault();
    // Let IME complete naturally
  }
});
```
