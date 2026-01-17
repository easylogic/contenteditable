---
id: ce-0324-chrome-v96-performance-regression-spellcheck-ko
scenarioId: scenario-chrome-v96-performance-regression-spellcheck
locale: ko
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "96"
keyboard: US
caseTitle: Chrome v96 performance regression with spell checking in large contenteditable
description: "Chrome version 96 introduced significant performance regressions when typing in large contenteditable elements, particularly linked to spell-checking feature causing sluggish typing and high CPU usage."
tags:
  - performance
  - chrome
  - spellcheck
  - regression
  - v96
status: draft
---

## Phenomenon

Chrome version 96 introduced significant performance regressions when working with large documents in contenteditable elements. Users experience sluggish typing, high CPU usage, and overall unresponsiveness. The issue appears to be linked to Chrome's spell-checking feature, and disabling spell check mitigates the performance degradation.

## Reproduction example

1. Create a contenteditable div with large amount of content (10,000+ words).
2. Use Chrome version 96 or later.
3. Type characters in the contenteditable element.
4. Observe sluggish typing and high CPU usage.
5. Disable spell checking and observe improved performance.

## Observed behavior

- **Sluggish typing**: Each keystroke has noticeable delay in Chrome v96+.
- **High CPU usage**: Browser uses significant CPU during typing.
- **Spell check related**: Disabling spell check improves performance.
- **Large documents**: Issue more pronounced with large content.
- **Version-specific**: Chrome v96 introduced the regression.
- **Rich text editors**: Particularly affects editors like ProseMirror.

## Expected behavior

- Typing should be responsive regardless of content size.
- Spell checking should not cause significant performance degradation.
- CPU usage should remain reasonable during typing.
- Performance should be consistent across Chrome versions.

## Analysis

Chrome v96 changed how spell checking works with contenteditable elements, causing the browser to perform expensive operations on large documents during each keystroke. The spell checker may be re-analyzing the entire document rather than just the affected region.

## Workarounds

- Disable spell checking on contenteditable element:
  ```html
  <div contenteditable="true" spellcheck="false"></div>
  ```
- Disable via JavaScript:
  ```javascript
  element.spellcheck = false;
  element.focus();
  element.blur(); // Force re-evaluation
  ```
- Users can disable in Chrome settings or via context menu.
- Monitor Chrome updates for performance fixes.
- Consider implementing custom spell checking that's more performant.
- Break down large documents into smaller sections.
