---
id: ce-0088-contenteditable-with-media-query
scenarioId: scenario-media-query-layout
locale: en
os: Android
osVersion: "13"
device: Phone
deviceVersion: Any
browser: Chrome Mobile
browserVersion: "120.0"
keyboard: Mobile Samsung
caseTitle: Media query layout changes disrupt keyboard focus
description: "On mobile devices, layout shifts triggered by @media queries (such as orientation changes) can cause the virtual keyboard to dismiss and the selection to be lost."
tags: ["media-query", "layout", "mobile", "keyboard-dismiss"]
status: confirmed
---

## Phenomenon
When a CSS media query is triggered (e.g., rotating a device or shifting container width), browsers often trigger a layout pass that can invalidate the current DOM selection in mobile browsers, leading to the virtual keyboard being dismissed.

## Reproduction Steps
1. Open a contenteditable field on a mobile device.
2. Focus the field so the virtual keyboard appears.
3. Rotate the device (Portrait to Landscape).
4. Observe that the keyboard often disappears.

## Observed Behavior
The viewport change triggers a reflow that causes the browser to lose the active element focus if the element's bounding box moves significantly.
