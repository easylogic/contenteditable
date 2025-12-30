---
id: ce-0161
scenarioId: scenario-auto-scroll-on-typing
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 빠른 입력 중 자동 스크롤이 성능 문제를 일으킴
description: "Chrome에서 contenteditable 요소의 가장자리 근처에서 빠르게 입력할 때 빈번한 자동 스크롤이 성능 문제를 일으킵니다. 페이지가 지연되고 입력이 반응하지 않는 것처럼 느껴집니다."
tags:
  - scroll
  - performance
  - typing
  - chrome
status: draft
---

### 현상

Chrome에서 contenteditable 요소의 가장자리 근처에서 빠르게 입력할 때 빈번한 자동 스크롤이 성능 문제를 일으킵니다. 페이지가 지연되고 입력이 반응하지 않는 것처럼 느껴집니다.

### 재현 예시

1. 스크롤 가능한 콘텐츠가 있는 contenteditable 요소를 만듭니다
2. 하단 가장자리 근처에서 빠르게 텍스트를 입력합니다
3. 성능을 관찰합니다

### 관찰된 동작

- 페이지가 지연됩니다
- 입력이 반응하지 않는 것처럼 느껴집니다
- 스크롤 작업이 비용이 많이 듭니다
- 성능이 크게 저하됩니다

### 예상 동작

- 스크롤이 부드럽고 성능이 좋아야 합니다
- 입력이 반응적으로 유지되어야 합니다
- 성능이 저하되지 않아야 합니다
- 스크롤이 최적화되어야 합니다

### 브라우저 비교

- **Chrome/Edge**: 성능 문제가 있을 수 있음 (이 케이스)
- **Firefox**: 유사한 성능 문제
- **Safari**: 성능이 다양함

### 참고 및 해결 방법 가능한 방향

- 스크롤 작업 스로틀
- 부드러운 스크롤을 위해 `requestAnimationFrame` 사용
- 스크롤 계산 디바운스
- 스크롤 성능 최적화
