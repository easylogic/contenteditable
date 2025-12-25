---
id: ce-0137
scenarioId: scenario-blockquote-behavior
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Exiting blockquote requires multiple Enter presses
description: "When editing text inside a blockquote in Chrome, exiting the blockquote to create normal paragraphs requires multiple Enter key presses or manual manipulation. It's difficult to exit the quote context."
tags:
  - blockquote
  - exit
  - enter
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<blockquote><p>Quoted text</p></blockquote>'
    description: "blockquote 요소, 커서가 텍스트 끝에 위치"
  - label: "After First Enter (Bug)"
    html: '<blockquote><p>Quoted text</p><p></p></blockquote>'
    description: "첫 번째 Enter로 blockquote 내부에 새 단락 생성"
  - label: "After Multiple Enters (Bug)"
    html: '<blockquote><p>Quoted text</p><p></p><p></p></blockquote>'
    description: "여러 번 Enter를 눌러도 blockquote를 벗어나기 어려움"
  - label: "✅ Expected"
    html: '<blockquote><p>Quoted text</p></blockquote><p></p>'
    description: "정상: Enter 한 번으로 blockquote 외부에 새 단락 생성"
---

### Phenomenon

When editing text inside a blockquote in Chrome, exiting the blockquote to create normal paragraphs requires multiple Enter key presses or manual manipulation. It's difficult to exit the quote context.

### Reproduction example

1. Create a blockquote: `<blockquote><p>Quoted text</p></blockquote>`
2. Place cursor at the end of the text
3. Press Enter multiple times

### Observed behavior

- First Enter creates paragraph within blockquote
- Multiple Enters may be needed to exit
- Or blockquote cannot be exited easily
- User must manually manipulate DOM

### Expected behavior

- Should be able to exit blockquote easily
- Or behavior should be predictable
- User should understand how to exit
- Exit should be intuitive

### Browser Comparison

- **Chrome/Edge**: Exit may require multiple Enters (this case)
- **Firefox**: Similar exit difficulty
- **Safari**: Exit behavior most inconsistent

### Notes and possible direction for workarounds

- Intercept Enter at end of blockquote
- Create paragraph outside blockquote
- Provide clear exit mechanism
- Document blockquote exit behavior

