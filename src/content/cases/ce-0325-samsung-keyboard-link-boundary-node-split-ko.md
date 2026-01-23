---
id: ce-0325-samsung-keyboard-link-boundary-node-split-ko
scenarioId: scenario-samsung-keyboard-link-boundary
locale: ko
os: Android
osVersion: "10-14"
device: Mobile (Samsung Galaxy series)
browser: Chrome for Android
keyboard: Korean (IME) - Samsung Keyboard with Text Prediction ON
caseTitle: 삼성 키보드 링크 경계 입력 시 텍스트 노드 강제 분리 및 이탈 현상
description: "안드로이드 크롬에서 삼성 키보드의 구문 추천 기능이 활성화된 상태로 <a> 태그(링크)의 끝부분에서 한글을 입력할 때, 브라우저가 텍스트 노드를 물리적으로 쪼개거나 커서가 링크 밖(부모 요소)으로 튕겨 나가는 현상을 다룹니다."
tags:
  - samsung-keyboard
  - link-boundary
  - node-split
  - ime-composition
  - android-chrome
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px;">
    <p><a href="#">링크텍스트</a></p>
  </div>
domSteps:
  - label: "초기 상태"
    html: '<div contenteditable="true"><p><a href="#">[naver.com]</a>|</p></div>'
    description: "<a> 태그의 텍스트 노드 끝에 커서가 위치함"
  - label: "한글 입력 시도 ('ㅁ' 입력)"
    html: '<div contenteditable="true"><p><a href="#">[naver.com]</a>[mㅁ]</p></div>'
    description: "입력 시 링크의 마지막 글자('m')가 복제되어 링크 밖으로 새 노드와 함께 튕겨 나감"
  - label: "조합 진행 ('마' 입력)"
    html: '<div contenteditable="true"><p><a href="#">[naver.com]</a>[m마]</p></div>'
    description: "링크 끝 글자가 중복된 상태로 조합이 진행됨 (`m마` 현상)"
---

## 현상

안드로이드 크롬 브라우저에서 삼성 키보드의 **구문 추천(Text Prediction)** 기능이 켜져 있을 때, 링크(`<a>`) 요소의 끝 지점에서 한글을 입력하면 다음과 같은 구조적 문제가 발생합니다:

1.  **텍스트 노드 강제 분리**: 원래 하나의 텍스트 노드여야 할 부분이 입력 시점에 물리적으로 쪼개집니다.
2.  **커서/입력값 탈출 및 복제 (Leakage)**: 입력값이 링크 태그 내부가 아닌 바깥으로 튕겨 나가는데, 이때 **링크의 마지막 글자가 복제**되어 함께 나가는 현상이 발생합니다. (예: `com` 뒤에 '마' 입력 시 `com` + `m마` 가 됨)
3.  **조합 참조 상실**: IME가 링크 내부의 텍스트와 새로 입력된 텍스트 사이의 문맥을 잃어버려, 위와 같이 글자가 중복되거나 조합이 깨지는 현상이 발생합니다.

## 재현 예시

1. 안드로이드 기기(삼성 갤럭시)에서 Chrome을 실행하고 삼성 키보드 '구문 추천'을 활성화합니다.
2. `contenteditable` 영역 내에 링크(`<a>링크</a>`)를 생성합니다.
3. 링크 텍스트의 바로 뒤(끝부분)에 커서를 둡니다.
4. 한글을 입력합니다 (예: '안녕').

## 관찰된 동작 (Zero Trace Log 분석 기반)

- **Step 72 (beforeinput)**: `insertCompositionText`가 발생할 때까지는 타겟이 `A` 태그 내부를 가리킵니다.
- **Step 73 (input)**: 실제 입력값이 돔에 반영되는 순간, 입력된 글자(`ㅇ`)가 `A` 태그 밖의 `P` 태그 지식으로 삽입됩니다.
- 결과적으로 돔 트리 상에서 `<p><a>링크</a>ㅇ</p>`와 같은 구조가 되어, 서식이 의도치 않게 끊기게 됩니다.

## 예상 동작

- 입력된 글자는 항상 `<a>` 태그 내부의 텍스트 노드 끝에 유지되어야 합니다.
- 텍스트 노드가 분리되지 않고 기존 노드에 합쳐져야(Merge) 합니다.

## 해결을 위한 원형 알고리즘(Circular Sync) 적용 포인트

1.  **Normalization Cycle**: `input` 이벤트 직후, 텍스트 노드가 분리된 것을 감지하면 즉시 모델의 진실(ID 기반 구조)에 따라 분리된 노드를 다시 링크 내부로 "회전(Rotate)"시켜 병합합니다.
2.  **Shadow Composition Tracking**: 브라우저가 돔을 쪼개더라도, 모델 상에서는 단일 텍스트 노드로 관리하여 다음 렌더링 시점에 하나로 합쳐진 돔을 출력합니다.
