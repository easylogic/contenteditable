---
id: ce-0076
scenarioId: scenario-cors-restrictions
locale: ko
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: MacBook Pro
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: CORS 제한이 교차 출처 iframe의 contenteditable에 영향을 줄 수 있음
description: "contenteditable 요소가 교차 출처 iframe 내부에 있을 때 CORS 제한이 특정 작업을 방지할 수 있습니다. 부모 프레임에서 contenteditable에 접근하는 것이 차단될 수 있으며, 일부 편집 작업이 제한될 수 있습니다."
tags:
  - cors
  - iframe
  - security
  - safari
  - macos
status: draft
---

### 현상

contenteditable 요소가 교차 출처 iframe 내부에 있을 때 CORS 제한이 특정 작업을 방지할 수 있습니다. 부모 프레임에서 contenteditable에 접근하는 것이 차단될 수 있으며, 일부 편집 작업이 제한될 수 있습니다.

### 재현 예시

1. 교차 출처 iframe이 있는 페이지를 만듭니다.
2. iframe 내부에 contenteditable div를 만듭니다.
3. 부모 프레임에서 contenteditable에 접근하려고 시도합니다.
4. 프로그래밍 방식으로 콘텐츠를 수정하려고 시도합니다.
5. CORS 관련 오류나 제한을 관찰합니다.

### 관찰된 동작

- macOS의 Safari에서 CORS 제한이 교차 출처 iframe에 적용됩니다.
- 부모 프레임에서 contenteditable 콘텐츠에 접근하는 것이 차단될 수 있습니다.
- 동일 출처 정책으로 인해 일부 작업이 제한될 수 있습니다.
- 오류 메시지가 명확하지 않을 수 있습니다.

### 예상 동작

- CORS 제한이 명확하게 문서화되어야 합니다.
- 또는 교차 출처 contenteditable로 작업하는 표준 방법이 있어야 합니다.
- 오류 메시지가 도움이 되어야 합니다.
