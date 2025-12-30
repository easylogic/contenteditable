---
id: ce-0018
scenarioId: scenario-execCommand-alternatives
locale: ko
os: Any
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: execCommand는 더 이상 권장되지 않지만 서식 적용에 여전히 널리 사용됨
description: "contenteditable 영역에서 서식(굵게, 기울임꼴 등)을 적용하는 데 일반적으로 사용되는 document.execCommand() API가 더 이상 권장되지 않습니다. 그러나 완전한 대체재가 없으며 많은 편집기가 여전히 이를 사용합니다."
tags:
  - execCommand
  - formatting
  - deprecation
  - chrome
status: draft
---

### 현상

contenteditable 영역에서 서식(굵게, 기울임꼴 등)을 적용하는 데 일반적으로 사용되는 `document.execCommand()` API가 더 이상 권장되지 않습니다. 그러나 완전한 대체재가 없으며 많은 구현이 여전히 이를 사용합니다. 이는 향후 브라우저 지원에 대한 불확실성을 만듭니다.

### 재현 예시

1. contenteditable div를 만듭니다.
2. `document.execCommand('bold', false, null)`을 사용하여 굵게 서식을 적용합니다.
3. 브라우저 콘솔에서 deprecation 경고를 확인합니다.
4. 명령이 여전히 작동하지만 경고를 표시하는 것을 관찰합니다.

### 관찰된 동작

- Chrome은 execCommand를 사용할 때 콘솔에 deprecation 경고를 표시합니다.
- 명령은 여전히 작동하지만 향후 브라우저 버전에서 작동이 중단될 수 있습니다.
- 대안(Selection API + DOM 조작)은 구현이 더 복잡합니다.

### 예상 동작

- contenteditable 영역을 서식하기 위한 표준화된 최신 API가 제공되어야 합니다.
- 새로운 API는 잘 문서화되어 있고 브라우저 간에 지원되어야 합니다.
- execCommand에서의 마이그레이션 경로가 명확해야 합니다.
