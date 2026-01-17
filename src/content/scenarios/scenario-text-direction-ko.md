---
id: scenario-text-direction-ko
title: 텍스트 방향(dir 속성) 변경이 편집 중에 적용되지 않음
description: "contenteditable 영역에서 dir 속성이 동적으로 변경될 때(예: ltr과 rtl 간 전환) Firefox에서 활성 편집 중에 텍스트 방향이 올바르게 업데이트되지 않을 수 있습니다. 캐럿 위치와 텍스트 흐름이 잘못될 수 있습니다."
category: other
tags:
  - direction
  - rtl
  - ltr
  - firefox
status: draft
locale: ko
---

contenteditable 영역에서 `dir` 속성이 동적으로 변경될 때(예: `ltr`과 `rtl` 간 전환) Firefox에서 활성 편집 중에 텍스트 방향이 올바르게 업데이트되지 않을 수 있습니다. 캐럿 위치와 텍스트 흐름이 잘못될 수 있습니다.

## 참고 자료

- [Stack Overflow: dir="auto" doesn't work as expected in Firefox](https://stackoverflow.com/questions/14346486/dir-auto-doesnt-work-as-expected-in-firefox) - dir="auto" issues
- [MDN: dir global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/dir) - dir attribute documentation
- [Firefox Source Docs: RTL guidelines](https://firefox-source-docs.mozilla.org/code-quality/coding-style/rtl_guidelines.html) - Firefox RTL implementation
- [Wikimedia Phabricator: dir attribute issues](https://phabricator.wikimedia.org/T153356) - Related bug report
- [ProseMirror Discuss: Firefox contenteditable false cursor bug](https://discuss.prosemirror.net/t/firefox-contenteditable-false-cursor-bug/5016) - Related cursor issues
