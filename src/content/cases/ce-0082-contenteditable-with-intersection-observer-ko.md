---
id: ce-0082-contenteditable-with-intersection-observer-ko
scenarioId: scenario-intersection-observer-interference
locale: ko
os: macOS
osVersion: "14.2"
device: Desktop
deviceVersion: Any
browser: Safari
browserVersion: "17.2"
keyboard: US
caseTitle: IntersectionObserver가 예기치 않은 에디터 초기화를 유발함
description: "에디터의 가시성을 감지하기 위해 IntersectionObserver를 사용하면 타이핑 중에 교차 상태가 변경될 때 Safari가 IME 조합 버퍼를 해제할 수 있습니다."
tags: ["intersection-observer", "composition", "reset", "safari"]
status: confirmed
---

## 현상
Safari에서 `IntersectionObserver`가 에디터 div를 감시하고 있고, 스크롤이나 키보드 확장 중에 해당 div의 교차 비율이 조금이라도 변경되면, 브라우저는 현재의 IME 조합(Composition)을 지워버리는 재렌더링 주기를 트리거할 수 있습니다.

## 재현 단계
1. 에디터에 `IntersectionObserver`를 연결합니다.
2. IME 조합(예: 한글 또는 일본어)을 시작합니다.
3. 에디터의 위치가 약간 이동하도록 페이지를 스크롤합니다.
4. 현재 밑줄이 그어진 텍스트가 즉시 확정되거나 삭제되는지 확인합니다.

## 관찰된 동작
이벤트 디스패치를 위한 Safari의 "가시성 확인" 로직이 옵저버 주기에 민감하게 반응하여, 조기에 `compositionend` 이벤트를 발생시킵니다.
