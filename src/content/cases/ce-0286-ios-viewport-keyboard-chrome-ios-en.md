---
id: ce-0286
scenarioId: scenario-ios-viewport-keyboard
locale: en
os: iOS
osVersion: "16+"
device: Mobile (iPhone/iPad)
deviceVersion: Any
browser: Chrome (iOS)
browserVersion: "120+"
keyboard: English (QWERTY) or iOS Virtual Keyboard
caseTitle: iOS Chrome viewport behaves differently with keyboard
description: "In Chrome for iOS, when software keyboard becomes visible, viewport behavior is different from Safari. The issue may be less severe but still present. This case compares Chrome iOS behavior."
tags:
  - ios
  - chrome
  - keyboard
  - viewport
  - position-fixed
status: draft
initialHtml: |
  <div style="position: fixed; top: 20px; right: 20px; padding: 10px; background: rgba(0, 0, 0, 0.8); border-radius: 8px; z-index: 100;">
    Fixed Toolbar
  </div>
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 150px;">
    Type text here.
    <br><br>
    Chrome for iOS may handle keyboard differently than Safari.
    <br><br>
    window.innerHeight: <span id="height-display">--</span> px
  </div>
  <script>
    function updateHeightDisplay() {
      document.getElementById('height-display').textContent = window.innerHeight;
    }
    updateHeightDisplay();
    window.addEventListener('resize', () => {
      updateHeightDisplay();
    });
  </script>
domSteps:
  - label: "Before"
    html: '<div style="position: fixed; top: 20px;">Fixed Toolbar</div><div contenteditable="true">Text input area</div><span id="height-display">--</span>'
    description: "Page load: Fixed element normal, height displayed"
  - label: "Step 1: Show keyboard"
    html: '<div style="position: fixed; top: 20px;">Fixed Toolbar</div><div contenteditable="true">Text input area</div><span id="height-display">600</span>'
    description: "Chrome iOS: Keyboard shown, observe viewport height"
  - label: "Step 2: Hide keyboard"
    html: '<div style="position: fixed; top: 20px;">Fixed Toolbar</div><div contenteditable="true">Text input area</div><span id="height-display">900</span>'
    description: "Chrome iOS: Keyboard hidden, observe if height restored"
  - label: "Observation"
    html: '<div style="position: fixed; top: 20px;">Fixed Toolbar</div><div contenteditable="true">Text input area</div><span id="height-display">900</span>'
    description: "Chrome iOS may behave differently than Safari but issue likely less severe"
---

## 현상

In Chrome for iOS, when the software keyboard becomes visible, viewport behavior may be different from Safari but the issue may still be present.

## 재현 예시

1. Open Chrome for iOS on iPhone or iPad.
2. Load the page with position:fixed element and contenteditable.
3. Tap to show keyboard.
4. Observe behavior of fixed element and viewport height.

## 관찰된 동작

- **Chrome iOS behavior**: May handle keyboard differently than Safari
- **Less severe**: Position issues may be less severe than in Safari
- **Still problematic**: Fixed positioning may still have issues
- **Viewport behavior**: Chrome iOS and Safari iOS differ in viewport handling

## 참고사항

This case observes Chrome for iOS behavior, which may differ from Safari but the fundamental issue of viewport keyboard handling still exists on iOS.

Chrome for iOS uses WebKit but may have different viewport implementation than Safari.
