// Supported locales configuration
export const locales = {
  en: {
    code: 'en',
    name: 'English',
    shortName: 'EN',
    flag: '🇺🇸',
    dir: 'ltr',
    isDefault: true,
  },
  ko: {
    code: 'ko',
    name: '한국어',
    shortName: '한',
    flag: '🇰🇷',
    dir: 'ltr',
    isDefault: false,
  },
} as const;

export type Locale = keyof typeof locales;
export const defaultLocale: Locale = 'en';
export const supportedLocales = Object.keys(locales) as Locale[];

// Get locale info
export function getLocaleInfo(locale: Locale) {
  return locales[locale] || locales[defaultLocale];
}

// Check if a locale is supported
export function isValidLocale(locale: string): locale is Locale {
  return locale in locales;
}

// Translations
export const translations = {
  en: {
    nav: {
      docs: 'Docs',
      cases: 'Cases',
      scenarios: 'Scenarios',
      tips: 'Tips',
      playground: 'Playground',
    },
    hero: {
      badge: 'Real-world contenteditable research',
      title: 'contenteditable.lab',
      description:
        'An incident catalog documenting real-world contenteditable behavior. Each scenario groups multiple cases across different operating systems, browsers, and keyboard setups.',
      browseCases: 'Browse all cases',
      openPlayground: 'Open playground',
    },
    stats: {
      totalCases: 'Total Cases',
      scenarios: 'Scenarios',
      osVariants: 'OS Variants',
      browsers: 'Browsers',
      confirmed: 'Confirmed',
      draft: 'Draft',
    },
    sections: {
      browseByPhenomenon: 'Browse by phenomenon',
      browseByPhenomenonDesc: 'Start from a specific phenomenon to see how it manifests across environments.',
      viewAllScenarios: 'View all scenarios',
      browseByCategory: 'Browse by category',
      browseByCategoryDesc: 'Explore cases by topic tags or environment filters.',
      viewAllCases: 'View all cases with filters',
      pinnedIncidents: 'Pinned incidents',
      pinnedIncidentsDesc: 'Curated baseline references and frequently observed issues.',
      latestScenarios: 'Latest scenarios',
      latestScenariosDesc: 'Up to 20 scenarios, ordered by most recent case ID.',
      openCase: 'Open case',
      openScenario: 'Scenario',
    },
    caseDetail: {
      case: 'Case',
      scenario: 'Scenario',
      os: 'OS',
      device: 'Device',
      browser: 'Browser',
      keyboard: 'Keyboard',
      status: 'Status',
      statusConfirmed: 'Confirmed',
      statusDraft: 'Draft',
      variants: 'Variants for this scenario',
      compatibilityMatrix: 'Browser compatibility matrix',
      allVariants: 'All variants (detailed table)',
      viewDetails: 'View details',
      allCases: 'All',
      noCases: 'No cases found matching your criteria.',
      resetFilters: 'Reset filters',
      search: 'Search cases...',
      allOS: 'All OS',
      allBrowsers: 'All browsers',
      allTags: 'All tags',
      allStatus: 'All status',
      applyFilters: 'Apply filters',
      reset: 'Reset',
      backToScenarios: 'All scenarios',
    },
    playground: {
      title: 'Playground',
      description: 'Explore contenteditable behavior freely without a specific documented case.',
      reportedEnv: 'Reported environment',
      yourEnv: 'Your environment',
      eventLog: 'Event log',
      clearLog: 'Clear log',
      copyIssue: 'Copy GitHub issue template',
      sampleHTML: 'Sample HTML',
      saveSnapshot: '💾 Save snapshot',
      copyReport: '📋 Copy report',
      snapshotHistory: 'Snapshot History',
      noSnapshots: 'No snapshots saved yet.',
      delete: 'Delete',
      restore: 'Restore',
      copy: 'Copy',
      eventLogEmpty: 'Events will appear here when you type in the editor.',
      eventAnalysis: '# ContentEditable Event Analysis',
      eventLogSection: '## Event Log',
      boundaryStart: 'start',
      boundaryEnd: 'end',
      boundary: 'boundary',
      inlineElementBoundary: 'Input occurred at inline element boundary',
      parentMismatch: 'beforeinput and input have different parent elements',
      reset: 'Reset',
      showInvisibleChars: 'Show Invisible',
      environmentInfo: 'Environment Info',
      detectedAnomalies: 'Detected Anomalies',
      legend: 'Legend',
      legendSelection: 'Selection',
      legendComposition: 'Composition',
      legendBeforeinput: 'Beforeinput',
      legendDeleted: 'Deleted area',
      legendAdded: 'Added area',
      legendNonEditable: 'Non-editable',
      legendInvisibleChars: 'Invisible characters',
    },
  },
  ko: {
    nav: {
      docs: '문서',
      cases: '케이스',
      scenarios: '시나리오',
      tips: '해결 팁',
      playground: '플레이그라운드',
    },
    hero: {
      badge: 'contenteditable 동작 연구',
      title: 'contenteditable.lab',
      description: 'contenteditable의 실제 동작을 문서화하는 인시던트 카탈로그입니다. 각 시나리오는 다양한 운영체제, 브라우저, 키보드 설정에서 동일한 현상을 보이는 케이스들을 그룹화합니다.',
      browseCases: '전체 케이스 보기',
      openPlayground: '플레이그라운드 열기',
    },
    stats: {
      totalCases: '전체 케이스',
      scenarios: '시나리오',
      osVariants: 'OS 종류',
      browsers: '브라우저',
      confirmed: '확인됨',
      draft: '초안',
    },
    sections: {
      browseByPhenomenon: '현상별 탐색',
      browseByPhenomenonDesc: '특정 현상이 다양한 환경에서 어떻게 나타나는지 확인하세요.',
      viewAllScenarios: '전체 시나리오 보기',
      browseByCategory: '카테고리별 탐색',
      browseByCategoryDesc: '태그나 환경 필터로 케이스를 탐색하세요.',
      viewAllCases: '필터와 함께 전체 케이스 보기',
      pinnedIncidents: '고정된 인시던트',
      pinnedIncidentsDesc: '기준 참조 자료와 자주 관찰되는 이슈들입니다.',
      latestScenarios: '최신 시나리오',
      latestScenariosDesc: '최근 케이스 ID 기준 최대 20개 시나리오입니다.',
      openCase: '케이스 열기',
      openScenario: '시나리오',
    },
    caseDetail: {
      case: '케이스',
      scenario: '시나리오',
      os: 'OS',
      device: '기기',
      browser: '브라우저',
      keyboard: '키보드',
      status: '상태',
      statusConfirmed: '확인됨',
      statusDraft: '초안',
      variants: '이 시나리오의 변형',
      compatibilityMatrix: '브라우저 호환성 매트릭스',
      allVariants: '전체 변형 (상세 테이블)',
      viewDetails: '상세 보기',
      allCases: '전체',
      noCases: '조건에 맞는 케이스가 없습니다.',
      resetFilters: '필터 초기화',
      search: '케이스 검색...',
      allOS: '모든 OS',
      allBrowsers: '모든 브라우저',
      allTags: '모든 태그',
      allStatus: '모든 상태',
      applyFilters: '필터 적용',
      reset: '초기화',
      backToScenarios: '모든 시나리오',
    },
    playground: {
      title: '플레이그라운드',
      description: '특정 문서화된 케이스 없이 contenteditable 동작을 자유롭게 탐색하세요.',
      reportedEnv: '보고된 환경',
      yourEnv: '현재 환경',
      eventLog: '이벤트 로그',
      clearLog: '로그 지우기',
      copyIssue: 'GitHub 이슈 템플릿 복사',
      sampleHTML: '샘플 HTML',
      saveSnapshot: '💾 스냅샷 저장',
      copyReport: '📋 리포트 복사',
      snapshotHistory: '스냅샷 히스토리',
      noSnapshots: '저장된 스냅샷이 없습니다.',
      delete: '삭제',
      restore: '복원',
      copy: '복사',
      eventLogEmpty: '에디터에 입력하면 이벤트가 여기에 표시됩니다.',
      eventAnalysis: '# ContentEditable 이벤트 분석',
      eventLogSection: '## 이벤트 로그',
      boundaryStart: '시작',
      boundaryEnd: '끝',
      boundary: '경계',
      inlineElementBoundary: '인라인 요소 경계에서 입력 발생',
      environmentInfo: '환경 정보',
      detectedAnomalies: '감지된 비정상 동작',
      snapshotHistoryTitle: '스냅샷 히스토리',
      parentMismatch: 'beforeinput과 input의 parent 요소가 다름',
      reset: '초기화',
      showInvisibleChars: '보이지 않는 문자 표시',
      legend: '범례',
      legendSelection: '선택 영역',
      legendComposition: '컴포지션',
      legendBeforeinput: 'Beforeinput',
      legendDeleted: '삭제된 영역',
      legendAdded: '추가된 영역',
      legendNonEditable: '편집 불가',
      legendInvisibleChars: '보이지 않는 문자',
    },
  },
} as const;

export type TranslationKey = keyof (typeof translations)['en'];

// Get translation for a locale, fallback to English if not available
export function getTranslation(locale: Locale) {
  return translations[locale] || translations[defaultLocale];
}

// Helper to get current locale from URL path
export function getLocaleFromPath(path: string): Locale {
  const segments = path.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && isValidLocale(firstSegment) && firstSegment !== defaultLocale) {
    return firstSegment;
  }

  return defaultLocale;
}

// Helper to build localized path
export function getLocalizedPath(path: string, locale: Locale): string {
  // Remove any existing locale prefix
  const localePattern = new RegExp(`^/(${supportedLocales.join('|')})`);
  const cleanPath = path.replace(localePattern, '') || '/';

  // Default locale doesn't need prefix
  if (locale === defaultLocale) {
    return cleanPath;
  }

  return `/${locale}${cleanPath}`;
}

// Get all other locales for language switcher
export function getOtherLocales(currentLocale: Locale): Locale[] {
  return supportedLocales.filter((l) => l !== currentLocale);
}
