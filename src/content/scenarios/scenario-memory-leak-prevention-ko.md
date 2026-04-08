---
id: scenario-memory-leak-prevention-ko
title: "장시간 contenteditable 세션에서 메모리 증가"
description: "대용량 문서·DOM 참조 유지·MutationObserver·실행 취소 스택이 해제되지 않으면 메모리가 누적될 수 있고, 에디터를 오래 마운트한 SPA에서 두드러집니다."
category: performance
tags:
  - memory
  - performance
  - observer
  - spa
status: draft
locale: ko
---

**대용량 문서**·DOM 참조 유지·**MutationObserver**·**실행 취소 스택**이 해제되지 않으면 **메모리**가 누적될 수 있고, 에디터를 오래 마운트한 **SPA**에서 두드러집니다.

## 관련 케이스

- [ce-0225](ce-0225-memory-leak-large-docs)

## 참고 자료

- [scenario-performance-large-content-ko](scenario-performance-large-content-ko)
