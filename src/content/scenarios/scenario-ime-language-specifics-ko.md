---
id: scenario-ime-language-specifics-ko
title: "IME 및 언어별 특이사항: CJK, RTL 및 복합 문자열"
description: "언어별 입력 동작, BiDi 레이아웃 및 음절 단위(Granularity) 처리를 위한 고급 가이드입니다."
category: "language"
tags: ["ime", "cjk", "rtl", "granularity", "composition"]
status: "confirmed"
locale: "ko"
---

## 개요
글로벌 에디터는 "한 번의 키 입력 = 한 개의 문자" 공식이 통하지 않는 언어들을 처리해야 합니다. 이 백서는 CJK(조합형 문자), RTL(우측에서 좌측으로 흐르는 문자), 태국어(성조 기호 적층) 등 특수 언어 환경에서의 아키텍처 요구사항을 다룹니다.

## 언어별 주요 과제

### 1. CJK (한국어, 일본어, 중국어)
가장 큰 과제는 **활성 버퍼(Active Buffer)** 관리입니다.
- **한국어 (한글)**: 개별 자모가 모여 음절을 구성합니다. 백스페이스 입력 시 음절 전체가 아닌 마지막 자모만 지워져야 할 때 브라우저 이벤트가 누락되는 경우가 많습니다.
- **일본어**: 히라가나에서 간지로 변환하는 과정이 필요하며, 이 과정 전체에서 `keydown` 이벤트는 229 코드를 보고합니다.

### 2. RTL (아랍어, 히브리어)
텍스트의 방향성은 모든 것을 바꿉니다.
- **BiDi 엔진**: RTL과 LTR(숫자, 영어 등)이 혼용될 때 선택 영역 하이라이트가 깨지는 현상이 빈번합니다.
- **캐럿 정렬**: Chromium 124+ 버전에서는 스크롤 가능한 컨테이너 내 RTL 모드에서 캐럿이 왼쪽 끝에 고정되지 않는 고질적인 문제가 있습니다.

### 3. 복합 문자열 (태국어, 인디어)
태국어와 같은 언어는 모음과 성조 기호가 여러 층으로 쌓입니다.
- **캐럿 이동**: 커서는 개별 바이트가 아니라 하나의 기호 '클러스터' 단위를 건너뛰어야 합니다.

## 구현 전략

### 맥락 기반 입력 (Context-Aware Input)
`lang` 속성이나 `InputMethodContext`(가능한 경우)를 통해 현재 언어를 감지하고, 백스페이스 및 선택 영역 동작을 동적으로 조정하십시오.

## 관련 사례
- [ce-0175: 일본어 간지 변환 이슈](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0175-japanese-ime-kanji-conversion-chrome-ko.md)
- [ce-0570: RTL 스크롤 및 캐럿 정렬 오류](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0570-chromium-rtl-scroll-alignment-bug-ko.md)
- [ce-0177: 태국어 성조 기호 위치 오류](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0177-thai-ime-tone-mark-positioning-firefox-ko.md)
