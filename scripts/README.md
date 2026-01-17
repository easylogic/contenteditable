# Contenteditable Scenario Collection Scripts

이 디렉토리에는 contenteditable 관련 시나리오를 인터넷에서 자동으로 수집하는 스크립트가 포함되어 있습니다.

## collect-scenarios.js

GitHub Issues와 Stack Overflow에서 contenteditable 관련 이슈를 검색하고 케이스 파일을 자동으로 생성합니다.

### 사용법

#### 한 번만 실행

```bash
pnpm run collect-scenarios
```

또는

```bash
node scripts/collect-scenarios.js
```

#### 지속적으로 실행 (watch 모드)

```bash
pnpm run collect-scenarios:watch
```

또는

```bash
node scripts/collect-scenarios.js --watch
```

watch 모드는 5분마다 자동으로 검색을 실행합니다.

#### 검색 개수 제한

```bash
node scripts/collect-scenarios.js --limit 5
```

처음 5개의 검색어만 사용합니다.

### 환경 변수 설정 (선택사항)

더 높은 API rate limit을 위해 환경 변수를 설정할 수 있습니다:

```bash
# GitHub Personal Access Token (선택사항)
export GITHUB_TOKEN=your_github_token_here

# Stack Overflow API Key (선택사항)
export STACKOVERFLOW_KEY=your_stackoverflow_key_here
```

GitHub 토큰은 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)에서 생성할 수 있습니다.

Stack Overflow API 키는 [Stack Apps](https://stackapps.com/apps/oauth/register)에서 등록할 수 있습니다.

### 검색어

스크립트는 다음 검색어들을 사용합니다:

- contenteditable bug
- contenteditable issue
- contenteditable problem
- contenteditable IME
- contenteditable composition
- contenteditable paste
- contenteditable selection
- contenteditable focus
- contenteditable mobile
- contenteditable iOS
- contenteditable Android
- contenteditable Firefox
- contenteditable Chrome
- contenteditable Safari
- contenteditable Edge
- contenteditable drag drop
- contenteditable undo redo
- contenteditable table
- contenteditable RTL
- contenteditable beforeinput
- contenteditable execCommand

### 출력

스크립트는 다음을 수행합니다:

1. GitHub Issues와 Stack Overflow에서 검색
2. 중복 체크 (이미 존재하는 케이스는 건너뜀)
3. 케이스 파일 자동 생성 (`src/content/cases/`)
4. 메타데이터 자동 추출 (브라우저, OS, 디바이스 등)
5. 소스 URL과 정보를 케이스 파일에 포함

### 생성되는 케이스 파일 형식

생성된 케이스 파일은 다음 정보를 포함합니다:

- 케이스 ID (자동 생성)
- 시나리오 ID (키워드 기반 자동 할당)
- 브라우저, OS, 디바이스 (텍스트에서 자동 추출)
- 제목, 설명
- 소스 URL
- 재현 단계 (소스 링크 포함)
- 태그

### 주의사항

- API rate limit을 고려하여 요청 간에 지연 시간이 있습니다
- 중복 체크는 소스 URL을 기반으로 수행됩니다
- 자동 생성된 케이스는 `status: draft`로 생성되며, 수동 검토가 필요합니다
- 메타데이터 추출은 휴리스틱 기반이므로 정확하지 않을 수 있습니다

### 개선 사항

향후 추가할 수 있는 기능:

- [ ] Reddit API 통합
- [ ] 웹 스크래핑 (적절한 rate limiting 포함)
- [ ] RSS 피드 모니터링
- [ ] 더 정확한 메타데이터 추출 (ML 기반)
- [ ] 자동 번역 (다른 언어로 케이스 생성)
- [ ] 이메일 알림 (새 케이스 발견 시)
