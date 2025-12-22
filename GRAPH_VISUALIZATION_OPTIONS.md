# 그래프 시각화 라이브러리 옵션

Case와 Scenario 간의 연관성을 시각화하기 위한 라이브러리 옵션입니다.

## 추천 라이브러리

### 1. **vis-network** (가장 추천) ⭐
- **장점:**
  - 네트워크 그래프에 특화
  - Vanilla JS로 사용 가능 (React 불필요)
  - 인터랙티브 (드래그, 줌, 필터링)
  - 대용량 데이터 처리 가능
  - 커스터마이징 용이
  - 문서화가 잘 되어 있음
- **단점:**
  - 3D는 지원하지 않음
- **설치:** `pnpm add vis-network`
- **용도:** Case-Scenario 네트워크, 태그 연결, OS/Browser 그룹핑

### 2. **Cytoscape.js**
- **장점:**
  - 그래프 시각화에 매우 강력
  - 다양한 레이아웃 알고리즘 (force-directed, hierarchical 등)
  - 확장 가능한 플러그인 시스템
  - 성능이 우수
- **단점:**
  - 학습 곡선이 있음
  - 설정이 복잡할 수 있음
- **설치:** `pnpm add cytoscape`
- **용도:** 복잡한 관계 시각화, 다양한 레이아웃 필요 시

### 3. **react-force-graph** (React 기반)
- **장점:**
  - React 컴포넌트로 사용 간편
  - 2D/3D 그래프 지원
  - 인터랙티브 (호버, 클릭, 드래그)
  - 예쁜 애니메이션
- **단점:**
  - React 의존성 필요 (이미 프로젝트에 있음)
  - 3D는 성능 이슈 가능
- **설치:** `pnpm add react-force-graph`
- **용도:** React 컴포넌트로 간단하게 구현하고 싶을 때

### 4. **D3.js**
- **장점:**
  - 완전한 커스터마이징 가능
  - 가장 유연함
  - 다양한 시각화 가능
- **단점:**
  - 학습 곡선이 매우 높음
  - 구현 시간이 오래 걸림
  - 코드가 복잡해질 수 있음
- **설치:** `pnpm add d3`
- **용도:** 완전히 커스텀한 시각화가 필요할 때

### 5. **Mermaid** (정적 다이어그램)
- **장점:**
  - 텍스트 기반으로 간단
  - 정적 다이어그램에 적합
- **단점:**
  - 인터랙티브하지 않음
  - 대용량 데이터에 부적합
- **설치:** `pnpm add mermaid`
- **용도:** 간단한 관계 다이어그램

## 데이터 구조 설계

### 노드 (Nodes)
```typescript
interface GraphNode {
  id: string;
  label: string;
  type: 'case' | 'scenario' | 'tag' | 'os' | 'browser' | 'category';
  size?: number; // 연결 수에 따라
  color?: string; // 타입별 색상
  url?: string; // 클릭 시 이동할 URL
  metadata?: {
    status?: 'draft' | 'confirmed';
    category?: string;
    // ... 기타 메타데이터
  };
}
```

### 엣지 (Edges)
```typescript
interface GraphEdge {
  from: string; // 노드 ID
  to: string; // 노드 ID
  type: 'scenario' | 'tag' | 'os' | 'browser' | 'category';
  width?: number; // 관계 강도
  color?: string; // 관계 타입별 색상
  label?: string; // 엣지 레이블
}
```

### 관계 타입
1. **Case → Scenario**: `scenarioId`로 연결 (가장 강한 연결)
2. **Case → Tag**: `tags` 배열로 연결
3. **Case → OS**: `os`로 연결
4. **Case → Browser**: `browser`로 연결
5. **Scenario → Category**: `category`로 연결
6. **Scenario → Tag**: `tags` 배열로 연결

## 추천 구현 방안

### Option 1: vis-network (추천)
```typescript
// 간단하고 직관적
import { Network } from 'vis-network';

const nodes = [
  { id: 'case-1', label: 'Case 1', type: 'case', color: '#ff6b6b' },
  { id: 'scenario-1', label: 'Scenario 1', type: 'scenario', color: '#4ecdc4' },
];

const edges = [
  { from: 'case-1', to: 'scenario-1', type: 'scenario' },
];

const network = new Network(container, { nodes, edges }, options);
```

### Option 2: react-force-graph
```tsx
import ForceGraph2D from 'react-force-graph-2d';

<ForceGraph2D
  graphData={{ nodes, links: edges }}
  nodeLabel={d => d.label}
  nodeColor={d => d.color}
  onNodeClick={node => window.location.href = node.url}
/>
```

## 필터링 기능

1. **노드 타입 필터**: Case만 보기, Scenario만 보기
2. **태그 필터**: 특정 태그가 있는 노드만 표시
3. **상태 필터**: confirmed/draft 필터링
4. **카테고리 필터**: IME, Formatting 등
5. **검색**: 노드 이름으로 검색

## 인터랙션 기능

1. **노드 클릭**: 해당 Case/Scenario 페이지로 이동
2. **노드 호버**: 상세 정보 툴팁 표시
3. **드래그**: 노드 위치 조정
4. **줌/팬**: 그래프 탐색
5. **하이라이트**: 선택한 노드와 연결된 노드만 강조

## 성능 고려사항

- **대용량 데이터**: vis-network나 Cytoscape.js 추천
- **작은 데이터셋**: react-force-graph도 충분
- **가상화**: 100개 이상 노드 시 가상화 고려

## 최종 추천

**vis-network**를 추천합니다:
1. Astro 프로젝트에 바로 통합 가능 (React 불필요)
2. 네트워크 그래프에 최적화
3. 인터랙티브 기능이 풍부
4. 커스터마이징이 용이
5. 문서화가 잘 되어 있음

