---
id: ce-0026
scenarioId: scenario-performance-large-content
locale: ko
os: Any
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 큰 contenteditable 콘텐츠에서 입력이 느려짐
description: "contenteditable 영역에 많은 양의 콘텐츠(수천 개의 DOM 노드)가 포함되어 있을 때 입력이 눈에 띄게 느려집니다. 키를 누르고 문자가 나타나는 사이에 눈에 띄는 지연이 있습니다."
tags:
  - performance
  - large-content
  - typing
  - chrome
status: draft
---

### 현상

contenteditable 영역에 많은 양의 콘텐츠(수천 개의 DOM 노드)가 포함되어 있을 때 입력이 눈에 띄게 느려집니다. 키를 누르고 문자가 나타나는 사이에 눈에 띄는 지연이 있습니다.

### 재현 예시

1. contenteditable div를 만듭니다.
2. 많은 양의 콘텐츠를 삽입합니다 (예: 10,000개 이상의 DOM 노드).
3. 콘텐츠 끝에 캐럿을 배치합니다.
4. 빠르게 입력을 시작합니다.
5. 키 입력과 문자 표시 사이의 지연을 관찰합니다.

### 관찰된 동작

- Chrome에서 contenteditable에 많은 DOM 노드가 포함되어 있으면 입력이 느려집니다.
- 키 입력과 문자 렌더링 사이에 눈에 띄는 지연이 있습니다.
- 빠른 입력 중에 브라우저가 반응하지 않을 수 있습니다.

### 예상 동작

- 콘텐츠 크기에 관계없이 입력이 반응적으로 유지되어야 합니다.
- 브라우저가 큰 contenteditable 영역에 대한 렌더링을 최적화해야 합니다.
- 성능이 급격히가 아닌 점진적으로 저하되어야 합니다.
