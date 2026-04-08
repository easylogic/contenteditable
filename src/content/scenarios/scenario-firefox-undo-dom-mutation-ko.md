---
id: scenario-firefox-undo-dom-mutation-ko
title: Firefox에서 입력 중 DOM 변경 시 실행 취소 스택 손상
description: "Firefox 입력 중 자동 서식·맞춤법·프레임워크 재조정 등으로 DOM이 바뀌면 내부 실행 취소 스택이 어긋날 수 있습니다. 실행 취소/다시 실행이 잘못된 스냅샷으로 이동하거나 기록이 잘립니다."
category: input
tags:
  - firefox
  - undo
  - redo
  - dom
  - history
status: draft
locale: ko
---

Firefox에서 입력 중 자동 서식·맞춤법·프레임워크 재조정 등으로 DOM이 바뀌면 내부 실행 취소 스택이 어긋날 수 있습니다. 실행 취소/다시 실행이 잘못된 스냅샷으로 이동하거나 기록이 잘립니다.

## 문제 개요

Gecko의 contenteditable 실행 취소는 편집 세션과 DOM 변이에 묶입니다. 키 입력 사이에 스크립트나 브라우저가 노드를 끼워 넣으면, 실행 취소 링에 기록된 경계가 사용자 기대와 다를 수 있습니다.

## 관찰된 동작

- 실행 취소가 마지막에 보인 편집보다 많거나 적게 되돌림.
- 특정 변이 후 다시 실행이 무응답.
- IME 조합과 프로그래밍 래핑이 겹치면 더 심해짐.

## 영향

데이터 손실로 보이는 동작, 에디터 동기화 레이어 깨짐, 재현 어려운 버그.

## 브라우저 비교

Chromium·WebKit의 실행 취소 경계는 다릅니다. 이 시나리오는 Firefox에서 입력 중 DOM 변경과 스택의 상호작용에 초점을 둡니다.

## 해결 방법

- `compositionend` 이후나 유휴 시까지 구조적 DOM 변경 미루기.
- 키마다 래핑하지 말고 묶어서 처리.
- 필요 시 Firefox용으로 ProseMirror 스타일 커스텀 히스토리로 대체.

## 모범 사례

- Firefox ESR과 최신 릴리스에서 각각 재현; 동작은 버전에 따라 변합니다.

## 관련 케이스

- [ce-0224](ce-0224-firefox-undo-corruption)

## 참고 자료

- MDN: [Document.execCommand](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand)
- Firefox bug tracker: contenteditable undo + mutation
