# 고성능 그래프 시각화 옵션

현재 노드 수가 많아져 성능 문제가 발생하는 경우, WebGL/WebGPU 기반 라이브러리로 전환을 고려해야 합니다.

## 추천 라이브러리 (성능 순)

### 1. **sigma.js** (가장 추천) ⭐
- **장점:**
  - WebGL 기반 2D 그래프 (3D 불필요)
  - 대용량 데이터에 최적화 (수천 개 노드)
  - GPU 가속 렌더링
  - 인터랙티브 기능 풍부
  - Vanilla JS 또는 React
  - 성능이 매우 우수
- **단점:**
  - 3D는 지원하지 않음
- **설치:** `pnpm add graphology sigma`
- **용도:** 대용량 2D 네트워크 그래프

### 2. **react-force-graph-3d** (3D 원할 경우)
- **장점:**
  - WebGL 기반 3D 그래프
  - Three.js 기반
  - 성능이 좋음
  - 인터랙티브 (회전, 줌, 팬)
  - React 컴포넌트로 간단
- **단점:**
  - 3D는 일부 사용자에게 혼란스러울 수 있음
  - 모바일에서 성능 저하 가능
- **설치:** `pnpm add react-force-graph-3d three`
- **용도:** 3D 그래프가 필요한 경우

### 3. **react-force-graph-2d** (WebGL 2D)
- **장점:**
  - WebGL 기반 2D 그래프
  - react-force-graph-3d의 2D 버전
  - 성능이 좋음
  - React 컴포넌트
- **단점:**
  - 3D 버전보다는 덜 인기
- **설치:** `pnpm add react-force-graph-2d`
- **용도:** WebGL 2D 그래프

### 4. **deck.gl** (매우 대용량)
- **장점:**
  - WebGL 기반
  - 매우 대용량 데이터 (수만 개 노드)
  - GPU 가속
  - 다양한 레이어 지원
- **단점:**
  - 학습 곡선이 높음
  - 설정이 복잡
- **설치:** `pnpm add deck.gl @deck.gl/core @deck.gl/layers`
- **용도:** 매우 대용량 데이터셋

### 5. **ngraph.graph + ngraph.pixel**
- **장점:**
  - WebGL 기반
  - 성능이 매우 좋음
  - 가볍음
- **단점:**
  - 문서화가 부족
  - 커뮤니티가 작음
- **설치:** `pnpm add ngraph.graph ngraph.pixel`
- **용도:** 최고 성능이 필요한 경우

## 성능 비교

| 라이브러리 | 노드 수 (60fps) | 렌더링 | GPU 가속 | 학습 곡선 |
|-----------|----------------|--------|----------|----------|
| vis-network | ~500 | Canvas 2D | ❌ | 낮음 |
| sigma.js | ~5,000+ | WebGL | ✅ | 중간 |
| react-force-graph-2d | ~2,000+ | WebGL | ✅ | 낮음 |
| react-force-graph-3d | ~1,000+ | WebGL | ✅ | 낮음 |
| deck.gl | ~10,000+ | WebGL | ✅ | 높음 |

## 최종 추천

**sigma.js**를 추천합니다:
1. WebGL 기반으로 성능이 우수
2. 2D 그래프 (3D 불필요)
3. 대용량 데이터에 최적화
4. 인터랙티브 기능이 풍부
5. React 없이도 사용 가능 (Astro에 적합)

또는 **react-force-graph-2d**도 좋은 선택:
1. React 컴포넌트로 간단
2. WebGL 기반 2D
3. 성능이 좋음
4. 이미 React를 사용 중

## 마이그레이션 전략

1. **단계적 전환:**
   - 먼저 sigma.js로 전환
   - 데이터 구조는 유지
   - 필터링 로직 재사용

2. **성능 최적화:**
   - 노드 수 제한 (예: 필터링된 노드만 표시)
   - 레이블 렌더링 최적화
   - 엣지 렌더링 최적화

3. **점진적 개선:**
   - 초기에는 모든 노드 표시
   - 필요시 가상화(virtualization) 추가

