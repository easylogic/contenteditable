---
id: ce-0049
scenarioId: scenario-ime-ui-positioning
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Japanese IME
caseTitle: IME 후보 창이 잘못된 위치에 나타남
description: "macOS의 Chrome에서 IME(Input Method Editor)를 사용할 때 후보 창(가능한 문자 변환을 보여주는 창)이 캐럿에 대한 잘못된 위치에 나타날 수 있습니다. 오프셋되거나 사용자가 입력하는 위치에서 멀리 떨어진 곳에 나타날 수 있습니다."
tags:
  - ime
  - ui
  - positioning
  - chrome
status: draft
---

### 현상

macOS의 Chrome에서 IME(Input Method Editor)를 사용할 때 후보 창(가능한 문자 변환을 보여주는 창)이 캐럿에 대한 잘못된 위치에 나타날 수 있습니다. 오프셋되거나 사용자가 입력하는 위치에서 멀리 떨어진 곳에 나타날 수 있습니다.

### 재현 예시

1. contenteditable div를 만듭니다.
2. 일본어 IME로 전환합니다.
3. 일본어 문자 입력을 시작합니다.
4. 캐럿에 대한 IME 후보 창의 위치를 관찰합니다.

### 관찰된 동작

- macOS의 Chrome에서 IME 후보 창이 잘못된 위치에 나타날 수 있습니다.
- 캐럿 위치에서 오프셋될 수 있습니다.
- contenteditable이 스크롤되거나 위치가 지정되었을 때 위치가 잘못될 수 있습니다.

### 예상 동작

- IME 후보 창이 캐럿 위치 근처에 나타나야 합니다.
- 사용자가 입력할 때 캐럿을 따라가야 합니다.
- 스크롤이나 레이아웃에 관계없이 위치가 정확해야 합니다.
