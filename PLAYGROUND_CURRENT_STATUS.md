# Playground 현재 상태 분석

## 현재 있는 기능 ✅

### 1. **Event Timeline Visualization** ✅
- `phases` 배열로 이벤트를 시간순으로 표시
- 각 phase의 delta(시간 차이) 표시
- 이미 구현되어 있음

### 2. **기본 DOM Diff** ✅
- `domBefore`와 `domAfter`를 저장
- `DomDiffView`로 Before/After 비교 표시
- 단순 문자열 diff (common prefix/suffix 기반)

### 3. **Range Visualization** ✅ (개선 필요)
- Selection, Composition, BeforeInput, Input의 Range를 SVG로 시각화
- 현재는 `overlayRef`를 사용하여 에디터 위에 오버레이로 표시
- **문제**: contenteditable 영역 밖으로 스크롤되면 보이지 않음

### 4. **Special Character Highlighting** ✅
- `DebugText` 컴포넌트로 zwnbsp, nbsp, space, lf, cr, tab 표시
- 이미 구현되어 있음

---

## 현재 없는 기능 ❌

### 1. **Snapshot 기능** ❌
- IndexedDB에 현재 상태 저장 기능 없음
- 스냅샷 히스토리 관리 없음
- 스냅샷 복원 기능 없음

### 2. **정확한 DOM Change Tracker** ⚠️
- 현재는 단순 문자열 diff만 있음
- **부족한 점**:
  - 어떤 노드가 추가/삭제/수정되었는지 정확히 추적하지 않음
  - 텍스트 노드가 어떻게 변경되었는지 추적하지 않음
  - beforeinput 시점의 텍스트 노드 스냅샷을 찍지 않음

### 3. **Text Node Tracker** ❌
- 텍스트 노드에 고유 ID 부여 기능 없음
- beforeinput 시점의 텍스트 노드 스냅샷 없음
- 텍스트 노드 변경 추적 없음
- **참고**: zwnbsp 같은 특수 문자 표시는 이미 `DebugText`로 하고 있음

---

## 질문에 대한 답변

### Q1: Snapshot 기능은 없어?
**A**: 없습니다. 추가 필요합니다.

### Q2: DOM Change Tracker도 없어?
**A**: 기본적인 diff는 있지만, 정확한 노드별 변경 추적은 없습니다.
- 현재: 문자열 diff (common prefix/suffix)
- 필요: 노드별 추가/삭제/수정 추적

### Q3: 구조를 완전히 바꿔야 하는거야?
**A**: 아니요. 현재 구조에서 추가/개선 가능합니다.
- Snapshot: IndexedDB 유틸리티 추가
- DOM Change Tracker: devtool의 `dom-change-tracker` 로직 참고하여 개선
- Text Node Tracker: 유틸리티 함수 추가

### Q4: Text Node Tracker는 어떤 형태로 필요한거야? zwnbsp 표시하는데 필요한거야?
**A**: zwnbsp 표시는 이미 `DebugText`로 하고 있습니다.
- **Text Node Tracker의 목적**:
  1. 각 텍스트 노드에 고유 ID 부여 (`text_1_1234567890` 형태)
  2. beforeinput 시점에 모든 텍스트 노드 스냅샷 찍기
  3. input 시점에 텍스트 노드가 어떻게 변경되었는지 비교
  4. 예: 텍스트 노드가 분리되었는지, 병합되었는지, 삭제되었는지 추적

- **사용 사례**:
  - 브라우저가 텍스트 노드를 어떻게 재구성하는지 파악
  - 예상치 못한 텍스트 노드 분리/병합 감지
  - zwnbsp와는 별개로, 노드 자체의 생명주기 추적

### Q5: Normalize Viewer는 뭘까요?
**A**: 브라우저가 DOM을 정규화하는 것을 보여주는 기능입니다.
- **예시**:
  - `<p></p><p></p>` → `<p><br></p><p><br></p>` (빈 paragraph에 br 추가)
  - `<b><i>text</i></b>` → `<i><b>text</b></i>` (태그 순서 정규화)
  - 연속된 텍스트 노드 병합

- **우리 프로젝트에서 필요한가?**
  - 순수 contenteditable에서는 브라우저가 자동으로 정규화하는 것을 보여주는 것
  - 현재 DOM diff로도 어느 정도 파악 가능
  - **우선순위 낮음** (필요하면 나중에)

---

## 제안하는 구현 계획

### Phase 1: 즉시 구현 (구조 변경 없이)

#### 1. **Range Visualization 개선** 🔥
- 현재: `overlayRef`를 에디터 위에 오버레이로 사용
- 문제: 스크롤 시 Range가 보이지 않음
- 해결: contenteditable 영역 내에서만 표시되도록 개선
- 방법: `editorRef.current`의 `getBoundingClientRect()`를 기준으로 계산

#### 2. **Snapshot 기능 추가** 🔥
- `src/utils/snapshot-db.ts`: IndexedDB 유틸리티
- `src/components/SnapshotButton.tsx`: 스냅샷 저장 버튼
- `src/components/SnapshotHistory.tsx`: 스냅샷 목록 및 상세보기
- 저장 데이터:
  - 이벤트 로그 (`logsRef.current`)
  - DOM Before/After (`domBefore`, `domAfter`)
  - 환경 정보 (`environment`)
  - Range 정보 (`rangesRef.current`)
  - 타임스탬프

#### 3. **DOM Change Tracker 개선** 🔥
- devtool의 `dom-change-tracker` 참고
- beforeinput 시점에 텍스트 노드 스냅샷 찍기
- input 시점에 변경사항 비교
- 변경된 노드를 색상으로 구분하여 표시

### Phase 2: 다음 단계

#### 4. **Text Node Tracker 추가** (선택사항)
- `src/utils/text-node-tracker.ts`: 텍스트 노드 ID 관리
- beforeinput 시점 스냅샷
- input 시점 비교
- 텍스트 노드 변경 히스토리 표시

---

## 구현 우선순위

1. **Range Visualization 개선** - 가장 빠르게 개선 가능
2. **Snapshot 기능** - 케이스 작성에 직접 도움
3. **DOM Change Tracker 개선** - 현재 diff를 더 정확하게

