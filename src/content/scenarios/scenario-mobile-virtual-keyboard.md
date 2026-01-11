---
id: scenario-mobile-virtual-keyboard
title: Mobile Virtual Keyboard Integration for contenteditable
description: "Handling virtual keyboard appearance/disappearance on mobile devices when editing contenteditable elements, including viewport adjustments, scroll position preservation, and focus management."
tags:
  - mobile
  - virtual-keyboard
  - viewport
  - scroll-preservation
  - ios
  - android
  - focus-management
  - touch
  - user-experience
status: draft
---

## Problem Overview

Mobile virtual keyboards (Gboard, SwiftKey, Samsung Keyboard) create unique challenges for contenteditable editors:

1. **Viewport resize** when keyboard appears/disappears
2. **Focus management conflicts** between editor and keyboard
3. **Scroll position jumping** when content changes
4. **Selection loss** during keyboard transitions
5. **Cursor positioning issues** in resized viewport

## iOS Safari Specific Issues

### Virtual Keyboard Appearance

**Problem:** When iOS virtual keyboard appears, viewport height is reduced but contenteditable doesn't adjust properly.

**Observed Behavior:**
```
// iOS Safari
- Keyboard appears: viewport.height reduces ~300px
- Content remains at original scroll position
- Bottom of editor hidden behind keyboard
- User can't see what they're typing
```

**Root Causes:**
- No automatic scroll-to-visible when keyboard appears
- Content height doesn't account for keyboard
- Fixed positioning without viewport awareness

### Gboard (Android) Specific Issues

**Problem:** Gboard may interfere with contenteditable focus and input handling.

**Observed Behavior:**
```
// Gboard on Android
- Focus doesn't always transfer to editor
- Keyboard predictions override custom handlers
- Touch suggestions overlap with editor content
- IME composition events inconsistent
```

**Root Causes:**
- Input method API conflicts
- Touch event handling interference
- Suggestion UI overlaying editor

## Solution Strategies

### 1. Viewport Awareness

```javascript
class MobileViewportManager {
  constructor(editor) {
    this.editor = editor;
    this.keyboardHeight = 0;
    this.originalScrollY = 0;
    this.originalScrollHeight = 0;
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (this.isMobile) {
      this.setupViewportListeners();
    }
  }
  
  setupViewportListeners() {
    // Listen for keyboard appearance/disappearance
    this.editor.addEventListener('focus', this.handleFocus.bind(this));
    this.editor.addEventListener('blur', this.handleBlur.bind(this));
    
    // Listen for viewport resize
    const visualViewport = window.visualViewport;
    if (visualViewport) {
      visualViewport.addEventListener('resize', this.handleViewportResize.bind(this));
    }
    
    // Fallback for browsers without VisualViewport API
    window.addEventListener('resize', this.handleWindowResize.bind(this));
    
    // Listen for scroll events
    this.editor.addEventListener('scroll', this.handleScroll.bind(this));
  }
  
  handleViewportResize(event) {
    const oldHeight = this.keyboardHeight;
    const newHeight = event.target.height;
    
    if (newHeight !== oldHeight) {
      this.adjustForKeyboard(newHeight);
    }
  }
  
  handleWindowResize() {
    // Fallback for browsers without VisualViewport API
    const viewportHeight = window.innerHeight;
    const keyboardHeight = this.estimateKeyboardHeight();
    
    if (Math.abs(keyboardHeight - viewportHeight) > 100) {
      this.adjustForKeyboard(keyboardHeight);
    }
  }
  
  estimateKeyboardHeight() {
    // Estimate keyboard height based on device and viewport
    const isLandscape = window.orientation === 'landscape-primary' || 
                       window.orientation === 'landscape-secondary';
    
    if (this.isIOSSafari()) {
      // iOS keyboard height estimation
      return isLandscape ? 250 : 216;
    } else if (this.isAndroid()) {
      // Android keyboard height estimation
      return isLandscape ? 200 : 250;
    } else {
      // Desktop estimation
      return 0;
    }
  }
  
  adjustForKeyboard(keyboardHeight) {
    this.keyboardHeight = keyboardHeight;
    
    // Scroll last visible line to be visible above keyboard
    const editorRect = this.editor.getBoundingClientRect();
    const viewportHeight = this.getViewportHeight();
    
    // Calculate how much of editor is hidden
    const hiddenHeight = editorRect.bottom - (viewportHeight - keyboardHeight);
    
    if (hiddenHeight > 0) {
      // Scroll to make last visible line visible
      this.editor.scrollTop += hiddenHeight + 50; // +50px for padding
    }
  }
  
  getViewportHeight() {
    const visualViewport = window.visualViewport;
    if (visualViewport) {
      return visualViewport.height;
    }
    return window.innerHeight;
  }
  
  handleFocus() {
    // Save current scroll position
    this.originalScrollY = this.editor.scrollTop;
    this.originalScrollHeight = this.editor.scrollHeight;
  }
  
  handleBlur() {
    // Restore scroll position when keyboard disappears
    if (this.keyboardHeight > 0) {
      this.editor.scrollTop = this.originalScrollY;
    }
  }
  
  handleScroll() {
    // Update saved scroll position
    if (this.keyboardHeight === 0) {
      this.originalScrollY = this.editor.scrollTop;
    this.originalScrollHeight = this.editor.scrollHeight;
    }
  }
  
  isIOSSafari() {
    return /iPhone|iPad|iPod/.test(navigator.userAgent) && 
           /Safari/.test(navigator.userAgent) &&
           !/Chrome/.test(navigator.userAgent);
  }
  
  isAndroid() {
    return /Android/.test(navigator.userAgent);
  }
}
```

### 2. Focus Management

```javascript
class MobileFocusManager {
  constructor(editor) {
    this.editor = editor;
    this.keyboardVisible = false;
    this.editorFocusElement = null;
    this.inputType = 'text';
    
    this.setupFocusManagement();
  }
  
  setupFocusManagement() {
    this.editorFocusElement = document.activeElement;
    
    // Track keyboard visibility
    this.setupKeyboardVisibilityTracking();
    
    // Prevent focus loss when keyboard visible
    this.setupFocusRetention();
    
    // Handle iOS Safari focus issues
    if (this.isIOSSafari()) {
      this.setupIOSSafariFocusFix();
    }
  }
  
  setupKeyboardVisibilityTracking() {
    // Detect when virtual keyboard appears
    document.addEventListener('focus', (e) => {
      this.keyboardVisible = false;
    }, { capture: true });
    
    // Detect when virtual keyboard disappears
    document.addEventListener('blur', () => {
      this.keyboardVisible = false;
    }, { capture: true });
    
    // Alternative: use resize events
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const originalHeight = viewportHeight;
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', (e) => {
        this.keyboardVisible = e.target.height < originalHeight;
      });
    } else {
      window.addEventListener('resize', () => {
        const currentHeight = window.innerHeight;
        this.keyboardVisible = currentHeight < originalHeight;
      });
    }
  }
  
  setupFocusRetention() {
    // Prevent editor from losing focus when keyboard is visible
    this.editor.addEventListener('blur', (e) => {
      if (this.keyboardVisible && document.activeElement !== this.editor) {
        // Prevent focus loss
        e.preventDefault();
        setTimeout(() => {
          this.editor.focus();
        }, 50);
      }
    });
  }
  
  setupIOSSafariFocusFix() {
    // iOS Safari: Handle focus issues with contenteditable
    // Fix: Prevent contenteditable from losing focus to virtual keyboard
    
    document.addEventListener('focus', (e) => {
      if (e.target === this.editor) {
        // Track that editor has focus
        this.editorFocusElement = e.target;
      }
    }, { capture: true });
    
    // Fix: Handle nested contenteditable focus
    const handleNestedFocus = (e) => {
      if (e.target !== this.editor && this.editor.contains(e.target)) {
        // Nested contenteditable: Ensure only one has focus at a time
        e.target.blur();
      }
    };
    
    this.editor.addEventListener('focusin', handleNestedFocus, { capture: true, bubbles: false });
  }
  
  handleInputType(e) {
    this.inputType = e.inputType;
    
    // Detect if input is from virtual keyboard
    this.detectVirtualKeyboardInput(e);
  }
  
  detectVirtualKeyboardInput(e) {
    // Check if input is from virtual keyboard
    const isVirtualKeyboard = this.isIOSSafari() || this.isAndroid();
    
    if (isVirtualKeyboard) {
      // Virtual keyboard inputs often use different patterns
      console.log('Virtual keyboard input detected:', e);
    }
  }
}
```

### 3. Selection Preservation

```javascript
class MobileSelectionManager {
  constructor(editor) {
    this.editor = editor;
    this.savedSelection = null;
    this.touchStartTime = 0;
    this.lastTouchPosition = { x: 0, y: 0 };
  }
  
  setupSelectionPreservation() {
    this.editor.addEventListener('focus', this.handleFocus.bind(this));
    this.editor.addEventListener('blur', this.handleBlur.bind(this));
    this.editor.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.editor.addEventListener('touchend', this.handleTouchEnd.bind(this.editor));
    this.editor.addEventListener('touchmove', this.handleTouchMove.bind(this.editor));
  }
  
  handleFocus() {
    // Save current selection when editor gains focus
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      this.savedSelection = selection.getRangeAt(0).cloneRange();
    }
  }
  
  handleBlur() {
    // Restore selection when editor loses focus
    if (this.savedSelection) {
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) {
          selection.addRange(this.savedSelection);
        }
        this.savedSelection = null;
      }, 100);
    }
  }
  
  handleTouchStart(e) {
    // Save touch start position for drag selection
    const touch = e.touches[0];
    this.touchStartTime = Date.now();
    this.lastTouchPosition = { x: touch.clientX, y: touch.clientY };
  }
  
  handleTouchEnd(e) {
    // Check for drag selection
    const touchDuration = Date.now() - this.touchStartTime;
    
    if (touchDuration < 300 && this.lastTouchPosition) {
      // It's a tap, preserve selection
      console.log('Tap detected, preserving selection');
    } else {
      // Long touch, allow normal selection behavior
      console.log('Long touch, normal selection');
    }
  }
  
  handleTouchMove(e) {
    // Track touch movement for drag selection detection
    const touch = e.touches[0];
    
    if (touch) {
      const deltaX = touch.clientX - this.lastTouchPosition.x;
      const deltaY = touch.clientY - this.lastTouchPosition.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Update last position
      this.lastTouchPosition = { x: touch.clientX, y: touch.clientY };
      
      // If significant movement, it's a drag
      if (distance > 10) {
        console.log('Drag selection detected');
        this.editor.style.userSelect = 'none'; // Prevent default selection
      }
    }
  }
}
```

## Browser-Specific Solutions

### iOS Safari Solutions

```javascript
class IOSSafariVirtualKeyboardHandler {
  constructor(editor) {
    this.editor = editor;
    this.keyboardHeight = 0;
    this.isKeyboardVisible = false;
    this.initialScrollY = 0;
  }
  
  setupIOSSafariHandling() {
    // iOS Safari specific virtual keyboard handling
    this.setupResizeObserver();
    this.setupKeyboardDetection();
  }
  
  setupResizeObserver() {
    // iOS Safari: Use ResizeObserver for keyboard detection
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === this.editor) {
          const oldHeight = this.keyboardHeight;
          const newHeight = entry.contentRect.height;
          
          if (newHeight > oldHeight + 50) {
            // Keyboard appeared
            this.keyboardHeight = newHeight;
            this.isKeyboardVisible = true;
            this.adjustScrollPosition('keyboard-appear');
          } else if (newHeight < oldHeight - 50) {
            // Keyboard disappeared
            this.keyboardHeight = newHeight;
            this.isKeyboardVisible = false;
          }
        }
      }
    });
    
    this.resizeObserver.observe(this.editor);
  }
  
  setupKeyboardDetection() {
    // Detect keyboard via input type patterns
    this.editor.addEventListener('beforeinput', (e) => {
      if (e.inputType === 'insertText' && !e.isComposing) {
        // Likely virtual keyboard input
        this.isKeyboardVisible = true;
        this.adjustScrollPosition('keyboard-input');
      }
    });
  }
  
  adjustScrollPosition(reason) {
    const editorRect = this.editor.getBoundingClientRect();
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const availableHeight = viewportHeight - this.keyboardHeight;
    
    if (availableHeight > 0 && editorRect.bottom > availableHeight) {
      // Scroll editor into view
      const scrollTop = editorRect.bottom - availableHeight + 50; // +50px padding
      this.editor.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  }
}
```

### Android Chrome Solutions

```javascript
class AndroidVirtualKeyboardHandler {
  constructor(editor) {
    this.editor = editor;
    this.keyboardHeight = 0;
    this.enterkeyhint = 'go';
  }
  
  setupAndroidHandling() {
    // Android Chrome specific virtual keyboard handling
    this.setupEnterKeyHint();
    this.setupFocusManagement();
    this.setupViewportListener();
  }
  
  setupEnterKeyHint() {
    // Use enterkeyhint="go" for better keyboard integration
    this.editor.setAttribute('enterkeyhint', this.enterkeyhint);
  }
  
  setupFocusManagement() {
    // Handle focus conflicts between editor and virtual keyboard
    this.editor.addEventListener('focus', this.handleFocus.bind(this));
    this.editor.addEventListener('blur', this.handleBlur.bind(this));
    this.editor.addEventListener('beforeinput', this.handleBeforeInput.bind(this));
  }
  
  handleFocus() {
    console.log('Editor focused');
    this.editorFocusElement = document.activeElement;
  }
  
  handleBlur() {
    console.log('Editor blurred, active element:', document.activeElement);
    // Don't prevent blur - let browser manage focus
  }
  
  handleBeforeInput(e) {
    if (e.inputType === 'insertText' && e.isComposing === false) {
      // Likely virtual keyboard input
      console.log('Virtual keyboard input detected');
    }
  }
  
  setupViewportListener() {
    // Monitor viewport for keyboard appearance
    this.monitorViewportHeight();
  }
  
  monitorViewportHeight() {
    const checkHeight = () => {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const currentHeight = this.editor.offsetHeight;
      
      if (viewportHeight < currentHeight) {
        // Keyboard appeared
        this.keyboardHeight = viewportHeight;
        console.log('Keyboard height:', viewportHeight);
      }
    };
    
    // Check every 100ms
    this.heightCheckInterval = setInterval(checkHeight, 100);
  }
}
```

## Testing & Verification

### Automated Testing Framework

```javascript
class MobileVirtualKeyboardTester {
  constructor(editor) {
    this.editor = editor;
    this.testResults = [];
  }
  
  async runAllTests() {
    console.log('Starting mobile virtual keyboard tests...');
    
    // Test 1: Keyboard appearance
    await this.testKeyboardAppearance();
    
    // Test 2: Focus management
    await this.testFocusManagement();
    
    // Test 3: Selection preservation
    await this.testSelectionPreservation();
    
    // Test 4: Viewport resize
    await this.testViewportResize();
    
    return this.testResults;
  }
  
  async testKeyboardAppearance() {
    const testResult = {
      testId: 'mobile-vk-appearance',
      testName: 'Virtual Keyboard Appearance',
      description: 'Test that virtual keyboard appearance properly adjusts viewport',
      expectedBehavior: 'Viewport should resize, editor should scroll to keep visible content',
      actualBehavior: '',
      passed: false
    };
    
    try {
      // Record initial state
      const initialHeight = window.innerHeight;
      const initialScrollTop = this.editor.scrollTop;
      
      // Simulate keyboard appearance
      this.simulateKeyboardAppearance(true);
      
      await this.wait(500);
      
      // Check if viewport resized
      const newHeight = window.innerHeight;
      const newScrollTop = this.editor.scrollTop;
      
      testResult.actualBehavior = `Viewport: ${initialHeight}px → ${newHeight}px, Scroll: ${initialScrollTop}px → ${newScrollTop}px`;
      
      testResult.passed = Math.abs(newHeight - initialHeight) > 200; // Expect ~300px change
      
      this.testResults.push(testResult);
      
      // Reset
      this.simulateKeyboardAppearance(false);
      await this.wait(500);
      
    } catch (error) {
      console.error('Test failed:', error);
      testResult.details = `Error: ${error.message}`;
    }
    
    return testResult;
  }
  
  async testFocusManagement() {
    const testResult = {
      testId: 'mobile-vk-focus',
      testName: 'Focus Management',
      description: 'Test that editor maintains focus when virtual keyboard appears',
      expectedBehavior: 'Editor keeps focus, keyboard can be dismissed',
      actualBehavior: '',
      passed: false
    };
    
    try {
      const activeElement = document.activeElement;
      this.editor.focus();
      
      await this.wait(200);
      
      testResult.actualBehavior = `Focused element: ${activeElement?.tagName}`;
      testResult.passed = activeElement === this.editor;
      
      this.testResults.push(testResult);
      
    } catch (error) {
      console.error('Test failed:', error);
      testResult.details = `Error: ${error.message}`;
    }
    
    return testResult;
  }
  
  async testSelectionPreservation() {
    const testResult = {
      testId: 'mobile-vk-selection',
      testName: 'Selection Preservation',
      description: 'Test that selection is preserved when virtual keyboard appears',
      expectedBehavior: 'Selection range maintained, cursor position preserved',
      actualBehavior: '',
      passed: false
    };
    
    try {
      // Set up initial selection
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(this.editor);
      selection.removeAllRanges();
      selection.addRange(range);
      
      const initialRange = selection.getRangeAt(0).cloneRange();
      
      // Simulate keyboard appearance
      this.simulateKeyboardAppearance(true);
      await this.wait(500);
      
      const newRange = window.getSelection().getRangeAt(0);
      const isSelectionLost = !this.rangesEqual(initialRange, newRange);
      
      testResult.actualBehavior = isSelectionLost ? 'Selection lost' : 'Selection preserved';
      testResult.passed = !isSelectionLost;
      
      this.testResults.push(testResult);
      
      // Reset
      this.simulateKeyboardAppearance(false);
      await this.wait(500);
      
    } catch (error) {
      console.error('Test failed:', error);
      testResult.details = `Error: ${error.message}`;
    }
    
    return testResult;
  }
  
  rangesEqual(range1, range2) {
    return range1 !== null && range2 !== null &&
           range1.startContainer === range2.startContainer &&
           range1.startOffset === range2.startOffset &&
           range1.endContainer === range2.endContainer &&
           range1.endOffset === range2.endOffset;
  }
  
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  simulateKeyboardAppearance(visible) {
    // This would use automation tools or manual simulation
    console.log('Simulating keyboard appearance:', visible);
  }
}
```

## Implementation Guidelines

### For Mobile Virtual Keyboard Integration

1. **Always use viewport API** (visualViewport) when available
2. **Implement keyboard detection** via multiple methods (resize, input type patterns)
3. **Preserve scroll position** during keyboard transitions
4. **Handle focus conflicts** with proper event management
5. **Test on real devices** - Emulators don't always work correctly
6. **Provide fallbacks** for browsers without modern APIs
7. **Use enterkeyhint** attribute for better keyboard integration
8. **Monitor performance** - Virtual keyboard interactions can impact performance

### Device-Specific Recommendations

#### iOS Safari
- Use ResizeObserver for reliable keyboard detection
- Test with different virtual keyboards (SwiftKey, Gboard)
- Consider using -webkit-overflow-scrolling: touch
- Handle nested contenteditable focus properly

#### Android Chrome
- Use enterkeyhint="go" for better integration
- Monitor viewport.height for keyboard detection
- Test with Gboard variations
- Handle focus conflicts with virtual keyboard

#### General Mobile
- Test on multiple screen sizes
- Test in both portrait and landscape orientations
- Consider touch vs keyboard input modes
- Optimize for low-end devices

## Testing Checklist

- [ ] iOS Safari with SwiftKey virtual keyboard
- [ ] iOS Safari with Gboard virtual keyboard  
- [ ] Android Chrome with Gboard virtual keyboard
- [ ] iOS Safari portrait mode
- [ ] iOS Safari landscape mode
- [ ] Android Chrome portrait mode
- [ ] Android Chrome landscape mode
- [ ] Focus management during rapid typing
- [ ] Selection preservation during keyboard transitions
- [ ] Scroll position preservation
- [ ] Performance with large content

---

This comprehensive mobile virtual keyboard management scenario provides solutions for one of the most challenging aspects of mobile contenteditable development.