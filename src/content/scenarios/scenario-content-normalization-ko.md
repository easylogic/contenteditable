---
id: scenario-content-normalization-ko
title: "콘텐츠 정규화: 붙여넣기, 공백 처리 및 DOM 위생"
description: "브라우저별 HTML 삽입 및 문자 인코딩 불일치를 중화하여 일관된 문서 상태를 유지하는 아키텍처 가이드입니다."
category: "architecture"
tags: ["paste", "normalization", "whitespace", "html-hygiene", "plaintext-only"]
status: "confirmed"
locale: "ko"
---

## 개요
사용자가 텍스트를 붙여넣거나 엔터를 칠 때, 브라우저마다 서로 다른 HTML 코드를 삽입합니다. 견고한 에디터는 이러한 "브라우저 수프(Browser Soup)"를 예측 가능한 내부 스키마로 정규화하여 데이터 오염과 레이아웃 깨짐을 방지해야 합니다.

## 핵심 정규화 영역

### 1. 붙여넣기 필터링 및 세척
Word, Excel 또는 웹페이지에서 내용을 복사해 올 때, 브라우저는 엄청난 양의 숨겨진 메타데이터와 전용 CSS(` <style>` 블록)를 함께 주입합니다. 이를 엄격하게 필터링하여 비표준 속성을 제거하는 과정이 필수적입니다.

### 2. 공백 및 &nbsp; 관리
브라우저는 기본적으로 HTML 규칙을 따라 연속된 공백을 하나로 합칩니다(Collapse). 시각적 정렬을 유지하기 위해 에디터는 흔히 줄 바꿈 없는 공백(`&nbsp;`)을 사용합니다.
- **오염**: `&nbsp;`는 CSS의 자동 줄 바꿈을 차단하여 레이아웃 오버플로우를 유발합니다. 이는 `plaintext-only` 모드에서 특히 치명적입니다.
- **역변환**: Chrome/Edge는 편집 중에 `&nbsp;`를 다시 일반 공백으로 변환하여, 의도했던 정렬이 무너지는 현상이 빈번합니다.

### 3. 빈 노드(Empty Node) 제거
빠른 편집 과정에서 DOM에는 내용이 없는 `<span>`, `<b>`, `<div>` 태그들이 남게 됩니다. 이러한 "유령 태그"들은 시각적으로는 보이지 않지만, 선택 영역 계산 로직을 꼬이게 만들고 노드 개수 기반의 기능들을 오작동시킵니다.

## 정규화 전략

### 파서 파이프라인 (Parser Pipeline)
`paste` 또는 `beforeinput` 이벤트를 가로채서 유입되는 HTML을 `DOMParser`로 처리하십시오. 삽입을 허용하기 전에 태그와 속성에 대해 엄격한 화이트리스트를 적용해야 합니다.

### 공백 유지 전략 (Entity 대신 CSS 선호)
`&nbsp;` 체인에 의존하기보다 `white-space: pre-wrap` 속성을 사용하여 레이아웃을 유지하는 것이 좋습니다. 수동 제어가 필요한 경우, `beforeinput` 핸들러를 사용하여 연속 공백이 입력될 때만 제한적으로 `\u00A0`를 삽입하십시오.

## 관련 사례
- [ce-0572: plaintext-only nbsp 버그](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0572-plaintext-only-nbsp-layout-broken-ko.md)
- [ce-0153: nbsp 줄바꿈 방지 현상](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0153-nbsp-line-break-prevention-ko.md)
- [ce-0102: 연속 공백 축소 현상](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0102-consecutive-spaces-collapsed-ko.md)
- [ce-0111: 빈 엘리먼트 누적 문제](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0111-empty-elements-accumulate-ko.md)
