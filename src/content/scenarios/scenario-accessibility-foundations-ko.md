---
id: scenario-accessibility-foundations-ko
title: "접근성 기초: 스크린 리더, ARIA 및 AX-Tree"
description: "ARIA 매핑과 브라우저 엔진 동기화를 통해 contenteditable 에디터의 보조 공학 도구 호환성을 확보하는 전략입니다."
category: "accessibility"
tags: ["accessibility", "aria", "screen-reader", "voiceover", "nvda", "spellcheck"]
status: "confirmed"
locale: "ko"
---

## 개요
Contenteditable 영역은 흔히 "접근성 장벽"으로 작용합니다. 기본적인 타이핑은 작동할지라도, 플레이스홀더, 중첩 블록, 멘션 위젯과 같은 복잡한 기능들은 정교한 ARIA 아키텍처가 뒷받침되지 않으면 스크린 리더 사용자에게 거의 보이지 않거나 오작동합니다.

## 핵심 접근성 과제

### 1. 플레이스홀더의 역설
네이티브 contenteditable은 `placeholder` 속성을 지원하지 않습니다. CSS나 빈 `::before` 요소를 사용하여 이를 흉내 내면 스크린 리더가 에디터의 존재 자체를 인지하지 못하거나, 사용자가 입력을 시작한 후에도 플레이스홀더 텍스트를 계속 읽어주는 문제가 발생합니다.

### 2. AX-Tree 동기화 및 변이 처리
현대 브라우저는 DOM으로부터 내부적인 "접근성 트리(Accessibility Tree)"를 구축합니다. 구문 강조나 맞춤법 검사 장식과 같은 잦은 DOM 변형은 AX-Tree를 너무 자주 새로고침하게 만들어, NVDA나 VoiceOver와 같은 도구에서 반복적이거나 끊기는 음성 피드백을 유발합니다.

### 3. 역할/상태 충돌 (2025 버그)
`role="textbox"` 요소에 `aria-readonly="false"`를 명시적으로 설정하면, Chromium 엔진 내부에서 편집 가능 여부 탐색 로직이 꼬여 스크린 리더가 해당 필드를 "읽기 전용"으로 잘못 안내하는 현상이 있습니다.

### 4. 맞춤법 검사(Spellcheck) UI 간섭
Safari에서 `spellcheck="true"`가 활성화된 경우, 나타나는 수정 제안 메뉴가 텍스트 선택을 방해할 수 있습니다. 또한 `contenteditable`을 false로 변경한 후에도 빨간색 "오류 밑줄"이 계속 남아 있어 사용자에게 혼란을 주기도 합니다.

## 최적화 청사진

### 명시적 역할(Role) 매핑
단순한 `div` 에디터라도 반드시 `role="textbox"`와 `aria-multiline="true"`를 설정하여 OS 레벨에서 올바른 핸들이 생성되도록 하십시오.

### 맞춤법 검사 장식 처리
DOM을 불필요한 스팬(`<span>`)으로 오염시키지 않으면서도 맞춤법 오류를 표시하려면 `::spelling-error` 의사 요소를 활용하십시오. 이는 AX-Tree의 빈번한 새로고침을 방지하는 데 도움이 됩니다.

## 관련 사례
- [ce-0573: macOS AXGroup 버그](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0573-macos-sequoia-chrome-ax-group-bug-ko.md)
- [ce-0574: aria-readonly 충돌 이슈](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0574-aria-readonly-conflict-bug-ko.md)
- [ce-0041: 맞춤법 검사 간섭 사례](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0041-spellcheck-interferes-ko.md)
- [ce-0324: Chrome v96 맞춤법 검사 성능 저하](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0324-chrome-v96-performance-regression-spellcheck-ko.md)
