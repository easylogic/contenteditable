---
id: scenario-ime-ui-positioning
title: IME candidate window appears in wrong position
description: "When using an IME (Input Method Editor) in Chrome on macOS, the candidate window (which shows possible character conversions) may appear in the wrong position relative to the caret. It may be offset or appear far from where the user is typing."
category: ime
tags:
  - ime
  - ui
  - positioning
  - chrome
status: draft
locale: en
---

When using an IME (Input Method Editor) in Chrome on macOS, the candidate window (which shows possible character conversions) may appear in the wrong position relative to the caret. It may be offset or appear far from where the user is typing.

## Problem Description

This issue occurs specifically when:
1. User is on macOS
2. Using Chrome browser
3. Using IME for languages like Chinese, Japanese, or Korean
4. The candidate window appears at incorrect position (often at bottom of screen)

### Expected Behavior
- Candidate window should appear directly below or near the caret
- Window should follow caret position as user types
- Window should be visible and accessible

### Actual Behavior (Chrome Bug)
- **Wrong position**: Candidate window appears at bottom of screen or far from caret
- **Doesn't follow caret**: Window doesn't move when caret position changes
- **Hard to use**: User must look away from typing area to see candidates

## Affected Browsers

- **Chrome** (macOS) - Issue confirmed
- **Safari** (macOS) - Does NOT exhibit this behavior (works correctly)
- **Firefox** - May have similar issues in some versions

## Root Cause

Chrome's coordinate calculation for IME candidate window positioning appears to have issues with:
1. Converting between Chrome's rendering coordinate system and macOS window coordinates
2. Determining correct caret position in contenteditable elements
3. Updating candidate window position when caret moves

## Workarounds

1. **Switch input sources**: Temporarily switch to another IME and back
2. **Restart Chrome**: Can reset internal coordinate cache
3. **Use Safari**: Safari handles IME positioning correctly
4. **Adjust IME settings**: Change candidate window orientation in system preferences

## References

- [Reddit: Chrome IME candidate window positioning issue](https://www.reddit.com/r/ChineseLanguage/comments/d207j8) - User reports
- [Firefox Bug 1924949: IME candidate window positioned lower than expected on macOS](https://bugzilla.mozilla.org/show_bug.cgi?id=1924949) - Related Firefox issue (fixed in Firefox 133)
