---
id: ce-0134
scenarioId: scenario-nested-list-behavior
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Tab 키가 목록 항목을 들여쓰기하여 중첩 목록을 만들지 않음
description: "Chrome에서 목록 항목에서 Tab을 누르면 목록 항목을 들여쓰기하여 중첩 목록 구조를 만드는 대신 탭 문자가 삽입됩니다. 이것은 중첩 목록을 만들기 어렵게 만듭니다."
tags:
  - list
  - nested
  - tab
  - indentation
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<ul><li>Item 1</li><li>Item 2</li></ul>'
    description: "List, cursor inside 'Item 2'"
  - label: "After Tab (Bug)"
    html: '<ul><li>Item 1</li><li>Item 2\t</li></ul>'
    description: "Tab key inserts tab character, nested list not created"
  - label: "✅ Expected"
    html: '<ul><li>Item 1<ul><li>Item 2</li></ul></li></ul>'
    description: "Expected: Tab key creates nested list (indentation)"
---

## 현상

Chrome에서 목록 항목에서 Tab을 누르면 목록 항목을 들여쓰기하여 중첩 목록 구조를 만드는 대신 탭 문자가 삽입됩니다. 이것은 중첩 목록을 만들기 어렵게 만듭니다.

## 재현 예시

1. 목록을 만듭니다: `<ul><li>Item 1</li><li>Item 2</li></ul>`
2. "Item 2"에 커서를 놓습니다
3. Tab을 누릅니다

## 관찰된 동작

- 탭 문자가 목록 항목에 삽입됩니다
- 목록 항목이 들여쓰기되지 않습니다
- 중첩 목록 구조가 생성되지 않습니다
- 사용자가 중첩 목록을 쉽게 만들 수 없습니다

## 예상 동작

- Tab은 목록 항목을 들여쓰기해야 합니다 (중첩 목록 생성)
- Shift+Tab은 들여쓰기를 해제해야 합니다
- 중첩 목록 구조가 생성되어야 합니다
- 동작이 워드 프로세서와 일치해야 합니다

## 브라우저 비교

- **모든 브라우저**: Tab이 문자를 삽입함 (기본 동작)
- 목록 들여쓰기를 위한 사용자 정의 처리 필요

## 참고 및 해결 방법 가능한 방향

- 목록 항목에서 Tab 키 가로채기
- 기본 동작 방지
- 중첩 목록 구조 생성
- 목록 항목을 중첩 목록으로 이동
- 들여쓰기 해제를 위해 Shift+Tab 처리
