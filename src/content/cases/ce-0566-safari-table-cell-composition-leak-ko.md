---
id: ce-0566-safari-table-cell-composition-leak-ko
scenarioId: scenario-table-composition-leaks
locale: ko
os: macOS
osVersion: "14.4"
device: Desktop
deviceVersion: Any
browser: Safari
browserVersion: "17.4"
keyboard: Japanese IME
caseTitle: "빈 테이블 셀에서 IME 조합 텍스트가 셀 밖으로 유출됨"
description: "Safari 17 이상 버전의 빈 <td> 셀에서 IME 조합 시, 최종 확정된 텍스트가 셀 컨테이너 외부로 배치되는 현상입니다."
tags: ["ime", "composition", "table", "safari-17", "selection-leak"]
status: confirmed
domSteps:
  - label: "1단계: 빈 셀 포커스"
    html: '<table><tr><td style="border: 1px solid black;">|</td></tr></table>'
    description: "비어 있는 <td> 내부에 캐럿이 위치함"
  - label: "2단계: 조합 시작"
    html: '<table><tr><td style="border: 1px solid black;"><span style="text-decoration: underline;">あ</span>|</td></tr></table>'
    description: "IME 조합 시작. 셀 내부에 임시 조합 텍스트 'あ'가 표시됨"
  - label: "3단계: 확정 (버그 발생)"
    html: 'あ<table><tr><td style="border: 1px solid black;"></td></tr></table>'
    description: "Enter를 눌러 확정하는 순간, 'あ'가 셀 밖으로 튀어나와 테이블 앞에 위치함"
  - label: "✅ 예상 동작"
    html: '<table><tr><td style="border: 1px solid black;">아|</td></tr></table>'
    description: "예상: 확정된 텍스트는 조합이 일어났던 <td> 내부에 그대로 머물러야 함"
---

## 현상
Safari의 WebKit 엔진은 테이블 구조 내에서 "논리적 위치에서 물리적 위치로(Logical to Physical)" 선택 영역을 매핑하는 과정에 결함이 있습니다. 사용자가 다른 텍스트나 노드가 없는 완전히 비어 있는 `<td>` 셀 내부에서 IME 조합(한글, 일본어, 중국어 등)을 시작하고 이를 확정할 때, 최종 삽입 지점이 셀 외부로 잘못 계산되는 현상이 나타납니다.

## 재현 단계
1. 비어 있는 테이블 셀이 포함된 구조를 렌더링합니다: `<table><tr><td></td></tr></table>`.
2. 해당 셀에 `contenteditable="true"`를 설정합니다.
3. CJK IME(예: 일본어 Kana, 한국어 등)를 사용합니다.
4. 셀 내부를 클릭하고 조합이 시작되도록 글자를 입력합니다 (예: "a").
5. **Enter** 키를 눌러 조합을 확정합니다.

## 관찰된 동작
1. **`compositionstart` 및 `compositionupdate`**: `<td>` 내부에서 정상적으로 발생합니다.
2. **`compositionend`**: 정상적으로 발생합니다.
3. **DOM 변이**: 조합이 끝난 뒤, 임시 조합 상태의 문자가 제거되고 정적인 텍스트가 삽입될 때 `<td>` **외부**에 삽입됩니다.
4. **캐럿 위치**: 캐럿이 문서의 맨 앞이나 테이블 블록의 시작 부분으로 점프하는 경우가 많습니다.

## 예상 동작
브라우저는 전체 조합 수명 주기(Lifecycle) 동안 `Selection` 범위가 부모 요소인 `<td>` 내부에 단단히 고정(anchor)되도록 보장해야 합니다.

## 영향
- **데이터 무결성**: 텍스트가 의도한 컨테이너 밖으로 나가버려 데이터의 논리적 구조가 깨집니다.
- **시각적 파손**: 테이블 셀은 비어 있고 텍스트만 테이블 위아래로 떠다니는 등 레이아웃이 붕괴됩니다.
- **실행 취소(Undo) 불능**: 삽입된 위치가 "유출"된 지점이기 때문에, Undo 조작 시 해당 텍스트를 정확히 찾아 제거하지 못할 수 있습니다.

## 브라우저 비교
- **Safari 17/18**: 버그 발생.
- **Chrome/Firefox**: 정상 동작; 범위가 `<td>` 내에 유지됨.

## 참고 및 해결 방법
### 해결책: 더미 노드 활용
ProseMirror에서 사용되는 워크라운드는 셀이 선택 시점에 "완전히 비어있지 않도록" 처리하거나, `compositionend` 시점에 선택 영역을 강제로 셀 내부로 재설정하는 것입니다.

```javascript
// compositionend 시점에 선택 영역이 셀을 벗어났는지 확인
element.addEventListener('compositionend', (e) => {
  const sel = window.getSelection();
  const range = sel.getRangeAt(0);
  
  if (!container.contains(range.commonAncestorContainer)) {
    console.warn('Safari Selection Leak 감지! 수정 중...');
    // 마지막으로 확인된 유효한 경로에 데이터를 직접 삽입
    insertAtLastKnownValidPath(e.data);
  }
});
```

- [ProseMirror v1.41.5 워크라운드 커밋](https://github.com/ProseMirror/prosemirror-view/commit/6b7f3d)
- [WebKit Bug 271501](https://bugs.webkit.org/show_bug.cgi?id=271501)
