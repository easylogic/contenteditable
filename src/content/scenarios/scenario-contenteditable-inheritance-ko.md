---
id: scenario-contenteditable-inheritance
title: contenteditable 상속 동작이 일관되지 않음
description: "부모 요소에 contenteditable=\"true\"가 있고 자식 요소에 contenteditable=\"false\"가 있을 때 상속 동작이 브라우저마다 일관되지 않습니다. 일부 브라우저는 자식에서 편집을 허용하지만 다른 브라우저는 올바르게 방지합니다. 자식에 contenteditable=\"inherit\"이 있거나 contenteditable 속성이 없을 때도 동작이 다를 수 있습니다."
category: other
tags:
  - inheritance
  - nested
  - firefox
  - windows
status: draft
---

부모 요소에 `contenteditable="true"`가 있고 자식 요소에 `contenteditable="false"`가 있을 때 상속 동작이 브라우저마다 일관되지 않습니다. 일부 브라우저는 자식에서 편집을 허용하지만 다른 브라우저는 올바르게 방지합니다. 자식에 `contenteditable="inherit"`이 있거나 contenteditable 속성이 없을 때도 동작이 다를 수 있습니다.
