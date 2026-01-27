---
id: ce-0577-android-first-word-duplication-ko
scenarioId: scenario-ime-interaction-patterns
locale: ko
os: Android
osVersion: "14.0"
device: Smartphone
deviceVersion: Any
browser: Chrome
browserVersion: "131.0"
keyboard: Gboard (English/Korean)
caseTitle: "Android: 공백 + 백스페이스 입력 후 첫 단어 중복 현상"
description: "안드로이드 Gboard 등 IME의 조합 버퍼 오작동으로 인해, 공백 입력과 백스페이스 연달아 수행 후 다음 글자를 입력할 때 이전 글자나 단어가 중복되어 삽입되는 현상입니다."
tags: ["android", "ime", "duplication", "composition", "chrome-131"]
status: confirmed
domSteps:
  - label: "1단계: 첫 단어 입력"
    html: '<div contenteditable="true">Hello |</div>'
    description: "'Hello'를 입력하고 공백(Space)을 한 번 누릅니다."
  - label: "2단계: 백스페이스 후 재입력"
    html: '<div contenteditable="true">Hello|</div>'
    description: "백스페이스를 눌러 공백을 지우고, 다시 글자를 입력하거나 추가로 지우려고 시도합니다."
  - label: "3단계: 버그 발생"
    html: '<div contenteditable="true">HelloHello|</div>'
    description: "IME 버퍼가 이전 단어의 위치를 잃어버리고 DOM에 다시 제출(re-submit)하여 텍스트가 중복되거나, 다음 단어의 첫 글자가 중복됩니다."
  - label: "✅ 예상 동작"
    html: '<div contenteditable="true">Hello|</div>'
    description: "예상: 중복 현상이 발생하지 않아야 하며, IME는 내부 버퍼와 현재 DOM 상태를 정확히 매핑해야 함"
---

## 현상
안드로이드에서 가장 파악하기 어렵고 좌절감을 주는 동작 중 하나로 이른바 "유령 버퍼(Ghost Buffer)" 현상으로 불립니다. 사용자가 문장 시작 부분이나 특정 구두점 뒤에서 입력-공백-백스페이스를 연달아 수행할 때, 안드로이드 IME(Gboard, 삼성 키보드 등)가 마지막으로 확정된 단어와 브라우저 DOM 간의 동기화에 실패합니다. 그 결과 사용자가 다시 입력을 시작하면 에디터에 이전 단어나 글자가 갑자기 중복되어 나타납니다.

## 재현 단계
1. 안드로이드 Chrome에서 `contenteditable` 에디터를 엽니다.
2. 단어 하나를 입력합니다 (예: "Hello").
3. 공백을 입력합니다.
4. 백스페이스를 눌러 공백을 지웁니다.
5. 즉시 다른 글자나 공백을 입력합니다.
6. DOM에 텍스트가 중복되는지 관찰합니다.

## 관찰된 동작
- **`input` 이벤트 폭주**: 브라우저가 짧은 시간 동안 여러 개의 `insertText` 또는 `insertCompositionText` 이벤트를 보냅니다.
- **버퍼 재제출(Re-submission)**: IME가 이미 DOM에 확정된 내부 버퍼 전체(예: "Hello")를 다시 보냅니다.
- **캐럿 변위(Displacement)**: 캐럿이 중복된 문자열의 맨 끝으로 튕겨 나가게 되어 사용자가 직접 불필요한 텍스트를 지워야 합니다.

## 예상 동작
IME는 DOM 노드와 엄격한 1:1 매핑을 유지해야 합니다. 백스페이스 입력은 이전 단어 전체를 다시 제출하게 만드는 트리거가 되어서는 안 되며, 내부 버퍼의 "마지막 글자" 상태만을 정확히 지워야 합니다.

## 영향
- **타이핑 피로도 가중**: 사용자가 중복된 글자를 지우기 위해 계속 입력을 멈춰야 하므로 긴 글 작성이 거의 불가능해집니다.
- **상태 오염**: 에디터가 정형화된 모델을 사용하는 경우, 이러한 "권한 없는" 변이가 모델의 로직을 우회하여 UI와 데이터 간의 불일치를 유발합니다.

## 브라우저 비교
- **안드로이드용 Chrome**: 다양한 안드로이드 버전에서 매우 높은 빈도로 발생합니다.
- **안드로이드용 Firefox**: 버퍼 관리 면에서 대체로 안정적이지만, 특유의 "끊김" 현상이 존재합니다.
- **iOS Safari**: 이러한 특정 버퍼 재제출 버그는 거의 발생하지 않습니다.

## 참고 및 해결 방법
### 해결책: 조합 잠금(Composition Locking)
많은 프레임워크(Lexical, ProseMirror)는 조합 세션 중에 모델이 허가하지 않은 방식으로 DOM이 변경되었는지 감지하고, 그런 경우 DOM을 다시 모델 상태로 강제 복구(force-reconcile)하는 "변이 가드(mutation guard)"를 구현합니다.

```javascript
/* 개념적인 해결 로직 */
element.addEventListener('input', (e) => {
  if (isAndroid && e.inputType === 'insertCompositionText') {
    // 들어오는 텍스트가 예상되는 차이점(diff)과 크게 다른지 감지
    if (isLikelyDuplication(e.data, currentModel)) {
      e.stopImmediatePropagation();
      forceReconcileModelToDom();
    }
  }
});
```

- [Lexical 이슈: 안드로이드 텍스트 중복 현상](https://github.com/facebook/lexical/issues/3348)
- [ProseMirror: 안드로이드 조합 로직 가이드](https://prosemirror.net/docs/guide/#view.android)
- [이전 ce-0577 통합본]
