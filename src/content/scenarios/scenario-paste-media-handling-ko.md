---
id: scenario-paste-media-handling-ko
title: contenteditable에 이미지 붙여넣기가 일관되게 지원되지 않음
description: "contenteditable 영역에 이미지(클립보드에서)를 붙여넣으려고 할 때 동작이 브라우저마다 일관되지 않습니다. 일부 브라우저는 붙여넣기를 무시하는 반면, 다른 브라우저는 플레이스홀더를 삽입하거나 조용히 실패할 수 있습니다."
category: paste
tags:
  - paste
  - images
  - media
  - chrome
status: draft
locale: ko
---

contenteditable 영역에 이미지(클립보드에서)를 붙여넣으려고 할 때 동작이 브라우저마다 일관되지 않습니다. 일부 브라우저는 붙여넣기를 무시하는 반면, 다른 브라우저는 플레이스홀더를 삽입하거나 조용히 실패할 수 있습니다.

## 참고 자료

- [MDN: Window paste event](https://developer.mozilla.org/docs/Web/API/Window/paste_event) - Paste 이벤트 문서
- [MDN: DataTransfer API](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/) - 클립보드 데이터 접근
- [MDN: Clipboard.read](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/read) - 비동기 클립보드 API
- [MDN: Clipboard.write](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/write) - 클립보드 쓰기
- [AWSM Page: Accessing clipboard images with JavaScript](https://awsm.page/javascript/code-snippet-accessing-clipboard-images-with-javascript/) - 이미지 붙여넣기 예제
