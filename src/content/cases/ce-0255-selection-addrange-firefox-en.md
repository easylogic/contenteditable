---
id: ce-0255
scenarioId: scenario-selection-addrange-safari-fail
locale: en
os: Windows
osVersion: "10/11"
device: Desktop
deviceVersion: Any
browser: Firefox
browserVersion: "120+"
keyboard: English (QWERTY)
caseTitle: selection.addRange works correctly in Firefox
description: "In Firefox, when using `selection.addRange()` to set cursor position in a contenteditable element with nested elements, the selection is correctly positioned at the intended location. This serves as a control case to demonstrate that the issue is Safari-specific."
tags:
  - selection
  - safari
  - webkit
  - cursor
  - addRange
  - firefox
  - working-correctly
status: confirmed
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc;">
    <span id="marker1" style="background: #fef08a;">[Marker 1]</span>
    <span id="marker2" style="background: #ddd;">text</span>
    <span id="marker3" style="background: #fef08a;">[Marker 3]</span>
  </div>
  <div style="margin-top: 20px;">
    <button onclick="setCursorToMarker2()">Move cursor before Marker 2</button>
  </div>
  <script>
    function setCursorToMarker2() {
      const marker2 = document.getElementById('marker2');
      const selection = window.getSelection();
      const range = document.createRange();
      
      range.setStartBefore(marker2);
      range.collapse(true);
      
      selection.removeAllRanges();
      selection.addRange(range);
      
      console.log('Selection:', selection.toString());
    }
  </script>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true"><span id="marker1">[Marker 1]</span><span id="marker2">text</span><span id="marker3">[Marker 3]</span></div>'
    description: "Contenteditable with nested elements"
  - label: "Click button to set cursor"
    html: '<div contenteditable="true"><span id="marker1">[Marker 1]</span><span id="marker2">|</span>text</span><span id="marker3">[Marker 3]</span></div>'
    description: "After button click"
  - label: "✅ Correct: Selection before Marker 2"
    html: '<div contenteditable="true"><span id="marker1">[Marker 1]</span><span id="marker2">|</span>text</span><span id="marker3">[Marker 3]</span></div>'
    description: "Expected: Selection correctly positioned before Marker 2"
---

## 현상

In Firefox, when using `selection.addRange()` to set cursor position in a contenteditable element with nested elements, the selection is correctly positioned at the intended location.

## 재현 예시

1. Contenteditable element contains markers (`<span>` elements).
2. Click button to move cursor before Marker 2.

## 관찰된 동작

- **Correct behavior**: Selection is positioned before Marker 2 as intended
- **No jumping**: Selection stays within intended container
- **Works correctly**: Firefox handles nested elements properly

## 참고사항

This is a **control case** demonstrating that the issue is Safari-specific and does not affect Firefox.
