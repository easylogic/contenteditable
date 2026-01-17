---
id: scenario-ime-composition-number-input-ko
title: IME 컴포지션 중 숫자 입력이 예상치 못한 동작을 유발함
description: "contenteditable 요소에서 IME로 텍스트를 컴포지션할 때 숫자 키를 누르면 숫자를 삽입하는 대신 IME 특정 기능(예: 일본어/중국어 IME의 후보 선택)이 트리거되거나, 컴포지션이 예상치 못하게 취소될 수 있습니다."
category: ime
tags:
  - ime
  - composition
  - number-input
  - candidate-selection
status: draft
locale: ko
---

`contenteditable` 요소에서 IME로 텍스트를 컴포지션할 때 숫자 키를 누르면 숫자를 삽입하는 대신 IME 특정 기능(예: 일본어/중국어 IME의 후보 선택)이 트리거되거나, 컴포지션이 예상치 못하게 취소될 수 있습니다.

## 관찰된 동작

1. **후보 선택**: 숫자 키가 숫자를 삽입하는 대신 변환 목록에서 후보를 선택할 수 있습니다
2. **컴포지션 취소**: 숫자 키가 활성 컴포지션을 취소할 수 있습니다
3. **예상치 못한 삽입**: 숫자가 예상치 못한 위치에 삽입될 수 있습니다
4. **이벤트 충돌**: 숫자 키 동작이 컴포지션 처리와 충돌합니다
5. **일관되지 않은 동작**: 동작이 네이티브 입력 필드와 다를 수 있습니다

## 언어별 특성

이 문제는 언어에 따라 다르게 나타납니다:

- **일본어 IME**: 숫자 키(1-9)가 변환 목록에서 한자 후보를 선택하는 데 사용됩니다
- **중국어 IME**: 숫자 키(1-9)가 변환 목록에서 문자 후보를 선택하는 데 사용됩니다
- **한국어 IME**: 숫자 키가 컴포지션을 취소하거나 예상치 못하게 동작할 수 있습니다
- **기타 IME**: 다른 언어에서도 유사한 문제가 발생할 수 있습니다

## 브라우저 비교

- **Chrome/Edge**: 변환 중 숫자 키가 후보 선택을 트리거할 수 있습니다
- **Firefox**: 컴포지션 중 숫자 키 동작이 다를 수 있습니다
- **Safari**: 컴포지션 중 숫자 키 처리가 일관되지 않을 수 있습니다

## 영향

- 컴포지션 중 숫자를 안정적으로 삽입할 수 없습니다
- 후보 목록이 활성화되면 숫자 입력이 차단됩니다
- 컴포지션 중 숫자가 필요할 때 워크플로가 중단됩니다
- 네이티브 입력 필드에 비해 사용자 경험이 저하됩니다

## 해결 방법

컴포지션 중 숫자 키를 주의 깊게 처리합니다:

```javascript
let isComposing = false;
let candidateListActive = false;

element.addEventListener('compositionstart', () => {
  isComposing = true;
});

element.addEventListener('compositionupdate', (e) => {
  // 후보 목록이 활성화되었을 가능성 확인
  candidateListActive = e.data && e.data.length > 0;
});

element.addEventListener('keydown', (e) => {
  if (isComposing && candidateListActive) {
    // 후보 선택 중 숫자 키
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
      // 옵션 1: 후보 선택 허용 (기본 동작)
      // 옵션 2: 방지하고 대신 숫자 삽입
      // e.preventDefault();
      // 그런 다음 컴포지션이 완료된 후 수동으로 숫자 삽입
    }
  } else if (isComposing && !candidateListActive) {
    // 컴포지션 중 숫자 키 (후보 목록 없음)
    // IME에 따라 특별한 처리가 필요할 수 있습니다
  }
});

element.addEventListener('compositionend', () => {
  isComposing = false;
  candidateListActive = false;
});
```

## 참고 자료

- [Microsoft Support: Microsoft Simplified Chinese IME](https://support.microsoft.com/en-au/windows/microsoft-simplified-chinese-ime-9b962a3b-2fa4-4f37-811c-b1886320dd72) - Chinese IME candidate selection
- [Microsoft Support: Microsoft Traditional Chinese IME](https://support.microsoft.com/en-us/windows/microsoft-traditional-chinese-ime-ef596ca5-aff7-4272-b34b-0ac7c2631a38) - Traditional Chinese IME behavior
- [Microsoft Support: Microsoft Japanese IME](https://support.microsoft.com/en-gb/windows/microsoft-japanese-ime-da40471d-6b91-4042-ae8b-713a96476916) - Japanese IME candidate selection
- [Microsoft Learn: Traditional Chinese IME](https://learn.microsoft.com/en-us/globalization/input/traditional-chinese-ime) - IME implementation details
- [Apple Support: Japanese Input Method on Mac](https://support.apple.com/es-us/guide/japanese-input-method/jpim10262/mac) - macOS Japanese IME behavior
