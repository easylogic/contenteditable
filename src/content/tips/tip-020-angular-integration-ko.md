---
id: tip-020-angular-integration-ko
title: Angular와 contenteditable 통합하기
description: "Angular와 contenteditable 요소를 올바르게 통합하고, 상태 동기화를 처리하며, 커서 위치 문제를 방지하는 방법"
category: framework
tags:
  - angular
  - framework
  - state-sync
  - caret
  - contenteditable
  - zonejs
difficulty: intermediate
relatedScenarios:
  - scenario-framework-state-sync
relatedCases: []
locale: ko
---

## 이 Tip을 사용할 때

다음과 같은 경우에 이 패턴을 사용하세요:
- Angular와 contenteditable 통합
- 양방향 데이터 바인딩 처리
- 리렌더링 시 커서 위치 점프 방지
- Angular의 변경 감지와 작업
- 폼 통합을 위한 ControlValueAccessor 구현

## 문제

Angular의 변경 감지와 Zone.js가 contenteditable에서 문제를 일으킬 수 있습니다:
- 리렌더링 시 커서 위치 점프
- `ngModel`이 contenteditable과 직접 작동하지 않음
- Zone.js가 모든 키 입력에서 변경 감지를 트리거
- 네이티브 폼 컨트롤 지원 없음
- DOM과 Angular 상태 간 상태 동기화

## 해결 방법

### 1. contenteditable이 있는 기본 Angular 컴포넌트

수동 상태 관리가 있는 간단한 통합:

```typescript
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-content-editable',
  template: `
    <div
      #editor
      contenteditable="true"
      (input)="onInput($event)"
      (blur)="onBlur()"
      [innerHTML]="content"
    ></div>
  `,
})
export class ContentEditableComponent implements AfterViewInit {
  @ViewChild('editor', { static: false }) editorRef!: ElementRef<HTMLElement>;
  
  content = '';
  private isUpdating = false;
  
  ngAfterViewInit() {
    // 초기 설정
  }
  
  onInput(event: Event) {
    if (this.isUpdating) return;
    
    const target = event.target as HTMLElement;
    this.content = target.innerHTML;
  }
  
  onBlur() {
    // 최종 상태 저장
    if (this.editorRef) {
      this.content = this.editorRef.nativeElement.innerHTML;
    }
  }
  
  updateContent(newContent: string) {
    if (this.editorRef && this.editorRef.nativeElement.innerHTML !== newContent) {
      this.isUpdating = true;
      this.editorRef.nativeElement.innerHTML = newContent;
      this.isUpdating = false;
    }
  }
}
```

### 2. 커서 위치 보존

점프를 방지하기 위해 커서 위치 저장 및 복원:

```typescript
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-content-editable',
  template: `
    <div
      #editor
      contenteditable="true"
      (input)="onInput($event)"
      (keyup)="saveCaretPosition()"
      (mouseup)="saveCaretPosition()"
      [innerHTML]="content"
    ></div>
  `,
})
export class ContentEditableComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editor', { static: false }) editorRef!: ElementRef<HTMLElement>;
  
  content = '';
  private savedSelection: { start: number; end: number; collapsed: boolean } | null = null;
  private isUpdating = false;
  
  ngAfterViewInit() {
    // 입력 시 커서 위치 저장
    if (this.editorRef) {
      this.editorRef.nativeElement.addEventListener('input', () => {
        this.saveCaretPosition();
      });
    }
  }
  
  ngOnDestroy() {
    // 필요한 경우 정리
  }
  
  saveCaretPosition() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const editor = this.editorRef.nativeElement;
    
    // 문자 오프셋 계산
    const startRange = range.cloneRange();
    startRange.selectNodeContents(editor);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(editor);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    this.savedSelection = {
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }
  
  restoreCaretPosition() {
    if (!this.savedSelection || !this.editorRef) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    const editor = this.editorRef.nativeElement;
    
    // 시작 위치 찾기
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      editor,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let startNode = null;
    let startOffset = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (currentOffset + nodeLength >= this.savedSelection.start) {
        startNode = node;
        startOffset = this.savedSelection.start - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode) return;
    
    range.setStart(startNode, startOffset);
    
    if (this.savedSelection.collapsed) {
      range.collapse(true);
    } else {
      // 끝 위치 찾기
      currentOffset = 0;
      const walker = document.createTreeWalker(
        editor,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= this.savedSelection.end) {
          const endNode = node;
          const endOffset = this.savedSelection.end - currentOffset;
          range.setEnd(endNode, endOffset);
          break;
        }
        
        currentOffset += nodeLength;
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  onInput(event: Event) {
    if (this.isUpdating) return;
    
    const target = event.target as HTMLElement;
    this.content = target.innerHTML;
    this.saveCaretPosition();
  }
  
  updateContent(newContent: string) {
    if (this.editorRef && this.editorRef.nativeElement.innerHTML !== newContent) {
      this.isUpdating = true;
      this.saveCaretPosition();
      this.editorRef.nativeElement.innerHTML = newContent;
      
      // DOM 업데이트 후 커서 복원
      setTimeout(() => {
        this.restoreCaretPosition();
        this.isUpdating = false;
      }, 0);
    }
  }
}
```

### 3. ControlValueAccessor 구현

폼 통합을 위한 ControlValueAccessor 구현:

```typescript
import { Component, ElementRef, ViewChild, forwardRef, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-content-editable',
  template: `
    <div
      #editor
      contenteditable="true"
      (input)="onInput($event)"
      (blur)="onBlur()"
      [class.disabled]="disabled"
      [attr.contenteditable]="disabled ? 'false' : 'true'"
    ></div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContentEditableComponent),
      multi: true,
    },
  ],
})
export class ContentEditableComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('editor', { static: false }) editorRef!: ElementRef<HTMLElement>;
  
  content = '';
  disabled = false;
  private savedSelection: { start: number; end: number } | null = null;
  private isUpdating = false;
  
  private onChange = (value: string) => {};
  private onTouched = () => {};
  
  ngAfterViewInit() {
    if (this.editorRef) {
      this.editorRef.nativeElement.addEventListener('input', () => {
        this.saveCaretPosition();
      });
    }
  }
  
  saveCaretPosition() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const editor = this.editorRef.nativeElement;
    
    const startRange = range.cloneRange();
    startRange.selectNodeContents(editor);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(editor);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    this.savedSelection = {
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }
  
  restoreCaretPosition() {
    if (!this.savedSelection || !this.editorRef) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    const editor = this.editorRef.nativeElement;
    
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      editor,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let startNode = null;
    let startOffset = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (currentOffset + nodeLength >= this.savedSelection.start) {
        startNode = node;
        startOffset = this.savedSelection.start - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode) return;
    
    range.setStart(startNode, startOffset);
    
    if (this.savedSelection.collapsed) {
      range.collapse(true);
    } else {
      currentOffset = 0;
      const walker = document.createTreeWalker(
        editor,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= this.savedSelection.end) {
          const endNode = node;
          const endOffset = this.savedSelection.end - currentOffset;
          range.setEnd(endNode, endOffset);
          break;
        }
        
        currentOffset += nodeLength;
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  onInput(event: Event) {
    if (this.isUpdating || this.disabled) return;
    
    const target = event.target as HTMLElement;
    const newContent = target.innerHTML;
    
    if (newContent !== this.content) {
      this.content = newContent;
      this.onChange(this.content);
      this.saveCaretPosition();
    }
  }
  
  onBlur() {
    this.onTouched();
  }
  
  // ControlValueAccessor 구현
  writeValue(value: string) {
    if (value !== this.content && this.editorRef) {
      this.isUpdating = true;
      this.saveCaretPosition();
      this.editorRef.nativeElement.innerHTML = value || '';
      this.content = value || '';
      
      setTimeout(() => {
        this.restoreCaretPosition();
        this.isUpdating = false;
      }, 0);
    }
  }
  
  registerOnChange(fn: (value: string) => void) {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    if (this.editorRef) {
      this.editorRef.nativeElement.setAttribute('contenteditable', isDisabled ? 'false' : 'true');
    }
  }
}

// 템플릿에서 사용
// <app-content-editable [(ngModel)]="content"></app-content-editable>
// 또는
// <app-content-editable [formControl]="contentControl"></app-content-editable>
```

### 4. Zone.js 최적화

성능 향상을 위해 Angular zone 외부에서 실행:

```typescript
import { Component, ElementRef, ViewChild, NgZone, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-content-editable',
  template: `
    <div
      #editor
      contenteditable="true"
      (input)="onInput($event)"
      [innerHTML]="content"
    ></div>
  `,
})
export class ContentEditableComponent implements AfterViewInit {
  @ViewChild('editor', { static: false }) editorRef!: ElementRef<HTMLElement>;
  
  content = '';
  private isUpdating = false;
  
  constructor(private ngZone: NgZone) {}
  
  ngAfterViewInit() {
    if (this.editorRef) {
      const editor = this.editorRef.nativeElement;
      
      // 더 나은 성능을 위해 Angular zone 외부에서 입력 이벤트 실행
      this.ngZone.runOutsideAngular(() => {
        editor.addEventListener('input', (e) => {
          // 필요할 때만 변경 감지 트리거
          this.ngZone.run(() => {
            this.onInput(e);
          });
        });
        
        editor.addEventListener('keyup', () => {
          // 변경 감지 디바운싱
          this.ngZone.run(() => {
            this.saveCaretPosition();
          });
        });
      });
    }
  }
  
  onInput(event: Event) {
    if (this.isUpdating) return;
    
    const target = event.target as HTMLElement;
    this.content = target.innerHTML;
  }
  
  saveCaretPosition() {
    // 커서 위치 저장
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    // 이전 예제의 구현
  }
  
  updateContent(newContent: string) {
    if (this.editorRef && this.editorRef.nativeElement.innerHTML !== newContent) {
      this.isUpdating = true;
      this.saveCaretPosition();
      this.editorRef.nativeElement.innerHTML = newContent;
      
      setTimeout(() => {
        this.restoreCaretPosition();
        this.isUpdating = false;
      }, 0);
    }
  }
}
```

### 5. 반응형 폼과 완전한 Angular 통합

변경 감지 최적화가 있는 반응형 폼과의 완전한 통합:

```typescript
import { Component, ElementRef, ViewChild, forwardRef, AfterViewInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-content-editable',
  template: `
    <div
      #editor
      contenteditable="true"
      [class.disabled]="disabled()"
      [class.error]="hasError"
      [attr.contenteditable]="disabled() ? 'false' : 'true'"
    ></div>
    <div *ngIf="hasError" class="error-message">{{ errorMessage }}</div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContentEditableComponent),
      multi: true,
    },
  ],
})
export class ContentEditableComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @ViewChild('editor', { static: false }) editorRef!: ElementRef<HTMLElement>;
  
  content = '';
  disabled = false;
  hasError = false;
  errorMessage = '';
  
  private savedSelection: { start: number; end: number; collapsed: boolean } | null = null;
  private isUpdating = false;
  private destroy$ = new Subject<void>();
  private inputSubject = new Subject<string>();
  
  private onChange = (value: string) => {};
  private onTouched = () => {};
  
  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    // 입력 업데이트 디바운싱
    this.inputSubject.pipe(
      debounceTime(100),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.content = value;
      this.onChange(value);
    });
  }
  
  ngAfterViewInit() {
    if (this.editorRef) {
      const editor = this.editorRef.nativeElement;
      
      // 더 나은 성능을 위해 zone 외부에서 실행
      this.ngZone.runOutsideAngular(() => {
        editor.addEventListener('input', (e) => {
          const target = e.target as HTMLElement;
          this.saveCaretPosition();
          
          // 필요할 때만 변경 감지 트리거
          this.ngZone.run(() => {
            this.inputSubject.next(target.innerHTML);
          });
        });
        
        editor.addEventListener('blur', () => {
          this.ngZone.run(() => {
            this.onTouched();
            this.cdr.markForCheck();
          });
        });
        
        editor.addEventListener('keyup', () => {
          this.saveCaretPosition();
        });
        
        editor.addEventListener('mouseup', () => {
          this.saveCaretPosition();
        });
      });
    }
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  saveCaretPosition() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const editor = this.editorRef.nativeElement;
    
    const startRange = range.cloneRange();
    startRange.selectNodeContents(editor);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(editor);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    this.savedSelection = {
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }
  
  restoreCaretPosition() {
    if (!this.savedSelection || !this.editorRef) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    const editor = this.editorRef.nativeElement;
    
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      editor,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let startNode = null;
    let startOffset = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (currentOffset + nodeLength >= this.savedSelection.start) {
        startNode = node;
        startOffset = this.savedSelection.start - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode) return;
    
    range.setStart(startNode, startOffset);
    
    if (this.savedSelection.collapsed) {
      range.collapse(true);
    } else {
      currentOffset = 0;
      const walker = document.createTreeWalker(
        editor,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= this.savedSelection.end) {
          const endNode = node;
          const endOffset = this.savedSelection.end - currentOffset;
          range.setEnd(endNode, endOffset);
          break;
        }
        
        currentOffset += nodeLength;
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  // ControlValueAccessor 구현
  writeValue(value: string) {
    if (value !== this.content && this.editorRef) {
      this.isUpdating = true;
      this.saveCaretPosition();
      this.editorRef.nativeElement.innerHTML = value || '';
      this.content = value || '';
      
      requestAnimationFrame(() => {
        this.restoreCaretPosition();
        this.isUpdating = false;
        this.cdr.markForCheck();
      });
    }
  }
  
  registerOnChange(fn: (value: string) => void) {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    if (this.editorRef) {
      this.editorRef.nativeElement.setAttribute('contenteditable', isDisabled ? 'false' : 'true');
    }
  }
  
  // 유효성 검사 지원
  setError(error: string | null) {
    this.hasError = !!error;
    this.errorMessage = error || '';
    this.cdr.markForCheck();
  }
}

// 사용법
// 컴포넌트에서:
// contentControl = new FormControl('', [Validators.required]);
// 
// 템플릿에서:
// <app-content-editable [formControl]="contentControl"></app-content-editable>
```

### 6. 독립형 컴포넌트 (Angular 14+)

최신 독립형 컴포넌트 접근법:

```typescript
import { Component, ElementRef, ViewChild, forwardRef, AfterViewInit, signal, effect } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content-editable',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div
      #editor
      contenteditable="true"
      [class.disabled]="disabled()"
      [attr.contenteditable]="disabled() ? 'false' : 'true'"
    ></div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContentEditableComponent),
      multi: true,
    },
  ],
})
export class ContentEditableComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('editor', { static: false }) editorRef!: ElementRef<HTMLElement>;
  
  content = signal('');
  disabled = signal(false);
  
  private savedSelection: { start: number; end: number; collapsed: boolean } | null = null;
  private isUpdating = false;
  
  private onChange = (value: string) => {};
  private onTouched = () => {};
  
  constructor() {
    // 콘텐츠 변경에 반응
    effect(() => {
      const value = this.content();
      if (this.editorRef && !this.isUpdating) {
        this.updateEditorContent(value);
      }
    });
  }
  
  ngAfterViewInit() {
    if (this.editorRef) {
      const editor = this.editorRef.nativeElement;
      
      editor.addEventListener('input', (e) => {
        if (this.isUpdating) return;
        
        const target = e.target as HTMLElement;
        this.content.set(target.innerHTML);
        this.onChange(target.innerHTML);
        this.saveCaretPosition();
      });
      
      editor.addEventListener('blur', () => {
        this.onTouched();
      });
      
      editor.addEventListener('keyup', () => {
        this.saveCaretPosition();
      });
    }
  }
  
  updateEditorContent(value: string) {
    if (this.editorRef && this.editorRef.nativeElement.innerHTML !== value) {
      this.isUpdating = true;
      this.saveCaretPosition();
      this.editorRef.nativeElement.innerHTML = value || '';
      
      requestAnimationFrame(() => {
        this.restoreCaretPosition();
        this.isUpdating = false;
      });
    }
  }
  
  saveCaretPosition() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const editor = this.editorRef.nativeElement;
    
    const startRange = range.cloneRange();
    startRange.selectNodeContents(editor);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = startRange.toString().length;
    
    const endRange = range.cloneRange();
    endRange.selectNodeContents(editor);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = endRange.toString().length;
    
    this.savedSelection = {
      start: startOffset,
      end: endOffset,
      collapsed: range.collapsed,
    };
  }
  
  restoreCaretPosition() {
    if (!this.savedSelection || !this.editorRef) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    const editor = this.editorRef.nativeElement;
    
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      editor,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let startNode = null;
    let startOffset = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      
      if (currentOffset + nodeLength >= this.savedSelection.start) {
        startNode = node;
        startOffset = this.savedSelection.start - currentOffset;
        break;
      }
      
      currentOffset += nodeLength;
    }
    
    if (!startNode) return;
    
    range.setStart(startNode, startOffset);
    
    if (this.savedSelection.collapsed) {
      range.collapse(true);
    } else {
      currentOffset = 0;
      const walker = document.createTreeWalker(
        editor,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        
        if (currentOffset + nodeLength >= this.savedSelection.end) {
          const endNode = node;
          const endOffset = this.savedSelection.end - currentOffset;
          range.setEnd(endNode, endOffset);
          break;
        }
        
        currentOffset += nodeLength;
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  writeValue(value: string) {
    this.content.set(value || '');
  }
  
  registerOnChange(fn: (value: string) => void) {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean) {
    this.disabled.set(isDisabled);
    if (this.editorRef) {
      this.editorRef.nativeElement.setAttribute('contenteditable', isDisabled ? 'false' : 'true');
    }
  }
}
```

## 주의사항

- DOM 업데이트 전에 항상 커서 위치 저장
- DOM 변경 후 커서 복원에 `setTimeout` 또는 `requestAnimationFrame` 사용
- 폼 통합을 위해 `ControlValueAccessor` 구현
- 성능 최적화를 위해 `NgZone.runOutsideAngular()` 사용
- 변경 감지 주기를 줄이기 위해 입력 이벤트 디바운싱
- 더 나은 반응성을 위해 signals 사용 (Angular 16+)
- 기본 및 OnPush 모드 모두에서 Angular의 변경 감지로 테스트
- OnPush 모드에서 `ChangeDetectorRef.markForCheck()` 사용 고려

## 브라우저 호환성

- **Chrome/Edge**: Angular와 잘 작동합니다
- **Firefox**: 좋은 지원이지만 커서 복원을 테스트하세요
- **Safari**: 작동하지만 Zone.js 변경 감지에 주의하세요

## 관련 자료

- [시나리오: 프레임워크 상태 동기화](/scenarios/scenario-framework-state-sync)
- [Tip: 선택 처리 패턴](/tips/tip-017-selection-handling-pattern)
- [Tip: React 통합](/tips/tip-001-caret-preservation-react)
