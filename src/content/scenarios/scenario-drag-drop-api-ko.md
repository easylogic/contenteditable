---
id: scenario-drag-drop-api-ko
title: contenteditable과 HTML 드래그 앤 드롭 API
description: "contenteditable 안이나 옆에서 HTML DnD API를 쓰면 일반 요소와 다르게 동작하는 경우가 많습니다. 기본 동작, 편집 영역 히트 테스트, beforeinput/drop 순서가 브라우저마다 다릅니다. 커스텀 에디터는 네이티브 DnD와 자체 선택 모델을 맞춰야 합니다."
category: input
tags:
  - drag-drop
  - contenteditable
  - beforeinput
  - chrome
  - firefox
status: draft
locale: ko
---

contenteditable 안이나 옆에서 HTML DnD API를 쓰면 일반 요소와 다르게 동작하는 경우가 많습니다. 기본 동작, 편집 영역 히트 테스트, `beforeinput`/`drop` 순서가 브라우저마다 다릅니다. 커스텀 에디터는 네이티브 DnD와 자체 선택 모델을 맞춰야 합니다.

## 문제 개요

드래그 앤 드롭 모델은 최신 `beforeinput`·IME 인식 편집보다 이전에 설계되었습니다. contenteditable은 중첩 편집 영역·일부 설정의 섀도 DOM·텍스트 드래그 이미지 등으로 동작이 달라집니다.

## 관찰된 동작

- 내부 텍스트 드래그에서 프레임워크가 기대하는 순서로 이벤트가 오지 않음.
- 같은 편집기 안 이동 시 `preventDefault`와 기본 처리가 충돌.
- 외부(파일·HTML)에서 드롭할 때 붙여넣기 파이프라인과 다르게 동작.

## 영향

드래그 재정렬 실패, 드롭 후 선택 손실, 조각 중복·누락.

## 브라우저 비교

선택 텍스트에 대한 `dragstart` 데이터 전달이 Chromium과 Gecko에서 다르고, WebKit은 macOS에서 이미지 드래그에 추가 이슈가 있을 수 있습니다.

## 해결 방법

- 커스텀 드래그 시 `dataTransfer.setData('text/plain', ...)` 등을 명시.
- `drop`에서 문서 변경 전 드롭 위치의 캐럿/선택과 동기화.
- 접근성 요구를 맞출 수 있다면 내부 이동만 네이티브 DnD를 끄고 오버레이로 흉내 내는 선택지도 있음.

## 모범 사례

- 다른 앱·같은 페이지의 두 번째 에디터·문단 내부 재정렬을 각각 테스트.

## 관련 케이스

- [ce-0083](ce-0083-contenteditable-with-drag-drop-api)

## 참고 자료

- [HTML Living Standard: Drag and drop](https://html.spec.whatwg.org/multipage/dnd.html)
- MDN: [Drag operations](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
