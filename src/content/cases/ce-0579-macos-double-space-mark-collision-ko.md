---
id: ce-0579-ko
scenarioId: scenario-ime-interaction-patterns
locale: ko
os: macOS
osVersion: "15.0 (Sequoia)"
device: Desktop
deviceVersion: Any
browser: 모든 브라우저 (ProseMirror 문맥)
browserVersion: "최신 (2025년 11월)"
keyboard: Apple Magic Keyboard (US)
caseTitle: "macOS: 이중 공백 마침표 기능이 inclusive:false 마크 서식을 침범하는 오류"
description: "macOS의 '두 번 띄어쓰기로 마침표 추가' 기능이 발생시키는 교체 이벤트가 이전 단어의 서식을 마침표에 잘못 적용하여, 서식 경계 설정(non-inclusive)을 무시하는 현상입니다."
tags: ["macos", "ux", "auto-correct", "marks", "prosemirror"]
status: confirmed
domSteps:
  - label: "1. 굵은 텍스트 입력"
    html: '<b>Hello</b>|'
    description: "오른쪽 확장이 허용되지 않는(inclusive: false) 굵게 서식으로 'Hello'를 입력합니다."
  - label: "2. 첫 번째 공백"
    html: '<b>Hello</b> |'
    description: "공백 하나를 추가합니다. 서식 설정에 따라 공백은 굵게 처리되지 않습니다(정상)."
  - label: "3. 두 번째 공백 (버그)"
    html: '<b>Hello. </b>|'
    description: "macOS가 공백을 '. '으로 교체합니다. 교체 범위가 굵게 노드 경계와 겹치면서 마침표에 굵게 서식이 잘못 적용됩니다."
  - label: "✅ 예상 결과"
    html: '<b>Hello</b>. |'
    description: "예상: 마침표는 교체 전 공백의 스타일을 상속받아 일반 텍스트 상태를 유지해야 하며, 이전 단어의 서식을 가져오지 않아야 합니다."
---

## 현상
macOS를 사용하는 모든 브라우저의 리치 텍스트 에디터(ProseMirror, Lexical 등)에서 미묘하지만 번거로운 상호작용 버그가 발견되었습니다. macOS 시스템 옵션 중 "두 번 띄어쓰기로 마침표 추가" 기능이 활성화된 경우, 공백 두 개가 마침표와 공백 하나(`. `)로 변환됩니다. 이때 "굵게"나 "코드"와 같이 서식 경계가 `inclusive: false`(새 글자 입력 시 서식이 확장되지 않음)로 설정된 마크 옆에서 이 변환이 일어나면, 브라우저의 교체 로직이 마침표를 서식 범위 안으로 끌어들여 버립니다.

## 재현 단계
1. macOS 시스템 설정의 키보드 메뉴에서 "두 번 띄어쓰기로 마침표 추가" 기능을 켭니다.
2. 리치 텍스트 에디터에서 굵은 글씨 단어를 만듭니다. (굵게 마크의 오른쪽 inclusive 설정은 false여야 합니다.)
3. 단어 뒤에 공백을 하나 입력합니다 (일반 텍스트로 나타나야 함).
4. 두 번째 공백을 입력합니다.
5. 자동으로 삽입되는 마침표의 서식을 확인합니다.

## 관찰된 동작
- **서식 확장**: 마침표가 굵게 변하며, 예기치 않게 굵은 글씨 범위가 확장됩니다.
- **선택 영역 비동기**: 일부 내부 모델에서 교체 작업 후 캐럿이 마크 내부인지 외부인지 혼동을 일으켜, 다음 문장의 서식이 의도치 않게 고정되는 문제를 유발합니다.

## 영향
- **서식 오염**: 사용자는 문장 끝마다 생기는 굵은 마침표를 직접 선택해서 서식을 제거해야 하는 번거로움을 겪습니다.
- **문서 모델 불일치**: 문장 부호가 마크 외부에 있어야 한다고 가정하는 프로그래밍 방식의 검사 로직들이 실패하게 됩니다.

## 브라우저 비교
- **macOS / 모든 브라우저**: 시스템 레벨의 교체 이벤트이므로 OS 환경에 종속적으로 발생합니다.
- **Windows / Chrome**: 자동 수정 엔진이 다르므로 이 현상이 발생하지 않습니다.

## 참고 및 해결 방법
### 해결책: 이벤트 가로채기
현대적인 에디터들은 `inputType: "insertReplacementText"`를 명시적으로 처리하여 macOS의 마침표 단축키 발생 여부를 감지하고, 해당 범위에 에디터 스키마의 "Plain Text" 속성을 강제로 재적용해야 합니다.

- [ProseMirror 이슈 #1542: 이중 공백 마침표와 inclusive: false 마크 간의 예기치 않은 상호작용](https://github.com/prosemirror/prosemirror/issues/1542)
- [Lexical 논의: macOS 교체 버퍼와의 싸움](https://github.com/facebook/lexical/discussions/2103)
