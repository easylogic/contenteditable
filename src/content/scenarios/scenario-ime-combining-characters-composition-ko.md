---
id: scenario-ime-combining-characters-composition-ko
title: 결합 문자·복잡 스크립트 IME 조합
description: "결합 부호·자모 결합·성조(태국·데바나가리·베트남어·키릴 등)는 브라우저마다 조합이 다르게 나갈 수 있습니다. 조합 중 정규화나 DOM 분할이 끼어들면 부호가 사라지거나 순서가 바뀌거나 노드에 걸쳐 쪼개질 수 있습니다."
category: ime
tags:
  - ime
  - composition
  - combining-characters
  - devanagari
  - thai
  - vietnamese
  - cyrillic
status: draft
locale: ko
---

결합 부호·자모 결합·성조(태국·데바나가리·베트남어·키릴 등)는 브라우저마다 조합이 다르게 나갈 수 있습니다. 조합 중 정규화나 DOM 분할이 끼어들면 부호가 사라지거나 순서가 바뀌거나 노드에 걸쳐 쪼개질 수 있습니다.

## 문제 개요

유니코드 결합 서열·그래프 클러스터는 DOM `Text` 노드나 에디터 트랜잭션과 1:1로 맞지 않을 수 있습니다. JS `length`로 자르거나 자리 표시자에 ZWSP를 넣는 방식은 인도·태국 입력을 깨뜨리기 쉽습니다.

## 관찰된 동작

- 성조·모음 부호가 기본 자모와 순서가 어긋남.
- 자모 결합이 공백·구두점까지 입력해야만 완성됨.
- 키릴 입력이 라틴 IME와 다른 규칙을 따름.

## 영향

단어 손상, 맞춤법 범위 깨짐, 실행 취소 스택과 사용자 기대 불일치.

## 브라우저 비교

Harfbuzz·플랫폼 IME 차이로 같은 OS에서도 Safari와 Chrome이 베트남어·태국어에서 갈릴 수 있습니다.

## 해결 방법

- 조합 중 문자열 조작 시 그래프 단위 연산(`Intl.Segmenter` 등) 선호.
- `compositionupdate` 중 불필요한 `Text` 노드 분할 피하기.
- 정규화는 `compositionend` 이후로 미루기.

## 모범 사례

- 베트남어 Telex/VNI·태국어를 여러 키보드로 검증.

## 관련 케이스

- [ce-0177](ce-0177-thai-ime-tone-mark-positioning-firefox)
- [ce-0178](ce-0178-vietnamese-ime-diacritic-loss-chrome)
- [ce-0180](ce-0180-hindi-ime-devanagari-conjuncts-chrome)
- [ce-0206](ce-0206-russian-ime-cyrillic-composition-chrome)

## 참고 자료

- [Unicode Standard Annex #29](https://unicode.org/reports/tr29/)
- [CSS Text Module](https://www.w3.org/TR/css-text-3/)
