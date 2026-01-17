---
id: scenario-form-integration-ko
title: contenteditable 콘텐츠가 폼 제출에 포함되지 않음
description: "contenteditable 영역이 폼 내부에 있을 때 그 콘텐츠가 자동으로 폼 제출에 포함되지 않습니다. input과 textarea와 달리 contenteditable 콘텐츠는 수동으로 추출하여 폼 데이터에 추가해야 합니다."
category: other
tags:
  - form
  - submission
  - chrome
status: draft
locale: ko
---

contenteditable 영역이 `<form>` 내부에 있을 때 그 콘텐츠가 자동으로 폼 제출에 포함되지 않습니다. `<input>`과 `<textarea>`와 달리 contenteditable 콘텐츠는 수동으로 추출하여 폼 데이터에 추가해야 합니다.

## 참고 자료

- [Stack Overflow: Using contenteditable fields in form submission](https://stackoverflow.com/questions/6247702/using-html5-how-do-i-use-contenteditable-fields-in-a-form-submission) - Form integration patterns
- [Web.dev: More capable form controls](https://web.dev/articles/more-capable-form-controls) - formdata event
- [Drupal: Hidden form controls validation](https://www.drupal.org/project/drupal/issues/2571755) - Validation issues
