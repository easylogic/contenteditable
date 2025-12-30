---
id: ce-0053
scenarioId: scenario-mobile-touch-behavior
locale: ko
os: Android
osVersion: "Ubuntu 22.04"
device: Mobile
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: System virtual keyboard
caseTitle: 모바일에서 선택 핸들이 콘텐츠와 겹침
description: "Android Chrome에서 contenteditable 영역의 텍스트를 선택할 때 선택 핸들(선택을 조정하기 위한 잡기 지점)이 콘텐츠와 겹칠 수 있어 선택한 텍스트를 보거나 상호작용하기 어렵습니다."
tags:
  - mobile
  - selection
  - handles
  - android
status: draft
---

## 현상

Android Chrome에서 contenteditable 영역의 텍스트를 선택할 때 선택 핸들(선택을 조정하기 위한 잡기 지점)이 콘텐츠와 겹칠 수 있어 선택한 텍스트를 보거나 상호작용하기 어렵습니다.

## 재현 예시

1. Android Chrome에서 contenteditable 영역을 엽니다.
2. 길게 눌러 텍스트 선택을 시작합니다.
3. 선택 핸들의 위치를 관찰합니다.
4. 핸들을 드래그하여 선택을 조정하려고 시도합니다.

## 관찰된 동작

- Android Chrome에서 선택 핸들이 콘텐츠와 겹칠 수 있습니다.
- 핸들이 선택한 텍스트를 가릴 수 있습니다.
- 무엇이 선택되었는지 보기 어려울 수 있습니다.
- 선택을 조정하는 것이 어려울 수 있습니다.

## 예상 동작

- 선택 핸들이 콘텐츠와 겹치지 않아야 합니다.
- 핸들이 명확하고 눈에 띄게 배치되어야 합니다.
- 선택한 텍스트가 보이고 접근 가능해야 합니다.
