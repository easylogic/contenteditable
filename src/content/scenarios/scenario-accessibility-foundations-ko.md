---
id: scenario-accessibility-foundations-ko
title: "접근성 기초: 역할, ARIA 및 보조 공학 호환성"
description: "스크린 리더 친화적인 에디터를 만들기 위한 핵심 원칙으로, 역할 매핑 및 상태 동기화에 집중합니다."
category: "accessibility"
tags: ["accessibility", "aria", "role", "screen-reader", "state-sync"]
status: "confirmed"
locale: "ko"
---

## 개요
Contenteditable 영역은 종종 커스텀 상호작용이 일어나는 "섬"과 같습니다. 보조 공학(AT)은 브라우저의 접근성 트리(AX Tree)에 의존하여 특정 `div`가 실제로는 텍스트 입력창임을 이해합니다.

## 주요 통합 과제

### 1. 플랫폼 역할(Role) 매핑
브라우저는 `contenteditable` 속성을 OS 레벨의 역할(예: `AXTextArea`)로 매핑해야 합니다.
- **회귀 버그 사례**: macOS Sequoia(Chrome 129)에서 에디터가 `AXGroup`으로 잘못 보고되어, VoiceOver의 단어 단위 탐색이 깨지는 심각한 문제가 있었습니다.

### 2. 상태 및 속성 충돌
명시적인 ARIA 속성이 때로는 네이티브 상태를 덮어버릴 수 있습니다.
- **패턴**: Chromium에서 `contenteditable="true"`인 엘리먼트에 `aria-readonly="false"`를 적용하면, 역설적으로 보조 공항에 "읽기 전용" 신호를 보내는 트리거가 될 수 있습니다.
- **가이드라인**: 복잡한 복합 위젯(Grid, Tree 등)을 구현하는 것이 아니라면, 상태 관리는 가급적 네이티브 속성에 맡기십시오.

### 3. 관계 API (Controls/Owns)
에디터를 플로팅 메뉴(예: 슬래시 커맨드 메뉴)와 연결하려면 `aria-controls`나 `aria-owns`가 필요합니다.
- **버그**: WebKit은 활발한 IME 조합 세션 중에 이러한 관련 엘리먼트로 포커스 의도를 전달하지 못하는 경우가 빈번합니다.

## 모범 사례 템플릿

```html
<!-- '접근성 보장 에디터' 패턴 -->
<div 
  contenteditable="true" 
  role="textbox" 
  aria-multiline="true"
  aria-label="에디터 내용"
  aria-autocomplete="list"
>
  <!-- 콘텐츠 영역 -->
</div>
```

## 관련 사례
- [ce-0573: macOS Sequoia AXGroup 버그](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0573-macos-sequoia-chrome-ax-group-bug.md)
- [ce-0574: aria-readonly 속성 충돌](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0574-aria-readonly-conflict-bug.md)
---
id: scenario-accessibility-foundations-ko
title: "접근성 기초: 역할, ARIA 및 보조 공학 호환성"
description: "스크린 리더 친화적인 에디터를 만들기 위한 핵심 원칙으로, 역할 매핑 및 상태 동기화에 집중합니다."
category: "accessibility"
tags: ["accessibility", "aria", "role", "screen-reader", "state-sync"]
status: "confirmed"
locale: "ko"
---

## 개요
Contenteditable 영역은 종종 커스텀 상호작용이 일어나는 "섬"과 같습니다. 보조 공학(AT)은 브라우저의 접근성 트리(AX Tree)에 의존하여 특정 `div`가 실제로는 텍스트 입력창임을 이해합니다.

## 주요 통합 과제

### 1. 플랫폼 역할(Role) 매핑
브라우저는 `contenteditable` 속성을 OS 레벨의 역할(예: `AXTextArea`)로 매핑해야 합니다.
- **회귀 버그 사례**: macOS Sequoia(Chrome 129)에서 에디터가 `AXGroup`으로 잘못 보고되어, VoiceOver의 단어 단위 탐색이 깨지는 심각한 문제가 있었습니다.

### 2. 상태 및 속성 충돌
명시적인 ARIA 속성이 때로는 네이티브 상태를 덮어버릴 수 있습니다.
- **패턴**: Chromium에서 `contenteditable="true"`인 엘리먼트에 `aria-readonly="false"`를 적용하면, 역설적으로 보조 공항에 "읽기 전용" 신호를 보내는 트리거가 될 수 있습니다.
- **가이드라인**: 복잡한 복합 위젯(Grid, Tree 등)을 구현하는 것이 아니라면, 상태 관리는 가급적 네이티브 속성에 맡기십시오.

### 3. 관계 API (Controls/Owns)
에디터를 플로팅 메뉴(예: 슬래시 커맨드 메뉴)와 연결하려면 `aria-controls`나 `aria-owns`가 필요합니다.
- **버그**: WebKit은 활발한 IME 조합 세션 중에 이러한 관련 엘리먼트로 포커스 의도를 전달하지 못하는 경우가 빈번합니다.

## 모범 사례 템플릿

```html
<!-- '접근성 보장 에디터' 패턴 -->
<div 
  contenteditable="true" 
  role="textbox" 
  aria-multiline="true"
  aria-label="에디터 내용"
  aria-autocomplete="list"
>
  <!-- 콘텐츠 영역 -->
</div>
```

## 관련 사례
- [ce-0573: macOS Sequoia AXGroup 버그](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0573-macos-sequoia-chrome-ax-group-bug.md)
- [ce-0574: aria-readonly 속성 충돌](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0574-aria-readonly-conflict-bug.md)
