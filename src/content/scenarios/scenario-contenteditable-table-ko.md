---
id: scenario-contenteditable-table-ko
title: "테이블 셀의 contenteditable이 레이아웃 문제를 일으킴"
description: "contenteditable 영역이 테이블 셀(`<td>`) 내부에 있을 때 Firefox에서 콘텐츠를 편집하면 레이아웃 문제가 발생할 수 있습니다. 테이블이 예상치 못하게 크기 조정되거나 셀이 오버플로우할 수 있습니다."
category: other
tags:
  - table
  - layout
  - contenteditable
  - firefox
status: draft
locale: ko
---

contenteditable 영역이 테이블 셀(`<td>`) 내부에 있을 때 Firefox에서 콘텐츠를 편집하면 레이아웃 문제가 발생할 수 있습니다. 테이블이 예상치 못하게 크기 조정되거나 셀이 오버플로우할 수 있습니다.

## 참고 자료

- [Stack Overflow: Make contenteditable respect initial size of table cell](https://stackoverflow.com/questions/79350342/how-to-make-contenteditable-respect-the-initial-size-of-a-table-cell) - Table layout issues
- [MDN: table-layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/table-layout) - table-layout CSS property
- [Stack Overflow: Firefox doesn't style empty elements](https://stackoverflow.com/questions/73812458/firefox-doesnt-style-empty-elements) - Empty cell behavior
