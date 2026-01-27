---
id: scenario-ime-ui-experience
title: "IME UI & Layout: UX Synchronization and Viewport Logic"
description: "Analysis of the visual layer of IME input, including candidate windows, caret positioning, and mobile viewport shifts."
category: "ux"
tags: ["ime", "ux", "scrolling", "viewport", "candidate-window"]
status: "confirmed"
locale: "en"
---

## Problem Overview
IME input is not just data; it is a UI interaction. The browser must coordinate the system's "Candidate Window" (fixed UI) with the web's "Caret Position" (fluid DOM). Misalignment results in "Floating UI" or covered text.

## Observed Behavior

### 1. The 'Ghost' Candidate Window
On macOS, if a `contenteditable` container is positioned using `transform: translate`, the IME candidate window may appear at the wrong coordinates (often at the top-left of the screen), because the browser's coordinate mapping fails to account for the CSS transform.

### 2. Viewport Obstruction (Mobile)
When the mobile keyboard opens, the viewport shrinks or scrolls. 
- **The Android 'Auto-Scroll' Bug**: Chrome for Android sometimes scrolls the *entire page* to keep the caret visible, even if the editor is inside a fixed-height modal, breaking the layout.

### 3. Pinyin Visibility (Safari 18)
In recent Safari versions, the "Pinyin" (phonetic) buffer is often rendered directly into the DOM as part of the text node during composition. If the editor re-renders the DOM, this phonetic text may be accidentally "baked" into the document model.

## Solutions

### 1. Coordinate Proxying
For complex layouts, use a hidden "Caret Proxy" (a standard textarea) that mirrors the editor's focus but remains in the document flow to help the OS find the correct candidate window position.

### 2. Viewport Stabilization
Use the **Visual Viewport API** to detect when the keyboard shifts the layout and manually adjust padding or transiton logic.

```javascript
window.visualViewport.addEventListener('resize', () => {
    const offset = window.innerHeight - window.visualViewport.height;
    document.body.style.paddingBottom = `${offset}px`;
});
```

## Related Cases
- [ce-0568: Chrome Android Placeholder/Caret sync](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0568-chrome-android-placeholder-korean-ime.md)
- [ce-0194: Japanese IME scroll cancels in iOS Safari](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0194-japanese-ime-scroll-cancels-ios-safari.md)
---
id: scenario-ime-ui-experience
title: "IME UI & Layout: UX Synchronization and Viewport Logic"
description: "Analysis of the visual layer of IME input, including candidate windows, caret positioning, and mobile viewport shifts."
category: "ux"
tags: ["ime", "ux", "scrolling", "viewport", "candidate-window"]
status: "confirmed"
locale: "en"
---

## Problem Overview
IME input is not just data; it is a UI interaction. The browser must coordinate the system's "Candidate Window" (fixed UI) with the web's "Caret Position" (fluid DOM). Misalignment results in "Floating UI" or covered text.

## Observed Behavior

### 1. The 'Ghost' Candidate Window
On macOS, if a `contenteditable` container is positioned using `transform: translate`, the IME candidate window may appear at the wrong coordinates (often at the top-left of the screen), because the browser's coordinate mapping fails to account for the CSS transform.

### 2. Viewport Obstruction (Mobile)
When the mobile keyboard opens, the viewport shrinks or scrolls. 
- **The Android 'Auto-Scroll' Bug**: Chrome for Android sometimes scrolls the *entire page* to keep the caret visible, even if the editor is inside a fixed-height modal, breaking the layout.

### 3. Pinyin Visibility (Safari 18)
In recent Safari versions, the "Pinyin" (phonetic) buffer is often rendered directly into the DOM as part of the text node during composition. If the editor re-renders the DOM, this phonetic text may be accidentally "baked" into the document model.

## Solutions

### 1. Coordinate Proxying
For complex layouts, use a hidden "Caret Proxy" (a standard textarea) that mirrors the editor's focus but remains in the document flow to help the OS find the correct candidate window position.

### 2. Viewport Stabilization
Use the **Visual Viewport API** to detect when the keyboard shifts the layout and manually adjust padding or transiton logic.

```javascript
window.visualViewport.addEventListener('resize', () => {
    const offset = window.innerHeight - window.visualViewport.height;
    document.body.style.paddingBottom = `${offset}px`;
});
```

## Related Cases
- [ce-0568: Chrome Android Placeholder/Caret sync](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0568-chrome-android-placeholder-korean-ime.md)
- [ce-0194: Japanese IME scroll cancels in iOS Safari](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0194-japanese-ime-scroll-cancels-ios-safari.md)
