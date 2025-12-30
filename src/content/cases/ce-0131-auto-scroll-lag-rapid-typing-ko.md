---
id: ce-0131
scenarioId: scenario-auto-scroll-on-typing
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 가장자리 근처에서 빠른 입력 중 자동 스크롤이 지연됨
description: "Chrome에서 contenteditable 요소의 가장자리 근처에서 빠르게 입력할 때 커서를 보이게 유지하기 위한 자동 스크롤이 입력보다 뒤처집니다. 여러 문자가 입력된 후 스크롤이 발생하여 커서가 일시적으로 보이지 않게 됩니다."
tags:
  - scroll
  - cursor
  - typing
  - performance
  - chrome
status: draft
---

## 현상

Chrome에서 contenteditable 요소의 가장자리 근처에서 빠르게 입력할 때 커서를 보이게 유지하기 위한 자동 스크롤이 입력보다 뒤처집니다. 여러 문자가 입력된 후 스크롤이 발생하여 커서가 일시적으로 보이지 않게 됩니다.

## 재현 예시

1. 스크롤 가능한 콘텐츠가 있는 contenteditable 요소를 만듭니다
2. 하단 가장자리 근처에서 빠르게 텍스트를 입력합니다
3. 스크롤 타이밍을 관찰합니다

## 관찰된 동작

- 여러 문자가 입력된 후 스크롤이 발생합니다
- 커서가 일시적으로 보이지 않게 됩니다
- 스크롤이 결국 따라잡습니다
- 빠른 입력 중 사용자 경험이 저하됩니다

## 예상 동작

- 스크롤이 즉시 발생해야 합니다
- 커서가 보이게 유지되어야 합니다
- 스크롤이 입력 속도를 따라가야 합니다
- 지연이 눈에 띄지 않아야 합니다

## 브라우저 비교

- **Chrome/Edge**: 스크롤이 지연될 수 있음 (이 케이스)
- **Firefox**: 지연될 가능성이 더 높음
- **Safari**: 스크롤 타이밍이 다양함

## 참고 및 해결 방법 가능한 방향

- 즉시 발생하는 사용자 정의 스크롤 구현
- 부드러운 스크롤을 위해 `requestAnimationFrame` 사용
- 스크롤 작업을 적절히 스로틀
- 커서 위치를 더 자주 확인
