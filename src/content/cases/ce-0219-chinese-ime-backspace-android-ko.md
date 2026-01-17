---
id: ce-0219-chinese-ime-backspace-android-ko
scenarioId: scenario-ime-backspace-chinese-mobile
locale: ko
os: Android
osVersion: "11.0+"
device: Any Android device
deviceVersion: Any
browser: Chrome Mobile
browserVersion: "100.0+"
keyboard: Chinese (Pinyin) IME
caseTitle: Chinese IME backspace deletes entire composition instead of last character
description: "On Android Chrome with Chinese Pinyin IME, backspace key during composition deletes the entire composition string instead of just the last character. This differs from desktop behavior where backspace typically removes individual characters or components from the composition."
tags:
  - mobile
  - ime
  - chinese
  - backspace
  - deletion
  - android
  - chrome
  - composition
  - unexpected-behavior
status: draft
domSteps:
  - label: "Before typing"
    html: '<p>Hello </p>'
    description: "Editor ready for Chinese input"
  - label: "Start composition"
    html: '<p>Hello <span class="composing">nihao</span></p>'
    description: "User types 'n-i-h-a-o' for 你好 composition"
  - label: "Backspace during composition"
    html: '<p>Hello <span class="composing">niha</span></p>'
    description: "Expected: remove last character 'o'"
  - label: "Actual behavior"
    html: '<p>Hello </p>'
    description: "Actual: entire composition cleared"
---

## Phenomenon

On Android Chrome with Chinese Pinyin IME, pressing backspace during composition deletes the entire composition string instead of removing just the last character. This behavior is inconsistent with desktop Chinese IME behavior where backspace typically removes characters incrementally.

## Reproduction example

1. Open Android Chrome and focus a `contenteditable` element.
2. Switch to Chinese Pinyin IME.
3. Start typing a multi-character word (e.g., type "nihao" to compose "你好").
4. While still in composition mode (before confirming), press backspace.
5. Observe that the entire composition disappears instead of just removing the last character.
6. Try again with longer compositions like "zhongguo" (中国) - same issue.

## Observed behavior

### Mobile vs Desktop behavior:

**Android Chrome Mobile (Chinese IME):**
1. **Entire composition deletion**: Backspace removes complete composition string
2. **No intermediate states**: Cannot step back through composition characters
3. **Complete restart required**: Must retype entire composition
4. **High error rate**: Small mistakes require retyping entire phrases

**Desktop Chrome/Edge (Chinese IME):**
1. **Character-by-character deletion**: Backspace removes one character at a time
2. **Intermediate composition**: Composition continues with remaining characters
3. **Incremental correction**: Users can correct mistakes character by character
4. **Natural flow**: Expected backspace behavior for text editing

### Event sequence differences:

**Mobile Android Chrome:**
```
1. compositionstart
2. beforeinput (insertCompositionText) for 'n'
3. beforeinput (insertCompositionText) for 'i'
4. beforeinput (insertCompositionText) for 'h'
5. beforeinput (insertCompositionText) for 'a'
6. beforeinput (insertCompositionText) for 'o'
7. beforeinput (deleteContentBackward) - CLEARS ENTIRE COMPOSITION
8. compositionend
```

**Desktop Chrome:**
```
1. compositionstart
2. beforeinput (insertCompositionText) for 'n'
3. beforeinput (insertCompositionText) for 'i'
4. beforeinput (insertCompositionText) for 'h'
5. beforeinput (insertCompositionText) for 'a'
6. beforeinput (insertCompositionText) for 'o'
7. beforeinput (deleteContentBackward) - REMOVES LAST CHARACTER 'o'
8. compositionupdate (with 'niha')
```

## Expected behavior

- Backspace should remove the last character of the composition
- Composition should continue with remaining characters
- Event sequence should match desktop behavior
- Users should be able to correct mistakes incrementally
- Behavior should be consistent across platforms

## Impact

- **User frustration**: Small mistakes require retyping entire phrases
- **Reduced efficiency**: Significantly slower text input for Chinese users
- **Learning curve**: Users must adapt to different mobile behavior
- **Platform inconsistency**: Creates cognitive overhead for cross-platform users
- **Accessibility issues**: Users with motor impairments face higher error rates

## Browser Comparison

- **Android Chrome**: Entire composition deletion on backspace
- **Android Firefox**: Similar behavior to Chrome
- **iOS Safari (Chinese)**: Character-by-character deletion (better)
- **Desktop Chrome**: Character-by-character deletion
- **Desktop Edge**: Character-by-character deletion
- **Desktop Firefox**: Character-by-character deletion

## Workarounds

### 1. Custom backspace handling for Chinese IME

```javascript
class ChineseIMEHandler {
  constructor(editor) {
    this.editor = editor;
    this.compositionState = {
      isComposing: false,
      text: '',
      cursor: 0
    };
    
    this.setupListeners();
  }
  
  setupListeners() {
    this.editor.addEventListener('compositionstart', this.handleCompositionStart.bind(this));
    this.editor.addEventListener('compositionupdate', this.handleCompositionUpdate.bind(this));
    this.editor.addEventListener('compositionend', this.handleCompositionEnd.bind(this));
    this.editor.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.editor.addEventListener('beforeinput', this.handleBeforeInput.bind(this));
  }
  
  handleCompositionStart(e) {
    this.compositionState.isComposing = true;
    this.compositionState.text = '';
    this.compositionState.cursor = 0;
  }
  
  handleCompositionUpdate(e) {
    if (e.data) {
      this.compositionState.text = e.data;
      this.compositionState.cursor = e.data.length;
    }
  }
  
  handleCompositionEnd(e) {
    this.compositionState.isComposing = false;
  }
  
  handleKeyDown(e) {
    // Detect Chinese IME on Android
    const isChineseIME = this.detectChineseIME();
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isAndroid && isChineseIME && 
        this.compositionState.isComposing && 
        e.key === 'Backspace') {
      
      e.preventDefault();
      this.handleCustomBackspace();
      return false;
    }
    
    return true;
  }
  
  handleBeforeInput(e) {
    if (this.compositionState.isComposing) {
      // Track composition updates
      if (e.inputType === 'insertCompositionText') {
        this.compositionState.text = e.data || '';
        this.compositionState.cursor = (e.data || '').length;
      }
    }
  }
  
  handleCustomBackspace() {
    // Implement character-by-character deletion
    if (this.compositionState.cursor > 0) {
      // Remove last character
      const newText = this.compositionState.text.slice(0, -1);
      this.compositionState.text = newText;
      this.compositionState.cursor = newText.length;
      
      // Update composition manually
      this.updateCompositionDisplay(newText);
      
      // Fire compositionupdate event
      this.fireCompositionUpdate(newText);
    } else {
      // No characters left, end composition
      this.fireCompositionEnd();
    }
  }
  
  updateCompositionDisplay(text) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // Remove current composition
      range.deleteContents();
      
      // Insert new composition text
      if (text) {
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.selectNodeContents(textNode);
      }
    }
  }
  
  fireCompositionUpdate(text) {
    const event = new CompositionEvent('compositionupdate', {
      bubbles: true,
      cancelable: true,
      data: text
    });
    this.editor.dispatchEvent(event);
  }
  
  fireCompositionEnd() {
    const event = new CompositionEvent('compositionend', {
      bubbles: true,
      cancelable: true,
      data: this.compositionState.text
    });
    this.editor.dispatchEvent(event);
    
    this.compositionState.isComposing = false;
  }
  
  detectChineseIME() {
    // Heuristic detection based on user agent and behavior patterns
    // This is approximate - real detection would require IME APIs
    const isAndroid = /Android/.test(navigator.userAgent);
    const supportsChinese = navigator.language.startsWith('zh');
    
    return isAndroid && supportsChinese;
  }
}
```

### 2. Alternative input method suggestion

```javascript
function suggestAlternativeInput() {
  const isAndroid = /Android/.test(navigator.userAgent);
  const isChineseUser = navigator.language.startsWith('zh');
  
  if (isAndroid && isChineseUser) {
    // Suggest using Google Pinyin with different settings
    showNotification('For better Chinese input experience, try adjusting IME settings or use alternative keyboards like Gboard with Chinese support.');
  }
}
```

### 3. User education

```javascript
function showChineseIMEHelp() {
  const helpText = `
    Chinese Input on Android:
    • Backspace deletes entire composition (Android limitation)
    • Use alternative keyboards for better experience
    • Consider using voice input for longer phrases
    • Split long compositions into shorter parts
  `;
  
  showHelpModal(helpText);
}
```

## Testing recommendations

1. **Various Chinese IME**: Google Pinyin, Sogou, Baidu, etc.
2. **Different Android versions**: 10, 11, 12, 13+
3. **Various device manufacturers**: Samsung, Xiaomi, Huawei, etc.
4. **Different text lengths**: Short words, phrases, sentences
5. **Mixed content**: Chinese + English + numbers
6. **Alternative keyboards**: Test with third-party keyboards

## Notes

- This appears to be an Android-level limitation, not browser-specific
- iOS handles Chinese backspace more gracefully
- The behavior is consistent across Android browsers (Chrome, Firefox)
- Some third-party keyboards may provide better backspace handling
- The issue affects learning and efficiency for Chinese mobile users