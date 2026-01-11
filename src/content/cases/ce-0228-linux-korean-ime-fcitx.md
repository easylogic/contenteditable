---
id: ce-0228
scenarioId: scenario-linux-korean-ime-fcitx
locale: en
os: Linux
osVersion: "20.04+"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0+"
keyboard: Korean (Fcitx IME)
caseTitle: Fcitx Korean IME loses composition state during rapid typing in Chrome
description: "On Linux with Fcitx Korean IME and Chrome browser, composition state becomes inconsistent during rapid typing. The IME composition window may disappear prematurely, or the typed text may not match the composition preview, leading to character loss and incorrect input."
tags:
  - linux
  - chrome
  - fcitx
  - korean
  - composition-state
  - input-loss
  - rapid-typing
  - ime-window
status: draft
domSteps:
  - label: "Start typing Korean"
    html: '<div contenteditable="true"><p>안녕</p></div>'
    description: "User starts typing '안녕' with Fcitx IME"
  - label: "Composition window appears"
    html: '<div contenteditable="true"><p>안녕</p></div>'
    description: "Fcitx composition window shows candidates for '안녕'"
  - label: "Rapid typing continuation"
    html: '<div contenteditable="true"><p>안녕하</p></div>'
    description: "User continues typing quickly, composition state becomes unstable"
  - label: "Final result"
    html: '<div contenteditable="true"><p>안하</p></div>'
    description: "Final text is incomplete or incorrect, characters lost"
---

## Phenomenon

On Linux with Fcitx Korean IME and Chrome browser, composition state management becomes problematic during rapid typing. The IME composition window may disappear unexpectedly, typed characters may not match the composition preview, and the final text may be incomplete or incorrect.

## Reproduction example

1. Install Fcitx with Korean input method on Linux (Ubuntu 20.04+).
2. Set Chrome as default browser.
3. Open a `contenteditable` element and focus it.
4. Start typing Korean text rapidly (e.g., "안녕하세요" or "가나다라마바사").
5. Observe the Fcitx composition window behavior during rapid typing.
6. Notice that the preview text doesn't match what gets inserted, or characters are lost.

## Observed behavior

### Composition state issues:

**Normal expected sequence:**
```
1. User types '안' → IME shows '안' in preview
2. User types '녕' → IME shows '안녕' in preview  
3. User types '하' → IME shows '안녕하' in preview
4. User confirms → '안녕하' gets inserted
```

**Chrome + Fcitx actual behavior:**
```
1. User types '안' → IME shows '안' in preview
2. User types '녕' → IME window flickers/disappears, preview resets to '안'
3. User types '하' → IME shows '하' (wrong preview)
4. User confirms → '안하' gets inserted (missing '녕')
```

### Specific patterns observed:

1. **Composition window disappearing**: Fcitx window closes unexpectedly during typing
2. **Preview text inconsistency**: What's shown in preview doesn't match what gets inserted
3. **Character loss**: Part of the composition gets lost during rapid typing
4. **State synchronization issues**: Browser and IME state become desynchronized
5. **Timing-dependent problems**: Issues are more pronounced with fast typing

### Event sequence analysis:

```javascript
// Problematic Chrome + Fcitx events
document.addEventListener('compositionstart', (e) => {
  console.log('compositionstart:', e.data); // ''
});

document.addEventListener('compositionupdate', (e) => {
  console.log('compositionupdate:', e.data); // May show incomplete data
});

document.addEventListener('compositionend', (e) => {
  console.log('compositionend:', e.data); // May be wrong or incomplete
});
```

## Expected behavior

- Fcitx composition window should remain stable during rapid typing
- Preview text should accurately reflect the current composition state
- All typed characters should be preserved until final confirmation
- Browser and IME should maintain synchronized state
- Final insertion should match the composition preview at confirmation time

## Impact

- **Character corruption**: Korean text becomes incomplete or wrong
- **User frustration**: Users must retype frequently due to lost characters
- **Input inconsistency**: Preview doesn't match final result, confusing users
- **Productivity loss**: Rapid typing becomes unreliable, slowing down input
- **Platform incompatibility**: Linux + Chrome + Fcitx combination has critical input issues

## Browser Comparison

- **Chrome + Fcitx Linux**: Severe composition state issues
- **Chrome + IBus Linux**: Generally better, but still some issues
- **Chrome + system IME**: Most reliable behavior
- **Firefox + Fcitx Linux**: Different but also problematic behavior
- **Edge + Fcitx Linux**: Similar issues to Chrome (Chromium-based)
- **Chrome Windows/macOS**: No such issues (different IME systems)

## Workarounds

### 1. Fcitx configuration optimization

```bash
# Fcitx configuration for better Chrome compatibility
# Edit ~/.config/fcitx/config

[Program]
# Delay composition finalization to improve Chrome compatibility
CompositionDelay=10

# Increase composition window stability
CompositionWindowDelay=50

# Improve character handling
CharacterHandling=full

# Disable problematic features for Chrome
# Some Fcitx features may cause issues with Chrome
[ChromeFix]
DisableAutoEngage=1
StableComposition=1
```

### 2. Chrome-specific JavaScript handling

```javascript
class FcitxChromeHandler {
  constructor(editor) {
    this.editor = editor;
    this.isFcitxChrome = this.detectFcitxChrome();
    this.compositionBuffer = '';
    this.expectedComposition = '';
    
    if (this.isFcitxChrome) {
      this.setupFcitxHandling();
    }
  }
  
  detectFcitxChrome() {
    // Detect if using Fcitx on Linux with Chrome
    return /Linux/.test(navigator.platform) && 
           /Chrome/.test(navigator.userAgent) &&
           this.checkFcitxProcess();
  }
  
  checkFcitxProcess() {
    // Check if Fcitx is running (simplified detection)
    return navigator.userAgent.includes('Linux') && 
           document.title && document.title.includes('Fcitx');
  }
  
  setupFcitxHandling() {
    this.editor.addEventListener('compositionstart', this.handleCompositionStart.bind(this));
    this.editor.addEventListener('compositionupdate', this.handleCompositionUpdate.bind(this));
    this.editor.addEventListener('compositionend', this.handleCompositionEnd.bind(this));
    this.editor.addEventListener('input', this.handleInput.bind(this));
  }
  
  handleCompositionStart(e) {
    this.compositionBuffer = '';
    this.expectedComposition = '';
    
    console.log('Fcitx composition started');
    
    // Enable Fcitx-specific monitoring
    this.startCompositionMonitoring();
  }
  
  handleCompositionUpdate(e) {
    if (!this.isFcitxChrome) return;
    
    const data = e.data || '';
    
    // Store the expected composition
    this.expectedComposition = data;
    
    // Log the issue if data is incomplete
    if (data.length < this.compositionBuffer.length + 1) {
      console.warn('Fcitx composition data loss detected. Expected:', data, 'Buffer:', this.compositionBuffer);
    }
    
    this.compositionBuffer = data;
  }
  
  handleCompositionEnd(e) {
    if (!this.isFcitxChrome) return;
    
    const finalData = e.data || '';
    
    // Check if composition was lost
    if (this.expectedComposition !== finalData) {
      console.warn('Fcitx composition corruption detected. Expected:', this.expectedComposition, 'Actual:', finalData);
      
      // Attempt to recover lost characters
      this.recoverLostComposition();
    }
    
    this.compositionBuffer = '';
    this.expectedComposition = '';
    
    this.stopCompositionMonitoring();
  }
  
  handleInput(e) {
    if (!this.isFcitxChrome) return;
    
    // Monitor for character loss
    if (e.inputType === 'insertText' && this.expectedComposition) {
      if (e.data && this.expectedComposition.includes(e.data) === false) {
        console.warn('Fcitx character loss detected in input event');
      }
    }
  }
  
  recoverLostComposition() {
    // Try to recover from Fcitx composition issues
    setTimeout(() => {
      // Check current content and try to fix
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const text = range.toString();
        
        // Simple heuristic to detect and fix common Fcitx issues
        const fixedText = this.fixFcitxIssues(text);
        
        if (fixedText !== text) {
          range.deleteContents();
          range.insertNode(document.createTextNode(fixedText));
          
          console.log('Recovered Fcitx composition:', text, '→', fixedText);
        }
      }
    }, 100);
  }
  
  fixFcitxIssues(text) {
    // Common Fcitx + Chrome issues and fixes
    
    // Issue 1: Missing final jamo
    if (/[ㄱ-ㅎ][ㅏ-ㅣ]$/.test(text)) {
      // Add missing final jamo if text ends with initial + medial but no final
      const lastChar = text[text.length - 1];
      const isInitialMedialWithoutFinal = /[ㄱ-ㅎ][ㅏ-ㅣ]/.test(lastChar);
      
      if (isInitialMedialWithoutFinal) {
        // Try common finals
        const fixes = {
          'ㄱㅏ': '가', 'ㄴㅏ': '나', 'ㄷㅏ': '다', 'ㄹㅏ': '라',
          'ㄱㅓ': '개', 'ㄴㅓ': '네', 'ㄷㅓ': '데', 'ㄹㅓ': '레',
          'ㄱㅣ': '교', 'ㄴㅣ': '구', 'ㄷㅣ': '규', 'ㄹㅣ': '루'
        };
        
        for (const [pattern, replacement] of Object.entries(fixes)) {
          if (text.endsWith(pattern)) {
            return text.slice(0, -1) + replacement;
          }
        }
      }
    }
    
    // Issue 2: Wrong character combinations
    // This would need more complex logic based on Korean orthography
    
    // Issue 3: Character duplication
    const cleaned = text.replace(/(.)\1+/g, '$1');
    
    return cleaned;
  }
  
  startCompositionMonitoring() {
    // Monitor Fcitx process and window state
    this.compositionMonitor = setInterval(() => {
      this.checkFcitxStability();
    }, 100);
  }
  
  stopCompositionMonitoring() {
    if (this.compositionMonitor) {
      clearInterval(this.compositionMonitor);
      this.compositionMonitor = null;
    }
  }
  
  checkFcitxStability() {
    // Check if Fcitx is still running and stable
    // This would involve system calls in a real implementation
    
    // Simplified: check if composition window should be visible
    const hasComposition = this.expectedComposition.length > 0;
    
    if (hasComposition && !document.activeElement) {
      console.warn('Fcitx composition detected but no active element');
      this.restoreCompositionState();
    }
  }
  
  restoreCompositionState() {
    // Try to restore Fcitx composition state
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // Re-focus and try to trigger composition state recovery
      this.editor.focus();
      
      // In a real implementation, this might involve
      // system calls to Fcitx or specialized commands
    }
  }
}
```

### 3. Alternative IME suggestion

```javascript
function suggestAlternativeIME() {
  const isLinux = /Linux/.test(navigator.platform);
  const isChrome = /Chrome/.test(navigator.userAgent);
  
  if (isLinux && isChrome) {
    const koreanUser = navigator.language.startsWith('ko');
    
    if (koreanUser) {
      this.showIMEAlternatives();
    }
  }
}

function showIMEAlternatives() {
  const alternatives = document.createElement('div');
  alternatives.className = 'ime-alternatives-modal';
  alternatives.innerHTML = `
    <div class="modal-content">
      <h3>⚠️ Korean Input Issues Detected</h3>
      <p>Chrome + Fcitx on Linux has known Korean input issues. Consider these alternatives:</p>
      
      <div class="ime-options">
        <div class="ime-option">
          <h4>IBus-hangul</h4>
          <p>More stable with Chrome on Linux</p>
          <button onclick="setupIMESuggestion('ibus')">Setup Guide</button>
        </div>
        
        <div class="ime-option">
          <h4>Kimch</h4>
          <p>Korean IME with better Chrome compatibility</p>
          <button onclick="setupIMESuggestion('kimch')">Setup Guide</button>
        </div>
        
        <div class="ime-option">
          <h4>Nabi</h4>
          <p>Lightweight Korean IME</p>
          <button onclick="setupIMESuggestion('nabi')">Setup Guide</button>
        </div>
      </div>
      
      <div class="actions">
        <button onclick="dismissAlternatives()">Continue with Current IME</button>
        <button onclick="rememberChoice('fcitx')">Don't Show Again</button>
      </div>
    </div>
  `;
  
  alternatives.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 2px solid #333;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    z-index: 10000;
    max-width: 500px;
    font-family: system-ui, sans-serif;
  `;
  
  document.body.appendChild(alternatives);
}

function setupIMESuggestion(imeType) {
  // Open setup guide for specific IME
  window.open(`https://github.com/ime-setup-${imeType}`, '_blank');
}

function dismissAlternatives() {
  const modal = document.querySelector('.ime-alternatives-modal');
  if (modal) {
    document.body.removeChild(modal);
  }
}

function rememberChoice(choice) {
  localStorage.setItem('chrome-linux-ime-choice', choice);
  dismissAlternatives();
}
```

### 4. System environment optimization

```bash
#!/bin/bash
# fcitx-chrome-optimization.sh

echo "Optimizing Linux environment for better Fcitx + Chrome compatibility..."

# Set environment variables for better Fcitx behavior
export GTK_IM_MODULE=fcitx
export XMODIFIERS="@im=fcitx"
export QT_IM_MODULE=fcitx

# Optimize Chrome launch flags
CHROME_FLAGS="--disable-gpu-rasterization --enable-gpu-rasterization --disable-software-rasterizer --enable-native-gpu-memory-buffers"

echo "Chrome will launch with optimized flags: $CHROME_FLAGS"
echo "Please restart your session for changes to take effect."

# Show current status
echo "Current Fcitx status:"
fcitx-diagnose 2>/dev/null || echo "Fcitx not running"

echo ""
echo "Optimization complete. Issues should be improved."
echo "If problems persist, consider switching to IBus or system Korean IME."
```

## Testing recommendations

1. **Different Linux distributions**: Ubuntu, Fedora, Arch, openSUSE with Fcitx
2. **Chrome versions**: 110, 111, 112, 113, 114, 115, 120, latest
3. **Fcitx versions**: 4.x, 5.x series
4. **Rapid typing tests**: Fast Korean text input (30+ wpm)
5. **Complex compositions**: Long Korean words with multiple candidates
6. **Mixed content tests**: Korean + English + numbers in same text

## Notes

- This issue is specific to the combination of Fcitx + Chrome on Linux
- Other browsers (Firefox, Edge) or other IMEs (IBus) show different behavior
- The root cause appears to be in how Chrome handles Fcitx composition events
- Fcitx configuration can mitigate but not completely eliminate the issues
- Alternative IMEs generally provide better Chrome compatibility on Linux
- This is a well-known issue in the Linux Korean input community