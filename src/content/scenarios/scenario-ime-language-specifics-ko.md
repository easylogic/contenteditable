---
id: scenario-ime-language-specifics-ko
title: "언어별 IME 로직: CJK, RTL 및 결합 문자"
description: "한국어, 일본어, 중국어, 아랍어 및 태국어 IME 구현에 따른 고유한 구조적 요구 사항을 심도 있게 다룹니다."
category: "logic"
tags: ["ime", "cjk", "rtl", "combining-characters", "localization"]
status: "confirmed"
locale: "ko"
---

## 개요
언어마다 각기 다른 "조합 위상(Composition Topology)"을 가집니다. 한글 음절을 구성하는 방식은 일본어 한자 변환이나 아랍어 글자 결합(joining)과 근본적으로 다릅니다.

## 기술적 차분(Divergence)

### 1. 한국어 (한글): 음절 합성
한글 IME는 자모(자음/모음)를 이용해 글자를 만듭니다.
- **'미완성' 트랩**: 일부 브라우저는 다음 글자가 입력되어 음절이 완전히 닫히기 전까지는 계속 "조합 중"으로 보고합니다. 이로 인해 모델 동기화 시 인덱스가 하나씩 밀리는 에러가 발생할 수 있습니다.

### 2. 일본어/중국어: 후보 리스트
이 IME들은 사용자가 동음이의어 리스트에서 적절한 글자를 선택해야 합니다.
- **선택 영역 불일치**: Safari에서 사용자가 활발하게 후보 리스트를 탐색하는 동안, `window.getSelection()`이 빈 범위를 반환하거나 조합의 시작점만 가리키는 현상이 빈번합니다.

### 3. 아랍어/히브리어: RTL 교차점
RTL IME는 글자의 결합(Ligature)을 동적으로 처리해야 합니다.
- **커서 플립(Flip)**: Chromium에서 RTL 모드로 조합 세션이 시작될 때 캐럿이 갑자기 줄의 맨 앞으로 튀었다가, 첫 글자가 확정되면 제자리로 돌아오는 "튀는" 현상이 발생할 수 있습니다.

### 4. 태국어: 성조 표시(Tone Mark) 위치
태국어는 수직으로 쌓이는 결합 문자를 사용합니다.
- **'너비 0' 버그**: 일부 브라우저는 조합 중에 실제 너비가 없는 성조 기호를 너비가 있는 것처럼 잘못 처리하여, 타이핑 시 글자가 좌우로 미세하게 "떨리는(jitter)" 현상을 유발합니다.

## 구조적 교차점 처리

### 테이블 및 리스트 내의 조합
`<td>`나 `<li>` 내부에서 텍스트를 조합할 때 브라우저는 흔히 "안전 노드(Safe Node)" 로직을 트리거하여 임시 `<span>`이나 `<font>` 태그로 조합을 감싸기도 합니다.
- **주의**: `span { display: block }`과 같은 전역 CSS 초기화를 적용하지 마십시오. 이는 IME의 물리적 배치를 완전히 파괴할 수 있습니다.

## 관련 사례
- [ce-0575: ProseMirror Safari 테이블 셀 유출](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0575-prosemirror-safari-empty-table-leak.md)
- [ce-0175: 크롬 일본어 IME 한자 변환](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0175-japanese-ime-kanji-conversion-chrome.md)
---
id: scenario-ime-language-specifics-ko
title: "언어별 IME 로직: CJK, RTL 및 결합 문자"
description: "한국어, 일본어, 중국어, 아랍어 및 태국어 IME 구현에 따른 고유한 구조적 요구 사항을 심도 있게 다룹니다."
category: "logic"
tags: ["ime", "cjk", "rtl", "combining-characters", "localization"]
status: "confirmed"
locale: "ko"
---

## 개요
언어마다 각기 다른 "조합 위상(Composition Topology)"을 가집니다. 한글 음절을 구성하는 방식은 일본어 한자 변환이나 아랍어 글자 결합(joining)과 근본적으로 다릅니다.

## 기술적 차분(Divergence)

### 1. 한국어 (한글): 음절 합성
한글 IME는 자모(자음/모음)를 이용해 글자를 만듭니다.
- **'미완성' 트랩**: 일부 브라우저는 다음 글자가 입력되어 음절이 완전히 닫히기 전까지는 계속 "조합 중"으로 보고합니다. 이로 인해 모델 동기화 시 인덱스가 하나씩 밀리는 에러가 발생할 수 있습니다.

### 2. 일본어/중국어: 후보 리스트
이 IME들은 사용자가 동음이의어 리스트에서 적절한 글자를 선택해야 합니다.
- **선택 영역 불일치**: Safari에서 사용자가 활발하게 후보 리스트를 탐색하는 동안, `window.getSelection()`이 빈 범위를 반환하거나 조합의 시작점만 가리키는 현상이 빈번합니다.

### 3. 아랍어/히브리어: RTL 교차점
RTL IME는 글자의 결합(Ligature)을 동적으로 처리해야 합니다.
- **커서 플립(Flip)**: Chromium에서 RTL 모드로 조합 세션이 시작될 때 캐럿이 갑자기 줄의 맨 앞으로 튀었다가, 첫 글자가 확정되면 제자리로 돌아오는 "튀는" 현상이 발생할 수 있습니다.

### 4. 태국어: 성조 표시(Tone Mark) 위치
태국어는 수직으로 쌓이는 결합 문자를 사용합니다.
- **'너비 0' 버그**: 일부 브라우저는 조합 중에 실제 너비가 없는 성조 기호를 너비가 있는 것처럼 잘못 처리하여, 타이핑 시 글자가 좌우로 미세하게 "떨리는(jitter)" 현상을 유발합니다.

## 구조적 교차점 처리

### 테이블 및 리스트 내의 조합
`<td>`나 `<li>` 내부에서 텍스트를 조합할 때 브라우저는 흔히 "안전 노드(Safe Node)" 로직을 트리거하여 임시 `<span>`이나 `<font>` 태그로 조합을 감싸기도 합니다.
- **주의**: `span { display: block }`과 같은 전역 CSS 초기화를 적용하지 마십시오. 이는 IME의 물리적 배치를 완전히 파괴할 수 있습니다.

## 관련 사례
- [ce-0575: ProseMirror Safari 테이블 셀 유출](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0575-prosemirror-safari-empty-table-leak.md)
- [ce-0175: 크롬 일본어 IME 한자 변환](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0175-japanese-ime-kanji-conversion-chrome.md)
