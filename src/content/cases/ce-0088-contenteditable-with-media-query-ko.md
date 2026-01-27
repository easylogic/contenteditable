---
id: ce-0088-contenteditable-with-media-query-ko
scenarioId: scenario-media-query-layout
locale: ko
os: Android
osVersion: "13"
device: Phone
deviceVersion: Any
browser: Chrome Mobile
browserVersion: "120.0"
keyboard: Mobile Samsung
caseTitle: 미디어 쿼리 레이아웃 변경이 키보드 포커스를 방해함
description: "모바일 장치에서 @media 쿼리에 의해 트리거되는 레이아웃 이동(예: 방향 전환)은 가상 키보드를 닫히게 하고 선택 영역을 소실시킬 수 있습니다."
tags: ["media-query", "layout", "mobile", "keyboard-dismiss"]
status: confirmed
---

## 현상
CSS 미디어 쿼리가 트리거될 때(예: 장치 회전 또는 컨테이너 너비 변경), 브라우저는 레이아웃 패스를 실행하며 이 과정에서 모바일 브라우저의 현재 DOM 선택 영역이 무효화되어 가상 키보드가 닫힐 수 있습니다.

## 재현 단계
1. 모바일 장치에서 contenteditable 필드를 엽니다.
2. 가상 키보드가 나타나도록 필드에 포커스합니다.
3. 장치를 회전합니다 (세로 모드 -> 가로 모드).
4. 키보드가 사라지는지 관찰합니다.

## 관찰된 동작
뷰포트 변경이 리플로우(Reflow)를 일으키며, 요소의 바운딩 박스가 크게 이동할 경우 브라우저가 활성 요소의 포커스를 잃게 만듭니다.
