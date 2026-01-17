# Tip 자동 생성 프롬프트 가이드

이 디렉토리에는 AI agent가 시나리오와 케이스를 기반으로 Tip을 자동 생성할 때 사용하는 프롬프트와 체크리스트가 있습니다.

## 파일 구조

- `tip-generation-prompt.md`: Tip 생성 작업을 위한 상세 프롬프트
- `tip-generation-checklist.md`: Tip 시스템 상태 및 생성 시 확인사항 체크리스트
- `README.md`: 이 파일 (사용 가이드)

## 사용 방법

### 1. Tip 생성 요청

사용자가 다음과 같이 요청할 수 있습니다:

```
시나리오 scenario-browser-extension-interference를 기반으로 
tip-009를 생성해줘. 관련 케이스는 ce-0561-browser-extension-grammarly-interference야.
```

### 2. Agent 작업 흐름

Agent는 다음 순서로 작업합니다:

1. **프롬프트 읽기**: `.prompts/tip-generation-prompt.md` 파일 읽기
2. **체크리스트 확인**: `.prompts/tip-generation-checklist.md`로 시스템 상태 확인
3. **관련 파일 읽기**:
   - 시나리오 파일 (영어/한국어)
   - 관련 케이스 파일들
   - 기존 tip 파일들 (번호 확인)
4. **Tip 생성**:
   - 영어 버전: `src/content/tips/tip-XXX-{slug}.md`
   - 한국어 버전: `src/content/tips/tip-XXX-{slug}-ko.md`
5. **검증**: 체크리스트에 따라 검증

### 3. 프롬프트 사용 예시

Agent에게 다음과 같이 지시할 수 있습니다:

```
.prompts/tip-generation-prompt.md의 프롬프트를 따라 
scenario-ime-duplicate-text-heading을 기반으로 tip-010을 생성해줘.
```

또는:

```
tip-generation-prompt.md를 참고해서 
다음 시나리오들에 대한 tip들을 생성해줘:
- scenario-ime-duplicate-text-heading → tip-010
- scenario-paste-link-behavior → tip-011
```

## 프롬프트 구조

### tip-generation-prompt.md

주요 섹션:
- **작업 개요**: Tip 생성의 목적과 범위
- **입력 정보**: 필요한 입력 파라미터
- **작업 단계**: 상세한 단계별 가이드
- **파일 생성 규칙**: 파일명, ID, 저장 위치
- **내용 작성 가이드라인**: 각 섹션별 작성 방법
- **검증 체크리스트**: 생성 후 확인사항

### tip-generation-checklist.md

주요 섹션:
- **시스템 상태 확인**: 현재 시스템이 정상 작동하는지 확인
- **Tip 생성 시 확인사항**: 생성 전/중/후 확인사항
- **Tip 품질 기준**: 내용, 구조, 다국어 품질 기준

## 주의사항

1. **기존 Tip 확인**: 항상 기존 tip 번호를 확인하여 중복 방지
2. **관련 파일 읽기**: 시나리오와 케이스 파일을 반드시 읽고 분석
3. **양쪽 언어 생성**: 영어와 한국어 버전 모두 생성 필수
4. **검증 필수**: 생성 후 체크리스트에 따라 검증

## 예시 작업

### 예시 1: 단일 Tip 생성

**요청**:
```
scenario-browser-extension-interference 기반으로 tip-009 생성
```

**Agent 작업**:
1. `.prompts/tip-generation-prompt.md` 읽기
2. `src/content/scenarios/scenario-browser-extension-interference.md` 읽기
3. `src/content/scenarios/scenario-browser-extension-interference-ko.md` 읽기
4. 관련 케이스 파일들 읽기
5. 기존 tip 파일들 확인 (tip-008까지 존재 확인)
6. `tip-009-browser-extension-prevention.md` 생성
7. `tip-009-browser-extension-prevention-ko.md` 생성
8. 체크리스트로 검증

### 예시 2: 여러 Tip 일괄 생성

**요청**:
```
다음 시나리오들에 대한 tip 생성:
- scenario-ime-duplicate-text-heading → tip-010
- scenario-paste-link-behavior → tip-011
```

**Agent 작업**:
각 시나리오에 대해 위와 동일한 프로세스 반복

## 업데이트

프롬프트나 체크리스트를 업데이트할 때는:
1. 실제 사용 경험을 반영
2. 새로운 패턴이나 요구사항 추가
3. 예시 업데이트
4. 체크리스트 보완
