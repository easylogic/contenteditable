---
id: scenario-table-composition-leaks-ko
title: "IME 조합 텍스트가 테이블 셀 밖으로 유출되는 현상"
description: "비어 있는 테이블 구조 내부에 앵커링된 IME 조합이 왜 자주 유출되는지에 대한 기술적 분석입니다."
category: "ime"
tags: ["composition", "table", "selection", "webkit"]
status: "confirmed"
locale: "ko"
---

## 문제 개요
테이블 셀(`<td>`, `<th>`)은 DOM에서 레이아웃 컨테이너이자 구조적 경계 역할을 동시에 수행하기 때문에 특별합니다. IME(Input Method Editor) 세션은 "미확정" 텍스트를 관리하기 위해 안정적인 `Selection` 범위가 필요합니다. 특히 WebKit 기반 브라우저에서 셀이 비어 있거나 `<br>`, 제로 너비 공백(ZWSP)만 포함된 경우, 조합 확정 단계에서 브라우저 내부의 선택 영역 매핑 로직이 셀 경계를 "오버슈트(overshoot)"하여 최종 텍스트를 부모 행(row)이나 테이블 전체 앞에 배치해 버리는 현상이 발생합니다.

## 관찰된 동작
### 시나리오 1: "빈 셀"의 함정
비어 있는 셀에서 브라우저는 종종 캐럿을 "셀의 시작"으로 표시하지만, 논리적으로는 "테이블 앞"과 동일한 지점으로 해석될 수 있습니다.

```javascript
/* 관찰된 시퀀스 */
// 1. 사용자가 <td></td>를 클릭 (포커스)
// 2. 사용자가 'G' 입력 (IME 시작)
// 3. 브라우저가 'G'를 위한 임시 span 생성
// 4. 사용자가 Enter 입력 (확정)
// 5. 브라우저가 임시 span 제거
// 6. 브라우저가 'G'를 삽입하지만, 더 이상 유효하게 중첩되지 않은 캐시된 범위를 사용하여 유출 발생.
```

## 영향
- **문서 파손**: DOM 내에서 테이블 구조가 물리적으로 깨집니다.
- **접근성 저하**: 스크린 리더가 해당 텍스트가 특정 셀에 속해 있다는 문맥을 상실합니다.
- **스타일링**: `<td>` 밖으로 나간 텍스트는 셀의 패딩, 정렬, 스코핑 규칙을 무시합니다.

## 브라우저 비교
- **WebKit (Safari)**: 이 버그에 가장 취약한 엔진입니다. iOS 및 macOS 17.x 버전에서 지속적으로 관찰됩니다.
- **Blink (Chrome)**: 셀 높이와 포커스를 유지하기 위해 `<p>`나 `<br>`을 자동으로 삽입하는 로직 덕분에 대체로 견고합니다.
- **Gecko (Firefox)**: 경계 처리는 잘 하지만, 확정 타이밍이 약간 어긋날 경우 중복 문자가 삽입되는 현상이 발생할 수 있습니다.

## 해결 방법
### 1. 보이지 않는 플레이스홀더 (ZWSP)
셀이 기술적으로 "완전히 비어 있지 않도록" 보장하는 것이 가장 일반적인 해결책입니다.

```javascript
function ensureTdContent(td) {
  if (td.childNodes.length === 0) {
    // 선택 영역을 고정하기 위해 ZWSP 추가
    td.appendChild(document.createTextNode('\u200B'));
  }
}
```

### 2. `compositionend`에서의 수동 동기화
최종 확정을 가로채서 브라우저의 기본 삽입 동작을 덮어씁니다.

```javascript
element.addEventListener('compositionend', (e) => {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const td = findParentTd(range.startContainer);
  
  if (!td) {
    e.preventDefault();
    console.warn('선택 영역 유출 수정 중...');
    forceInsertIntoCorrectCell(e.data);
  }
});
```

## 모범 사례
- **항상 ZWSP나 BR 유지**: `contenteditable` 테이블 셀을 절대 완전히 비워두지 마세요.
- **범위 포함 여부 검증**: 이벤트 핸들러에서 항상 `cell.contains(range.commonAncestorContainer)`를 확인하세요.

## 관련 사례
- [ce-0566: 빈 테이블 셀에서 IME 조합 텍스트가 셀 밖으로 유출되는 현상](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0566-safari-table-cell-composition-leak-ko.md)

## 참고 자료
- [W3C Editing: 테이블 처리 논의](https://github.com/w3c/editing)
- [WebKit 선택 영역 버그 트래커](https://bugs.webkit.org/show_bug.cgi?id=271501)
