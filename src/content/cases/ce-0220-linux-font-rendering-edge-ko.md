---
id: ce-0220-linux-font-rendering-edge-ko
scenarioId: scenario-linux-font-rendering-edge
locale: ko
os: Linux
osVersion: "20.04+"
device: Desktop
deviceVersion: Any
browser: Edge
browserVersion: "110.0+"
keyboard: US QWERTY
caseTitle: Linux font rendering inconsistencies with contenteditable
description: "On Linux with Edge browser, contenteditable elements show inconsistent font rendering compared to regular text elements. Characters may appear at different sizes, weights, or with different anti-aliasing within the same contenteditable element, especially during typing or cursor movement."
tags:
  - linux
  - edge
  - font-rendering
  - anti-aliasing
  - visual-inconsistency
  - contenteditable
  - rendering
status: draft
domSteps:
  - label: "Initial content"
    html: '<div contenteditable="true" style="font-family: Arial, sans-serif; font-size: 16px;"><p>This is normal text with <strong>bold</strong> and <em>italic</em> formatting.</p></div>'
    description: "Content with mixed formatting"
  - label: "During typing"
    html: '<div contenteditable="true" style="font-family: Arial, sans-serif; font-size: 16px;"><p>This is normal text with <strong>bold</strong> and <em>italic</em> formatting. New text being typed...</p></div>'
    description: "Newly typed text may render differently"
  - label: "After cursor movement"
    html: '<div contenteditable="true" style="font-family: Arial, sans-serif; font-size: 16px;"><p>This is normal text with <strong>bold</strong> and <em>italic</em> formatting. New text being typed...</p></div>'
    description: "Existing text may change appearance when cursor moves over it"
---

## Phenomenon

On Linux with Edge browser, contenteditable elements display inconsistent font rendering where characters within the same element may appear with different sizes, weights, or anti-aliasing. This is particularly noticeable during typing, cursor movement, or when content is dynamically updated.

## Reproduction example

1. Open Edge browser on Linux (Ubuntu 20.04+ or similar).
2. Create a `contenteditable` element with specific font styling.
3. Type text with mixed formatting (bold, italic, different sizes).
4. Move cursor around the contenteditable area.
5. Observe character rendering inconsistencies.
6. Try different fonts (Arial, Times New Roman, system fonts).
7. Compare with regular (non-contenteditable) text elements.

## Observed behavior

### Font rendering inconsistencies:

1. **Size variations**: Characters appear at slightly different sizes within same element
2. **Weight differences**: Font weight appears inconsistent for same CSS values
3. **Anti-aliasing changes**: Some characters have different anti-aliasing than others
4. **Baseline shifts**: Text baseline may shift between characters or lines
5. **Kerning issues**: Character spacing appears uneven
6. **Dynamic changes**: Rendering changes during cursor movement or typing

### Specific patterns observed:

- **Newly typed text**: Often renders differently from existing text
- **Cursor proximity**: Text near cursor may render differently
- **Mixed formatting**: Transitions between formatted and unformatted text show inconsistencies
- **Font fallback**: Different system fonts may be used inconsistently
- **Color rendering**: Text color may appear slightly different

### System dependency:

- **Fontconfig issues**: Linux font configuration affects rendering
- **Freetype version**: Different versions produce different results
- **Desktop environment**: GNOME vs KDE vs other DEs show different behavior
- **Display server**: X11 vs Wayland variations
- **GPU acceleration**: Hardware vs software rendering differences

## Expected behavior

- All characters in same contenteditable should render consistently
- Font properties should be applied uniformly
- Anti-aliasing should be consistent across characters
- Cursor movement should not affect text rendering
- New text should match existing text appearance
- Rendering should match regular (non-contenteditable) elements

## Impact

- **Visual quality degradation**: Text appears unprofessional or "broken"
- **User experience**: Inconsistent appearance distracts users
- **Content readability**: Mixed rendering makes text harder to read
- **Brand consistency**: Affects professional appearance
- **Cross-platform issues**: Linux-specific behavior creates platform divergence

## Browser Comparison

- **Edge Linux**: Pronounced rendering inconsistencies in contenteditable
- **Chrome Linux**: Similar issues but less pronounced
- **Firefox Linux**: Generally better font handling, fewer inconsistencies
- **Edge Windows/Mac**: No issues - Linux-specific problem
- **Chrome Windows/Mac**: No issues
- **Safari Mac**: No issues

## Workarounds

### 1. Force hardware acceleration

```css
.contenteditable {
  transform: translateZ(0); /* Force hardware layer */
  backface-visibility: hidden;
  perspective: 1000px;
}
```

### 2. Normalize font rendering

```css
.contenteditable {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'kern' 1, 'liga' 1;
}
```

### 3. CSS containment

```css
.contenteditable {
  contain: content; /* Isolate rendering */
  isolation: isolate; /* Create new stacking context */
}
```

### 4. Font loading optimization

```javascript
class FontRenderer {
  constructor(editorElement) {
    this.editor = editorElement;
    this.loadedFonts = new Set();
    this.setupFontLoading();
  }
  
  setupFontLoading() {
    // Ensure fonts are loaded before enabling editing
    const fonts = this.extractFontsFromCSS();
    
    Promise.all(fonts.map(font => this.loadFont(font)))
      .then(() => {
        this.enableEditing();
      });
  }
  
  extractFontsFromCSS() {
    const styles = window.getComputedStyle(this.editor);
    const fontFamily = styles.fontFamily;
    
    // Extract font names and ensure they're available
    return fontFamily.split(',').map(font => 
      font.trim().replace(/['"]/g, '')
    );
  }
  
  loadFont(fontFamily) {
    return new Promise((resolve, reject) => {
      if (this.loadedFonts.has(fontFamily)) {
        resolve();
        return;
      }
      
      const font = new FontFace(fontFamily, `local(${fontFamily})`);
      
      font.load().then(() => {
        document.fonts.add(font);
        this.loadedFonts.add(fontFamily);
        resolve();
      }).catch(() => {
        // Font not available locally, use fallback
        resolve();
      });
    });
  }
  
  enableEditing() {
    // Force re-render after fonts are loaded
    this.editor.style.display = 'none';
    this.editor.offsetHeight; // Force reflow
    this.editor.style.display = '';
    
    // Stabilize rendering
    this.stabilizeRendering();
  }
  
  stabilizeRendering() {
    let frameCount = 0;
    const maxFrames = 10;
    
    const stabilize = () => {
      if (frameCount < maxFrames) {
        // Slight adjustments to trigger consistent rendering
        this.editor.style.transform = `translateZ(${frameCount * 0.01}px)`;
        frameCount++;
        requestAnimationFrame(stabilize);
      } else {
        this.editor.style.transform = '';
      }
    };
    
    requestAnimationFrame(stabilize);
  }
}
```

### 5. Linux-specific CSS fixes

```css
/* Linux-specific font rendering fixes */
@supports (-webkit-appearance: none) {
  .contenteditable {
    /* Edge on Linux detection and fixes */
    text-rendering: geometricPrecision;
    -webkit-text-stroke: 0.01em transparent;
    font-synthesis: none;
  }
}

/* Wayland specific */
@media (hover: none) and (pointer: coarse) {
  .contenteditable {
    text-rendering: optimizeSpeed;
  }
}

/* X11 specific */
@media (hover: hover) and (pointer: fine) {
  .contenteditable {
    text-rendering: optimizeLegibility;
  }
}
```

### 6. JavaScript rendering stabilization

```javascript
class LinuxContenteditableFix {
  constructor(editor) {
    this.editor = editor;
    this.isLinux = /Linux/.test(navigator.platform);
    this.isEdge = /Edg\//.test(navigator.userAgent);
    
    if (this.isLinux && this.isEdge) {
      this.applyLinuxEdgeFixes();
    }
  }
  
  applyLinuxEdgeFixes() {
    this.setupMutationObserver();
    this.setupInputHandling();
    this.forceConsistentRendering();
  }
  
  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      this.normalizeTextRendering();
    });
    
    observer.observe(this.editor, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }
  
  setupInputHandling() {
    this.editor.addEventListener('input', (e) => {
      setTimeout(() => {
        this.normalizeTextRendering();
      }, 0);
    });
    
    this.editor.addEventListener('selectionchange', () => {
      setTimeout(() => {
        this.normalizeTextRendering();
      }, 0);
    });
  }
  
  normalizeTextRendering() {
    // Force consistent text rendering
    const textNodes = this.getTextNodes(this.editor);
    
    textNodes.forEach(node => {
      const parent = node.parentElement;
      if (parent) {
        // Temporarily change to force re-render
        const originalDisplay = parent.style.display;
        parent.style.display = 'none';
        parent.offsetHeight; // Force reflow
        parent.style.display = originalDisplay;
      }
    });
  }
  
  getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }
    
    return textNodes;
  }
  
  forceConsistentRendering() {
    // Apply consistent rendering attributes
    this.editor.style.textRendering = 'geometricPrecision';
    this.editor.style.fontKerning = 'normal';
    this.editor.style.fontVariantLigatures = 'common-ligatures';
  }
}
```

## Testing recommendations

1. **Different Linux distributions**: Ubuntu, Fedora, Arch, openSUSE
2. **Various desktop environments**: GNOME, KDE, XFCE, i3
3. **Display servers**: X11 vs Wayland
4. **Different fonts**: System fonts, web fonts, variable fonts
5. **Edge versions**: 110, 111, 112, latest
6. **GPU acceleration**: On/off, different graphics cards

## Notes

- This appears to be specific to Edge's rendering engine on Linux
- Related to how Edge handles font rendering and text layout
- Issue persists across different font configurations
- Affects both Chromium-based Edge and legacy Edge
- May be related to Linux font system (Fontconfig, FreeType) integration