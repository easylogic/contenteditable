---
id: ce-0082-contenteditable-with-intersection-observer
scenarioId: scenario-intersection-observer-interference
locale: en
os: macOS
osVersion: "14.2"
device: Desktop
deviceVersion: Any
browser: Safari
browserVersion: "17.2"
keyboard: US
caseTitle: IntersectionObserver triggers unexpected editor resets
description: "Using IntersectionObserver to detect editor visibility can cause Safari to drop the IME composition buffer if the intersection state changes while typing."
tags: ["intersection-observer", "composition", "reset", "safari"]
status: confirmed
---

## Phenomenon
In Safari, if an `IntersectionObserver` is watching an editor div, and that div's intersection ratio changes (even slightly during scrolling or keyboard expansion), the browser may trigger a re-render cycle that clears the current IME composition.

## Reproduction Steps
1. Attach an `IntersectionObserver` to the editor.
2. Start an IME composition (e.g., Korean or Japanese).
3. Scroll the page so the editor's position moves slightly.
4. Observe that the current underlined text is immediately committed or deleted.

## Observed Behavior
Safari's "Is visible" check for event dispatching is sensitive to observer cycles, leading to premature `compositionend` events.
