# 신규 시나리오 후보 (Research Navigator 결과)

Research Navigator 워크플로우(갭 분석 → 외부 소스 검색 → 기존 시나리오 교차 참조)로 수집한 후보 목록.  
작성일: 2025-01-29

---

## 1. 인라인 요소 삭제 후 재생성 (Inline element recreation after delete)

| 항목 | 내용 |
|------|------|
| **현상** | contenteditable에서 빈 `<span>` 등 인라인 요소를 삭제한 뒤 입력하면, 브라우저가 삭제한 인라인 요소를 다시 만든다. |
| **영향** | DOM 제어를 예측하기 어렵고, 에디터 상태와 불일치할 수 있다. |
| **소스** | [W3C editing #468](https://github.com/w3c/editing/issues/468), [Chrome empty span delete SO](https://stackoverflow.com/questions/68914093/chrome-trying-to-delete-empty-span-in-contenteditable-results-in-added-node), Chromium (execCommand 관련) |
| **기존 시나리오** | `scenario-delete-key-behavior`(Delete vs Backspace 일관성), `scenario-image-deletion`(참고 링크만 있음). **동일 주제 시나리오 없음.** |
| **제안** | **신규 시나리오** 추가. 예: `scenario-inline-element-recreation-after-delete`. category: `formatting` 또는 `other`. |

---

## 2. RTL 텍스트 방향 / 스크롤 정렬 (RTL text direction inconsistent)

| 항목 | 내용 |
|------|------|
| **현상** | RTL(아랍어/히브리어 등) 또는 혼합 방향에서 선택 방향, 스크롤 정렬, Ctrl+A 시 선택이 기대와 다르게 동작한다. |
| **영향** | RTL 지원 에디터에서 선택/편집 UX 불일치. |
| **소스** | [WebKit 124765](https://bugs.webkit.org/show_bug.cgi?id=124765)(Select All + 비편집 블록), [Mozilla RTL selection](https://bugzilla.mozilla.org/show_bug.cgi?id=462452), 프로젝트 케이스 ce-0570 등. |
| **기존 시나리오** | 케이스에서 `scenario-rtl-text-direction-inconsistent` 를 참조하지만 **해당 id의 시나리오 파일 없음.** |
| **제안** | **누락된 시나리오 문서 생성.** `scenario-rtl-text-direction-inconsistent.md` (및 `-ko.md`) 추가. category: `selection` 또는 `language`. |

---

## 3. Select All 시 비편집 블록이 첫/끝 자식일 때 (Select All with non-editable block)

| 항목 | 내용 |
|------|------|
| **현상** | Ctrl+A 시, 비편집 블록이 첫 번째 또는 마지막 자식이면 전체 선택이 아니라 비편집 블록 반대 방향으로 선택이 접히는 동작이 있다. |
| **영향** | WYSIWYG 에디터에서 "전체 선택" 기대와 다름. Safari 15.5 등에서도 재현. |
| **소스** | [WebKit 124765](https://bugs.webkit.org/show_bug.cgi?id=124765) (Critical, Safari/Chrome/Opera 재현). |
| **기존 시나리오** | `scenario-focus-selects-all`는 **programmatic focus()** 시 전체 선택만 다룸. Ctrl+A + 비편집 블록은 별도 현상. |
| **제안** | **신규 시나리오** 추가. 예: `scenario-select-all-non-editable-block`. category: `selection`. |

---

## 4. 음성 제어 / Web Speech API와 contenteditable (Voice control & speech recognition)

| 항목 | 내용 |
|------|------|
| **현상** | Web Speech API, Dragon, Google 음성 입력 등으로 contenteditable에 삽입/수정 시, 포커스·선택·삽입 위치가 브라우저/기기별로 다르거나 실패할 수 있다. |
| **영향** | 접근성(음성으로 편집하는 사용자) 영향. |
| **소스** | Web Speech API 명세, Dragon Medical SpeechKit(contenteditable 지원), Google Voice Typing, SpeechPad(CKEditor). |
| **기존 시나리오** | `scenario-ios-dictation-duplicate-events`는 iOS dictation **이벤트 중복**만 다룸. 일반 음성 입력/제어 시나리오 없음. |
| **제안** | **신규 시나리오** 후보. 예: `scenario-voice-control-speech-recognition-contenteditable`. category: `accessibility`. (실제 케이스 수집 후 추가 권장) |

---

## 5. Safari contenteditable 포커스 불완전 이전 (2024)

| 항목 | 내용 |
|------|------|
| **현상** | 버튼/링크 클릭으로 contenteditable을 blur해도, 이후 키 입력(예: 화살표)이 여전히 contenteditable로 전달되거나 포커스가 다시 당겨지는 것처럼 동작한다. |
| **영향** | 포커스/선택 관리 예측 어려움. |
| **소스** | [WebKit 112854](https://bugs.webkit.org/show_bug.cgi?id=112854) (2024년 11월 언급). |
| **기존 시나리오** | `scenario-focus-management`, `scenario-selection-collapse-on-blur`와 관련 있으나, “blur 후에도 키 이벤트가 contenteditable로 전달”되는 구체 현상은 별도 케이스로 다루는 것이 좋음. |
| **제안** | 먼저 **케이스**로 기록(브라우저/버전/재현 단계). 필요 시 `scenario-focus-management`에 하위 섹션이나 관련 케이스로 링크. |

---

## 6. Chromium contenteditable 캐럿 위치 (uneditable 노드 내부)

| 항목 | 내용 |
|------|------|
| **현상** | 비편집 노드가 있는 contenteditable에서 삭제 시 캐럿이 편집 불가 영역 밖에 보이거나, 시각적 위치와 실제 입력 위치가 어긋난다. |
| **소스** | [Chromium 41114349](https://issues.chromium.org/issues/41114349). 2014년대부터 미해결. |
| **기존 시나리오** | `scenario-caret-jump-non-editable`, `scenario-caret-invisible-relative` 등과 유사. |
| **제안** | 기존 시나리오에 **관련 케이스**로 연결하거나, 동일 현상이면 케이스만 추가. 신규 시나리오는 기존과 중복 검토 후 결정. |

---

## 7. Firefox Fenix 중첩 contenteditable에서 getTargetRanges()

| 항목 | 내용 |
|------|------|
| **현상** | Firefox Mobile(Fenix)에서 중첩 contenteditable에 대해 `getTargetRanges()`가 자식이 아니라 부모 범위를 반환해, 텍스트가 의도와 다른 위치에 삽입된다. |
| **소스** | [Fenix 27569](https://github.com/mozilla-mobile/fenix/issues/27569). |
| **기존 시나리오** | `scenario-gettargetranges-empty` (빈 배열 반환). Fenix의 “잘못된 부모 범위”는 별도 동작. |
| **제안** | **케이스**로 등록 후, `scenario-gettargetranges-empty`에 “모바일/중첩 변형”으로 언급하거나, 필요 시 `scenario-gettargetranges-mobile-nested` 등 신규 시나리오 검토. |

---

## 우선순위 제안

| 순서 | 항목 | 이유 |
|------|------|------|
| 1 | **RTL** (2번) | 이미 케이스가 시나리오 id를 참조하는데 문서가 없어 링크 깨짐. 시나리오 문서 생성이 우선. |
| 2 | **인라인 요소 재생성** (1번) | W3C/Chromium 이슈로 정의가 명확하고, 기존 시나리오와 겹치지 않음. |
| 3 | **Select All + 비편집 블록** (3번) | WebKit 이슈로 재현·영향이 명확함. |
| 4 | **음성 제어** (4번) | 갭 분석에서 부족한 접근성 영역. 케이스 수집 후 시나리오 추가. |
| 5 | **5·6·7번** | 기존 시나리오에 케이스/하위 섹션으로 반영 후, 필요 시 전용 시나리오 검토. |

---

## 다음 단계

- **시나리오 생성**: [scenario-generator/SKILL.md](skills/scenario-generator/SKILL.md) 참고해 1~3번부터 영문/한국어 시나리오 문서 작성.
- **케이스 수집**: [case-generator/SKILL.md](skills/case-generator/SKILL.md) 참고해 5·6·7번에 대한 재현 단계·환경이 있는 케이스 초안 작성.
- **스키마**: 작성 전 [src/content/config.ts](../src/content/config.ts) 시나리오/케이스 스키마 확인.
