---
id: scenario-ime-duplicate-text-heading
title: IME composition causes duplicate text in headings (WebKit only)
description: When using IME to input CJK text in heading elements (H1, H2, etc.) in WebKit browsers, pressing Space to confirm composition causes both the raw Pinyin buffer AND the confirmed characters to appear together.
category: ime
tags:
  - composition
  - ime
  - heading
  - webkit
  - chinese
  - duplicate-text
status: draft
locale: en
---

When composing text with an IME (Input Method Editor) for Chinese or other CJK languages inside heading elements (`<h1>`, `<h2>`, etc.) in WebKit browsers, pressing Space to confirm the composition causes both the raw input buffer (e.g., Pinyin "nihao") and the confirmed characters (e.g., "你好") to appear together in the editor.

## Problem Description

The issue occurs specifically when:
1. User is in a heading element (H1-H6)
2. Using Chinese IME (or other CJK IME that shows raw input buffer)
3. Types Pinyin (e.g., "nihao" for "你好")
4. Presses Space to confirm the composition

### Expected Behavior
- Only the confirmed Chinese characters ("你好") should appear in the heading
- Raw Pinyin buffer should NOT be visible

### Actual Behavior (WebKit Bug)
- Both raw Pinyin ("nihao") AND confirmed characters ("你好") appear together
- Result: "nihao 你好" instead of just "你好"

## Affected Browsers

- **Safari** (WebKit) - Issue confirmed
- **Chrome** (Blink/WebKit) - Issue may occur in some versions
- **Firefox** - Does NOT exhibit this behavior (works correctly)

## Affected Languages

- Chinese IME (shows Pinyin buffer during composition)
- Other CJK IMEs that display raw input buffer during composition

## Root Cause

WebKit's IME composition handling in heading elements appears to incorrectly maintain both:
1. The raw input buffer being composed
2. The confirmed/composed characters

When composition is confirmed with Space key, WebKit fails to properly clear the raw buffer from the DOM in heading elements.

## Workarounds

1. **Use paragraphs instead of headings**:
   - Replace `<h2>` with `<p><strong>` or use CSS styling instead of semantic headings
   - Composition works correctly in non-heading elements

2. **Force DOM cleanup after composition**:
   ```javascript
   heading.addEventListener('compositionend', () => {
     setTimeout(() => {
       // Remove any raw Pinyin text that shouldn't be there
       const text = heading.textContent.replace(/[a-z]+/g, '');
       heading.textContent = text;
     }, 0);
   });
   ```

3. **Intercept Space key during composition**:
   ```javascript
   heading.addEventListener('keydown', (e) => {
     if (isComposing && e.key === ' ') {
       e.preventDefault();
       // Let IME handle composition completion naturally
     }
   });
   ```

## Reference

- GitHub Issue: https://github.com/ueberdosis/tiptap/issues/7271
