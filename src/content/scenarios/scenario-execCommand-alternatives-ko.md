---
id: scenario-execCommand-alternatives-ko
title: execCommand는 더 이상 사용되지 않지만 서식 적용에 여전히 널리 사용됨
description: "contenteditable 영역에서 서식(굵게, 기울임꼴 등)을 적용하는 데 일반적으로 사용되는 document.execCommand() API가 더 이상 사용되지 않습니다. 그러나 완전한 대체품이 없으며 많은 구현이 여전히 그것에 의존합니다. 이것은 향후 브라우저 지원에 대한 불확실성을 만듭니다."
category: formatting
tags:
  - execCommand
  - formatting
  - deprecation
  - chrome
status: draft
locale: ko
---

contenteditable 영역에서 서식(굵게, 기울임꼴 등)을 적용하는 데 일반적으로 사용되는 `document.execCommand()` API가 더 이상 사용되지 않습니다. 그러나 완전한 대체품이 없으며 많은 구현이 여전히 그것에 의존합니다. 이것은 향후 브라우저 지원에 대한 불확실성을 만듭니다.

## 참고 자료

- [MDN: Document.execCommand](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand) - execCommand API documentation (deprecated)
- [W3C Input Events Level 2 Specification](https://www.w3.org/TR/input-events-2/) - beforeinput and Input Events API
- [MDN: Element beforeinput event](https://developer.mozilla.org/en-US/docs/Web/API/Element/beforeinput_event) - Modern alternative
- [MDN: Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection) - Selection and Range APIs
