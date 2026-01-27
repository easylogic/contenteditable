---
id: scenario-performance-foundations-ko
title: "성능 기초: 복잡도, 메모리 및 쓰레싱"
description: "대규모 문서에서의 기하급수적 성능 저하와 브라우저별 엔진 쓰레싱(Thrashing) 관리 전략입니다."
category: "performance"
tags: ["performance", "large-content", "memory-leak", "safari-18", "complex-css"]
status: "confirmed"
locale: "ko"
---

## 개요
Contenteditable 에디터는 콘텐츠 양이 늘어남에 따라 성능이 기하급수적으로 저하됩니다. 10,000자 이상의 대규모 문서를 처리하려면 네이티브 DOM 탐색에서 벗어나 정형화된 인덱싱과 가상화(Virtualization) 기술을 도입해야 합니다.

## 기술적 병목 구간

### 1. CSS RuleSet 무효화 (2025 회귀 버그)
Mobile Safari 18.6에서는 속성 선택자(Attribute Selector)를 병합할 때 $O(n^2)$ 수준의 복잡도를 보이는 현상이 발견되었습니다.
- **결과**: 고도로 정교한 스타일시트를 사용하는 페이지에서 구문 강조 등을 위해 클래스를 변경하면 타이핑 시 UI가 수 초간 멈출 수 있습니다.

### 2. Selection API의 기하급수적 지연
`window.getSelection().addRange()`와 같은 작업은 DOM 깊이가 깊어질수록 점점 더 느려집니다. 
- **원인**: 브라우저 엔진이 매 선택 영역 변경 시마다 오프셋을 계산하기 위해 선형 검색을 수행하기 때문입니다.

### 3. 분리된 노드(Detached Nodes)에서의 메모리 누수
대량의 텍스트를 붙여넣거나 빠른 실행 취소(UNDO) 작업을 반복할 때, 이벤트 리스너가 적절히 제거되지 않으면 메모리에 수천 개의 유령 노드가 남게 됩니다.

## 최적화 청사진

### 구조적 인덱싱 (Structured Indexing)
'텍스트 노드' 메타데이터를 평탄한 배열로 유지하여, 비용이 많이 드는 TreeWalker 대신 O(1) 수준으로 문자 위치와 노드를 매핑하십시오.

### CSS 규칙 평탄화
`[class*="editor-"]`와 같은 복잡한 속성 선택자의 전역 사용을 피하십시오. 고유한 클래스 네임을 사용하여 WebKit의 비효율적인 무효화 경로를 우회해야 합니다.

## 관련 사례
- [ce-0578: Safari 18.6 성능 RuleSet 회귀 버그](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0578-safari-performance-ruleset-regression-ko.md)
- [ce-0026: 대규모 콘텐츠 성능 문제](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0026-performance-large-content-ko.md)
- [ce-0225: 대규모 문서에서의 메모리 누수](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0225-memory-leak-large-docs-ko.md)
