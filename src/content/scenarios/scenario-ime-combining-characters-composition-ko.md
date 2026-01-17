---
id: scenario-ime-combining-characters-composition-ko
title: IME 결합 문자 및 분음 기호 조합 문제
description: "결합 문자, 분음 기호, 성조 표시 또는 복잡한 문자 조합(태국어, 베트남어, 힌디어/데바나가리 등)을 사용하는 언어는 이러한 표시가 올바르게 위치하지 않거나, 잘못 결합되거나, 편집 작업 중 손실될 수 있는 contenteditable에서 문제를 경험할 수 있습니다."
category: ime
tags:
  - ime
  - composition
  - combining-characters
  - diacritics
  - thai
  - vietnamese
  - hindi
  - devanagari
status: draft
locale: ko
---

많은 언어가 기본 문자가 특정 방식으로 표시와 결합하는 결합 문자, 분음 기호, 성조 표시 또는 복잡한 문자 조합을 사용합니다. contenteditable 요소에서 이러한 표시의 위치, 순서 및 조합이 실패하여 잘못 표시되거나 읽을 수 없는 텍스트가 발생할 수 있습니다.

## 관찰된 동작

1. **표시 잘못 배치**: 성조 표시, 모음 표시 또는 분음 기호가 기본 문자에 대해 잘못된 위치에 나타날 수 있음
2. **잘못된 조합**: 표시가 잘못된 기본 문자와 결합될 수 있음
3. **순서 문제**: 기본 문자와 표시가 잘못된 순서로 삽입될 수 있음
4. **시각적 렌더링**: 텍스트가 DOM에서는 올바르게 나타나지만 시각적으로 잘못 렌더링될 수 있음
5. **Backspace 문제**: 문자를 삭제할 때 기본 문자와 결합 표시를 모두 올바르게 제거하지 않을 수 있음
6. **표시 손실**: 조합 또는 편집 중 분음 기호 또는 표시가 손실될 수 있음

## 언어별 표현

이 문제는 언어마다 다르게 나타납니다:

- **태국어**: 성조 표시와 모음 표시가 자음에 대해 올바르게 위치하지 않을 수 있음
- **베트남어**: 분음 기호 표시(악센트)가 손실되거나 기본 문자와 잘못 결합될 수 있음
- **힌디어/데바나가리**: 모음 기호(마트라)가 잘못 배치되거나 결합 문자가 올바르게 형성되지 않을 수 있음
- **기타 언어**: 결합 문자를 사용하는 모든 언어에서 유사한 문제가 발생할 수 있음

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 더 나은 지원이지만 결합 문자 위치 지정이 여전히 실패할 수 있음
- **Firefox**: 결합 문자 위치 지정 및 형성에 더 많은 문제가 있을 수 있음
- **Safari**: 렌더링이 일관되지 않을 수 있음, 특히 모바일 기기에서

## 영향

- 텍스트가 읽을 수 없거나 읽기 어려울 수 있음
- 사용자가 올바른 텍스트를 안정적으로 입력할 수 없음
- 텍스트가 한 브라우저에서는 올바르게 보이지만 다른 브라우저에서는 잘못 보일 수 있음
- 사용자가 표시를 자주 수동으로 수정해야 함

## 해결 방법

결합 문자를 주의 깊게 처리하고 조합 후 텍스트 검증:

```javascript
// 언어별 패턴
const thaiPattern = /[\u0E00-\u0E7F]+/;
const vietnamesePattern = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]/;
const devanagariPattern = /[\u0900-\u097F]/;

element.addEventListener('compositionend', (e) => {
  const text = e.target.textContent;
  
  // 올바른 문자 조합 확인
  if (thaiPattern.test(text) || vietnamesePattern.test(text) || devanagariPattern.test(text)) {
    // 올바른 문자 조합을 보장하기 위해 정규화
    const normalized = text.normalize('NFC');
    if (normalized !== text) {
      // 텍스트가 정규화가 필요할 수 있음
      console.warn('Text may need normalization');
    }
    
    // 결합 문자 순서 검증
    // 이것은 언어별이고 복잡함
  }
});

// 시각적 렌더링 문제 모니터링
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'characterData' || mutation.type === 'childList') {
      // 텍스트 렌더링이 올바른지 확인
      // 리플로우를 트리거하거나 스타일을 조정해야 할 수 있음
    }
  });
});

observer.observe(element, {
  characterData: true,
  childList: true,
  subtree: true
});

// 결합 표시를 보존하기 위해 backspace를 주의 깊게 처리
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'deleteContentBackward' && e.isComposing) {
    // 조합 중 backspace 동작이 다를 수 있음
    // IME가 처리하도록 허용
  }
});
```

## 참고 자료

- [Microsoft Learn: Vietnamese IME](https://learn.microsoft.com/ja-jp/globalization/input/vietnamese-ime) - Vietnamese input methods
- [Unicode Core Specification: Character encoding](https://www.unicode.org/versions/latest/core-spec/chapter-2/) - Unicode normalization
- [Unicode Core Specification: Thai script](https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-16/) - Thai combining characters
- [Unicode Core Specification: Devanagari](https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-12/) - Devanagari script
- [Linux Thai Network: Thai OpenType shaping](https://www.linux.thai.net/~thep/th-otf/shaping.html) - Thai rendering
- [Unicode Technical Report TR15: Normalization](https://unicode.org/reports/tr15/pdtr15.html) - Unicode normalization forms
