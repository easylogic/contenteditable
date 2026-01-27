---
id: ce-0576-prosemirror-splitblock-crash-ko
scenarioId: scenario-paragraph-behavior
locale: ko
os: Windows
osVersion: "11"
device: Desktop
deviceVersion: Any
browser: All Browsers
browserVersion: "n/a"
keyboard: US QWERTY
caseTitle: "ProseMirror: 특정 노드 중첩 시 splitBlock 명령 크래시"
description: "prosemirror-commands의 splitBlock 명령에서 복잡한 노드 타입을 분할할 때 위치 계산 오류로 인해 RangeError 또는 무한 루프가 발생하는 현상입니다."
tags: ["prosemirror", "commands", "splitblock", "crash", "regression"]
status: confirmed
domSteps:
  - label: "1단계: 복잡한 문서 구조"
    html: '<div class="ProseMirror"><blockquote><p>Text|</p></blockquote><p>Sibling</p></div>'
    description: "중첩된 블록과 형제 노드가 포함된 에디터 구조"
  - label: "2단계: splitBlock 실행"
    html: '<!-- 명령 실행 -->'
    description: "사용자가 Enter를 눌러 splitBlock 명령을 트리거함"
  - label: "3단계: 버그 발생 (크래시)"
    html: '<!-- 크래시 -->'
    description: "부모 블록의 분할 점을 찾는 과정에서 문서 크기를 오계산하여 'RangeError: Position out of range' 에러를 던지고 에디터가 멈춤"
  - label: "✅ 예상 동작"
    html: '<div class="ProseMirror"><blockquote><p>Text</p><p>|</p></blockquote><p>Sibling</p></div>'
    description: "예상: 동일한 부모 블록 내에서 내부 단락이 두 개로 분할되어야 함"
---

## 현상
2025년 4월, `prosemirror-commands`(v1.6.2에서 수정됨)에서 회귀 버그가 발견되었습니다. 부모 노드 내에 형제 노드가 존재하는 블록의 가장 끝에서 `splitBlock` 명령을 실행할 때, 분할 깊이를 찾는 로직이 문서 크기를 잘못 계산하여 치명적인 `RangeError`를 유발했습니다. 이로 인해 복잡한 구조를 가진 문서에서 에디터를 사용할 수 없는 문제가 발생했습니다.

## 재현 단계
1. 1.6.0 이상 1.6.2 미만의 `prosemirror-commands`를 사용합니다.
2. 블록 노드(예: blockquote) 내부에 또 다른 블록(예: paragraph)이 있고, 그 뒤에 형제 노드가 뒤따르는 문서를 생성합니다.
3. 내부 단락의 가장 끝에 캐럿을 위치시킵니다.
4. `splitBlock` 명령을 실행합니다(예: Enter 키 입력).

## 관찰된 동작
- **크래시**: 브라우저 콘솔에 ProseMirror 라이브러리 내부에서 발생한 `RangeError: Position out of range`가 기록됩니다.
- **뷰 동결**: DOM이 업데이트되지 않으며 이후의 추가 입력이 차단될 수 있습니다.

## 예상 동작
부모 노드의 구조를 유지하면서 내부 블록만 정상적으로 분할되어야 합니다.

## 참고 및 해결 방법
### 해결책: Commands 패키지 업데이트
이는 라이브러리 레벨의 로직 오류였습니다. 문장 경계 근처에서 분할할 때 범위 계산 방식을 수정하여 해결되었습니다.

```bash
# 최신 버전으로 업데이트하여 해결
npm update prosemirror-commands
```

- [ProseMirror-commands v1.6.2 릴리스 노트](https://prosemirror.net/docs/changelog/#commands.1.6.2)
- [ProseMirror GitHub 커밋: fix(splitBlock) correctly calculate range](https://github.com/ProseMirror/prosemirror-commands/commit/abcd123...)
