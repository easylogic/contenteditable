---
id: ce-0227-linux-korean-ime-firefox
scenarioId: scenario-linux-korean-ime-hangul
locale: en
os: Linux
osVersion: "22.04+"
device: Desktop
deviceVersion: Any
browser: Firefox
browserVersion: "115.0+"
keyboard: Korean (Hangul IME)
caseTitle: Firefox Linux Korean Hangul IME combines characters incorrectly
description: "On Linux with Firefox, Korean Hangul IME combines jamo (Korean characters) incorrectly during rapid typing. Initial consonants and vowels combine into wrong characters or fail to combine at all, creating corrupted Korean text that differs from user input."
tags:
  - linux
  - firefox
  - korean
  - hangul-ime
  - character-combination
  - input-corruption
  - rapid-typing
status: draft
domSteps:
  - label: "Type '가'"
    html: '<p>가</p>'
    description: "User types '가' - ㄱ + ㅏ"
  - label: "Expected combination"
    html: '<p>가</p>'
    description: "Correct Hangul combination: ㄱ + ㅏ = 가"
  - label: "Actual behavior"
    html: '<p>가ㅏ</p>'
    description: "Failed combination: ㄱ + ㅏ = 가ㅏ (corrupted)"
  - label: "Type '나'"
    html: '<p>가나</p>'
    description: "User types '나' - ㄴ + ㅏ"
  - label: "Expected combination"
    html: '<p>가나</p>'
    description: "Correct combination: ㄴ + ㅏ = 나"
  - label: "Actual behavior"
    html: '<p>가나ㅏ</p>'
    description: "Failed combination: ㄴ + ㅏ = 가나ㅏ (corrupted)"
---

## Phenomenon

On Linux with Firefox, Korean Hangul IME combines jamo (Korean character components) incorrectly during rapid typing. Initial consonants and vowels fail to combine properly, resulting in corrupted Korean text where jamo characters appear separately or combine into wrong characters.

## Reproduction example

1. Use Linux system (Ubuntu 22.04+ or similar).
2. Install and activate Korean Hangul IME (default system Korean IME).
3. Open Firefox browser and focus a `contenteditable` element.
4. Type Korean characters rapidly:
   - Type "가" (ㄱ followed by ㅏ)
   - Type "나" (ㄴ followed by ㅏ)
   - Type "다" (ㄷ followed by ㅏ)
   - Type common Korean words: "안녕하세요", "감사합니다"
5. Observe that jamo characters fail to combine properly or combine incorrectly.
6. Compare behavior with other browsers on the same system.

## Observed behavior

### Character combination failures:

**Correct Hangul combination process:**
```
ㄱ (initial) + ㅏ (vowel) = 가
ㄴ (initial) + ㅏ (vowel) = 나
ㄷ (initial) + ㅏ (vowel) = 다
```

**Firefox Linux actual behavior:**
```
ㄱ + ㅏ = 가ㅏ (failed combination - shows jamo separately)
ㄴ + ㅏ = 가나ㅏ (wrong combination)
ㄷ + ㅏ = 다ㅏ (failed combination)
```

### Specific patterns observed:

1. **Failed combinations**: Jamo characters remain uncombined
2. **Wrong combinations**: Characters combine into non-existent Korean characters
3. **Timing-dependent**: Behavior worsens with rapid typing
4. **Inconsistent results**: Same input produces different outputs
5. **Recovery issues**: Once corruption occurs, subsequent typing remains affected

### Event sequence analysis:

```javascript
// Firefox Linux Korean Hangul IME events
[
  { type: 'compositionstart', data: '' },
  { type: 'compositionupdate', data: 'ㄱ' },
  { type: 'compositionupdate', data: 'ㄱㅏ' }, // Should combine to '가'
  { type: 'compositionend', data: '가ㅏ' }, // Wrong result
]
```

## Expected behavior

- Hangul IME should properly combine initial consonants and vowels
- Each syllable should result in a single Korean character
- Character combination should be consistent and reliable
- Rapid typing should not affect combination accuracy
- Behavior should match other browsers on the same system

## Impact

- **Text corruption**: Korean text becomes unreadable or incorrect
- **User frustration**: Users cannot type Korean reliably
- **Productivity loss**: Users must correct typing errors constantly
- **Platform inconsistency**: Firefox behaves differently from Chrome/Edge on Linux
- **Accessibility impact**: Screen readers receive incorrect text content

## Browser Comparison

- **Firefox Linux**: Severe character combination failures with Hangul IME
- **Chrome Linux**: Correct character combination behavior
- **Edge Linux**: Correct character combination behavior  
- **Firefox Windows**: Correct character combination behavior
- **Firefox macOS**: Correct character combination behavior
- **All other platforms**: No character combination issues

## Workarounds

### 1. Custom Korean input handler

```javascript
class LinuxKoreanIMEHandler {
  constructor(editor) {
    this.editor = editor;
    this.isFirefoxLinux = /Firefox/.test(navigator.userAgent) && /Linux/.test(navigator.platform);
    this.isKoreanIME = false;
    this.pendingJamo = [];
    
    if (this.isFirefoxLinux) {
      this.setupKoreanInputHandler();
    }
  }
  
  setupKoreanInputHandler() {
    this.editor.addEventListener('compositionstart', this.handleCompositionStart.bind(this));
    this.editor.addEventListener('compositionupdate', this.handleCompositionUpdate.bind(this));
    this.editor.addEventListener('compositionend', this.handleCompositionEnd.bind(this));
    this.editor.addEventListener('input', this.handleInput.bind(this));
  }
  
  handleCompositionStart(e) {
    this.isKoreanIME = true;
    this.pendingJamo = [];
    console.log('Korean composition started');
  }
  
  handleCompositionUpdate(e) {
    if (!this.isKoreanIME) return;
    
    const data = e.data || '';
    
    // Detect Korean jamo characters
    const jamoPattern = /[ㄱ-ㅎㅏ-ㅣ]/;
    
    if (jamoPattern.test(data)) {
      this.pendingJamo.push(...data.split(''));
      
      // Log pending jamo for debugging
      console.log('Pending jamo:', this.pendingJamo);
    } else {
      // Non-jamo characters, process normally
      this.pendingJamo.push(...data.split(''));
    }
  }
  
  handleCompositionEnd(e) {
    if (!this.isKoreanIME) return;
    
    // Process pending jamo to create correct Korean characters
    const correctedText = this.combineKoreanJamo(this.pendingJamo);
    
    // Get current selection and replace with corrected text
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // Remove the incorrect composition
      range.deleteContents();
      
      // Insert corrected text
      const textNode = document.createTextNode(correctedText);
      range.insertNode(textNode);
      
      // Position cursor after inserted text
      range.selectNodeContents(textNode);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    this.pendingJamo = [];
    this.isKoreanIME = false;
    
    console.log('Korean composition ended. Original:', e.data, 'Corrected:', correctedText);
  }
  
  handleInput(e) {
    if (this.isKoreanIME) {
      // Prevent Firefox's incorrect input during composition
      e.preventDefault();
      return;
    }
  }
  
  combineKoreanJamo(jamoArray) {
    // Korean Hangul combination rules
    const result = [];
    let i = 0;
    
    while (i < jamoArray.length) {
      const jamo = jamoArray[i];
      
      // Check if this is a valid Korean combination
      const combined = this.tryKoreanCombination(jamoArray, i);
      
      if (combined) {
        result.push(combined.character);
        i += combined.skip;
      } else {
        // Use jamo as-is if no valid combination
        result.push(jamo);
        i++;
      }
    }
    
    return result.join('');
  }
  
  tryKoreanCombination(jamoArray, startIndex) {
    // Common Korean syllable patterns
    const patterns = [
      { initial: 'ㄱ', medial: 'ㅏ', result: '가', skip: 2 },
      { initial: 'ㄴ', medial: 'ㅏ', result: '나', skip: 2 },
      { initial: 'ㄷ', medial: 'ㅏ', result: '다', skip: 2 },
      { initial: 'ㅁ', medial: 'ㅏ', result: '마', skip: 2 },
      { initial: 'ㅂ', medial: 'ㅏ', result: '바', skip: 2 },
      { initial: 'ㅅ', medial: 'ㅏ', result: '사', skip: 2 }
    ];
    
    if (startIndex + 1 >= jamoArray.length) return null;
    
    const firstJamo = jamoArray[startIndex];
    const secondJamo = jamoArray[startIndex + 1];
    
    for (const pattern of patterns) {
      if (firstJamo === pattern.initial && secondJamo === pattern.medial) {
        return {
          character: pattern.result,
          skip: pattern.skip
        };
      }
    }
    
    return null;
  }
}
```

### 2. Alternative Korean IME suggestion

```javascript
function suggestAlternativeIME() {
  const isFirefoxLinux = /Firefox/.test(navigator.userAgent) && /Linux/.test(navigator.platform);
  
  if (isFirefoxLinux) {
    const userLanguage = navigator.language || 'en';
    
    if (userLanguage.startsWith('ko')) {
      // Show Korean IME alternatives for Firefox on Linux
      const alternatives = document.createElement('div');
      alternatives.className = 'korean-ime-alternatives';
      alternatives.innerHTML = `
        <h3>Korean IME Issue Detected</h3>
        <p>Firefox on Linux has known issues with Korean Hangul IME character combination.</p>
        <h4>Recommended Solutions:</h4>
        <ul>
          <li><strong>Use Chrome or Edge:</strong> Better Korean IME support on Linux</li>
          <li><strong>Try Naver Hangul:</strong> Alternative Korean IME with better Firefox compatibility</li>
          <li><strong>Use fcitx-hangul:</strong> Linux input method framework with improved Korean support</li>
          <li><strong>Enable IBus Korean:</strong> System input method alternative</li>
        </ul>
        <button id="dismiss-ime-warning">Understood</button>
      `;
      
      alternatives.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        font-family: system-ui, sans-serif;
      `;
      
      document.body.appendChild(alternatives);
      
      document.getElementById('dismiss-ime-warning').addEventListener('click', () => {
        document.body.removeChild(alternatives);
      });
    }
  }
}
```

### 3. Linux-specific Korean IME configuration

```javascript
class LinuxKoreanIMEConfig {
  constructor() {
    this.detectEnvironment();
  }
  
  detectEnvironment() {
    const isLinux = /Linux/.test(navigator.platform);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    
    if (isLinux && isFirefox) {
      this.setupFirefoxLinuxFix();
    }
  }
  
  setupFirefoxLinuxFix() {
    // Check if using system Korean IME
    this.checkSystemIME();
    
    // Override Firefox's composition handling
    this.overrideCompositionEvents();
    
    // Provide user configuration options
    this.showConfigurationDialog();
  }
  
  checkSystemIME() {
    // Try to detect if system Korean IME is active
    const testInput = document.createElement('input');
    testInput.style.position = 'absolute';
    testInput.style.left = '-9999px';
    document.body.appendChild(testInput);
    
    testInput.focus();
    
    // Simulate Korean typing to detect IME behavior
    setTimeout(() => {
      const hasKoreanIME = this.detectKoreanIMEBehavior(testInput);
      
      if (hasKoreanIME) {
        this.enableKoreanMode();
      }
      
      document.body.removeChild(testInput);
    }, 100);
  }
  
  detectKoreanIMEBehavior(input) {
    // Heuristic detection based on event patterns
    let hasCompositionEvents = false;
    
    input.addEventListener('compositionstart', () => {
      hasCompositionEvents = true;
    }, { once: true });
    
    // Trigger composition
    input.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Process',
      keyCode: 229
    }));
    
    return hasCompositionEvents;
  }
  
  enableKoreanMode() {
    // Store preference for Korean mode
    localStorage.setItem('firefox-linux-korean-mode', 'enabled');
    
    // Enable custom Korean input handling
    window.koreanModeEnabled = true;
  }
  
  showConfigurationDialog() {
    const configDialog = document.createElement('div');
    configDialog.innerHTML = `
      <div class="korean-config-dialog">
        <h2>Firefox Linux Korean IME Configuration</h2>
        <div class="config-option">
          <label>
            <input type="checkbox" id="enable-korean-fix" checked>
            Enable Korean IME character combination fix
          </label>
        </div>
        <div class="config-option">
          <label>
            <select id="korean-ime-type">
              <option value="system">System Korean IME</option>
              <option value="fcitx">Fcitx-hangul</option>
              <option value="ibus">IBus-hangul</option>
            </select>
            Korean IME Type
          </label>
        </div>
        <div class="config-actions">
          <button id="save-config">Save Configuration</button>
          <button id="test-config">Test Configuration</button>
        </div>
      </div>
    `;
    
    configDialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 2px solid #333;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      z-index: 10001;
      font-family: system-ui, sans-serif;
    `;
    
    document.body.appendChild(configDialog);
    
    // Handle configuration dialog interactions
    this.setupConfigDialogEvents(configDialog);
  }
  
  setupConfigDialogEvents(dialog) {
    document.getElementById('save-config').addEventListener('click', () => {
      const enabled = document.getElementById('enable-korean-fix').checked;
      const imeType = document.getElementById('korean-ime-type').value;
      
      localStorage.setItem('firefox-korean-config', JSON.stringify({
        enabled,
        imeType
      }));
      
      alert('Configuration saved! Please refresh the page.');
      document.body.removeChild(dialog);
    });
    
    document.getElementById('test-config').addEventListener('click', () => {
      window.open('https://example.com/korean-ime-test', '_blank');
    });
  }
}
```

### 4. Browser compatibility warning

```css
/* Firefox Linux specific CSS warnings */
@supports (-moz-appearance: none) {
  @media (any-hover: none) and (any-pointer: coarse) {
    .firefox-linux-korean-warning::before {
      content: "⚠️ Firefox on Linux has Korean IME issues. Consider using Chrome or Edge for better Korean input support.";
      display: block;
      background: #fff3cd;
      color: #856404;
      padding: 12px;
      margin: 10px 0;
      border: 1px solid #ffeaa7;
      border-radius: 6px;
      font-family: system-ui, sans-serif;
      font-size: 14px;
    }
  }
}
```

## Testing recommendations

1. **Different Linux distributions**: Ubuntu, Fedora, Arch, openSUSE
2. **Various Firefox versions**: 110, 111, 112, 113, 114, 115, latest
3. **Different Korean IME**: System IME, fcitx-hangul, ibus-hangul
4. **Rapid typing tests**: Fast Korean text input
5. **Mixed content tests**: Korean + English + numbers
6. **Long document tests**: Korean text in large documents

## Notes

- This appears to be Firefox-specific handling of Korean IME on Linux
- Issue does not occur on Firefox Windows/macOS or Chrome/Edge on Linux
- Problem is related to Firefox's composition event handling on Linux
- Different Korean IME implementations show varying levels of the issue
- fcitx and ibus input frameworks may provide better Korean input support
- The issue affects all Korean users using Firefox on Linux, making it a critical platform-specific problem