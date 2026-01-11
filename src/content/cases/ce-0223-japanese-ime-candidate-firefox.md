---
id: ce-0223
scenarioId: scenario-japanese-ime-convertion-firefox
locale: en
os: macOS
osVersion: "12.0+"
device: Desktop
deviceVersion: Any
browser: Firefox
browserVersion: "115.0+"
keyboard: Japanese (IME)
caseTitle: Firefox Japanese IME conversion candidate selection interferes with contenteditable selection
description: "In Firefox with Japanese IME on macOS, when selecting conversion candidates, the IME candidate window can interfere with the contenteditable selection and cursor positioning. The candidate window may appear over the editor, causing visual conflicts and potential selection loss."
tags:
  - firefox
  - japanese
  - ime
  - conversion-candidates
  - selection-interference
  - macos
  - candidate-window
  - visual-conflict
status: draft
domSteps:
  - label: "Start composition"
    html: '<p>こんにちは</p>'
    description: "User starts typing Japanese text"
  - label: "Candidate selection"
    html: '<p>こんにちは</p>'
    description: "IME candidate window appears, potentially covering editor"
  - label: "After selection"
    html: '<p>今日は</p>'
    description: "After selecting candidate, selection may be lost or misplaced"
---

## Phenomenon

In Firefox with Japanese IME on macOS, the conversion candidate window can interfere with the contenteditable selection and cursor positioning. When users select conversion candidates from the IME dropdown, the candidate window may appear over the editor content, causing visual conflicts and potential selection loss.

## Reproduction example

1. Open Firefox on macOS with Japanese IME enabled.
2. Focus a `contenteditable` element with some content.
3. Start typing Japanese text (e.g., type "kyou" for 今日).
4. Press space or conversion key to show candidate window.
5. Select a different candidate from the dropdown.
6. Observe candidate window positioning and selection behavior.
7. Try with longer compositions and multiple candidate selections.

## Observed behavior

### Candidate window interference:

1. **Visual overlap**: Candidate window may appear over editor content
2. **Selection loss**: Existing selection may be lost when candidate appears
3. **Cursor displacement**: Cursor position may shift unexpectedly
4. **Scroll issues**: Editor may scroll to accommodate candidate window
5. **Focus conflicts**: Focus may shift between editor and candidate window

### Specific patterns observed:

- **Fixed positioning**: Editor with fixed positioning more affected
- **Small screens**: More likely to have candidate window overlap
- **Long compositions**: More candidates = larger window = more interference
- **Near edges**: Composing near screen edges causes candidate repositioning
- **Multiple selections**: Complex selections more likely to be lost

### Event sequence analysis:

```javascript
// Firefox Japanese IME with candidate selection events
document.addEventListener('compositionstart', (e) => {
  console.log('compositionstart:', e.data);
});

document.addEventListener('compositionupdate', (e) => {
  console.log('compositionupdate:', e.data);
  // Candidate selection triggers compositionupdate
});

document.addEventListener('compositionend', (e) => {
  console.log('compositionend:', e.data);
  // Selection may be lost at this point
});

document.addEventListener('selectionchange', (e) => {
  console.log('selectionchange');
  // May fire unexpectedly during candidate selection
});
```

## Expected behavior

- Candidate window should not interfere with editor selection
- Cursor should remain at expected position during candidate selection
- Visual layout should accommodate candidate window without losing content
- Focus should remain on editor during entire composition process
- Selection should be preserved throughout candidate selection

## Impact

- **User experience disruption**: Visual conflicts during text input
- **Selection inconsistency**: Users lose their place in text
- **Input interruption**: Complex compositions become difficult
- **Accessibility issues**: Screen reader users may lose context
- **Cross-browser inconsistency**: Different behavior from other browsers

## Browser Comparison

- **Firefox macOS**: Candidate window may interfere with selection
- **Chrome macOS**: Better handling, minimal interference
- **Safari macOS**: Good integration, rare conflicts
- **Firefox Windows**: Different IME system, better behavior
- **Chrome Windows**: No issues with candidate windows
- **Edge macOS**: Similar to Chrome, good behavior

## Workarounds

### 1. Candidate window positioning management

```javascript
class JapaneseIMECandidateHandler {
  constructor(editorElement) {
    this.editor = editorElement;
    this.isFirefox = /Firefox/.test(navigator.userAgent);
    this.isMac = /Mac/.test(navigator.platform);
    this.isJapaneseIME = false;
    
    if (this.isFirefox && this.isMac) {
      this.setupCandidateHandling();
    }
  }
  
  setupCandidateHandling() {
    this.editor.addEventListener('compositionstart', this.handleCompositionStart.bind(this));
    this.editor.addEventListener('compositionupdate', this.handleCompositionUpdate.bind(this));
    this.editor.addEventListener('compositionend', this.handleCompositionEnd.bind(this));
    this.editor.addEventListener('focus', this.handleFocus.bind(this));
    
    // Detect Japanese IME usage
    this.detectJapaneseIME();
  }
  
  detectJapaneseIME() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Process' || e.keyCode === 229) {
        this.isJapaneseIME = this.checkLocaleJapanese();
      }
    });
  }
  
  checkLocaleJapanese() {
    const locale = navigator.language || navigator.userLanguage;
    return locale.startsWith('ja');
  }
  
  handleCompositionStart(e) {
    this.preserveSelection();
    this.adjustEditorPositioning();
  }
  
  handleCompositionUpdate(e) {
    // Check if this is a candidate selection
    if (this.isCandidateSelection(e)) {
      this.handleCandidateSelection(e);
    }
  }
  
  handleCompositionEnd(e) {
    this.restoreSelection();
    this.resetEditorPositioning();
  }
  
  handleFocus(e) {
    this.setupCandidateObserver();
  }
  
  isCandidateSelection(e) {
    // Heuristic: rapid compositionupdate without user input
    // likely indicates candidate selection
    return e.data && this.lastCompositionData && 
           e.data !== this.lastCompositionData &&
           this.isRapidEvent();
  }
  
  isRapidEvent() {
    const now = Date.now();
    const isRapid = this.lastEventTime && (now - this.lastEventTime) < 100;
    this.lastEventTime = now;
    return isRapid;
  }
  
  handleCandidateSelection(e) {
    // Save current selection before potential interference
    this.savedSelection = this.saveSelection();
    
    // Adjust editor to avoid candidate window overlap
    this.adjustForCandidateWindow();
    
    // Handle candidate window appearance
    setTimeout(() => {
      this.checkCandidateWindowOverlap();
    }, 50);
  }
  
  saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      return {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset
      };
    }
    return null;
  }
  
  restoreSelection() {
    if (this.savedSelection) {
      try {
        const selection = window.getSelection();
        const range = document.createRange();
        
        range.setStart(this.savedSelection.startContainer, this.savedSelection.startOffset);
        range.setEnd(this.savedSelection.endContainer, this.savedSelection.endOffset);
        
        selection.removeAllRanges();
        selection.addRange(range);
      } catch (e) {
        console.warn('Could not restore selection:', e);
      }
    }
  }
  
  adjustForCandidateWindow() {
    const rect = this.editor.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // If editor might be obscured by candidate window
    if (rect.bottom > viewportHeight - 200) {
      // Move editor up to accommodate candidate window
      const originalTop = this.editor.style.top;
      this.originalPosition = { top: originalTop };
      
      this.editor.style.position = 'relative';
      this.editor.style.top = `${Math.max(0, rect.top - 150)}px`;
      
      // Smooth transition
      this.editor.style.transition = 'top 0.2s ease-out';
    }
  }
  
  resetEditorPositioning() {
    if (this.originalPosition) {
      this.editor.style.top = this.originalPosition.top;
      this.editor.style.position = '';
      this.editor.style.transition = '';
      this.originalPosition = null;
    }
  }
  
  adjustEditorPositioning() {
    // Ensure editor remains visible during composition
    this.editor.style.overflow = 'visible';
    this.editor.style.zIndex = '10';
  }
  
  preserveSelection() {
    // Store selection for later restoration
    this.initialSelection = this.saveSelection();
  }
  
  checkCandidateWindowOverlap() {
    // Try to detect candidate window and adjust if needed
    // This is heuristic since we can't directly access IME windows
    const activeElements = document.activeElement;
    const editorRect = this.editor.getBoundingClientRect();
    
    // Check if editor is still focused and visible
    if (document.activeElement !== this.editor) {
      // Focus lost, restore it
      this.editor.focus();
      this.restoreSelection();
    }
  }
  
  setupCandidateObserver() {
    // Monitor for focus changes during composition
    let compositionInProgress = false;
    
    document.addEventListener('compositionstart', () => {
      compositionInProgress = true;
    });
    
    document.addEventListener('compositionend', () => {
      compositionInProgress = false;
    });
    
    document.addEventListener('blur', (e) => {
      if (compositionInProgress && e.target !== this.editor) {
        // Focus lost during composition, restore it
        setTimeout(() => {
          this.editor.focus();
          this.restoreSelection();
        }, 10);
      }
    }, true);
  }
}
```

### 2. CSS positioning for candidate window accommodation

```css
.japanese-ime-editor {
  /* Ensure editor stays above candidate window */
  position: relative;
  z-index: 100;
  
  /* Prevent unwanted scrolling during composition */
  overflow-anchor: none;
  overscroll-behavior: contain;
  
  /* Ensure consistent positioning */
  transform: translateZ(0); /* Hardware acceleration */
  will-change: transform;
}

.japanese-ime-editor.composing {
  /* Special styling during composition */
  outline: 2px solid #007acc;
  outline-offset: 2px;
  
  /* Prevent layout shifts */
  min-height: 100px;
  resize: vertical;
}

/* Firefox-specific fixes */
@supports (-moz-appearance: none) {
  .japanese-ime-editor {
    /* Firefox-specific positioning */
    position: sticky;
    top: 0;
    
    /* Better integration with IME */
    ime-mode: auto;
  }
}

/* macOS-specific fixes */
@media (min-resolution: 2dppx) {
  .japanese-ime-editor {
    /* High DPI Mac-specific adjustments */
    font-smoothing: antialiased;
    -webkit-font-smoothing: antialiased;
  }
}
```

### 3. Alternative input method handling

```javascript
class AlternativeJapaneseInput {
  constructor(editor) {
    this.editor = editor;
    this.mode = 'standard'; // 'standard' or 'alternative'
    
    this.setupModeToggle();
  }
  
  setupModeToggle() {
    // Provide alternative input method for Japanese
    const toggle = document.createElement('button');
    toggle.textContent = 'Japanese Input Mode';
    toggle.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 1000;
      padding: 5px 10px;
      background: #007acc;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    `;
    
    toggle.addEventListener('click', () => {
      this.toggleMode();
    });
    
    this.editor.parentElement.style.position = 'relative';
    this.editor.parentElement.appendChild(toggle);
  }
  
  toggleMode() {
    if (this.mode === 'standard') {
      this.mode = 'alternative';
      this.enableAlternativeMode();
    } else {
      this.mode = 'standard';
      this.disableAlternativeMode();
    }
  }
  
  enableAlternativeMode() {
    // Use romaji-to-hiragana conversion without candidate window
    this.editor.addEventListener('keydown', this.handleAlternativeInput.bind(this));
    
    // Show conversion panel inline
    this.showInlineConversionPanel();
  }
  
  disableAlternativeMode() {
    this.editor.removeEventListener('keydown', this.handleAlternativeInput);
    this.hideInlineConversionPanel();
  }
  
  handleAlternativeInput(e) {
    // Implement custom Japanese input logic
    // This would be a complex implementation
    // but provides more control over candidate selection
  }
  
  showInlineConversionPanel() {
    // Create inline candidate selection within editor
    // instead of using system IME candidate window
    const panel = document.createElement('div');
    panel.className = 'inline-candidate-panel';
    panel.style.cssText = `
      position: absolute;
      background: white;
      border: 1px solid #ccc;
      border-radius: 3px;
      padding: 5px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 1001;
    `;
    
    this.editor.parentElement.appendChild(panel);
  }
  
  hideInlineConversionPanel() {
    const panel = this.editor.parentElement.querySelector('.inline-candidate-panel');
    if (panel) {
      panel.remove();
    }
  }
}
```

## Testing recommendations

1. **Different Japanese IME**: Microsoft IME, Google Japanese Input, ATOK
2. **Various text patterns**: Hiragana, katakana, kanji, mixed
3. **Different editor positions**: Top, middle, bottom of page
4. **Various screen sizes**: Small laptop, large monitor
5. **Multiple candidates**: Long words with many conversion options
6. **Rapid vs slow typing**: Different typing speeds

## Notes

- This appears to be specific to Firefox's IME integration on macOS
- The issue is related to Firefox's window management and focus handling
- Candidate window positioning varies between different Japanese IME
- The problem is more pronounced with certain IME implementations
- Some users report better behavior with Firefox's developer edition