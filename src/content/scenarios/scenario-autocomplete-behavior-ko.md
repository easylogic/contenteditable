---
id: scenario-autocomplete-behavior-ko
title: contenteditable에 자동 완성 제안이 나타나지 않음
description: "적절한 autocomplete 속성이 설정되어 있어도 contenteditable 영역에서 입력할 때 브라우저 자동 완성 제안(폼, 주소 등)이 나타나지 않습니다. 이것은 폼과 같은 입력에 대한 contenteditable의 유용성을 제한합니다."
category: other
tags:
  - autocomplete
  - suggestions
  - chrome
status: draft
locale: ko
---

적절한 `autocomplete` 속성이 설정되어 있어도 contenteditable 영역에서 입력할 때 브라우저 자동 완성 제안(폼, 주소 등)이 나타나지 않습니다. 이것은 폼과 같은 입력에 대한 contenteditable의 유용성을 제한합니다.

## 참고 자료

- [MDN: HTMLTextAreaElement.autocomplete](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/autocomplete) - autocomplete attribute documentation
- [MDN: autocorrect global attribute](https://developer.mozilla.org/docs/Web/HTML/Reference/Global_attributes/autocorrect) - autocorrect for contenteditable
- [jQuery UI Bug #14917: Autocomplete does not recognize contenteditable](https://bugs.jqueryui.com/ticket/14917/) - Library compatibility issues
- [GitHub: contenteditable-autocomplete](https://github.com/gr2m/contenteditable-autocomplete) - Custom autocomplete library
- [Contenteditable Autocomplete Demo](https://gr2m.github.io/contenteditable-autocomplete/) - Library example
