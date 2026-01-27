---
id: scenario-ime-ui-experience
title: "IME UI & Experience: Viewports, Candidates, and Layout"
description: "Managing browser UI collisions, virtual keyboard resizing, and IME candidate window positioning."
category: "ui"
tags: ["viewport", "keyboard", "candidates", "scroll", "anchoring"]
status: "confirmed"
locale: "en"
---

## Overview
The "IME experience" is not just about data—it's about the physical stability of the editor. Mobile browsers and floating candidate windows frequently collide with application UI.

## Key Experience Barriers

### 1. The 'Viewport Jump' (Scroll Anchoring)
When an IME is activated, the browser's "Visual Viewport" changes. 
- **Regression (iOS 18)**: Focusing a long document frequently fails to anchor the caret, causing the viewport to jump to the top of the container.
- **Android**: Chrome often resizes the entire content area, which can cause 'jumpy' layout if elements aren't sized with `dv` units.

### 2. Candidate Window Positioning
Floating windows (e.g., Japanese Kanji selection) are rendered by the OS but positioned by the browser.
- **Bug**: In `Fixed` or `Absolute` containers, WebKit often places the window at the absolute 0,0 screen coordinate instead of anchoring it to the caret.

### 3. Interactive Widget Behavior
Modern viewports define `interactive-widget=resizes-content`. Choosing between `resizes-content` and `resizes-visual` determines whether the editor's height shrinks or simply gets covered by the keyboard.

## Optimization Strategy: Viewport Sync

```javascript
/* Use the Visual Viewport API for stabilization */
window.visualViewport.addEventListener('resize', () => {
  if (isFocused && isIMEActive) {
      // Manually force caret into view to prevent snap-jump
      ensureCaretInCenter();
  }
});
```

## Related Cases
- [ce-0580: iOS scroll anchoring jump](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0580-ios-scroll-anchoring-jump.md)
- [ce-0049: Japanese IME candidate window position](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0049-ime-candidate-window-position.md)
