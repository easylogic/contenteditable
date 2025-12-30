---
id: ce-0113
scenarioId: scenario-undo-redo-stack
locale: ko
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: 사용자 정의 작업이 실행 취소 스택에 추가되지 않음
description: "preventDefault()를 사용하고 사용자 정의 편집 작업을 구현할 때 해당 작업이 브라우저의 실행 취소 스택에 추가되지 않습니다. 사용자는 Ctrl+Z를 사용하여 사용자 정의 작업을 실행 취소할 수 없습니다."
tags:
  - undo
  - redo
  - history
  - chrome
status: draft
---

## 현상

`preventDefault()`를 사용하고 사용자 정의 편집 작업을 구현할 때 해당 작업이 브라우저의 실행 취소 스택에 추가되지 않습니다. 사용자는 Ctrl+Z를 사용하여 사용자 정의 작업을 실행 취소할 수 없습니다.

## 재현 예시

1. `preventDefault()`로 사용자 정의 텍스트 삽입 구현
2. 일부 텍스트 삽입
3. 실행 취소를 위해 Ctrl+Z 누르기

## 관찰된 동작

- 사용자 정의 작업이 실행 취소되지 않습니다
- 브라우저의 실행 취소 스택에 작업이 포함되지 않습니다
- 사용자가 사용자 정의 작업을 실행 취소할 수 없습니다
- 사용자 정의 기능에 대해 실행 취소/다시 실행 기능이 깨집니다

## 예상 동작

- 사용자 정의 작업이 실행 취소 가능해야 합니다
- 실행 취소 스택에 모든 작업이 포함되어야 합니다
- Ctrl+Z가 사용자 정의 작업에 대해 작동해야 합니다
- 다시 실행도 작동해야 합니다

## 브라우저 비교

- **모든 브라우저**: 사용자 정의 작업이 실행 취소 스택에 없음
- 이것은 `preventDefault()`를 사용할 때 예상되는 동작입니다
- 사용자 정의 실행 취소/다시 실행 구현 필요

## 참고 및 해결 방법 가능한 방향

- 사용자 정의 실행 취소/다시 실행 스택 구현
- 각 작업 전 상태 저장
- 실행 취소 시 상태 복원
- Ctrl+Z 및 Ctrl+Y를 수동으로 처리
- 별도의 실행 취소/다시 실행 스택 유지
