---
id: ce-0075
scenarioId: scenario-xss-protection
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: US
caseTitle: XSS 보호가 contenteditable HTML 삽입을 방해할 수 있음
description: "브라우저 XSS 보호 메커니즘이 contenteditable 요소에서 프로그래밍 방식 HTML 삽입을 방해할 수 있습니다. innerHTML 또는 유사한 방법을 통해 삽입된 스크립트 태그나 이벤트 핸들러가 제거되거나 정리될 수 있습니다."
tags:
  - xss
  - security
  - edge
  - windows
status: draft
---

### 현상

브라우저 XSS 보호 메커니즘이 contenteditable 요소에서 프로그래밍 방식 HTML 삽입을 방해할 수 있습니다. innerHTML 또는 유사한 방법을 통해 삽입된 스크립트 태그나 이벤트 핸들러가 제거되거나 정리될 수 있습니다.

### 재현 예시

1. contenteditable div를 만듭니다.
2. 프로그래밍 방식으로 스크립트 태그나 이벤트 핸들러가 있는 HTML을 삽입하려고 시도합니다.
3. HTML이 그대로 삽입되는지 또는 정리되는지 관찰합니다.
4. 스크립트 실행이 차단되는지 확인합니다.

### 관찰된 동작

- Windows의 Edge에서 XSS 보호가 삽입된 HTML에서 스크립트 태그를 제거할 수 있습니다.
- 속성에서 이벤트 핸들러가 제거될 수 있습니다.
- 일부 HTML이 자동으로 정리될 수 있습니다.
- 동작이 표준 DOM 조작과 다를 수 있습니다.

### 예상 동작

- XSS 보호가 투명하게 작동해야 합니다.
- 또는 허용되는 항목에 대한 명확한 문서가 있어야 합니다.
- 정리는 일관되고 예측 가능해야 합니다.
