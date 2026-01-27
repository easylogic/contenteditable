---
id: scenario-content-normalization-ko
title: "콘텐츠 정규화: 붙여넣기, 공백 및 엔티티 처리"
description: "붙여넣기나 드래그 앤 드롭 같은 외부 상호작용 후 예측 가능한 DOM 출력을 보장하기 위한 기술 가이드입니다."
category: "paste"
tags: ["paste", "normalization", "whitespace", "nbsp", "plaintext-only"]
status: "confirmed"
locale: "ko"
---

## 개요
클립보드나 외부 드래그를 통해 유입되는 콘텐츠는 본질적으로 "지저분"합니다. 현대적인 브라우저들은 `plaintext-only` 모드를 제공하지만, 공백 처리나 HTML 엔티티 변환과 관련된 내부 정규화 로직은 브라우저마다 크게 다릅니다.

## 핵심 정규화 패턴

### 1. 'nbsp' 감염 (nbsp Infection)
Chromium(특히 v121)은 붙여넣기 중에 들여쓰기를 유지하기 위해 표준 공백(U+0020)을 줄 바꿈 없는 공백(`&nbsp;`)으로 자주 변환합니다.
- **문제점**: 이로 인해 좁은 컨테이너에서 텍스트가 자연스럽게 줄 바꿈 되지 않아 레이아웃이 깨집니다.

### 2. 후행 공백(Trailing Whitespace) 제거
Firefox는 역사적으로 붙여넣기나 엔터 입력 시 블록 끝의 공백을 잘라내는 경향이 있으며, 이는 코드 포맷팅이나 정밀한 텍스트 정렬을 방해할 수 있습니다.
- **해결책**: `white-space: pre-wrap`이나 `-moz-pre-space`를 사용하여 브라우저가 공백을 유지하도록 강제하십시오.

### 3. 네이티브 vs 프로그래밍 방식 삽입
`document.execCommand('insertText')`를 사용하는 방식은 네이티브 `plaintext-only` 동작과 비교해 서로 다른 DOM 구조(예: `<br>` vs `<div>`)를 생성하는 경우가 많습니다.

## 권장되는 정제(Sanitization) 파이프라인

```javascript
/* 표준 정규화 후크 */
element.addEventListener('paste', (e) => {
    // 1. 필요한 경우 일반 텍스트 모드 강제 적용
    if (editorMode === 'plain') {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        
        // 2. 즉각적인 정제 (U+0020 공백 강제)
        const cleanText = text.replace(/\u00A0/g, ' ');
        
        // 3. 정규화된 삽입 로직 실행
        insertAtCaret(cleanText);
    }
});
```

## 관련 사례
- [ce-0572: plaintext-only 붙여넣기 후 nbsp 잔존](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0572-plaintext-only-nbsp-layout-broken.md)
- [ce-0302: Firefox 후행 공백 제거 문제](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0302-firefox-trailing-whitespace-paste-en-ko.md)
---
id: scenario-content-normalization-ko
title: "콘텐츠 정규화: 붙여넣기, 공백 및 엔티티 처리"
description: "붙여넣기나 드래그 앤 드롭 같은 외부 상호작용 후 예측 가능한 DOM 출력을 보장하기 위한 기술 가이드입니다."
category: "paste"
tags: ["paste", "normalization", "whitespace", "nbsp", "plaintext-only"]
status: "confirmed"
locale: "ko"
---

## 개요
클립보드나 외부 드래그를 통해 유입되는 콘텐츠는 본질적으로 "지저분"합니다. 현대적인 브라우저들은 `plaintext-only` 모드를 제공하지만, 공백 처리나 HTML 엔티티 변환과 관련된 내부 정규화 로직은 브라우저마다 크게 다릅니다.

## 핵심 정규화 패턴

### 1. 'nbsp' 감염 (nbsp Infection)
Chromium(특히 v121)은 붙여넣기 중에 들여쓰기를 유지하기 위해 표준 공백(U+0020)을 줄 바꿈 없는 공백(`&nbsp;`)으로 자주 변환합니다.
- **문제점**: 이로 인해 좁은 컨테이너에서 텍스트가 자연스럽게 줄 바꿈 되지 않아 레이아웃이 깨집니다.

### 2. 후행 공백(Trailing Whitespace) 제거
Firefox는 역사적으로 붙여넣기나 엔터 입력 시 블록 끝의 공백을 잘라내는 경향이 있으며, 이는 코드 포맷팅이나 정밀한 텍스트 정렬을 방해할 수 있습니다.
- **해결책**: `white-space: pre-wrap`이나 `-moz-pre-space`를 사용하여 브라우저가 공백을 유지하도록 강제하십시오.

### 3. 네이티브 vs 프로그래밍 방식 삽입
`document.execCommand('insertText')`를 사용하는 방식은 네이티브 `plaintext-only` 동작과 비교해 서로 다른 DOM 구조(예: `<br>` vs `<div>`)를 생성하는 경우가 많습니다.

## 권장되는 정제(Sanitization) 파이프라인

```javascript
/* 표준 정규화 후크 */
element.addEventListener('paste', (e) => {
    // 1. 필요한 경우 일반 텍스트 모드 강제 적용
    if (editorMode === 'plain') {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        
        // 2. 즉각적인 정제 (U+0020 공백 강제)
        const cleanText = text.replace(/\u00A0/g, ' ');
        
        // 3. 정규화된 삽입 로직 실행
        insertAtCaret(cleanText);
    }
});
```

## 관련 사례
- [ce-0572: plaintext-only 붙여넣기 후 nbsp 잔존](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0572-plaintext-only-nbsp-layout-broken.md)
- [ce-0302: Firefox 후행 공백 제거 문제](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0302-firefox-trailing-whitespace-paste-en-ko.md)
