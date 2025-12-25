---
id: ce-0145
scenarioId: scenario-text-color-change
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Text color format varies (hex, rgb, named colors)
description: "When applying text colors in Chrome, the color format (hex, rgb, named colors) may vary inconsistently. The same color may be stored as #ff0000, rgb(255,0,0), or 'red' depending on how it was applied."
tags:
  - color
  - text
  - format
  - consistency
  - chrome
status: draft
domSteps:
  - label: "After Color Picker"
    html: '<span style="color: #ff0000;">Text</span>'
    description: "색상 선택기로 빨간색 적용 (hex 형식)"
  - label: "After Text Input (Bug)"
    html: '<span style="color: rgb(255, 0, 0);">Text</span>'
    description: "텍스트 입력으로 같은 빨간색 적용 (rgb 형식, 형식 불일치)"
  - label: "After Named Color (Bug)"
    html: '<span style="color: red;">Text</span>'
    description: "이름으로 같은 빨간색 적용 (named 형식, 형식 불일치)"
  - label: "✅ Expected"
    html: '<span style="color: #ff0000;">Text</span>'
    description: "정상: 동일한 색상은 일관된 형식(hex) 사용"
---

### Phenomenon

When applying text colors in Chrome, the color format (hex, rgb, named colors) may vary inconsistently. The same color may be stored as `#ff0000`, `rgb(255,0,0)`, or `red` depending on how it was applied.

### Reproduction example

1. Apply red color via color picker
2. Apply red color via text input
3. Apply red color via named color
4. Observe the DOM color values

### Observed behavior

- Color format varies: `#ff0000`, `rgb(255,0,0)`, `red`
- Same color stored in different formats
- Inconsistent color representation
- Difficult to query or modify colors

### Expected behavior

- Color format should be consistent
- Or format should be predictable
- Same color should use same format
- Format should be easy to work with

### Browser Comparison

- **Chrome/Edge**: Format varies (this case)
- **Firefox**: Similar format inconsistency
- **Safari**: Format handling varies

### Notes and possible direction for workarounds

- Normalize color format after application
- Convert all colors to consistent format (e.g., hex)
- Store original format if needed
- Document color format behavior

