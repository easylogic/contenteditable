---
id: ce-0561-browser-extension-grammarly-interference-ko
scenarioId: scenario-browser-extension-interference
locale: ko
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: Latest
keyboard: US
caseTitle: Grammarly 확장 프로그램이 contenteditable 편집을 방해함
description: "Grammarly 브라우저 확장 프로그램이 활성화되면 contenteditable 요소에 DOM 노드를 주입하고 스타일을 수정하여 커서 위치 문제, DOM 손상, 성능 문제를 일으킵니다. 텍스트가 사라지고, 레이아웃이 이동하며, 편집이 불안정해질 수 있습니다."
tags:
  - browser-extension
  - grammarly
  - dom-injection
  - cursor
  - performance
status: draft
---

## 현상

Grammarly 브라우저 확장 프로그램이 활성화되면 `contenteditable` 요소에 DOM 노드를 주입하고 스타일을 수정하여 커서 위치 문제, DOM 손상, 성능 문제를 일으킵니다.

## 재현 예시

1. Grammarly 브라우저 확장 프로그램 설치 및 활성화
2. contenteditable 에디터가 있는 페이지 열기
3. 에디터에서 타이핑 시작
4. 커서 위치 문제, 사라지는 텍스트, 레이아웃 이동 관찰

## 관찰된 동작

- **DOM 주입**: Grammarly가 편집 가능한 영역 내부에 추가 HTML 마크업(밑줄, 오버레이)을 주입함
- **커서 위치**: Grammarly 수정 후 커서가 사라지거나 잘못된 위치에 나타남
- **텍스트 사라짐**: 텍스트가 사라지거나 손상될 수 있음
- **레이아웃 이동**: Grammarly가 폰트(예: Inter)를 로드하면 눈에 띄는 레이아웃 이동 발생
- **성능 저하**: 모든 키 입력에 대한 무거운 처리로 입력 지연 증가

## 예상 동작

- 브라우저 확장 프로그램이 contenteditable 편집을 방해하지 않아야 함
- 커서 위치가 정확하게 유지되어야 함
- DOM 구조가 안정적으로 유지되어야 함
- 편집이 반응적으로 유지되어야 함

## 분석

Grammarly 확장 프로그램은 승인된 권한을 가지고 있으며 페이지 로드 후 스크립트와 스타일을 주입할 수 있습니다. 확장 프로그램이 DOM을 크게 변경하여 리치 텍스트 에디터와 커서가 위치하는 모든 컴포넌트에 영향을 줍니다.

## 해결 방법

- contenteditable 요소에 `data-gramm="false"` 속성 추가
- MutationObserver를 사용하여 주입된 마크업 감지 및 제거
- 사용자에게 확장 프로그램 간섭에 대해 경고
- 더 나은 제어를 위해 EditContext API 사용 (Chrome/Edge)
