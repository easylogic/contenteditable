---
id: ce-0218
scenarioId: scenario-mobile-virtual-keyboard-resize
locale: en
os: Android
osVersion: "10.0+"
device: Any Android device
deviceVersion: Any
browser: Chrome Mobile
browserVersion: "90.0+"
keyboard: Gboard (Google Keyboard)
caseTitle: Virtual keyboard resize causes viewport and selection loss
description: "On Android Chrome with Gboard, virtual keyboard appearance/disappearance causes viewport resize that scrolls content and loses selection/caret position. This is particularly problematic in fixed-position editors or when content is scrolled to specific positions."
tags:
  - mobile
  - virtual-keyboard
  - viewport
  - selection-loss
  - android
  - chrome
  - gboard
  - resize
status: draft
domSteps:
  - label: "Before keyboard"
    html: '<div class="editor" style="position: fixed; top: 100px; height: 200px; width: 300px; border: 1px solid #ccc;"><p>Type something here and note cursor position</p></div>'
    description: "Editor positioned with cursor at specific location"
  - label: "Keyboard appears"
    html: '<div class="editor" style="position: fixed; top: 100px; height: 200px; width: 300px; border: 1px solid #ccc;"><p>Type something here and note cursor position</p></div>'
    description: "Virtual keyboard appears, viewport resizes, content scrolls"
  - label: "After keyboard"
    html: '<div class="editor" style="position: fixed; top: 100px; height: 200px; width: 300px; border: 1px solid #ccc;"><p>Type something here and note cursor position</p></div>'
    description: "Content scrolled, selection may be lost or repositioned"
---

## Phenomenon

On Android Chrome with Gboard, virtual keyboard appearance/disappearance causes viewport resize events that scroll content and can lose selection/caret position. This is especially problematic for:
- Fixed-position editors
- Content scrolled to specific positions
- Long documents where losing position is disruptive
- Apps requiring precise cursor control

## Reproduction example

1. Create a fixed-position `contenteditable` element on Android device.
2. Add enough content to allow scrolling.
3. Scroll to specific position and place cursor precisely.
4. Tap to focus and bring up Gboard virtual keyboard.
5. Observe viewport resize and content scroll.
6. Try to continue typing - cursor may be in wrong position or lost.
7. Dismiss keyboard and observe content re-scroll.

## Observed behavior

### Keyboard appearance:

1. **Viewport resizes**: Visual Viewport API reports size change
2. **Content scrolls**: Page scrolls to keep focused element visible
3. **Selection may shift**: Cursor moves to accommodate new viewport
4. **Fixed elements reposition**: Fixed-position elements may jump

### Keyboard dismissal:

1. **Viewport expands**: Viewport returns to original size
2. **Content re-scrolls**: Page may scroll to different position
3. **Selection may be lost**: Cursor position can be lost entirely
4. **Focus may change**: Focus might shift to other elements

### Specific patterns observed:

- **Fixed editors**: Most affected - position calculations become invalid
- **Absolute positioning**: Moderate impact - relative positioning breaks
- **Normal flow**: Least affected but still problematic
- **Long content**: More likely to lose scroll position
- **Complex layouts**: Multiple elements compound the issue

## Expected behavior

- Viewport resize should preserve scroll position relative to content
- Selection/caret should remain at same logical position
- Fixed elements should maintain their intended position
- Keyboard transitions should be smooth and predictable
- Content should not jump or scroll unnecessarily

## Impact

- **User experience disruption**: Jarring jumps and position loss
- **Input interruption**: Users lose their place while typing
- **Layout instability**: Complex layouts become unstable
- **Accessibility issues**: Screen reader users lose context
- **Form abandonment**: Users may abandon due to frustration

## Browser Comparison

- **Android Chrome**: Most affected, aggressive viewport resizing
- **Android Firefox**: Better handling, less aggressive scrolling
- **Samsung Internet**: Similar to Chrome, varies by version
- **iOS Safari**: Different approach, less disruptive but other issues
- **Desktop browsers**: Not applicable (no virtual keyboard)

## Workarounds

### 1. Visual Viewport API stabilization

```javascript
class KeyboardManager {
  constructor() {
    this.originalHeight = window.visualViewport?.height || window.innerHeight;
    this.isKeyboardVisible = false;
    this.scrollPosition = { x: 0, y: 0 };
    this.selection = null;
    
    this.setupListeners();
  }
  
  setupListeners() {
    // Visual Viewport API for precise keyboard detection
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', this.handleViewportResize.bind(this));
    }
    
    // Fallback: resize event
    window.addEventListener('resize', this.handleWindowResize.bind(this));
    
    // Focus/blur events
    document.addEventListener('focusin', this.handleFocusIn.bind(this));
    document.addEventListener('focusout', this.handleFocusOut.bind(this));
  }
  
  handleViewportResize(event) {
    const currentHeight = event.target.height;
    const heightDiff = this.originalHeight - currentHeight;
    
    if (heightDiff > 150) { // Keyboard appeared
      this.handleKeyboardShow(heightDiff);
    } else if (this.isKeyboardVisible) { // Keyboard hidden
      this.handleKeyboardHide();
    }
  }
  
  handleKeyboardShow(keyboardHeight) {
    this.isKeyboardVisible = true;
    
    // Save current state
    this.scrollPosition = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
    this.selection = this.saveSelection();
    
    // Prevent unwanted scrolling
    setTimeout(() => {
      window.scrollTo(this.scrollPosition.x, this.scrollPosition.y);
      this.restoreSelection(this.selection);
    }, 100);
  }
  
  handleKeyboardHide() {
    this.isKeyboardVisible = false;
    
    // Restore original scroll position
    setTimeout(() => {
      window.scrollTo(this.scrollPosition.x, this.scrollPosition.y);
    }, 100);
  }
  
  saveSelection() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return null;
    
    const range = selection.getRangeAt(0);
    return {
      startContainer: range.startContainer,
      startOffset: range.startOffset,
      endContainer: range.endContainer,
      endOffset: range.endOffset
    };
  }
  
  restoreSelection(savedSelection) {
    if (!savedSelection) return;
    
    try {
      const selection = window.getSelection();
      const range = document.createRange();
      
      range.setStart(savedSelection.startContainer, savedSelection.startOffset);
      range.setEnd(savedSelection.endContainer, savedSelection.endOffset);
      
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (e) {
      console.warn('Could not restore selection:', e);
    }
  }
}
```

### 2. Viewport meta optimization

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, height=device-height, viewport-fit=cover">
```

### 3. CSS scroll anchoring

```css
.fixed-editor {
  position: fixed;
  top: 100px;
  left: 20px;
  right: 20px;
  height: 200px;
  overflow-anchor: none; /* Prevent scroll anchoring interference */
}

.editor-content {
  overflow-y: auto;
  overscroll-behavior: contain; /* Prevent overscroll effects */
}
```

### 4. Input mode hints

```html
<div contenteditable 
     inputmode="text"
     enterkeyhint="done"
     spellcheck="false"
     autocomplete="off">
</div>
```

### 5. Adaptive positioning

```javascript
class AdaptiveEditor {
  constructor(editorElement) {
    this.editor = editorElement;
    this.originalPosition = this.getComputedPosition();
    this.keyboardManager = new KeyboardManager();
    
    this.setupAdaptivePositioning();
  }
  
  setupAdaptivePositioning() {
    this.keyboardManager.on('keyboardShow', (height) => {
      this.adjustForKeyboard(height);
    });
    
    this.keyboardManager.on('keyboardHide', () => {
      this.restoreOriginalPosition();
    });
  }
  
  adjustForKeyboard(keyboardHeight) {
    const rect = this.editor.getBoundingClientRect();
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    
    if (rect.bottom > viewportHeight - 100) { // Too close to keyboard
      const newTop = Math.max(50, viewportHeight - keyboardHeight - rect.height - 100);
      this.editor.style.position = 'absolute';
      this.editor.style.top = `${newTop}px`;
    }
  }
  
  restoreOriginalPosition() {
    this.editor.style.position = this.originalPosition.position;
    this.editor.style.top = this.originalPosition.top;
  }
  
  getComputedPosition() {
    const style = window.getComputedStyle(this.editor);
    return {
      position: style.position,
      top: style.top,
      left: style.left
    };
  }
}
```

## Testing recommendations

1. **Different screen sizes**: Test on various phone/tablet sizes
2. **Various keyboard apps**: Gboard, Samsung Keyboard, SwiftKey
3. **Different positioning**: Fixed, absolute, static positioning
4. **Content lengths**: Short, medium, long content
5. **Scroll positions**: Top, middle, bottom of page
6. **Orientation changes**: Portrait to landscape transitions

## Notes

- Visual Viewport API provides most reliable keyboard detection
- Scroll anchoring can sometimes interfere with custom handling
- Different keyboard apps have different behaviors
- Android 12+ improved keyboard handling but issues persist
- Complex layouts require more sophisticated positioning logic