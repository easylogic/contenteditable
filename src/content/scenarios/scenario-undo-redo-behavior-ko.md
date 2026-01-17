---
id: scenario-undo-redo-behavior-ko
title: 실행 취소 및 다시 실행 동작이 브라우저마다 일관되지 않음
description: "실행 취소 및 다시 실행 기능(Ctrl+Z / Ctrl+Y 또는 Cmd+Z / Cmd+Shift+Z)이 브라우저마다 다르게 동작합니다. 일부 브라우저는 개별 키 입력을 실행 취소하는 반면, 다른 브라우저는 더 큰 작업을 실행 취소합니다. 실행 취소 스택이 예상치 못하게 지워질 수도 있습니다."
category: other
tags:
  - undo
  - redo
  - browser-compatibility
status: draft
locale: ko
---

실행 취소 및 다시 실행 기능(Ctrl+Z / Ctrl+Y 또는 Cmd+Z / Cmd+Shift+Z)이 브라우저마다 다르게 동작합니다. 일부 브라우저는 개별 키 입력을 실행 취소하는 반면, 다른 브라우저는 더 큰 작업을 실행 취소합니다. 실행 취소 스택이 예상치 못하게 지워질 수도 있습니다.

이 시나리오는 여러 환경에서 유사한 동작으로 관찰되었습니다.

## 참고 자료

- [W3C Editing Issue #150: Native undo/redo behavior](https://github.com/w3c/editing/issues/150) - Specification discussion
- [MDN: Element beforeinput event](https://developer.mozilla.org/en-US/docs/Web/API/Element/beforeinput_event) - beforeinput with historyUndo/historyRedo
- [Can I Use: beforeinput event](https://caniuse.com/mdn-api_element_beforeinput_event) - Browser compatibility
- [ProseMirror Discuss: Native undo history](https://discuss.prosemirror.net/t/native-undo-history/1823) - Undo/redo behavior discussion
- [Stack Overflow: How to undo changes made from script](https://stackoverflow.com/questions/69857400/how-to-undo-changes-made-from-script-on-contenteditable-div) - Script changes
- [Stack Overflow: iframe undo redo for execCommand insertHTML](https://stackoverflow.com/questions/51831623/iframe-undo-redo-for-execcommand-using-inserthtml-contenteditable) - Element insertion undo issues
- [Chrome Developers: Introducing EditContext API](https://developer.chrome.com/blog/introducing-editcontext-api) - Future improvements
