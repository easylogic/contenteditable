---
id: ce-0135
scenarioId: scenario-font-family-change
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Removing font family leaves empty style attributes
description: "When removing font family formatting in Chrome, empty style attributes may be left in the DOM. These empty style attributes bloat the HTML and serve no purpose."
tags:
  - font
  - style
  - empty
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<span style="font-family: Arial;">Text</span>'
    description: "Arial 폰트가 적용된 텍스트"
  - label: "After Removing Font (Bug)"
    html: '<span style="">Text</span>'
    description: "폰트 제거 후 빈 style 속성이 남음"
  - label: "✅ Expected"
    html: 'Text'
    description: "정상: 빈 style 속성과 요소가 제거됨"
---

### Phenomenon

When removing font family formatting in Chrome, empty style attributes may be left in the DOM. These empty style attributes bloat the HTML and serve no purpose.

### Reproduction example

1. Apply font family to text: `<span style="font-family: Arial">Text</span>`
2. Remove font family formatting
3. Observe the DOM

### Observed behavior

- Empty style attributes may remain: `<span style="">Text</span>`
- Or empty span elements may remain: `<span></span>`
- DOM becomes bloated
- Unnecessary attributes accumulate

### Expected behavior

- Style attributes should be removed when empty
- Empty elements should be cleaned up
- DOM should be minimal
- No unnecessary attributes

### Browser Comparison

- **Chrome/Edge**: May leave empty styles (this case)
- **Firefox**: More likely to leave empty attributes
- **Safari**: Most likely to leave empty structures

### Notes and possible direction for workarounds

- Clean up empty style attributes
- Remove style attribute if empty
- Unwrap elements with empty styles
- Normalize DOM structure regularly

