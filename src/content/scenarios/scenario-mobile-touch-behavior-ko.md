---
id: scenario-mobile-touch-behavior-ko
title: "터치 이벤트가 모바일에서 contenteditable 포커스를 간섭함"
description: "iOS Safari에서 contenteditable 영역에 대한 터치 이벤트(탭, 길게 누르기)가 요소를 올바르게 포커스하지 못할 수 있습니다. 가상 키보드가 나타나지 않거나 포커스가 예상치 못하게 손실될 수 있습니다."
category: mobile
tags:
  - mobile
  - touch
  - focus
  - ios
status: draft
locale: ko
---

iOS Safari에서 contenteditable 영역에 대한 터치 이벤트(탭, 길게 누르기)가 요소를 올바르게 포커스하지 못할 수 있습니다. 가상 키보드가 나타나지 않거나 포커스가 예상치 못하게 손실될 수 있습니다.

이 시나리오는 여러 환경에서 유사한 동작으로 관찰되었습니다.

## 참고 자료

- [Algolia Support: Autocomplete input focus on iPhone](https://support.algolia.com/hc/en-us/articles/15445252263057-Why-doesn-t-Autocomplete-input-get-focus-or-open-the-keyboard-when-entering-detached-mode-on-iPhone-iOS) - User gesture requirements
- [Stack Overflow: contenteditable div doesn't focus on iPad](https://stackoverflow.com/questions/76043001/contenteditable-div-doesnt-focus-on-ipad-using-requestanimationframe) - Focus timing issues
- [ProseMirror Discuss: Can't focus on iOS](https://discuss.prosemirror.net/t/cant-focus-on-ios/3372) - iOS focus problems
- [GitHub Gist: Trigger focus with soft keyboard dynamically](https://gist.github.com/azaek/a52ffe350ff408f5932ffb228f0ca4e4) - Dummy input workaround
