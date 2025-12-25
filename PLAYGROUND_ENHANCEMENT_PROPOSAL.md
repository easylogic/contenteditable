# Playground Enhancement Proposal

## 현재 Playground 기능
- ✅ Range visualization (selection, composition, beforeinput, input)
- ✅ Event logging (selectionchange, composition, beforeinput, input)
- ✅ DOM diff (Before/After)
- ✅ Anomaly detection (parent mismatch, boundary input, etc.)
- ✅ Special character highlighting (nbsp, zwnbsp, lf, cr, tab, space)
- ✅ Text with cursor position visualization
- ✅ Environment detection

## 제안하는 추가 기능

### 1. **Snapshot 기능** (우선순위: 높음)
devtool의 `snapshot-collector`와 `snapshot-history-viewer`를 참고하여:

#### 기능:
- **스냅샷 생성**: 현재 상태(이벤트 로그, DOM, 환경 정보)를 IndexedDB에 저장
- **스냅샷 히스토리**: 저장된 스냅샷 목록 표시
- **스냅샷 상세보기**: 각 스냅샷의 이벤트 로그, DOM, 환경 정보를 상세히 보기
- **스냅샷 다운로드**: JSON 형태로 다운로드
- **스냅샷 삭제**: 불필요한 스냅샷 삭제
- **스냅샷 복원**: 저장된 스냅샷을 다시 로드하여 재현

#### 구현 위치:
- `src/components/Playground.tsx`에 스냅샷 버튼 추가
- `src/components/SnapshotHistory.tsx` 새 컴포넌트 생성
- `src/utils/snapshot-db.ts` IndexedDB 유틸리티 생성

#### 사용 사례:
- 특정 버그를 재현한 상태를 저장하여 나중에 분석
- 여러 브라우저에서 같은 스냅샷을 로드하여 비교
- 케이스 작성 시 증거 자료로 활용

---

### 2. **DOM Structure Tree Viewer** (우선순위: 중간)
devtool의 `struct-tree-viewer`를 참고하여:

#### 기능:
- **DOM 트리 시각화**: contenteditable 요소의 DOM 구조를 트리 형태로 표시
- **노드 하이라이트**: 현재 선택된 노드나 이벤트가 발생한 노드를 하이라이트
- **노드 정보**: 각 노드의 태그명, id, className, textContent 표시
- **인터랙티브 탐색**: 트리에서 노드를 클릭하면 에디터에서 해당 노드로 스크롤

#### 구현 위치:
- `src/components/DomStructureTree.tsx` 새 컴포넌트 생성
- Playground 우측 패널에 탭으로 추가

#### 사용 사례:
- 복잡한 DOM 구조를 시각적으로 이해
- 이벤트가 발생한 정확한 노드 위치 파악
- DOM 변경 전후 구조 비교

---

### 3. **Event Timeline Visualization** (우선순위: 중간)
devtool의 `event-logs-viewer`의 타임라인 기능을 참고하여:

#### 기능:
- **타임라인 뷰**: 이벤트들을 시간 순서대로 타임라인에 표시
- **이벤트 그룹핑**: composition/beforeinput/input 세트를 그룹으로 묶어 표시
- **이벤트 필터링**: 특정 이벤트 타입만 필터링하여 보기
- **이벤트 상세보기**: 타임라인에서 이벤트를 클릭하면 상세 정보 표시

#### 구현 위치:
- `src/components/EventTimeline.tsx` 새 컴포넌트 생성
- Playground 우측 패널에 탭으로 추가

#### 사용 사례:
- 여러 이벤트의 발생 순서와 시간 간격 파악
- IME composition 이벤트 세트를 한눈에 보기
- 이벤트 간의 관계 이해

---

### 4. **DOM Change Tracker** (우선순위: 높음)
devtool의 `dom-change-tracker`를 참고하여:

#### 기능:
- **변경 추적**: beforeinput과 input 사이의 DOM 변경사항을 정확히 추적
- **변경 시각화**: 추가/삭제/수정된 노드를 색상으로 구분하여 표시
- **변경 상세 정보**: 어떤 노드가 어떻게 변경되었는지 상세 정보 표시
- **변경 히스토리**: 여러 변경사항을 히스토리로 관리

#### 구현 위치:
- `src/components/DomChangeTracker.tsx` 새 컴포넌트 생성
- Playground의 DOM diff 영역에 통합

#### 사용 사례:
- 브라우저가 실제로 어떤 DOM 변경을 수행하는지 정확히 파악
- 예상치 못한 DOM 변경 감지
- DOM 변경 최적화 분석

---

### 5. **Text Node Tracker** (우선순위: 중간)
devtool의 `text-node-tracker`를 참고하여:

#### 기능:
- **텍스트 노드 추적**: 각 텍스트 노드에 고유 ID 부여
- **텍스트 노드 변경 추적**: beforeinput/input 사이에 텍스트 노드가 어떻게 변경되었는지 추적
- **텍스트 노드 시각화**: 에디터에서 각 텍스트 노드를 하이라이트

#### 구현 위치:
- `src/utils/text-node-tracker.ts` 유틸리티 생성
- `src/components/Playground.tsx`에 통합

#### 사용 사례:
- 텍스트 노드가 언제 생성/삭제/병합되는지 파악
- 브라우저별 텍스트 노드 처리 차이 분석

---

### 6. **Range Utils & Visualization Enhancement** (우선순위: 중간)
devtool의 `range-utils`와 `range-visualizer`를 참고하여:

#### 기능:
- **Range 상세 정보**: Range의 startContainer, endContainer, offset 정보를 더 상세히 표시
- **Range 비교**: 여러 Range를 비교하여 차이점 표시
- **Range 시각화 개선**: 
  - Selection boundary를 삼각형으로 표시
  - Container 범위를 별도로 표시
  - Range 레이어를 구분하여 표시 (selection, composition, beforeinput, input)

#### 구현 위치:
- `src/utils/range-utils.ts` 유틸리티 생성
- `src/components/Playground.tsx`의 RangeVisualizer 개선

#### 사용 사례:
- Range의 정확한 위치와 범위 파악
- 여러 이벤트의 Range 비교

---

### 7. **Normalize Viewer** (우선순위: 낮음)
devtool의 `normalize-viewer`를 참고하여:

#### 기능:
- **정규화된 DOM 표시**: 브라우저가 실제로 처리하는 정규화된 DOM 구조 표시
- **정규화 전후 비교**: 원본 DOM과 정규화된 DOM 비교

#### 구현 위치:
- `src/components/NormalizeViewer.tsx` 새 컴포넌트 생성
- Playground 우측 패널에 탭으로 추가

#### 사용 사례:
- 브라우저의 DOM 정규화 동작 이해
- 정규화로 인한 예상치 못한 변경 감지

---

### 8. **JSON Viewer** (우선순위: 낮음)
devtool의 `json-viewer`를 참고하여:

#### 기능:
- **JSON 데이터 시각화**: 이벤트 로그, DOM, 환경 정보를 JSON 형태로 보기 좋게 표시
- **JSON 검색**: JSON 내에서 특정 값 검색
- **JSON 복사**: JSON 데이터를 클립보드에 복사

#### 구현 위치:
- `src/components/JsonViewer.tsx` 새 컴포넌트 생성
- Playground 우측 패널에 탭으로 추가

#### 사용 사례:
- 전체 데이터를 JSON 형태로 확인
- 데이터 구조 이해
- 리포트 생성 시 활용

---

## 구현 우선순위

### Phase 1 (즉시 구현)
1. **Snapshot 기능** - 가장 유용하고 케이스 작성에 직접 도움
2. **DOM Change Tracker** - 현재 DOM diff를 더 정확하게 개선

### Phase 2 (다음 단계)
3. **DOM Structure Tree Viewer** - 복잡한 DOM 구조 이해에 도움
4. **Event Timeline Visualization** - 이벤트 흐름 이해에 도움
5. **Range Utils & Visualization Enhancement** - Range 시각화 개선

### Phase 3 (추가 개선)
6. **Text Node Tracker** - 고급 분석에 유용
7. **Normalize Viewer** - 특정 케이스에 유용
8. **JSON Viewer** - 데이터 확인용

---

## 기술 스택

- **IndexedDB**: 스냅샷 저장 (`idb` 라이브러리 사용 권장)
- **React**: 기존 컴포넌트 구조 유지
- **SVG**: Range 시각화 (이미 사용 중)
- **Tree View**: DOM 구조 트리 표시 (`react-tree-view` 또는 직접 구현)

---

## 참고 파일

### devtool 플러그인 주요 파일:
- `/Users/user/github/zero-js/zero-core/packages/plugins/devtool/src/utils/snapshot-collector/` - 스냅샷 생성 로직
- `/Users/user/github/zero-js/zero-core/packages/plugins/devtool/src/ui/snapshot-history-viewer.ts` - 스냅샷 히스토리 UI
- `/Users/user/github/zero-js/zero-core/packages/plugins/devtool/src/utils/event-monitor/dom-change-tracker.ts` - DOM 변경 추적
- `/Users/user/github/zero-js/zero-core/packages/plugins/devtool/src/utils/event-monitor/text-node-tracker.ts` - 텍스트 노드 추적
- `/Users/user/github/zero-js/zero-core/packages/plugins/devtool/src/ui/struct-tree-viewer.ts` - DOM 구조 트리
- `/Users/user/github/zero-js/zero-core/packages/plugins/devtool/src/utils/event-monitor/range-visualizer.ts` - Range 시각화

