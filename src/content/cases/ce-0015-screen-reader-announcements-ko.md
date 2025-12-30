---
id: ce-0015
scenarioId: scenario-accessibility-announcements
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: 스크린 리더가 contenteditable 영역의 변경 사항을 알리지 않음
description: "contenteditable 영역에서 콘텐츠가 변경될 때(텍스트 입력, 삭제 또는 서식 적용) 스크린 리더가 이러한 변경 사항을 사용자에게 알리지 않습니다. 이로 인해 보조 기술에 의존하는 사용자가 편집기에서 무슨 일이 일어나고 있는지 이해하기 어렵습니다."
tags:
  - accessibility
  - screen-reader
  - aria
  - safari
status: draft
---

### 현상

contenteditable 영역에서 콘텐츠가 변경될 때(텍스트 입력, 삭제 또는 서식 적용) 스크린 리더가 이러한 변경 사항을 사용자에게 알리지 않습니다. 이로 인해 보조 기술에 의존하는 사용자가 편집기에서 무슨 일이 일어나고 있는지 이해하기 어렵습니다.

### 재현 예시

1. 적절한 ARIA 속성을 가진 contenteditable div를 만듭니다.
2. VoiceOver(macOS) 또는 NVDA(Windows)를 활성화합니다.
3. contenteditable 영역에 포커스합니다.
4. 일부 텍스트를 입력하거나 텍스트를 삭제합니다.
5. 스크린 리더가 알리는 내용을 관찰합니다.

### 관찰된 동작

- VoiceOver가 있는 Safari에서 contenteditable 영역의 변경 사항이 알려지지 않습니다.
- 스크린 리더가 서식이 적용되거나 제거될 때를 나타내지 않을 수 있습니다.
- 선택 변경 사항이 알려지지 않을 수 있습니다.

### 예상 동작

- 텍스트가 삽입되거나 삭제될 때 스크린 리더가 알려야 합니다.
- 서식 변경 사항이 알려져야 합니다.
- 선택 변경 사항이 알려져야 합니다.
- 편집기의 현재 상태가 스크린 리더 사용자에게 접근 가능해야 합니다.
