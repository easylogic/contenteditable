---
id: ce-0001
scenarioId: scenario-baseline
locale: en
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: Latest
keyboard: US
caseTitle: Baseline typing and composition in a simple contenteditable region
tags:
  - composition
  - baseline
status: draft
---

### Phenomenon

This case describes a baseline scenario for inspecting how a plain `contenteditable` region behaves
with typing, composition, and basic navigation keys.

### Reproduction example

1. Focus the editable area.
2. Type ASCII text and observe `keydown`, `beforeinput`, and `input` events.
3. Switch to an IME (for example, Korean or Japanese) and type composed characters.
4. Use Backspace and the arrow keys to move the caret.

### Observed behavior

- The event order for simple typing is stable within a given browser and OS.
- Composition events fire when using an IME.

### Expected behavior

- This scenario is used as a reference. Other cases can be compared against this baseline to detect
  differences introduced by specific operating systems, devices, browsers, or keyboard layouts.

