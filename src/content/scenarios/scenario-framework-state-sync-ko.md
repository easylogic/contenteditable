---
id: scenario-framework-state-sync-ko
title: 프레임워크 상태 동기화 문제
description: "Vue, Angular, Svelte 같은 JavaScript 프레임워크에서 contenteditable을 사용할 때, DOM과 프레임워크 상태 간의 동기화가 캐럿 위치 문제, 이벤트 불일치, 성능 문제를 일으킬 수 있습니다. 각 프레임워크마다 contenteditable 통합 시 고유한 문제가 있습니다."
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
locale: ko
---

Vue, Angular, Svelte 같은 JavaScript 프레임워크에서 `contenteditable`을 사용할 때, DOM과 프레임워크 상태 간의 동기화가 캐럿 위치 문제, 이벤트 불일치, 성능 문제를 일으킬 수 있습니다.

## 관찰된 동작

### Vue 특정 문제
- **re-render 시 캐럿 이동**: React와 유사하게 Vue의 반응성이 캐럿을 초기화시킬 수 있음
- **v-model 작동 안 함**: `v-model`은 폼 입력용으로 설계되어 contenteditable에는 작동하지 않음
- **이벤트 타이밍**: `change` 이벤트가 신뢰성 있게 발생하지 않아 `input` 이벤트 필요
- **re-render 빈도**: 모든 키 입력이 watcher와 re-render를 유발할 수 있음

### Angular 특정 문제
- **네이티브 폼 컨트롤 없음**: contenteditable은 기본적으로 `ControlValueAccessor`를 구현하지 않음
- **모델 바인딩**: `ngModel`이 contenteditable과 직접 작동하지 않음
- **이벤트 처리**: Firefox에서 `input` 이벤트 관련 문제
- **변경 감지**: Zone.js가 빈번한 업데이트로 성능 문제 발생 가능

### Svelte 특정 문제
- **반응형 업데이트**: Svelte의 반응성이 유사한 캐럿 이동을 일으킬 수 있음
- **DOM 동기화**: 업데이트가 DOM 상태와 올바르게 동기화되지 않을 수 있음

## 브라우저 비교

- **Safari**: 프레임워크 re-render에 가장 많이 영향받음
- **Firefox**: 이벤트 처리 및 캐럿 위치 지정 문제
- **Chrome**: 일반적으로 더 나으나 여전히 영향받음
- **Edge**: Chrome과 유사

## 영향

- **사용자 경험 저하**: 캐럿 이동이 타이핑을 방해함
- **프레임워크 제한**: 프레임워크 통합을 어렵게 만듦
- **성능 오버헤드**: 빈번한 re-render가 지연을 일으킴
- **개발 복잡성**: 각 프레임워크마다 커스텀 솔루션 필요

## 해결 방법

### Vue 해결책

#### 1. 캐럿 보존이 있는 커스텀 컴포넌트

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
      // 캐럿 위치 복원 로직
      const el = this.$refs.editable
      // React 예제와 유사한 구현
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

#### 2. 업데이트 디바운스

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

### Angular 해결책

#### 1. 커스텀 ControlValueAccessor

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
    // 복원 로직
  }
}
```

### Svelte 해결책

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
    // 캐럿 복원
  }
</script>

<div
  bind:this={editableElement}
  contenteditable="true"
  on:input={handleInput}
>{content}</div>
```

## 참고 자료

- [Stack Overflow: Vue contenteditable with v-model](https://stackoverflow.com/questions/53899676/vue-2-contenteditable-with-v-model) - Vue 통합 패턴
- [Stack Overflow: Vue caret position after prop change](https://stackoverflow.com/questions/57133249/caret-position-in-editable-div-after-prop-change-using-vue-js) - Vue에서 캐럿 보존
- [Medium: Angular에서 ControlValueAccessor와 contenteditable](https://medium.com/its-tinkoff/controlvalueaccessor-and-contenteditable-in-angular-6ebf50b7475e) - Angular 통합 가이드
- [Stack Overflow: Angular contenteditable 양방향 바인딩](https://stackoverflow.com/questions/38444183/angular-contenteditable-change-event-not-fired) - Angular 이벤트 처리
- [jessieji.com: Vue에서 contenteditable](https://jessieji.com/2022/contenteditable-vue) - Vue 특정 문제 및 해결책
- [Stack Overflow: Angular contenteditable Firefox 문제](https://stackoverflow.com/questions/51206076/contenteditable-div-is-not-working-properly-with-angular-two-way-binding-in-fire) - Firefox 특정 문제
