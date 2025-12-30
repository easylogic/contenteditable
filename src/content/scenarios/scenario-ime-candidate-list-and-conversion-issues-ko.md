---
id: scenario-ime-candidate-list-and-conversion-issues
title: 여러 언어에 걸친 IME 후보 목록 표시 및 변환 문제
description: "contenteditable에서 문자 변환이 필요한 IME(일본어, 중국어 등)를 사용할 때 후보 목록이 올바르게 표시되지 않거나, 화살표 키 탐색이 편집을 방해하거나, 변환 프로세스가 지연되거나, 중단되거나, 잘못된 결과를 생성할 수 있습니다. 이것은 음성-문자 변환을 사용하는 일본어, 중국어 및 기타 언어를 포함하여 여러 언어에 영향을 줍니다."
category: ime
tags:
  - ime
  - composition
  - candidate-list
  - conversion
  - japanese
  - chinese
status: draft
---

음성 입력을 문자로 변환하는 IME(예: 일본어 로마자-한자, 중국어 병음-문자)는 사용자 선택을 위한 후보 목록을 표시합니다. contenteditable 요소에서 이 변환 프로세스가 중단될 수 있어 후보 목록이 나타나지 않거나, 조기에 사라지거나, 일반 편집 작업을 방해할 수 있습니다. 변환이 지연되거나, 중단되거나, 잘못된 결과를 생성할 수도 있습니다.

## 관찰된 동작

1. **후보 목록이 표시되지 않음**: IME 후보 목록이 예상될 때 나타나지 않을 수 있음
2. **화살표 키 충돌**: 후보를 탐색하는 데 사용되는 화살표 키가 후보 목록을 탐색하는 대신 커서를 이동시킬 수 있음
3. **조기 취소**: 클릭하거나 페이지와 상호작용할 때 변환 프로세스가 취소될 수 있음
4. **변환 지연**: 문자가 예상보다 오래 걸릴 수 있음
5. **부분 변환**: 입력의 일부만 변환되고 나머지는 음성 텍스트로 남을 수 있음
6. **잘못된 문자**: 변환 중 잘못된 문자가 삽입될 수 있음
7. **중단**: 클릭, 화살표 키 또는 기타 상호작용에 의해 변환이 취소될 수 있음

## 언어별 표현

이 문제는 언어마다 다르게 나타납니다:

- **일본어 IME**: 한자 변환 후보 목록이 나타나지 않거나 화살표 키가 후보를 탐색하는 대신 커서를 이동시킬 수 있음
- **중국어 IME**: 병음-문자 변환이 지연되거나, 부분적이거나, 중단될 수 있음
- **기타 변환 기반 IME**: 음성-문자 변환을 사용하는 다른 언어에서도 유사한 문제가 발생할 수 있음

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 더 나은 지원이지만 후보 목록 위치가 일관되지 않을 수 있으며 복잡한 구문에서 지연이 발생할 수 있음
- **Firefox**: 후보 목록 표시, 화살표 키 처리 및 변환 정확도에 문제가 있을 수 있음
- **Safari**: 후보 목록 동작 및 변환 타이밍이 일관되지 않을 수 있음, 특히 iOS에서

## 영향

- 사용자가 음성 입력을 문자로 안정적으로 변환할 수 없음
- 후보 선택이 실패할 때 워크플로가 중단됨
- 텍스트에 의도하지 않은 음성과 문자가 혼합될 수 있음
- 브라우저 간 일관되지 않은 동작이 혼란을 만듦

## 해결 방법

조합 중 화살표 키 이벤트 처리 및 변환 상태 모니터링:

```javascript
let isComposing = false;
let candidateListActive = false;
let conversionState = {
  isActive: false,
  pendingConversion: false,
  lastInput: ''
};

element.addEventListener('compositionstart', () => {
  isComposing = true;
  conversionState.isActive = true;
  conversionState.pendingConversion = true;
});

element.addEventListener('compositionupdate', (e) => {
  // 후보 목록이 활성화되었을 가능성이 있는지 확인
  candidateListActive = e.data && e.data.length > 0;
  conversionState.lastInput = e.data;
  
  // 변환이 진행 중인지 추적(음성 텍스트가 여전히 존재)
  if (e.data && e.data.match(/[a-z]+/i)) {
    conversionState.pendingConversion = true;
  }
});

element.addEventListener('keydown', (e) => {
  if (isComposing && candidateListActive) {
    // 후보 탐색을 위해 화살표 키 허용
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      // 선택적으로 커서 이동을 피하기 위해 기본 동작 방지
      // e.preventDefault();
    }
  }
});

element.addEventListener('compositionend', (e) => {
  isComposing = false;
  candidateListActive = false;
  conversionState.isActive = false;
  conversionState.pendingConversion = false;
  
  // 변환이 올바르게 완료되었는지 확인
  if (e.data && e.data.match(/[a-z]+/i)) {
    // 여전히 음성 텍스트를 포함함 - 변환이 실패했을 수 있음
    console.warn('Conversion may have failed:', e.data);
  }
});

// 변환 중 중단 방지
element.addEventListener('click', (e) => {
  if (conversionState.pendingConversion) {
    // 선택적으로 클릭 처리를 지연
    setTimeout(() => {
      // 변환이 완료된 후 클릭 처리
    }, 100);
  }
});
```
