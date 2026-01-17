---
id: scenario-focus-management-ko
title: contenteditable 내의 특정 요소를 클릭하면 포커스가 손실됨
description: "contenteditable 영역에 대화형 요소(버튼, 링크 등)가 포함되어 있을 때 이러한 요소를 클릭하면 contenteditable이 포커스를 잃습니다. 이것은 편집 흐름을 중단하고 커서가 사라지게 만들 수 있습니다."
category: focus
tags:
  - focus
  - click
  - firefox
status: draft
locale: ko
---

contenteditable 영역에 대화형 요소(버튼, 링크 등)가 포함되어 있을 때 이러한 요소를 클릭하면 contenteditable이 포커스를 잃습니다. 이것은 편집 흐름을 중단하고 커서가 사라지게 만들 수 있습니다.

## 참고 자료

- [Stack Overflow: contenteditable div loses selection when input focuses](https://stackoverflow.com/questions/12778508/contenteditable-div-loses-selection-when-another-input-focuses) - Focus loss issues
- [Stack Overflow: Avoid losing focus on contenteditable when clicking button](https://stackoverflow.com/questions/7392959/how-do-you-avoid-losing-focus-on-a-contenteditable-element-when-a-user-clicks-ou) - preventDefault solution
- [Stack Overflow: jQuery button click causes focus loss](https://stackoverflow.com/questions/53973882/jquery-button-click-causes-focus-loss-on-highlighted-text-in-editable-div) - Button focus behavior
- [GitHub Gist: WebKit focus hack](https://gist.github.com/1081133/cfb74dde66261a892c5db1726ff97f7edcd3f780) - WebKit blur workaround
