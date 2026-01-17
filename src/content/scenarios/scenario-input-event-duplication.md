---
id: scenario-input-event-duplication
title: Input events fire multiple times for single keystroke
description: In Edge on Windows, the `input` event may fire multiple times for a single keystroke, causing event handlers to execute more than expected. This can lead to performance issues and incorrect behavior.
category: other
tags:
  - input
  - events
  - duplication
  - edge
status: draft
locale: en
---

In Edge on Windows, the `input` event may fire multiple times for a single keystroke, causing event handlers to execute more than expected. This can lead to performance issues and incorrect behavior.

## References

- [Rishan Digital: Key down event fires twice](https://rishandigital.com/jquery/key-down-event-fires-twice-ensure-event-is-not-bound-multiple-times/) - Event listener duplication
- [MDN: Element keydown event](https://developer.mozilla.org/docs/Web/API/Element/keydown_event) - Keydown event documentation
- [Microsoft Support: preventDefault doesn't work with IME in Edge](https://support.microsoft.com/en-us/topic/preventdefault-doesn-t-work-in-internet-explorer-11-or-microsoft-edge-with-ime-enabled-11908d69-b7e6-00c0-8664-62f2b3bcce0a) - IME-related event issues
