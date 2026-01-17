---
id: ce-0560-framework-state-sync-vue-ko
scenarioId: scenario-framework-state-sync
locale: ko
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: Latest
keyboard: US
caseTitle: Vue contenteditable에서 반응형 상태 업데이트 시 캐럿이 이동함
description: "Vue에서 반응형 상태(v-model 또는 데이터 바인딩)와 함께 contenteditable을 사용할 때, 상태 변경으로 인해 컴포넌트가 re-render될 때마다 캐럿 위치가 처음으로 이동합니다. Safari와 Firefox에서 더 자주 발생합니다."
tags:
  - vue
  - framework
  - caret
  - rerender
  - safari
  - firefox
status: draft
---

## 현상

Vue에서 반응형 상태 바인딩과 함께 `contenteditable` 요소를 사용할 때, 상태 변경으로 인해 컴포넌트가 re-render될 때마다 캐럿(커서) 위치가 요소의 처음으로 이동합니다. 이 동작은 Safari와 Firefox에서 특히 눈에 띕니다.

## 재현 예시

1. 반응형 데이터에 바인딩된 contenteditable div가 있는 Vue 컴포넌트 생성
2. 일부 텍스트를 입력하고 커서를 중간에 배치
3. re-render를 유발하는 반응형 상태 업데이트 트리거
4. 캐럿 위치가 처음으로 이동하는 것을 관찰

## 관찰된 동작

- **캐럿 이동**: re-render 시 캐럿 위치가 요소의 처음으로 되돌아감
- **Safari/Firefox**: Safari와 Firefox에서 더 자주 발생
- **v-model 작동 안 함**: v-model은 폼 입력용으로 설계되어 contenteditable에는 작동하지 않음
- **이벤트 타이밍**: change 이벤트가 신뢰성 있게 발생하지 않아 input 이벤트 필요
- **re-render 빈도**: 모든 키 입력이 watcher와 re-render를 유발할 수 있음

## 예상 동작

- re-render 중에도 캐럿 위치가 보존되어야 함
- DOM 업데이트가 커서 위치를 재설정하지 않아야 함
- 상태 업데이트 중에도 편집 경험이 부드럽게 유지되어야 함

## 분석

Vue의 반응성 시스템이 데이터 변경 시 컴포넌트를 re-render하여 DOM 노드를 교체하고, 브라우저가 캐럿 위치를 추적하지 못하게 됩니다. Safari와 Firefox는 Chrome과 다르게 DOM 업데이트를 처리하여 이 문제에 더 취약합니다.

## 해결 방법

- 반응형 바인딩 대신 ref와 수동 DOM 업데이트 사용
- DOM 업데이트 전후에 캐럿 위치 저장 및 복원
- 상태 업데이트를 디바운스하거나 스로틀하여 re-render 빈도 감소
- 캐럿 보존을 자동으로 처리하는 커스텀 컴포넌트 사용
