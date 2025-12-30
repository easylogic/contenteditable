---
id: scenario-paste-event-handling
title: preventDefault on paste event does not prevent default paste behavior
description: In Chrome on Windows, calling `preventDefault()` on the `paste` event does not always prevent the default paste behavior. Content may still be pasted despite the prevention.
category: paste
tags:
  - paste
  - events
  - preventDefault
  - chrome
status: draft
locale: en
---

In Chrome on Windows, calling `preventDefault()` on the `paste` event does not always prevent the default paste behavior. Content may still be pasted despite the prevention.
