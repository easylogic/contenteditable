---
id: ce-0056
scenarioId: scenario-placeholder-behavior
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable이 포커스를 받을 때 플레이스홀더 텍스트가 사라짐
description: "CSS ::before 또는 ::after 의사 요소를 사용하여 contenteditable 영역에 대한 플레이스홀더 텍스트를 만들 때 요소가 포커스를 받으면 콘텐츠가 비어 있어도 플레이스홀더가 즉시 사라집니다."
tags:
  - placeholder
  - focus
  - safari
status: draft
---

### 현상

CSS `::before` 또는 `::after` 의사 요소를 사용하여 contenteditable 영역에 대한 플레이스홀더 텍스트를 만들 때 요소가 포커스를 받으면 콘텐츠가 비어 있어도 플레이스홀더가 즉시 사라집니다. 이는 `<input>` 및 `<textarea>` 동작과 다릅니다.

### 재현 예시

1. 플레이스홀더 스타일이 있는 contenteditable div를 만듭니다:
   ```css
   [contenteditable]:empty::before {
     content: "Type here...";
     color: #999;
   }
   ```
2. contenteditable에 포커스합니다.
3. 플레이스홀더가 사라지는지 관찰합니다.

### 관찰된 동작

- macOS의 Safari에서 콘텐츠가 비어 있어도 포커스 시 플레이스홀더가 사라집니다.
- 이는 텍스트가 입력될 때까지 플레이스홀더가 유지되는 표준 입력 요소와 다릅니다.
- 동작이 사용자 기대와 일관되지 않습니다.

### 예상 동작

- 콘텐츠가 비어 있을 때 포커스 시 플레이스홀더가 유지되어야 합니다.
- 실제로 콘텐츠가 입력될 때만 사라져야 합니다.
- 동작이 표준 입력 요소와 일치해야 합니다.
