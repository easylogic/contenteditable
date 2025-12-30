---
id: scenario-insertHTML-behavior
title: insertHTML이 DOM 구조와 포맷팅을 손상시킴
description: "contenteditable 영역에 HTML 콘텐츠를 삽입하기 위해 document.execCommand('insertHTML', ...)를 사용할 때 DOM 구조가 손상되거나 예상치 못하게 재포맷될 수 있습니다. 중첩된 요소가 평탄화되거나 재구성될 수 있습니다."
category: formatting
tags:
  - insertHTML
  - dom
  - formatting
  - chrome
status: draft
locale: ko
---

`document.execCommand('insertHTML', ...)`를 사용하여 contenteditable 영역에 HTML 콘텐츠를 삽입할 때 DOM 구조가 손상되거나 예상치 못하게 재포맷될 수 있습니다. 중첩된 요소가 평탄화되거나 재구성될 수 있습니다.
