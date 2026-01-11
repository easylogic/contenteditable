---
id: scenario-mobile-focus-management
title: Mobile Focus Management for contenteditable
description: "Comprehensive focus management strategies for mobile contenteditable implementations, addressing touch focus issues, virtual keyboard behavior, and browser-specific focus quirks."
tags:
  - mobile
  - focus
  - touch
  - virtual-keyboard
  - ios
  - android
  - viewport
  - user-experience
status: draft
---

## Problem Overview

Mobile contenteditable implementations face unique focus management challenges that differ significantly from desktop experiences:

1. **Touch vs Mouse Focus** - Different focus indicators and behaviors
2. **Virtual Keyboard Interference** - Keyboard appearance/disappearance affects focus
3. **Viewport Changes** - Scrolling and resizing can lose focus
4. **Browser-Specific Quirks** - iOS Safari, Android Chrome focus behaviors
5. **Accessibility Conflicts** - Screen reader focus vs editor focus
6. **Multiple Editors** - Managing focus between multiple contenteditable elements

## 1. Touch Focus Behavior

### Touch Focus Activation

```javascript
// Detect and handle touch-based focus
document.addEventListener('touchstart', (e) => {
  const touchTarget = e.target;
  
  // Check if touch target is a contenteditable or contains one
  if (touchTarget.closest('[contenteditable]')) {
    handleTouchFocus(touchTarget, e);
  }
}, { passive: true });

function handleTouchFocus(element, event) {
  // Record focus source for later restoration
  if (!element.dataset.focusSource) {
    element.dataset.focusSource = 'touch';
  }
  
  // Prevent default tap zooming on focus
  if (element.style.touchAction === 'auto') {
    element.style.touchAction = 'pan-x pan-y';
  }
}
```

### Touch Focus Indication

```css
/* Visual focus indication for touch */
[contenteditable]:focus {
  outline: 3px solid #007AFF;
  outline-offset: -1px;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

[contenteditable]:focus::after {
  outline-color: #0052CC;
  box-shadow: 0 0 0 1px rgba(0, 82, 204, 0.3);
}

/* iOS Safari specific focus indicator */
@supports (-webkit-touch: 0) and (hover: none) {
  [contenteditable]:focus {
    outline: none;
    background: #E8F0FD;
    box-shadow: 0 0 10px rgba(0, 122, 255, 0.2);
  }
}
```

## 2. Virtual Keyboard Integration

### Keyboard Show/Hide Events

```javascript
class VirtualKeyboardManager {
  constructor(editor) {
    this.editor = editor;
    this.isKeyboardVisible = false;
    this.originalScrollPosition = { x: 0, y: 0 };
    this.originalFocusElement = null;
    
    this.setupKeyboardListeners();
  }
  
  setupKeyboardListeners() {
    // Detect keyboard appearance
    document.addEventListener('focusin', (e) => {
      if (e.target === this.editor) {
        this.handleEditorFocus(e);
      }
    }, { capture: true });
    
    document.addEventListener('focusout', (e) => {
      if (e.target === this.editor) {
        this.handleEditorBlur(e);
      }
    }, { capture: true });
    
    // Virtual keyboard detection (iOS/Android)
    this.editor.addEventListener('focus', () => {
      this.detectVirtualKeyboard();
    }, { capture: true });
    
    this.editor.addEventListener('blur', () => {
      setTimeout(() => {
        this.virtualKeyboardVisible = false;
        this.restoreScrollPosition();
      }, 300);
    });
  }
  
  handleEditorFocus(e) {
    // Save original scroll position
    this.originalScrollPosition = {
      x: this.editor.scrollLeft,
      y: this.editor.scrollTop
    };
    
    // Check for virtual keyboard
    if (this.virtualKeyboardVisible) {
      // If keyboard is visible, keep editor visible
      this.ensureEditorVisible();
    }
  }
  
  handleEditorBlur(e) {
    // Check if virtual keyboard is showing
    if (this.virtualKeyboardVisible) {
      // If keyboard is visible, don't lose focus
      e.preventDefault();
      return;
    }
  }
  
  detectVirtualKeyboard() {
    // iOS detection
    this.isIOSSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) &&
                      /Safari/.test(navigator.userAgent);
    
    // Android detection
    this.isAndroid = /Android/.test(navigator.userAgent);
    
    if (this.isIOSSafari) {
      // iOS: Check for keyboard via resize
      this.setupIOSKeyboardDetection();
    } else if (this.isAndroid) {
      // Android: Check for keyboard via layout changes
      this.setupAndroidKeyboardDetection();
    }
  }
  
  setupIOSKeyboardDetection() {
    const initialHeight = window.visualViewport?.height || window.innerHeight;
    this.isKeyboardVisible = false;
    
    window.visualViewport.addEventListener('resize', (e) => {
      const newHeight = e.target.height;
      const heightDiff = Math.abs(newHeight - initialHeight);
      
      // If viewport shrinks significantly, keyboard appeared
      if (heightDiff > 150) {
        this.isKeyboardVisible = true;
      this.adjustForKeyboard(true);
      }
    });
  }
  
  setupAndroidKeyboardDetection() {
    // Android uses layout changes when keyboard appears
    let initialEditorHeight = this.editor.offsetHeight;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const heightDiff = Math.abs(entry.contentRect.height - initialEditorHeight);
        
        if (heightDiff > 150) {
          this.isKeyboardVisible = true;
          this.adjustForKeyboard(true);
          initialEditorHeight = entry.contentRect.height;
        }
      }
    });
    
    resizeObserver.observe(this.editor);
  }
  
  adjustForKeyboard(keyboardVisible) {
    if (keyboardVisible) {
      // Adjust editor to avoid keyboard
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const keyboardHeight = viewportHeight * 0.4;
      
      // Reduce editor height
      this.editor.style.maxHeight = `${viewportHeight - keyboardHeight}px`;
      this.editor.style.height = 'auto';
    } else {
      // Restore full editor height
      this.editor.style.maxHeight = '';
      this.editor.style.height = '';
    }
  }
  
  ensureEditorVisible() {
    // Make sure editor is visible above keyboard
    const keyboardHeight = window.visualViewport?.height ? window.visualViewport.height * 0.4 : 0;
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const availableHeight = viewportHeight - keyboardHeight;
    
    if (this.editor.offsetTop > availableHeight) {
      this.editor.style.top = `${availableHeight / 2}px`;
    } else {
      this.editor.style.top = '';
    }
  }
  
  restoreScrollPosition() {
    if (this.originalScrollPosition) {
      this.editor.scrollLeft = this.originalScrollPosition.x;
      this.editor.scrollTop = this.originalScrollPosition.y;
      this.originalScrollPosition = null;
    }
  }
}
```

### enterkeyhint Integration

```html
<!-- Better keyboard support on mobile -->
<div contenteditable="true" enterkeyhint="done">
  Press enter to submit, return for next field
</div>

<div contenteditable="true" enterkeyhint="go">
  Press enter to move to next field
</div>

<div contenteditable="true" enterkeyhint="next">
  Press enter to move to next button
</div>

<div contenteditable="true" enterkeyhint="previous">
  Press enter to move to previous button
</div>

<div contenteditable="true" enterkeyhint="search">
  Press enter to open search
</div>

<div contenteditable="true" enterkeyhint="send">
  Press enter to send message
</div>
```

## 3. Viewport Management

### Scroll Position Preservation

```javascript
class ViewportPreserver {
  constructor(editor) {
    this.editor = editor;
    this.scrollHistory = [];
    this.maxHistory = 10;
  }
  
  saveScrollPosition() {
    this.scrollHistory.push({
      scrollTop: this.editor.scrollTop,
      scrollLeft: this.editor.scrollLeft,
      timestamp: Date.now()
    });
    
    if (this.scrollHistory.length > this.maxHistory) {
      this.scrollHistory.shift();
    }
  }
  
  restoreScrollPosition(focusSource) {
    // Find the most recent scroll position from same focus source
    const recentScrolls = this.scrollHistory.filter(
      s => s.source === focusSource
    ).sort((a, b) => b.timestamp - a.timestamp);
    
    if (recentScrolls.length > 0) {
      const { scrollTop, scrollLeft } = recentScrolls[0];
      this.editor.scrollTop = scrollTop;
      this.editor.scrollLeft = scrollLeft;
    }
  }
  
  trackFocusSource(source) {
    // Mark each scroll position with its source
    this.scrollHistory.forEach(s => {
      s.source = source;
    });
  }
}
```

### Responsive Viewport Adjustments

```javascript
class ResponsiveViewport {
  constructor() {
    this.editor = null;
    this.originalHeight = 0;
    
    this.setupResponsiveEditor();
  }
  
  setupResponsiveEditor() {
    this.editor = document.querySelector('[contenteditable]');
    this.originalHeight = this.editor.offsetHeight;
    
    // Initial adjustment
    this.adjustViewportForMobile();
    
    // Listen for orientation changes
    window.addEventListener('resize', () => this.adjustViewportForMobile());
    window.addEventListener('orientationchange', () => {
      this.adjustViewportForMobile();
      setTimeout(() => this.adjustViewportForMobile(), 100);
    });
  }
  
  adjustViewportForMobile() {
    const isPortrait = window.orientation.includes('portrait');
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const availableHeight = this.isPortrait ? viewportHeight * 0.8 : viewportHeight * 0.7;
    
    // Adjust editor height
    this.editor.style.maxHeight = `${availableHeight}px`;
    this.editor.style.height = 'auto';
  }
}
```

## 4. Browser-Specific Quirks

### iOS Safari Focus Issues

```javascript
class IOSSafariFocusFixes {
  constructor() {
    this.detectBrowser();
  }
  
  detectBrowser() {
    this.isIOSSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) &&
                      /Safari/.test(navigator.userAgent) &&
                      !/Chrome/.test(navigator.userAgent);
  }
  
  applyFocusFixes() {
    if (!this.isIOSSafari) return;
    
    // iOS Safari sometimes doesn't show focus indicator
    this.addFocusIndicatorFix();
    
    // iOS Safari focus issues with nested contenteditable
    this.addNestedFocusFix();
  }
  
  addFocusIndicatorFix() {
    const editors = document.querySelectorAll('[contenteditable]');
    
    editors.forEach(editor => {
      // iOS Safari: Force visual focus indication
      if (this.isIOSSafari) {
        editor.addEventListener('focus', () => {
          editor.style.boxShadow = '0 0 0 4px rgba(0, 122, 255, 0.5)';
        }, { capture: true });
        
        editor.addEventListener('blur', () => {
          editor.style.boxShadow = '';
        }, { capture: true });
      }
    });
  }
  
  addNestedFocusFix() {
    // iOS Safari: Focus management for nested contenteditable
    const nestedEditors = document.querySelectorAll('[contenteditable] [contenteditable]');
    
    nestedEditors.forEach(editor => {
      editor.addEventListener('focusin', (e) => {
        // Only one nested editor should have focus at a time
        nestedEditors.forEach(ce => {
          if (ce !== editor && ce !== e.relatedTarget) {
            ce.blur();
          }
        });
      }, { capture: true });
    });
  }
}
```

### Android Chrome Focus Quirks

```javascript
class AndroidChromeFocusFixes {
  constructor(editor) {
    this.editor = editor;
    this.isAndroid = /Android/.test(navigator.userAgent);
    this.isChrome = /Chrome/.test(navigator.userAgent);
    
    if (this.isAndroid && this.isChrome) {
      this.setupFixes();
    }
  }
  
  setupFixes() {
    // Android Chrome: Focus can be lost when virtual keyboard appears
    this.addFocusRetentionFix();
    
    // Android Chrome: Tap highlighting issues
    this.addTapHighlightFix();
  }
  
  addFocusRetentionFix() {
    this.editor.addEventListener('focus', () => {
      this.editor.setAttribute('data-focus-active', 'true');
    }, { capture: true });
    
    this.editor.addEventListener('blur', () => {
      // Check if virtual keyboard is still visible
      setTimeout(() => {
        if (this.isKeyboardVisible()) {
          // Re-focus editor if keyboard disappeared
          this.editor.focus();
        }
        this.editor.removeAttribute('data-focus-active');
      }, 300);
    }, { capture: true });
  }
  
  isKeyboardVisible() {
    // Check if virtual keyboard is visible
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const editorHeight = this.editor.offsetHeight;
    
    // If editor height reduced significantly, keyboard is visible
    return viewportHeight - editorHeight > 200;
  }
}
```

## 5. Accessibility Considerations

### Screen Reader Integration

```javascript
class AccessibleFocusManager {
  constructor(editor) {
    this.editor = editor;
    this.ariaLiveRegion = null;
    this.lastAnnouncedFocus = false;
  }
  
  setupAccessibility() {
    // Add ARIA live region for focus changes
    this.ariaLiveRegion = document.createElement('div');
    this.ariaLiveRegion.id = 'focus-announcer';
    this.ariaLiveRegion.className = 'sr-only';
    this.ariaLiveRegion.setAttribute('aria-live', 'polite');
    document.body.appendChild(this.ariaLiveRegion);
    
    // Announce focus changes
    this.editor.addEventListener('focus', () => {
      this.announceFocus('focused');
    }, { capture: true });
    
    this.editor.addEventListener('blur', () => {
      this.announceFocus('blurred');
    }, { capture: true });
  }
  }
  
  announceFocus(state) {
    // Announce focus state to screen readers
    const message = state === 'focused' ? 'Editor focused' : 'Editor blurred';
    
    this.ariaLiveRegion.textContent = message;
    this.lastAnnouncedFocus = state;
  }
}
```

### High Contrast Mode Support

```css
/* High contrast mode support for focused state */
@media (prefers-contrast: high) {
  [contenteditable]:focus {
    background: #000000;
    color: #FFFFFF;
    outline: 3px solid #FFFF00;
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.8);
  }
}

@media (prefers-contrast: high) and (prefers-reduced-motion: reduce) {
  [contenteditable]:focus::before {
    animation: none;
  }
}
```

## 6. Multiple Editor Management

### Focus Coordination

```javascript
class MultiEditorCoordinator {
  constructor() {
    this.editors = new Map();
    this.activeEditor = null;
    this.lastFocusTime = Date.now();
  }
  
  registerEditor(id, editor) {
    this.editors.set(id, editor);
    
    editor.addEventListener('focus', () => {
      this.handleEditorFocus(id);
    }, { capture: true });
    
    editor.addEventListener('blur', () => {
      this.handleEditorBlur(id);
    }, { capture: true });
  }
  }
  
  handleEditorFocus(id) {
    const editor = this.editors.get(id);
    const now = Date.now();
    
    // Focus timeout for handling rapid focus changes
    clearTimeout(this.focusTimeout);
    
    this.focusTimeout = setTimeout(() => {
      this.activeEditor = id;
      
      // Notify other editors
      this.notifyFocusChange(id);
      
      // Update last focus time
      this.lastFocusTime = now;
    }, 100);
  }
  
  handleEditorBlur(id) {
    const wasActive = this.activeEditor === id;
    const timeSinceLastFocus = Date.now() - this.lastFocusTime;
    
    // Only consider it as a blur if it was active long enough
    if (wasActive && timeSinceLastFocus > 100) {
      clearTimeout(this.focusTimeout);
      
      this.activeEditor = null;
      this.notifyFocusChange(id);
    }
  }
  
  notifyFocusChange(focusedId) {
    // Notify all editors about focus change
    this.editors.forEach((id, editor) => {
      if (id === focusedId) {
        editor.classList.add('focus-active');
      } else {
        editor.classList.remove('focus-active');
      }
    });
  }
}
```

## Testing Guidelines

### Focus Management Testing

```javascript
// Test suite for focus management
const focusTests = {
  testTouchFocus: 'Tap editor multiple times',
  testKeyboardVisibility: 'Open/close virtual keyboard',
  testViewportScroll: 'Scroll editor and check focus retention',
  testMultipleEditors: 'Focus between multiple editors',
  testAccessibility: 'Test screen reader announcements',
  testHighContrast: 'Test high contrast mode focus',
  testOrientationChange: 'Rotate device during editing',
  testTapHighlighting: 'Tap to focus and verify highlighting',
  testFocusTransition: 'Rapidly focus different elements'
};

function runFocusTests() {
  console.log('Running mobile focus tests...');
  
  Object.entries(focusTests).forEach(([testName, testDescription]) => {
    console.log(`Testing: ${testDescription}`);
    // Implement test execution
  });
}
```

## Implementation Recommendations

### 1. Always Test on Real Devices

- Use BrowserStack or Sauce Labs for real device testing
- Test on iOS Safari, Android Chrome, and Samsung Internet
- Test with different keyboard apps (Gboard, SwiftKey, etc.)

### 2. Provide Fallbacks

Always have non-JavaScript fallbacks
- Test functionality without JavaScript enabled
- Provide server-side validation
- Gracefully degrade features

### 3. Monitor User Feedback

- Track focus-related issues in production
- Collect user reports of focus problems
- A/B test different focus management strategies

### 4. Keep Performance in Mind

- Minimize DOM manipulation during focus changes
- Use requestAnimationFrame for visual updates
- Avoid expensive calculations during focus transitions

---

This scenario provides comprehensive focus management strategies for mobile contenteditable implementations, addressing the unique challenges of touch devices, virtual keyboards, and browser-specific behaviors.