---
id: scenario-placeholder-behavior-ko
title: "Placeholder와 IME 및 DOM 변이 간의 간섭 현상"
description: "CSS 및 속성 기반의 placeholder가 텍스트 삽입 및 IME 세션을 방해하는 방식에 대한 기술적 분석입니다."
category: "ui"
tags: ["placeholder", "collision", "ime", "rendering"]
status: "confirmed"
locale: "ko"
---

## 문제 개요
표준 `<input>` 및 `<textarea>` 요소는 네이티브 placeholder를 지원하지만, `contenteditable`은 그렇지 않습니다. 개발자들은 보통 CSS의 `:empty:before` 선택자나 가상 노드를 삽입하여 placeholder를 흉내 냅니다. 이러한 모방은 브라우저가 placeholder를 제거하는 로직과 사용자가 텍스트를 삽입하는 로직이 충돌하는 "경쟁 상태(Race Condition)"를 유발하며, 특히 IME 세션이 시작될 때 두드러집니다.

## 관찰된 동작
### 시나리오 1: 한국어 IME 무력화 (Chrome/Android)
안드로이드 Chrome 131+ 버전에서 한국어 음절의 첫 글자를 입력할 때, 요소가 더 이상 `:empty` 상태가 아니게 됨에 따라 CSS가 `:before` placeholder를 제거하면서 발생하는 DOM 변이가 브라우저 내부의 IME 버퍼를 초기화해 버립니다.

```javascript
/* Chrome 로직 루프 */
// 1. 사용자가 'ㅎ' 입력
// 2. 요소가 더 이상 :empty가 아님
// 3. CSS 가상 요소 파괴
// 4. Mutation 이벤트가 'ㅎ' 텍스트 노드를 잘못 정리함
```

### 시나리오 2: 포커스 시 레이아웃 쉬프트
Safari에서는 글자를 입력하기 전까지 placeholder가 유지되는 경우가 많습니다. 하지만 placeholder의 패딩이나 폰트 설정이 실제 텍스트와 다를 경우, 포커스를 주었을 때 레이아웃이 "점프"하며 캐럿 위치가 어긋날 수 있습니다.

## 영향
- **글자 유실**: 모든 입력 세션의 첫 글자가 지워지거나 무시됨.
- **잘못된 위치 지정**: 캐럿이 가상 요소 내부로 들어가거나 문서 맨 앞으로 튕겨 나감.
- **접근성 문제**: 스크린 리더가 사용자가 이미 타이핑을 시작한 *후에* placeholder 텍스트를 읽어주는 경우가 발생함.

## 브라우저 비교
- **Chromium**: 특히 모바일에서 "변이 충돌(Mutation Collision)"에 취약함.
- **WebKit**: 레이아웃 점프와 캐럿 계산 오류가 잦음.
- **Gecko**: `:empty` 전환을 대체로 안전하게 처리하지만, 높이가 0인 div에서 캐럿을 렌더링하지 못하는 경우가 있음.

## 해결 방법
### 1. 투명도(Opacity) 기반 토글링
`:empty`가 노드를 완전히 파괴하도록 두는 대신, 수동으로 관리되는 `is-empty` 클래스나 `focus` 상태에 따라 가시성(visibility)이나 투명도만 조절합니다.

```css
/* 입력 중간의 content: "" 변경 방지 */
[contenteditable]::before {
  content: attr(placeholder);
  opacity: 0.5;
}
[contenteditable]:not(:empty)::before,
[contenteditable]:focus::before {
  display: none; /* 또는 visibility: hidden */
}
```

### 2. 포커스 시 수동 Placeholder 제거
이벤트가 발생하기 전, 요소가 포커스를 받는 즉시 placeholder 상태를 명시적으로 제거합니다.

## 관련 사례
- [ce-0568: Placeholder가 있으면 한글 조합 첫 글자가 파손됨](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0568-chrome-android-placeholder-korean-ime-ko.md)

## 참고 자료
- [Lexical 이슈: Chrome Android Hangul Placeholder](https://github.com/facebook/lexical/issues/6821)
- [ProseMirror: Placeholder 처리 예제](https://prosemirror.net/examples/placeholder/)
