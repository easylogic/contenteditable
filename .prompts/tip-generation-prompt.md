# Tip 자동 생성 프롬프트

이 프롬프트는 시나리오와 케이스를 기반으로 contenteditable 문제 해결을 위한 Tip을 자동으로 생성합니다.

## 작업 개요

시나리오(scenario)와 관련 케이스(cases)를 분석하여 실용적인 해결 방법을 제공하는 Tip 문서를 생성합니다.

## 입력 정보

다음 정보를 제공받습니다:
- **시나리오 ID**: 예) `scenario-browser-extension-interference`
- **관련 케이스 ID들**: 예) `ce-0561-browser-extension-grammarly-interference`
- **생성할 Tip 번호**: 예) `tip-009` (다음 번호)

## 작업 단계

### 1. 관련 파일 읽기
- `src/content/scenarios/{scenario-id}.md` 파일 읽기
- `src/content/scenarios/{scenario-id}-ko.md` 파일 읽기 (한국어 버전)
- 관련 케이스 파일들 읽기
- 기존 tip 파일들 확인하여 번호와 패턴 파악

### 2. Tip 내용 생성

#### 영어 버전 (`tip-XXX-{slug}.md`)
- **Frontmatter 작성**:
  ```yaml
  id: tip-XXX-{slug}
  title: {간결하고 명확한 제목}
  description: "{한 문장 요약}"
  category: {framework|browser-feature|performance|accessibility|formatting|ime|selection|paste|mobile|other}
  tags:
    - {관련 태그들}
  difficulty: {beginner|intermediate|advanced}
  relatedScenarios:
    - {scenario-id}
  relatedCases:
    - {case-id-1}
    - {case-id-2}
  locale: en
  ```

- **본문 구조**:
  ```markdown
  ## Problem
  
  {문제 상황 설명 - 시나리오의 문제점을 간결하게}
  
  ## Solution
  
  ### 1. {해결 방법 1 제목}
  
  {설명}
  
  ```{언어}
  {코드 예제}
  ```
  
  ### 2. {해결 방법 2 제목}
  
  {설명과 코드}
  
  ## Notes
  
  - {주의사항 1}
  - {주의사항 2}
  
  ## Related Resources
  
  - [Scenario: {시나리오 제목}](/scenarios/{scenario-id})
  - [Case: {케이스 ID}](/cases/{case-id})
  ```

#### 한국어 버전 (`tip-XXX-{slug}-ko.md`)
- 동일한 구조로 한국어로 작성
- Frontmatter의 `locale: ko`
- 제목과 내용을 자연스러운 한국어로 번역

### 3. 파일 생성 규칙

1. **파일명 규칙**:
   - 영어: `tip-XXX-{kebab-case-slug}.md`
   - 한국어: `tip-XXX-{kebab-case-slug}-ko.md`
   - 예: `tip-009-browser-extension-prevention.md`, `tip-009-browser-extension-prevention-ko.md`

2. **ID 규칙**:
   - 영어: `tip-XXX-{kebab-case-slug}`
   - 한국어: `tip-XXX-{kebab-case-slug}-ko` (자동으로 -ko 추가됨)

3. **저장 위치**:
   - `src/content/tips/` 디렉토리

### 4. 내용 작성 가이드라인

#### Problem 섹션
- 시나리오에서 설명된 문제를 간결하게 요약
- 개발자가 겪을 수 있는 구체적인 상황 설명
- 2-3 문단 이내

#### Solution 섹션
- 최소 2개, 최대 5개의 해결 방법 제공
- 각 방법은 독립적으로 사용 가능해야 함
- 코드 예제는 실제 동작하는 완전한 예제 제공
- 복잡도 순서로 정렬 (간단한 것부터)

#### Notes 섹션
- 브라우저 호환성 주의사항
- 성능 고려사항
- 알려진 제한사항
- 추가 권장사항

#### Related Resources 섹션
- 관련 시나리오 링크
- 관련 케이스 링크들
- 마크다운 링크 형식 사용

### 5. 카테고리 분류

- **framework**: React, Vue 등 프레임워크 관련
- **browser-feature**: 브라우저 특정 기능 (확장 프로그램, 번역 등)
- **performance**: 성능 최적화
- **accessibility**: 접근성
- **formatting**: 포맷팅, 스타일링
- **ime**: IME 및 컴포지션
- **selection**: 선택 및 캐럿
- **paste**: 붙여넣기 및 클립보드
- **mobile**: 모바일 특정
- **other**: 기타

### 6. 난이도 분류

- **beginner**: 간단한 data 속성 추가, 기본 설정 변경
- **intermediate**: 코드 작성 필요, 이벤트 리스너 관리
- **advanced**: 복잡한 로직, 라이브러리 통합, 고급 패턴

### 7. 태그 작성

- 시나리오의 태그 참고
- 케이스의 태그 참고
- 핵심 키워드 3-7개
- 소문자, 하이픈 사용 (예: `memory-leak`, `event-listener`)

## 검증 체크리스트

생성 후 다음을 확인:

- [ ] Frontmatter의 모든 필수 필드가 올바르게 작성되었는가?
- [ ] ID가 올바른 형식인가? (영어는 `-ko` 없음, 한국어는 `-ko` 있음)
- [ ] 파일명이 올바른 형식인가?
- [ ] 코드 예제가 실제로 동작하는가?
- [ ] 관련 시나리오/케이스 ID가 정확한가?
- [ ] 마크다운 링크가 올바른 형식인가?
- [ ] 영어와 한국어 버전이 모두 생성되었는가?
- [ ] 헤딩에 `{#id}` 같은 패턴이 없는가? (제거해야 함)
- [ ] 카테고리가 적절한가?
- [ ] 난이도가 적절한가?

## 예시

### 입력
- 시나리오: `scenario-browser-extension-interference`
- 케이스: `ce-0561-browser-extension-grammarly-interference`
- Tip 번호: `tip-009`

### 출력
- `src/content/tips/tip-009-browser-extension-prevention.md`
- `src/content/tips/tip-009-browser-extension-prevention-ko.md`

## 주의사항

1. **기존 Tip과의 중복 방지**: 기존 tip들을 확인하여 유사한 내용이 있는지 확인
2. **실용성**: 이론보다는 실제 사용 가능한 해결 방법에 집중
3. **코드 품질**: 제공하는 코드 예제는 실제 프로덕션에서 사용 가능한 수준
4. **번역 품질**: 한국어 버전은 자연스러운 한국어로 작성 (직역 지양)
5. **일관성**: 기존 tip들의 스타일과 톤 유지

## 작업 완료 후

1. 생성된 파일들을 `src/content/tips/` 디렉토리에 저장
2. 린터 오류 확인
3. 브라우저에서 `/tips` 페이지 확인하여 정상 표시되는지 확인
