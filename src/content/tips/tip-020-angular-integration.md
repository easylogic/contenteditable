---
id: tip-020-angular-integration
title: Integrating contenteditable with Angular
description: "How to properly integrate contenteditable elements with Angular, handle state synchronization, and prevent caret position issues"
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
locale: en
---

## When to Use This Tip

Use this pattern when you need to:
- Integrate contenteditable with Angular
- Handle two-way data binding
- Prevent caret position jumps on re-renders
- Work with Angular's change detection
- Implement ControlValueAccessor for form integration

## Problem

Angular's change detection and Zone.js can cause issues with contenteditable:
- Caret position jumps on re-renders
- `ngModel` doesn't work directly with contenteditable
- Zone.js triggers change detection on every keystroke
- No native form control support
- State synchronization between DOM and Angular state

## Solution

### 1. Basic Angular Component with contenteditable

Simple integration with manual state management:

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
    // Initial setup
  }
  
  onInput(event: Event) {
    if (this.isUpdating) return;
    
    const target = event.target as HTMLElement;
    this.content = target.innerHTML;
  }
  
  onBlur() {
    // Save final state
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

### 2. Caret Position Preservation

Save and restore caret position to prevent jumps:

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
    // Save caret position on input
    if (this.editorRef) {
      this.editorRef.nativeElement.addEventListener('input', () => {
        this.saveCaretPosition();
      });
    }
  }
  
  ngOnDestroy() {
    // Cleanup if needed
  }
  
  saveCaretPosition() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const editor = this.editorRef.nativeElement;
    
    // Calculate character offsets
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
    
    // Find start position
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
      // Find end position
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
      
      // Restore caret after DOM update
      setTimeout(() => {
        this.restoreCaretPosition();
        this.isUpdating = false;
      }, 0);
    }
  }
}
```

### 3. ControlValueAccessor Implementation

Implement ControlValueAccessor for form integration:

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
  
  // ControlValueAccessor implementation
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

// Usage in template
// <app-content-editable [(ngModel)]="content"></app-content-editable>
// or
// <app-content-editable [formControl]="contentControl"></app-content-editable>
```

### 4. Zone.js Optimization

Run outside Angular zone to improve performance:

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
      
      // Run input events outside Angular zone for better performance
      this.ngZone.runOutsideAngular(() => {
        editor.addEventListener('input', (e) => {
          // Only trigger change detection when needed
          this.ngZone.run(() => {
            this.onInput(e);
          });
        });
        
        editor.addEventListener('keyup', () => {
          // Debounce change detection
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
    // Save caret position
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    // Implementation from previous example
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

### 5. Complete Angular Integration with Reactive Forms

Full integration with reactive forms and change detection optimization:

```typescript
import { Component, ElementRef, ViewChild, forwardRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-content-editable',
  template: `
    <div
      #editor
      contenteditable="true"
      [class.disabled]="disabled"
      [class.error]="hasError"
      [attr.contenteditable]="disabled ? 'false' : 'true'"
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
    // Debounce input updates
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
      
      // Run outside zone for better performance
      this.ngZone.runOutsideAngular(() => {
        editor.addEventListener('input', (e) => {
          const target = e.target as HTMLElement;
          this.saveCaretPosition();
          
          // Trigger change detection only when needed
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
  
  // ControlValueAccessor implementation
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
  
  // Validation support
  setError(error: string | null) {
    this.hasError = !!error;
    this.errorMessage = error || '';
    this.cdr.markForCheck();
  }
}

// Usage
// In component:
// contentControl = new FormControl('', [Validators.required]);
// 
// In template:
// <app-content-editable [formControl]="contentControl"></app-content-editable>
```

### 6. Standalone Component (Angular 14+)

Modern standalone component approach:

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
    // React to content changes
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

## Notes

- Always save caret position before DOM updates
- Use `setTimeout` or `requestAnimationFrame` to restore caret after DOM changes
- Implement `ControlValueAccessor` for form integration
- Use `NgZone.runOutsideAngular()` to optimize performance
- Debounce input events to reduce change detection cycles
- Use signals (Angular 16+) for better reactivity
- Test with Angular's change detection in both default and OnPush modes
- Consider using `ChangeDetectorRef.markForCheck()` in OnPush mode

## Browser Compatibility

- **Chrome/Edge**: Works well with Angular
- **Firefox**: Good support, but test caret restoration
- **Safari**: Works, but be careful with Zone.js change detection

## Related Resources

- [Scenario: Framework state synchronization](/scenarios/scenario-framework-state-sync)
- [Tip: Selection Handling Pattern](/tips/tip-017-selection-handling-pattern)
- [Tip: React Integration](/tips/tip-001-caret-preservation-react)
