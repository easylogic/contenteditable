---
id: ce-0272-caret-invisible-relative-chrome-macos-en-ko
scenarioId: scenario-caret-invisible-relative
locale: ko
os: macOS
osVersion: "13+"
device: Desktop (Mac)
deviceVersion: Any
browser: Chrome
browserVersion: "120+"
keyboard: English (QWERTY)
caseTitle: Text caret invisible on position:relative elements (Chrome macOS)
description: "In Chrome on macOS, when editing content inside an element with `position:relative`, the text caret (cursor) is completely invisible. Text appears but no visual feedback of insertion point."
tags:
  - caret
  - cursor
  - css
  - position-relative
  - chrome
  - webkit
status: draft
initialHtml: |
  <div style="position: relative; padding: 20px; border: 1px solid #ccc;">
    <div contenteditable="true" style="min-height: 100px;">
      Type text here. Observe if the caret (cursor) is visible.
    </div>
  </div>
domSteps:
  - label: "Before"
    html: '<div style="position: relative;"><div contenteditable="true"></div></div>'
    description: "Empty contenteditable inside position:relative container"
  - label: "Step 1: Focus on editor"
    html: '<div style="position: relative;"><div contenteditable="true"></div></div>'
    description: "❌ No caret visible! Cannot see insertion point"
  - label: "Step 2: Type text"
    html: '<div style="position: relative;"><div contenteditable="true">Hello</div></div>'
    description: "Text appears but caret remains invisible"
  - label: "✅ Expected"
    html: '<div style="position: relative;"><div contenteditable="true">Hello|</div></div>'
    description: "Expected: Caret should be visible (blinking or other indicator)"
---

## 현상

In Chrome on macOS, when editing content inside an element with `position:relative`, the text caret is completely invisible.

## 재현 예시

1. Create a container element with `position:relative`.
2. Place contenteditable element inside it.
3. Focus on the contenteditable element.
4. ❌ Caret is not visible!

## 관찰된 동작

- **No visible caret**: Cannot see where text will be inserted
- **Text still appears**: Typed text shows up in editor
- **Difficult editing**: User has to guess insertion point
- **WebKit issue**: Affects WebKit-based browsers on macOS
- **position:relative trigger**: This CSS property causes the issue

## 예상 동작

- Caret should be visible (blinking line or other indicator)
- User should clearly see insertion point
- position:relative should not affect caret rendering

## 참고사항 및 가능한 해결 방향

- **Remove position:relative**: Remove the problematic CSS property from parent
- **Use position:static**: Change to static positioning
- **Move to wrapper element**: Apply position:relative to wrapper, keep editor static
- **Custom caret implementation**: Create blinking cursor with CSS animation

## 코드 예시

### Solution 1: Remove position:relative
```css
.editable-container {
  position: static; /* Remove or omit position property */
}

[contenteditable] {
  min-height: 100px;
  outline: 2px solid #ddd;
}
```

### Solution 2: Wrapper element
```css
.wrapper {
  position: relative;
  padding: 20px;
  border: 1px solid #ccc;
}

[contenteditable] {
  position: static; /* Keep contenteditable static */
  min-height: 100px;
}
```

### Solution 3: Custom caret
```css
@keyframes caret-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.custom-caret {
  position: absolute;
  width: 2px;
  height: 20px;
  background: black;
  animation: caret-blink 1s infinite;
  pointer-events: none;
}
```

```javascript
const editor = document.querySelector('[contenteditable]');
const caret = document.createElement('span');
caret.className = 'custom-caret';
document.body.appendChild(caret);

editor.addEventListener('input', (e) => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Update caret position
    caret.style.top = rect.top + 'px';
    caret.style.left = rect.left + 'px';
  }
});
```
