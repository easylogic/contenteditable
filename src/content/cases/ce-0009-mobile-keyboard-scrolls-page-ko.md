---
id: ce-0009
scenarioId: scenario-mobile-keyboard-scroll
locale: ko
os: iOS
osVersion: "17.0"
device: Mobile
deviceVersion: iPhone
browser: Safari
browserVersion: "17.0"
keyboard: System virtual keyboard
caseTitle: 모바일에서 가상 키보드가 contenteditable을 뷰에서 벗어나게 스크롤함
description: "모바일 기기에서 contenteditable 요소에 포커스할 때 가상 키보드가 나타나면서 페이지가 스크롤되어 캐럿이나 편집 가능한 영역이 부분적으로 뷰에서 벗어납니다."
tags:
  - mobile
  - keyboard
  - scroll
status: draft
---

## 현상

모바일 기기에서 `contenteditable` 요소에 포커스할 때 가상 키보드가 나타나면서 페이지가 스크롤되어 캐럿이나 편집 가능한 영역이 부분적으로 뷰에서 벗어납니다.

## 재현 예시

1. 모바일 기기에서 페이지를 엽니다.
2. 편집 가능한 영역이 뷰포트 하단 근처에 오도록 스크롤합니다.
3. 편집 가능한 영역 내부를 탭하여 가상 키보드를 엽니다.
4. 입력을 시도하고 뷰포트에 대한 캐럿 위치를 관찰합니다.

## 관찰된 동작

- 페이지가 스크롤되지만 캐럿을 완전히 보이게 유지하지 않습니다.
- 경우에 따라 편집 가능한 영역이 키보드에 의해 부분적으로 가려집니다.

## 예상 동작

- 입력하는 동안 수동 스크롤 없이 캐럿과 주변 텍스트가 보이도록 유지되어야 합니다.

## 참고사항

- 이 동작은 뷰포트 메타 태그, 스크롤 컨테이너, 애플리케이션의 사용자 정의 스크롤 처리 로직에 민감합니다.
