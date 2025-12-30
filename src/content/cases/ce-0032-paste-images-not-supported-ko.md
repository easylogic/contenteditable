---
id: ce-0032
scenarioId: scenario-paste-media-handling
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable에 이미지 붙여넣기가 일관되게 지원되지 않음
description: "클립보드에서 이미지를 contenteditable 영역에 붙여넣으려고 할 때 동작이 브라우저 간에 일관되지 않습니다. 일부 브라우저는 붙여넣기를 무시하고, 다른 브라우저는 플레이스홀더를 삽입하거나 조용히 실패할 수 있습니다."
tags:
  - paste
  - images
  - media
  - chrome
status: draft
domSteps:
  - label: "Clipboard"
    html: '[Image: screenshot.png]'
    description: "클립보드의 이미지"
  - label: "After Paste (Bug)"
    html: ''
    description: "붙여넣기 시도가 무시되거나 실패, 이미지가 삽입되지 않음"
  - label: "✅ Expected"
    html: '<img src="data:image/png;base64,..." alt="Image">'
    description: "예상: 이미지가 &lt;img&gt; 요소로 삽입됨"
---

## 현상

클립보드에서 이미지를 contenteditable 영역에 붙여넣으려고 할 때 동작이 브라우저 간에 일관되지 않습니다. 일부 브라우저는 붙여넣기를 무시하고, 다른 브라우저는 플레이스홀더를 삽입하거나 조용히 실패할 수 있습니다.

## 재현 예시

1. 클립보드에 이미지를 복사합니다 (예: 이미지 편집기나 스크린샷에서).
2. contenteditable div를 만듭니다.
3. contenteditable에 포커스합니다.
4. 붙여넣습니다 (Cmd+V 또는 Ctrl+V).
5. 발생하는 일을 관찰합니다.

## 관찰된 동작

- macOS의 Chrome에서 이미지를 붙여넣으면 무시되거나 조용히 실패할 수 있습니다.
- 붙여넣기가 시도되었음을 나타내는 시각적 피드백이 없습니다.
- 이미지 데이터가 클립보드에 있지만 삽입되지 않을 수 있습니다.

## 예상 동작

- 이미지는 적절한 `src` 속성을 가진 `<img>` 요소로 붙여넣어져야 합니다.
- 또는 `beforeinput` 이벤트가 이미지 붙여넣기를 가로채고 처리할 수 있어야 합니다.
- 붙여넣기 작업의 성공 또는 실패를 명확하게 나타내는 피드백이 있어야 합니다.
