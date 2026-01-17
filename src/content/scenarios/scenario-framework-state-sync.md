---
id: scenario-framework-state-sync
title: Framework state synchronization issues with contenteditable
description: "When using contenteditable with JavaScript frameworks like Vue, Angular, or Svelte, state synchronization between the DOM and framework state can cause caret position issues, event mismatches, and performance problems. Each framework has unique challenges when integrating with contenteditable."
category: other
tags:
  - framework
  - vue
  - angular
  - svelte
  - state
  - synchronization
  - caret
status: draft
locale: en
---

When using `contenteditable` with JavaScript frameworks like Vue, Angular, or Svelte, state synchronization between the DOM and framework state can cause caret position issues, event mismatches, and performance problems.

## Observed Behavior

### Vue-specific Issues
- **Caret jumps on re-render**: Similar to React, Vue's reactivity can cause caret to reset
- **v-model doesn't work**: `v-model` is designed for form inputs, not contenteditable
- **Event timing**: `change` events don't fire reliably, requiring `input` events
- **Re-render frequency**: Every keystroke can trigger watchers and re-renders

### Angular-specific Issues
- **No native form control**: contenteditable doesn't implement `ControlValueAccessor` by default
- **Model binding**: `ngModel` doesn't work directly with contenteditable
- **Event handling**: Firefox-specific issues with `input` events
- **Change detection**: Zone.js can cause performance issues with frequent updates

### Svelte-specific Issues
- **Reactive updates**: Svelte's reactivity can cause similar caret jumping
- **DOM synchronization**: Updates may not sync correctly with DOM state

## Browser Comparison

- **Safari**: Most affected by framework re-renders
- **Firefox**: Issues with event handling and caret positioning
- **Chrome**: Generally better but still affected
- **Edge**: Similar to Chrome

## Impact

- **Poor user experience**: Caret jumping disrupts typing
- **Framework limitations**: Makes framework integration challenging
- **Performance overhead**: Frequent re-renders cause lag
- **Development complexity**: Requires custom solutions for each framework

## Workarounds

### Vue Solutions

#### 1. Custom Component with Caret Preservation

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
      // Restore caret position logic
      const el = this.$refs.editable
      // Implementation similar to React example
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

#### 2. Debounce Updates

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

### Angular Solutions

#### 1. Custom ControlValueAccessor

```typescript
import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-contenteditable',
  template: '<div contenteditable="true" (input)="onInput($event)"></div>',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ContentEditableComponent),
    multi: true
  }]
})
export class ContentEditableComponent implements ControlValueAccessor {
  private caretPosition: number = 0;
  
  onInput(event: Event) {
    const element = event.target as HTMLElement;
    this.saveCaretPosition(element);
    this.onChange(element.innerText);
  }
  
  writeValue(value: string): void {
    const element = document.querySelector('[contenteditable]') as HTMLElement;
    if (element && element.innerText !== value) {
      element.innerText = value;
      this.restoreCaretPosition(element);
    }
  }
  
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  private onChange = (value: string) => {};
  private onTouched = () => {};
  
  private saveCaretPosition(element: HTMLElement): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preRange = range.cloneRange();
      preRange.selectNodeContents(element);
      preRange.setEnd(range.startContainer, range.startOffset);
      this.caretPosition = preRange.toString().length;
    }
  }
  
  private restoreCaretPosition(element: HTMLElement): void {
    // Restore logic
  }
}
```

### Svelte Solutions

```svelte
<script>
  let content = '';
  let editableElement;
  let caretPosition = 0;
  
  function saveCaretPosition() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preRange = range.cloneRange();
      preRange.selectNodeContents(editableElement);
      preRange.setEnd(range.startContainer, range.startOffset);
      caretPosition = preRange.toString().length;
    }
  }
  
  function handleInput(event) {
    saveCaretPosition();
    content = event.currentTarget.innerText;
  }
  
  $: if (content !== editableElement?.innerText) {
    editableElement.innerText = content;
    // Restore caret
  }
</script>

<div
  bind:this={editableElement}
  contenteditable="true"
  on:input={handleInput}
>{content}</div>
```

## References

- [Stack Overflow: Vue contenteditable with v-model](https://stackoverflow.com/questions/53899676/vue-2-contenteditable-with-v-model) - Vue integration patterns
- [Stack Overflow: Vue caret position after prop change](https://stackoverflow.com/questions/57133249/caret-position-in-editable-div-after-prop-change-using-vue-js) - Caret preservation in Vue
- [Medium: ControlValueAccessor and contenteditable in Angular](https://medium.com/its-tinkoff/controlvalueaccessor-and-contenteditable-in-angular-6ebf50b7475e) - Angular integration guide
- [Stack Overflow: Angular contenteditable two-way binding](https://stackoverflow.com/questions/38444183/angular-contenteditable-change-event-not-fired) - Angular event handling
- [jessieji.com: contenteditable in Vue](https://jessieji.com/2022/contenteditable-vue) - Vue-specific issues and solutions
- [Stack Overflow: Angular contenteditable Firefox issues](https://stackoverflow.com/questions/51206076/contenteditable-div-is-not-working-properly-with-angular-two-way-binding-in-fire) - Firefox-specific problems
