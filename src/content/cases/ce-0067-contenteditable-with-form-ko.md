---
id: ce-0067
scenarioId: scenario-form-integration
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable 콘텐츠가 양식 제출에 포함되지 않음
description: "contenteditable 영역이 양식 내부에 있을 때 콘텐츠가 자동으로 양식 제출에 포함되지 않습니다. input 및 textarea와 달리 contenteditable 콘텐츠는 수동으로 추출하여 양식 데이터에 추가해야 합니다."
tags:
  - form
  - submission
  - chrome
status: draft
---

## 현상

contenteditable 영역이 `<form>` 내부에 있을 때 콘텐츠가 자동으로 양식 제출에 포함되지 않습니다. `<input>` 및 `<textarea>`와 달리 contenteditable 콘텐츠는 수동으로 추출하여 양식 데이터에 추가해야 합니다.

## 재현 예시

1. 그 안에 contenteditable div가 있는 양식을 만듭니다.
2. contenteditable에 일부 콘텐츠를 입력합니다.
3. 양식을 제출합니다.
4. contenteditable 콘텐츠가 포함되어 있는지 양식 데이터를 검사합니다.

## 관찰된 동작

- Windows의 Chrome에서 contenteditable 콘텐츠가 양식 제출에 포함되지 않습니다.
- 콘텐츠를 수동으로 추출하여 추가해야 합니다.
- 자동 양식 통합이 없습니다.

## 예상 동작

- Contenteditable 콘텐츠가 양식 제출에 포함되어야 합니다.
- 또는 contenteditable을 양식 필드와 연결하는 표준 방법이 있어야 합니다.
- 양식 통합이 원활하게 작동해야 합니다.
