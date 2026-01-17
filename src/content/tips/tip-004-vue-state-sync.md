---
id: tip-004-vue-state-sync
title: Vue contenteditable state synchronization
description: "How to solve caret position issues when using contenteditable with reactive state in Vue"
category: framework
tags:
  - vue
  - framework
  - caret
  - state-sync
  - reactivity
difficulty: intermediate
relatedScenarios:
  - scenario-framework-state-sync
relatedCases:
  - ce-0560-framework-state-sync-vue
locale: en
---

## Problem

When using `contenteditable` elements in Vue with reactive state binding (v-model or data binding), the caret (cursor) position jumps to the beginning of the element whenever the component re-renders due to state changes.

## Solution

### 1. Custom Component with Caret Preservation

Create a custom component that automatically preserves caret position.

```vue
<template>
  <div
    ref="editable"
    contenteditable="true"
    @input="onInput"
    @blur="onBlur"
  ></div>
</template>

<script>
export default {
  props: {
    value: String
  },
  emits: ['update:value'],
  data() {
    return {
      caretOffset: 0
    }
  },
  methods: {
    onInput(e) {
      const el = this.$refs.editable
      const sel = window.getSelection()
      if (sel.rangeCount > 0) {
        const range = sel.getRangeAt(0)
        const pre = range.cloneRange()
        pre.selectNodeContents(el)
        pre.setEnd(range.startContainer, range.startOffset)
        this.caretOffset = pre.toString().length
      }
      this.$emit('update:value', el.innerText)
    },
    restoreCaret() {
      const el = this.$refs.editable
      let pos = this.caretOffset

      function walkNodes(node) {
        for (let child of node.childNodes) {
          if (pos <= 0) return { node, offset: 0 }
          if (child.nodeType === Node.TEXT_NODE) {
            if (child.textContent.length >= pos) {
              return { node: child, offset: pos }
            } else {
              pos -= child.textContent.length
            }
          } else {
            const result = walkNodes(child)
            if (result) return result
          }
        }
        return { node: el, offset: el.childNodes.length }
      }

      const { node, offset } = walkNodes(el)
      const newRange = document.createRange()
      newRange.setStart(node, offset)
      newRange.collapse(true)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(newRange)
    }
  },
  watch: {
    value(newVal) {
      const el = this.$refs.editable
      if (el.innerText !== newVal) {
        el.innerText = newVal
        this.$nextTick(this.restoreCaret)
      }
    }
  }
}
</script>
```

### 2. Debounce Updates

Reduce re-render frequency by debouncing state updates.

```javascript
import { debounce } from 'lodash'

export default {
  methods: {
    onInput: debounce(function(e) {
      this.$emit('update:value', e.currentTarget.innerText)
    }, 300)
  }
}
```

### 3. Update Only on Blur

Don't update state while typing, only on blur.

```vue
<template>
  <div
    ref="editable"
    contenteditable="true"
    @blur="onBlur"
  ></div>
</template>

<script>
export default {
  props: {
    value: String
  },
  emits: ['update:value'],
  methods: {
    onBlur(e) {
      this.$emit('update:value', e.currentTarget.innerText)
    }
  },
  watch: {
    value(newVal) {
      const el = this.$refs.editable
      if (el.innerText !== newVal) {
        el.innerText = newVal
      }
    }
  }
}
</script>
```

## Notes

- v-model doesn't work directly with contenteditable, so custom component needed
- change events don't fire reliably, use input events instead
- This issue is more prevalent in Safari and Firefox, so test in these browsers

## Related Resources

- [Scenario: Framework state sync](/scenarios/scenario-framework-state-sync)
- [Case: ce-0560](/cases/ce-0560-framework-state-sync-vue)
