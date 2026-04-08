---
id: scenario-performance-selection-large-content-ko
title: "대용량 contenteditable에서 선택 성능"
description: "노드가 매우 많을 때 전체 선택·드래그에 getSelection·Range·DOM 순회가 메인 스레드를 막을 수 있고 모바일에서 먼저 드러납니다."
category: performance
tags:
  - performance
  - selection
  - large-document
  - mobile
status: draft
locale: ko
---

노드가 **매우 많을** 때 전체 선택·드래그에 `getSelection`·`Range`·DOM 순회가 **메인 스레드**를 막을 수 있고 **모바일**에서 먼저 드러납니다.

## 관련 케이스

- [ce-0226](ce-0226-selection-performance-large)

## 참고 자료

- [scenario-virtual-scrolling-ko](scenario-virtual-scrolling-ko)
