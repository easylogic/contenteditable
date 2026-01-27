---
id: ce-0574-aria-readonly-conflict-bug-ko
scenarioId: scenario-accessibility-foundations
locale: ko
os: Windows
osVersion: "11"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "124.0"
keyboard: US QWERTY
caseTitle: "aria-readonly가 contenteditable 상태와 충돌하는 현상"
description: "Chromium 124 버전 부근에서 contenteditable 영역에 aria-readonly='false'를 적용하면, 일부 스크린 리더(NVDA/JAWS)가 이를 편집 가능이 아닌 '읽기 전용'으로 잘못 안내하는 현상입니다."
tags: ["accessibility", "aria", "readonly", "screen-reader", "chrome-124"]
status: confirmed
domSteps:
  - label: "1단계: 커스텀 박스 설정"
    html: '<div contenteditable="true" role="textbox" aria-readonly="false">|</div>'
    description: "커스텀 편집 박스를 생성합니다. 접근성 개선을 위해 aria-readonly를 명시적으로 false로 설정합니다."
  - label: "2단계: 음성 안내 오류"
    html: '<!-- 접근성 트리 해석 -->'
    description: "aria-readonly='false'임에도 불구하고, 접근성 트리가 상태 플래그를 결합하는 과정에서 NVDA에 '읽기 전용' 신호를 보냅니다. NVDA가 '편집창, 읽기 전용'이라고 안내합니다."
  - label: "✅ 예상 결과"
    html: '<div contenteditable="true" role="textbox">|</div>'
    description: "예상: aria-readonly를 제거하거나 false로 설정했을 때, contenteditable 엘리먼트 고유의 '읽기-쓰기' 상태를 덮어써서는 안 됨"
---

## 현상
Chromium의 접근성 구현 방식에서 레거시 ARIA 속성이 `contenteditable` 속성으로부터 도출된 상태를 방해하거나 왜곡하는 충돌이 존재합니다. 구체적으로, 개발자가 명시적으로 `aria-readonly="false"`를 설정할 때(동적으로 상태를 토글하거나 안전을 기하기 위해 수동으로 설정하는 경우), Chrome은 이 플래그를 운영체제 접근성 API(IA2 등)에 부적절하게 전달하여 마치 제한된 상태인 것처럼 신호를 보냅니다. 이로 인해 NVDA와 같은 스크린 리더가 실제로는 타이핑이 가능한 필드임에도 불구하고 "읽기 전용"이라고 안내하게 됩니다.

## 재현 단계
1. `contenteditable="true"`와 `role="textbox"`를 가진 엘리먼트를 생성합니다.
2. `aria-readonly="false"` 속성을 추가합니다.
3. Chrome (v122~v124) 브라우저를 엽니다.
4. NVDA 또는 JAWS 스크린 리더를 실행합니다.
5. 탭 키를 이용해 에디터에 포커스를 줍니다.
6. 초기 음성 안내 내용을 확인합니다.

## 관찰된 동작
1. **스크린 리더 음성**: NVDA가 "내용 입력, 편집창, 읽기 전용"이라고 말합니다.
2. **사용자 혼란**: 캐럿이 활성화되어 깜빡이고 있음에도 읽기 전용이라는 안내를 받은 사용자는 입력을 시도하지 않고 포기하게 될 수 있습니다.
3. **접근성 트리**: 윈도우 IA2 등 플랫폼별 접근성 노드에서 `readonly` 비트가 잘못된 값(true)으로 설정됩니다.

## 예상 동작
`contenteditable="true"` 상태가 일차적인 편집 권한을 정의해야 합니다. `aria-readonly="false"`는 무시되거나 보조적인 역할만 수행해야 하며, `aria-readonly="true"`는 오직 `contenteditable` 속성이 `false`일 때만 유효하게 동작해야 합니다.

## 영향
- **비표준 작업 흐름**: 스크린 리더 시스템에 의존하는 사용자가 애플리케이션의 상호작용 가능 여부에 대해 잘못된 정보를 전달받게 됩니다.
- **동적 상태 전환 실패**: ARIA 속성을 통해 "읽기 모드"와 "편집 모드"를 전환하는 앱에서, 편집 모드 진입 후에도 "유령" 읽기 전용 상태가 유지되는 결함이 발생합니다.

## 브라우저 비교
- **Chrome 124**: 특정 Shadow DOM 및 커스텀 엘리먼트 시나리오에서 충돌 확인됨.
- **Firefox**: 편집 상태를 정확히 우선시하며, `aria-readonly="false"`를 적절히 무시함.
- **Safari**: 대체로 ARIA 매핑을 잘 따르나, `role="textbox"`와 관련된 별도의 과제들이 존재함.

## 참고 및 해결 방법
### 해결책: 편집 가능 영역에서 aria-readonly 지양
명시적으로 읽기 전용 상태가 아닌 이상, `aria-readonly` 속성을 아예 포함하지 않는 것이 좋습니다. 브라우저가 `contenteditable` 속성의 존재 여부만으로도 충분히 상태를 파악할 수 있도록 설계되었기 때문입니다.

```javascript
function setEditMode(isEditable) {
    const editor = document.getElementById('editor');
    editor.contentEditable = isEditable ? 'true' : 'false';
    
    // false로 설정하는 대신 아예 속성을 제거(Remove)하세요
    if (isEditable) {
        editor.removeAttribute('aria-readonly');
    } else {
        editor.setAttribute('aria-readonly', 'true');
    }
}
```

- [Chromium Issue #40945892: 편집 박스의 aria-readonly 충돌 이슈](https://issues.chromium.org/issues/40945892)
- [W3C ARIA: aria-readonly 속성 명세](https://www.w3.org/WAI/PF/aria-1.1/states_and_properties#aria-readonly)
