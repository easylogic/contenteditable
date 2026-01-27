---
id: ce-0575-prosemirror-safari-empty-table-leak-ko
scenarioId: scenario-table-composition-leaks
locale: ko
os: macOS
osVersion: "15.2"
device: Desktop
deviceVersion: Any
browser: Safari
browserVersion: "18.2"
keyboard: Japanese IME
caseTitle: "ProseMirror: Safari의 빈 테이블 셀에서 텍스트가 밖으로 이동"
description: "ProseMirror에서 특정 Safari 18+ 버전 사용 시, 비어 있는 <td> 셀에서의 IME 조합이 셀 외부에서 확정되어 버리는 현상입니다."
tags: ["prosemirror", "safari", "table", "composition", "regression"]
status: confirmed
domSteps:
  - label: "1단계: 빈 셀 포커스"
    html: '<td>|</td>'
    description: "ProseMirror-view가 관리하는 빈 셀에 캐럿이 위치함"
  - label: "2단계: 조합 시작"
    html: '<td><span class="ProseMirror-widget">...</span>あ|</td>'
    description: "IME 조합 세션 시작. ProseMirror가 임시 위젯 노드를 삽입할 수 있음"
  - label: "3단계: 확정 (버그 발생)"
    html: 'あ<td></td>'
    description: "조합 종료. WebKit이 물리적 위치를 오계산하여 테이블 앞에 텍스트를 삽입함"
  - label: "✅ 예상 동작"
    html: '<td>아|</td>'
    description: "예상: 텍스트가 셀 내부에 남고 ProseMirror가 문서 모델을 정상적으로 업데이트해야 함"
---

## 현상
2025년 말(v1.41.5 이전의 `prosemirror-view`에 영향), Safari 18의 개선되었으나 여전히 불안정한 조합 엔진과의 상호작용에서 문제가 확인되었습니다. 완전히 비어 있는 `<td>`에서 일어난 CJK IME 조합이 확정될 때, 텍스트가 부모 컨테이너로 "유출"됩니다. 이는 임시 조합 노드가 제거된 후 WebKit의 선택 영역 매핑이 빈 셀 내에서 안정적인 앵커(anchor)를 찾지 못하기 때문입니다.

## 재현 단계
1. ProseMirror-view 1.41.5 미만 버전을 사용합니다.
2. 빈 테이블 셀이 포함된 문서를 작성합니다.
3. Safari 18.2+ 버전에서 엽니다.
4. 셀을 클릭하고 CJK IME를 사용해 타이핑합니다.
5. Enter를 눌러 확정합니다.

## 관찰된 동작
- **DOM 유출**: 텍스트가 테이블 밖, 문서 레벨에 나타납니다.
- **상태 불일치**: ProseMirror의 `EditorState`는 여전히 커서가 셀 안에 있다고 생각하거나, 관리되지 않는 영역에서 변이가 발생하여 크래시가 날 수 있습니다.

## 예상 동작
텍스트는 반드시 `<td>` 경계 내에 유지되어야 합니다.

## 브라우저 비교
- **Safari 18.2**: 재현율 높음.
- **Chrome/Firefox**: 정상 동작.

## 참고 및 해결 방법
### 해결책: "보이지 않는 콘텐츠" 트릭
ProseMirror는 `v1.41.5`에서 빈 테이블 셀이 선택 시점에 항상 최소한 하나의 `<br>`이나 제로 너비 공백을 포함하도록 보장하여 WebKit 엔진을 고정(anchor)시키는 방식으로 이를 해결했습니다.

```javascript
/* ProseMirror-view 내부 해결 로직 예시 */
function fixEmptyCell(dom) {
  if (isSafari && dom.nodeName === 'TD' && !dom.firstChild) {
    dom.appendChild(document.createElement('br'));
  }
}
```

- [ProseMirror-view v1.41.5 릴리스 노트](https://prosemirror.net/docs/changelog/#view.1.41.5)
- [ProseMirror GitHub 이슈 #1452](https://github.com/ProseMirror/prosemirror/issues/1452)
