---
id: ce-0122
scenarioId: scenario-auto-scroll-on-typing
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Firefox에서 빠른 입력 중 자동 스크롤이 급격하고 불쾌함
description: "Firefox에서 contenteditable 요소의 가장자리 근처에서 빠르게 입력할 때 커서를 보이게 유지하기 위한 자동 스크롤이 급격하고 불쾌합니다. 스크롤이 부드럽게가 아니라 갑자기 발생합니다."
tags:
  - scroll
  - cursor
  - typing
  - firefox
status: draft
---

### 현상

Firefox에서 contenteditable 요소의 가장자리 근처에서 빠르게 입력할 때 커서를 보이게 유지하기 위한 자동 스크롤이 급격하고 불쾌합니다. 스크롤이 부드럽게가 아니라 갑자기 발생합니다.

### 재현 예시

1. 스크롤 가능한 콘텐츠가 있는 contenteditable 요소를 만듭니다
2. 하단 가장자리 근처에서 빠르게 텍스트를 입력합니다
3. 스크롤 동작을 관찰합니다

### 관찰된 동작

- 부드러운 애니메이션 없이 급격하게 스크롤이 발생합니다
- 빠른 입력 중 여러 스크롤 점프가 발생할 수 있습니다
- 사용자 경험이 불쾌합니다
- 스크롤 위치가 예상치 못하게 점프할 수 있습니다

### 예상 동작

- 스크롤이 부드럽고 점진적이어야 합니다
- 스크롤이 예측 가능하게 발생해야 합니다
- 사용자 경험이 즐거워야 합니다
- 스크롤이 불쾌함 없이 커서를 보이게 유지해야 합니다

### 브라우저 비교

- **Chrome/Edge**: 일반적으로 더 부드러운 스크롤
- **Firefox**: 더 급격한 스크롤 (이 케이스)
- **Safari**: 스크롤 동작이 다양함

### 참고 및 해결 방법 가능한 방향

- 사용자 정의 부드러운 스크롤 구현
- 부드러운 동작으로 `scrollIntoView` 사용
- 빠른 입력 중 스크롤 작업 스로틀
- 부드러운 스크롤을 위해 `requestAnimationFrame` 사용
