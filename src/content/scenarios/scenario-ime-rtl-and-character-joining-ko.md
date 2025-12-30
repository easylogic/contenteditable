---
id: scenario-ime-rtl-and-character-joining
title: IME RTL 텍스트 방향 및 문맥적 문자 결합 문제
description: "오른쪽에서 왼쪽(RTL) 텍스트 방향과 문맥적 문자 결합(아랍어, 히브리어 등)을 사용하는 언어는 contenteditable에서 텍스트 방향이 올바르게 처리되지 않거나, 문자가 제대로 결합되지 않거나, RTL 컨텍스트에서 캐럿 이동이 잘못될 수 있는 문제를 경험할 수 있습니다."
category: ime
tags:
  - ime
  - composition
  - rtl
  - text-direction
  - character-joining
  - arabic
  - hebrew
status: draft
---

오른쪽에서 왼쪽(RTL) 텍스트 방향과 문맥적 문자 결합(문자 위치에 따라 다르게 연결됨)을 사용하는 언어는 contenteditable 요소에서 문제를 경험할 수 있습니다. RTL 방향과 문자 결합 모두 문제가 될 수 있으며, 특히 왼쪽에서 오른쪽(LTR) 텍스트와 혼합될 때 그렇습니다.

## 관찰된 동작

1. **RTL 방향 문제**: 텍스트가 오른쪽에서 왼쪽 대신 왼쪽에서 오른쪽으로 표시될 수 있습니다
2. **문자 분리**: 문자가 제대로 결합되지 않아 연결된 단어를 형성하는 대신 별도의 문자로 나타날 수 있습니다
3. **캐럿 이동**: 캐럿이 RTL 텍스트에서 잘못 이동할 수 있습니다
4. **선택 문제**: RTL 컨텍스트에서 텍스트 선택이 올바르게 작동하지 않을 수 있습니다
5. **혼합 방향**: RTL과 LTR 텍스트를 혼합할 때 방향 처리가 잘못될 수 있습니다

## 언어별 특성

이 문제는 주로 다음에 영향을 미칩니다:

- **아랍어**: 문자가 문맥적으로 결합되지 않을 수 있으며, RTL 방향이 올바르게 처리되지 않을 수 있습니다
- **히브리어**: 유사한 RTL 및 문자 결합 문제가 발생합니다
- **기타 RTL 언어**: RTL 방향을 사용하는 다른 언어에서도 유사한 문제가 발생할 수 있습니다

## 브라우저 비교

- **Chrome/Edge**: 일반적으로 더 나은 RTL 지원을 하지만, 문자 결합이 여전히 실패할 수 있습니다
- **Firefox**: RTL 지원이 좋지만 일부 엣지 케이스가 존재합니다
- **Safari**: RTL 및 문자 결합이 일관되지 않을 수 있으며, 특히 iOS에서 그렇습니다

## 영향

- RTL 텍스트가 읽을 수 없거나 읽기 어려울 수 있습니다
- 사용자가 올바른 RTL 텍스트를 안정적으로 입력할 수 없습니다
- 혼합 방향 텍스트(RTL + LTR)가 잘못 표시될 수 있습니다

## 해결 방법

적절한 RTL 방향을 보장하고 문자 결합을 모니터링합니다:

```javascript
// RTL 콘텐츠에 대한 RTL 방향 설정
element.setAttribute('dir', 'rtl');
element.style.direction = 'rtl';
element.style.textAlign = 'right';

element.addEventListener('compositionend', (e) => {
  const text = e.target.textContent;
  
  // 텍스트에 RTL 문자가 포함되어 있는지 확인
  const arabicPattern = /[\u0600-\u06FF]/;
  const hebrewPattern = /[\u0590-\u05FF]/;
  
  if (arabicPattern.test(text) || hebrewPattern.test(text)) {
    // RTL 방향이 설정되었는지 확인
    if (getComputedStyle(e.target).direction !== 'rtl') {
      e.target.setAttribute('dir', 'rtl');
    }
    
    // 문자 결합 유효성 검사
    // RTL 문자는 문맥적으로 결합되어야 합니다
    // 이를 유효성 검사하는 것은 복잡합니다 - 브라우저가 처리해야 하지만 실패할 수 있습니다
  }
});

// 혼합 방향 텍스트 처리
element.addEventListener('input', (e) => {
  const text = e.target.textContent;
  const hasRTL = /[\u0590-\u05FF\u0600-\u06FF]/.test(text);
  const hasLatin = /[a-zA-Z]/.test(text);
  
  if (hasRTL && hasLatin) {
    // 혼합 방향 - 양방향 텍스트 처리가 필요할 수 있습니다
    // 유니코드 양방향 알고리즘(bidi) 사용
    e.target.setAttribute('dir', 'auto'); // 브라우저가 방향 결정하도록 함
  } else if (hasRTL) {
    e.target.setAttribute('dir', 'rtl');
  } else {
    e.target.setAttribute('dir', 'ltr');
  }
});
```
