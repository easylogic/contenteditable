---
id: scenario-ime-table-cell-pinyin-safari-ko
title: 표 셀에서의 중국어 병음 후보 창 (Safari·타 브라우저)
description: "표 셀 안에서 중국어 병음 입력 시—특히 iOS Safari—IME 후보 창이 잘리거나 위치가 어긋나거나, 일반 문단과 다르게 동작할 수 있습니다. Firefox·Edge·Chrome에서도 레이아웃에 따라 차이가 납니다."
category: ime
tags:
  - ime
  - chinese
  - pinyin
  - table
  - safari
  - ios
status: draft
locale: ko
---

표 셀 안에서 중국어 병음 입력 시—특히 iOS Safari—IME 후보 창이 잘리거나 위치가 어긋나거나, 일반 문단과 다르게 동작할 수 있습니다. Firefox·Edge·Chrome에서도 레이아웃에 따라 차이가 납니다.

## 문제 개요

IME UI는 캐럿 사각형에 고정되는데, 표 레이아웃·overflow·중첩 contenteditable이 그 사각형과 쌓임 맥락을 바꿔 후보 목록이 기대 위치에 안 보일 수 있습니다.

## 관찰된 동작

- 셀 테두리·스크롤 컨테이너에 후보 창이 가려짐.
- 표 밖 블록과 셀 안에서 동작이 다름.

## 영향

후보를 못 보고 잘못 확정하거나 조합을 취소함.

## 브라우저 비교

iOS Safari에서 자주 보고됨; 데스크톱 Edge·Chrome도 복잡한 표에서 차이 가능.

## 해결 방법

- 조합 중 캐럿 근처 조상에 `overflow: hidden`이 없도록 검토.
- `<td contenteditable>`에서 실제 기기로 병음 입력 테스트.
- 필요 시 편집 표면을 띄우거나 IME에 포털 쓰기(고급).

## 관련 케이스

- [ce-0236](ce-0236-chinese-ime-pinyin-table-safari-ko)
- [ce-0237](ce-0237-chinese-ime-pinyin-table-ios-safari-en)
- [ce-0238](ce-0238-chinese-ime-pinyin-table-edge-en)
- [ce-0239](ce-0239-chinese-ime-pinyin-table-firefox-en)

## 참고 자료

- WebKit Bugzilla: IME + table / contenteditable 검색
