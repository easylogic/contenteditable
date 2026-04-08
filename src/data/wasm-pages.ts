/**
 * Shared metadata for /wasm documentation (Rust + WebAssembly rich text).
 * English paths are default; Korean pages use getLocalizedPath(..., 'ko').
 */
export type WasmPageMeta = {
  slug: string;
  titleEn: string;
  titleKo: string;
  descEn: string;
  descKo: string;
};

export const wasmSectionPages: WasmPageMeta[] = [
  {
    slug: 'editing-approaches',
    titleEn: 'Editing approaches',
    titleKo: '에디팅 방식',
    descEn:
      'contenteditable + WASM: source of truth, event order, DOM↔model loop, normalization, and when to call Rust.',
    descKo:
      'contenteditable + WASM: 진실 원천, 이벤트 순서, DOM↔모델 루프, 정규화, Rust 호출 시점.',
  },
  {
    slug: 'ime-and-composition',
    titleEn: 'IME & composition',
    titleKo: 'IME·조합 입력',
    descEn:
      'composition events, syncing a Rust document model, and why the browser still owns the IME.',
    descKo:
      '조합 이벤트, Rust 문서 모델 동기화, IME는 여전히 브라우저 영역인 이유.',
  },
  {
    slug: 'js-wasm-boundary',
    titleEn: 'JS ↔ WASM boundary',
    titleKo: 'JS ↔ WASM 경계',
    descEn:
      'Strings, copies, batched ops, async vs input events, and keeping the hot path cheap.',
    descKo:
      '문자열·복사·배치 연산, 비동기와 입력 이벤트, 핫 패스 비용 줄이기.',
  },
  {
    slug: 'clipboard-input-routing',
    titleEn: 'Clipboard & input routing',
    titleKo: '클립보드·입력 라우팅',
    descEn:
      'beforeinput, paste, routing decisions in JS vs sanitization in WASM.',
    descKo:
      'beforeinput, 붙여넣기, JS에서 라우팅할지 WASM에서 정제할지.',
  },
  {
    slug: 'tooling-bundle-workers',
    titleEn: 'Tooling, bundle & workers',
    titleKo: '툴링·번들·워커',
    descEn:
      'wasm-pack, wasm-opt, code splitting, Web Workers, COOP/COEP and threads.',
    descKo:
      'wasm-pack, wasm-opt, 코드 스플릿, Web Worker, COOP/COEP·스레드.',
  },
  {
    slug: 'collaboration-crdt-wasm',
    titleEn: 'Collaboration & CRDT (WASM)',
    titleKo: '협업·CRDT (WASM)',
    descEn:
      'Yrs/y-crdt, bridging to Yjs, snapshots vs update streams with an editor host.',
    descKo:
      'Yrs·y-crdt, Yjs 연동, 스냅샷 vs 업데이트 스트림.',
  },
  {
    slug: 'selection-range-offsets',
    titleEn: 'Selection, Range & offsets',
    titleKo: '선택·Range·오프셋',
    descEn:
      'UTF-16 vs UTF-8 indices, Selection/Range in JS, mapping to a Rust model and getTargetRanges.',
    descKo:
      'UTF-16 vs UTF-8, JS Selection/Range, Rust 모델 매핑·getTargetRanges.',
  },
  {
    slug: 'undo-model',
    titleEn: 'Undo & redo model',
    titleKo: '실행 취소·다시 실행 모델',
    descEn:
      'Browser undo stack vs model history, programmatic DOM, and WASM-hosted transactions.',
    descKo:
      '브라우저 undo 스택 vs 모델 히스토리, 프로그래밍 DOM, WASM 트랜잭션.',
  },
  {
    slug: 'accessibility-wasm',
    titleEn: 'Accessibility (WASM host)',
    titleKo: '접근성 (WASM 호스트)',
    descEn:
      'Roles, focus, screen readers when the editable surface is still the browser.',
    descKo:
      '편집 표면이 브라우저일 때 역할·포커스·스크린 리더.',
  },
  {
    slug: 'testing-debugging-wasm',
    titleEn: 'Testing & debugging',
    titleKo: '테스트·디버깅',
    descEn:
      'E2E, profiling the JS↔WASM boundary, reproducing IME and paste in CI.',
    descKo:
      'E2E, JS↔WASM 경계 프로파일링, IME·붙여넣기 CI 재현.',
  },
  {
    slug: 'security-deployment-wasm',
    titleEn: 'Security & deployment',
    titleKo: '보안·배포',
    descEn:
      'CSP, SRI, module integrity, and hosting WASM next to contenteditable.',
    descKo:
      'CSP, SRI, 모듈 무결성, contenteditable 옆 WASM 호스팅.',
  },
];
