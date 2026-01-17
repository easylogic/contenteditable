---
id: ce-0253-mac-accent-menu-composition-zh
scenarioId: scenario-mac-accent-menu-composition
locale: zh
os: macOS
osVersion: "13+"
device: Desktop (Mac)
deviceVersion: Any
browser: Safari
browserVersion: "17+"
keyboard: Chinese (Simplified) - macOS Pinyin Input
caseTitle: macOS重音菜单使用时组合事件不一致（简体中文）
description: "在macOS上使用重音菜单（长按元音键或option键组合）输入特殊字符（é, ü, ö 等）时，标准IME组合事件（compositionstart, compositionupdate, compositionend）不会一致触发。这使得难以通过编程区分重音菜单输入与IME输入或普通键盘输入。"
tags:
  - composition
  - ime
  - macos
  - accent-menu
  - keyboard
  - chinese
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    在此处输入文本。尝试使用重音菜单（长按元音键或按option键组合）输入特殊字符（é, ü, ö 等），观察是否触发组合事件。
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true"></div>'
    description: "空编辑器"
  - label: "Step 1: 使用重音菜单输入'é'"
    html: '<div contenteditable="true">é</div>'
    description: "重音菜单输入'é'（可能不触发组合事件）"
  - label: "Step 2: 继续输入"
    html: '<div contenteditable="true">é你好</div>'
    description: "继续使用普通键盘输入"
  - label: "Observation"
    html: '<div contenteditable="true">é你好</div>'
    description: "compositionstart事件可能不触发，行为不一致"
  - label: "✅ Expected"
    html: '<div contenteditable="true">你好</div>'
    description: "预期：使用IME时应该触发组合事件"
---

## 现象

在macOS上使用重音菜单输入特殊字符时，标准IME组合事件不会一致触发。

## 再现步骤

1. 聚焦contenteditable元素。
2. 使用重音菜单（长按元音键或option键组合）输入特殊字符（例如：é）。
3. 继续使用普通键盘输入。

## 观察行为

- **compositionstart缺失**: 使用重音菜单时可能不触发`compositionstart`事件
- **compositionupdate不一致**: `compositionupdate`可能不触发或在意外时间触发
- **compositionend缺失或延迟**: `compositionend`可能不触发或意外延迟
- **难以区分**: 难以通过编程区分重音菜单输入与IME输入

## 预期行为

- 使用重音菜单时也应一致触发组合事件
- 应该能够与普通键盘输入区分
- 组合事件应遵循标准顺序

## 参考事项及可能解决方案

- **使用beforeinput的inputType**: 检查`inputType = 'insertCompositionText'`以检测IME输入
- **跟踪键盘状态**: 监控keydown/keyup事件作为后备
- **替代状态管理**: 使用额外的状态标志
- **理解macOS特性**: 了解重音菜单在系统级别的工作方式

## 代码示例

```javascript
const editor = document.querySelector('div[contenteditable]');
let isComposing = false;
let lastInputType = '';
let keyDownCount = 0;
let keyUpCount = 0;

editor.addEventListener('beforeinput', (e) => {
  lastInputType = e.inputType || '';
  if (e.inputType === 'insertCompositionText') {
    // IME组合
    isComposing = true;
  } else if (e.inputType === 'insertText') {
    // 普通键盘输入
    if (isComposing && lastInputType !== 'insertCompositionText') {
      // 没有compositionstart就出现insertText = 可能是重音菜单
      console.warn('Potential accent menu usage without composition events');
    }
  }
});

editor.addEventListener('compositionstart', () => {
  isComposing = true;
  console.log('Composition started');
});

editor.addEventListener('compositionupdate', (e) => {
  console.log('Composition update:', e.data);
});

editor.addEventListener('compositionend', () => {
  isComposing = false;
  console.log('Composition ended');
});

// 检测重音菜单（替代方案）
editor.addEventListener('keydown', (e) => {
  keyDownCount++;
  
  const isAccentMenu = e.altKey || isVowelKey(e.key) || isLongKeyPress();
  
  if (isAccentMenu) {
    console.log('Potential accent menu usage detected');
  }
});

editor.addEventListener('keyup', (e) => {
  keyUpCount++;
});

function isVowelKey(key) {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  return vowels.includes(key.toLowerCase());
}

function isLongKeyPress() {
  return keyDownCount > keyUpCount + 1;
}
```
