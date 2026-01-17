---
id: tip-004-vue-state-sync-ko
title: Vue에서 contenteditable 상태 동기화하기
description: "Vue에서 contenteditable을 반응형 상태와 함께 사용할 때 캐럿 위치 문제를 해결하는 방법"
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
locale: ko
---

## 문제

Vue에서 반응형 상태(v-model 또는 데이터 바인딩)와 함께 contenteditable을 사용할 때, 상태 변경으로 인해 컴포넌트가 re-render될 때마다 캐럿 위치가 처음으로 이동합니다.

## 해결 방법

### 1. 커스텀 컴포넌트로 캐럿 보존

커스텀 컴포넌트를 만들어 캐럿 위치를 자동으로 보존합니다.

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

### 2. 디바운스로 업데이트 빈도 감소

상태 업데이트를 디바운스하여 re-render 빈도를 줄입니다.

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

### 3. blur 이벤트에서만 업데이트

타이핑 중에는 상태를 업데이트하지 않고, blur 시에만 업데이트합니다.

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

## 주의사항

- v-model은 contenteditable에서 직접 작동하지 않으므로 커스텀 컴포넌트 필요
- change 이벤트가 신뢰성 있게 발생하지 않아 input 이벤트 사용 권장
- Safari와 Firefox에서 더 자주 발생하므로 이 브라우저에서 테스트 필수

## 관련 자료

- [시나리오: 프레임워크 상태 동기화](/scenarios/scenario-framework-state-sync)
- [케이스: ce-0560](/cases/ce-0560-framework-state-sync-vue)
