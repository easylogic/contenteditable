---
id: ce-0573-macos-sequoia-chrome-ax-group-bug-ko
scenarioId: scenario-accessibility-foundations
locale: ko
os: macOS
osVersion: "15.0"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "129.0"
keyboard: US QWERTY
caseTitle: "Contenteditable이 AXTextArea가 아닌 AXGroup으로 인식됨"
description: "macOS Sequoia 환경의 Chrome 129+ 버전에서 contenteditable 영역이 접근성 트리(Accessibility Tree)에 그룹(AXGroup)으로 잘못 노출되어, VoiceOver가 이를 편집 가능한 텍스트 영역으로 인식하지 못하는 현상입니다."
tags: ["accessibility", "voiceover", "macos-sequoia", "chrome-129", "ax-tree"]
status: confirmed
domSteps:
  - label: "1단계: 에디터 포커스"
    html: '<div contenteditable="true" aria-label="에디터">내용 입력...</div>'
    description: "사용자가 표준 접근성 속성이 설정된 에디터에 포커스를 줍니다."
  - label: "2단계: 접근성 트리 검사"
    html: '<!-- 접근성 트리 뷰 -->'
    description: "macOS Sequoia에서 해당 노드가 AXTextArea가 아닌 AXGroup으로 표시됩니다. VoiceOver가 '에디터, 편집 가능한 텍스트 영역' 대신 '에디터, 그룹'이라고 안내합니다."
  - label: "✅ 예상 결과"
    html: '<div contenteditable="true" role="textbox">내용 입력...</div>'
    description: "예상: 역할이 일관되게 AXTextArea로 유지되어, 보조 공구가 캐럿 위치를 추적하고 텍스트를 선택할 수 있어야 함"
---

## 현상
macOS Sequoia (15.0) 출시와 Chrome 129 버전 업데이트 이후 심각한 접근성 회귀(Regression) 버그가 발생했습니다. HTML `contenteditable`과 macOS 접근성 API(NSAccessibility) 간의 내부 매핑이 변경되거나 파손되었습니다. 다중행 편집 영역의 표준인 `AXTextArea` 대신, Chrome은 이 엘리먼트들을 일반적인 `AXGroup`으로 보고하기 시작했습니다.

## 재현 단계
1. macOS Sequoia가 설치된 Mac을 사용합니다.
2. Chrome (v129 이상)을 엽니다.
3. 임의의 `contenteditable` 영역으로 이동합니다.
4. VoiceOver를 활성화합니다 (`Cmd + F5`).
5. Accessibility Inspector (Xcode 도구)를 열어 해당 에디터를 검사합니다.
6. 보고된 "Role"과 VoiceOver의 음성 안내를 관찰합니다.

## 관찰된 동작
1. **역할 불일치**: 엘리먼트의 접근성 역할이 `AXGroup`으로 표시됩니다.
2. **VoiceOver 안내**: VoiceOver가 엘리먼트를 "그룹"으로 안내하며, 종종 "양식 모드"나 "편집 모드"로 진입하지 못해 시각 장애인 사용자가 글자를 입력하거나 탐색하는 것이 불가능해집니다.
3. **도구 호환성 저하**: Grammarly와 같은 서드파티 도구나 VoiceOver 같은 전문 스크린 리더가 `AXGroup` 내부의 텍스트 콘텐츠를 안정적으로 추적하지 못해 캐럿 위치 파악에 실패합니다.

## 예상 동작
Chrome은 `contenteditable` 엘리먼트를 ARIA 기준 `textbox` 역할로, macOS API 기준 `AXTextArea`로 직접 매핑하여 보조 공구와의 완전한 호환성을 보장해야 합니다.

## 영향
- **심각한 접근성 장벽**: 시각 장애 및 저시력 사용자가 에디터와 상호작용할 수 없게 되어, 복잡한 웹 애플리케이션(문서 도구, CMS, 이메일 등) 사용이 차단됩니다.
- **연동 기능 파손**: 텍스트 경계가 일반 그룹으로 보고되므로, 외부 맞춤법 검사기나 하이라이트 확장 프로그램이 UI를 정확한 위치에 고정하지 못합니다.

## 브라우저 비교
- **Chrome 129+**: Sequoia 환경에서 회귀 버그 발생.
- **Safari (Sequoia)**: macOS 14.4에서 유사한 이슈가 있었으나, 15.0에서는 `AXTextArea`로 올바르게 보고되도록 수정됨.
- **Firefox**: 가장 일관성이 높으며, 문자 수준의 접근성 데이터를 지속적으로 정확하게 보고함.

## 참고 및 해결 방법
### 해결책: 명시적 ARIA 역할 설정
브라우저가 이를 기본적으로 처리해야 하지만, `role="textbox"`와 `aria-multiline="true"`를 명시적으로 설정하면 접근성 트리가 텍스트 영역 동작을 우선시하도록 강제할 수 있는 경우가 있습니다.

```html
<!-- 접근성 매핑 강제 설정 -->
<div 
    contenteditable="true" 
    role="textbox" 
    aria-multiline="true"
    aria-label="안전한 에디터 컨텍스트"
>
    내용 입력...
</div>
```

- [Chromium Bug #367355088: macOS Sequoia에서 contenteditable의 AX 역할이 AXGroup으로 표시됨](https://issues.chromium.org/issues/367355088)
- [VoiceOver 문서: 그룹 및 텍스트 영역 상호작용 가이드](https://support.apple.com/guide/voiceover/welcome/mac)
