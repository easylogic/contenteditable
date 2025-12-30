---
id: scenario-mutation-observer-interference
title: MutationObserver가 contenteditable 편집을 간섭할 수 있음
description: "MutationObserver가 contenteditable 요소나 그 부모에 연결되면 옵저버 콜백이 편집 성능을 간섭할 수 있습니다. 입력 중 빈번한 DOM 변환이 많은 옵저버 콜백을 트리거하여 지연이나 버벅임을 유발할 수 있습니다."
category: performance
tags:
  - mutation-observer
  - performance
  - editing
  - safari
  - macos
status: draft
---

MutationObserver가 contenteditable 요소나 그 부모에 연결되면 옵저버 콜백이 편집 성능을 간섭할 수 있습니다. 입력 중 빈번한 DOM 변환이 많은 옵저버 콜백을 트리거하여 지연이나 버벅임을 유발할 수 있습니다.
