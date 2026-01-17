---
id: ce-0061-contenteditable-with-lang-ko
scenarioId: scenario-language-attribute
locale: ko
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: lang 속성이 맞춤법 검사 언어에 영향을 주지 않음
description: "contenteditable 영역의 lang 속성이 Safari에서 맞춤법 검사 언어에 영향을 주지 않습니다. lang 속성 값에 관계없이 맞춤법 검사는 항상 브라우저의 기본 언어를 사용합니다."
tags:
  - lang
  - spellcheck
  - language
  - safari
status: draft
---

## 현상

contenteditable 영역의 `lang` 속성이 Safari에서 맞춤법 검사 언어에 영향을 주지 않습니다. `lang` 속성 값에 관계없이 맞춤법 검사는 항상 브라우저의 기본 언어를 사용합니다.

## 재현 예시

1. `lang="fr"` 및 `spellcheck="true"`가 있는 contenteditable div를 만듭니다.
2. 프랑스어 텍스트를 입력합니다.
3. 맞춤법 검사가 프랑스어 사전을 사용하는지 관찰합니다.

## 관찰된 동작

- macOS의 Safari에서 `lang` 속성이 맞춤법 검사에 영향을 주지 않습니다.
- 맞춤법 검사는 항상 브라우저의 기본 언어를 사용합니다.
- 다국어 콘텐츠를 올바르게 맞춤법 검사할 수 없습니다.

## 예상 동작

- `lang` 속성이 맞춤법 검사 언어를 제어해야 합니다.
- 맞춤법 검사가 지정된 언어에 적절한 사전을 사용해야 합니다.
- 다국어 콘텐츠가 제대로 지원되어야 합니다.
