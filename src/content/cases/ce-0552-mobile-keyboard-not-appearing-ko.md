---
id: ce-0552-mobile-keyboard-not-appearing-ko
scenarioId: scenario-mobile-keyboard-not-appearing
locale: ko
os: iOS
osVersion: Any
device: Mobile
deviceVersion: Any
browser: Safari
browserVersion: Latest
keyboard: US
caseTitle: On-screen keyboard does not appear when focusing contenteditable on mobile
description: "On mobile WebKit (iOS and Android), the on-screen keyboard may not appear when focusing on contenteditable areas, making text input impossible."
tags:
  - mobile
  - ios
  - android
  - keyboard
  - focus
status: draft
---

## Phenomenon

On mobile WebKit browsers (iOS Safari and Android Chrome), when focusing on a contenteditable element, the on-screen keyboard may not appear. Additionally, the text caret might not render, leaving users uncertain about the input focus state.

## Reproduction example

1. Open a web page with a contenteditable div on iOS Safari or Android Chrome.
2. Tap on the contenteditable element.
3. Observe whether the on-screen keyboard appears.
4. Check if the caret is visible.
5. Try typing to see if input is accepted.

## Observed behavior

- **iOS Safari**: Keyboard may not appear when tapping contenteditable element.
- **Android Chrome**: Keyboard may not appear, especially in certain frameworks (e.g., Ionic).
- **Caret visibility**: Text caret may not render even when element has focus.
- **Focus state**: Element may appear focused but keyboard doesn't show.
- **Input acceptance**: Text input may not be accepted even with focus.
- **Framework-specific**: Issues more common in frameworks like Ionic, Framework7.

## Expected behavior

- Tapping a contenteditable element should show the on-screen keyboard.
- Text caret should be visible when element has focus.
- Text input should be accepted when keyboard is visible.
- Focus state should be clearly indicated to the user.

## Analysis

Mobile browsers handle contenteditable focus differently from desktop browsers. Some frameworks intercept touch events or apply CSS that prevents proper focus behavior. The browser may not recognize contenteditable as a valid input target.

## Workarounds

- Apply CSS: `-webkit-user-select: text;` to improve text selection on iOS.
- Ensure contenteditable element has proper focus handlers.
- In frameworks like Framework7, disable features like `activeState` that interfere.
- Use `inputmode` attribute to hint keyboard type: `contenteditable="true" inputmode="text"`
- Ensure element is not covered by other elements that intercept touch events.
- Programmatically focus element after tap: `element.focus()` in touch event handler.
- Use `touch-action: manipulation;` CSS to improve touch handling.
