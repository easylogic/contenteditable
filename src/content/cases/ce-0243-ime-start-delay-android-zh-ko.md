---
id: ce-0243-ime-start-delay-android-zh-ko
scenarioId: scenario-ime-start-delay-android
locale: zh
os: Android
osVersion: "10-14"
device: Mobile (Samsung Galaxy Tab S9)
deviceVersion: Any
browser: Chrome for Android
browserVersion: "120+"
keyboard: Chinese (Simplified) - Pinyin Input
caseTitle: Android中全选后IME启动延迟（中文）
description: "Android虚拟键盘在contenteditable元素中全选文本(Ctrl+A)后，输入第一个字母不会立即启动IME组合。第一个字母作为纯文本插入，只有从第二个字母开始IME组合。"
tags:
  - ime
  - composition
  - android
  - mobile
  - chinese
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    在此输入文本。例如，输入"你好"，然后全选(Ctrl+A)，再输入一个字母观察IME行为。
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true">你好</div>'
    description: "已输入文本"
  - label: "Step 1: 全选(Ctrl+A)"
    html: '<div contenteditable="true">你好</div>'
    description: "全文本已选中"
  - label: "Step 2: 输入第一个字母'n'"
    html: '<div contenteditable="true">你好n</div>'
    description: "❌ Bug: 第一个字母'n'作为纯文本插入，无IME候选项"
  - label: "Step 3: 输入第二个字母'i'"
    html: '<div contenteditable="true">你好ni</div>'
    description: "从第二个字母'i'开始IME组合"
  - label: "✅ Expected"
    html: '<div contenteditable="true">你好</div>'
    description: "预期：应从第一个字母开始IME组合"
---

## 现象

Android虚拟键盘在contenteditable元素中全选文本后，输入第一个字母不会立即启动IME组合。第一个字母作为纯文本插入，只有从第二个字母开始IME组合。

## 再现步骤

1. 在contenteditable元素中输入文本（例如："你好"）。
2. 按Ctrl+A全选文本。
3. 输入第一个字母（例如："n"）。

## 观察行为

- **第一个字母纯文本**: 'n'作为纯文本插入（不是IME组合的一部分）
- **选择保留**: "全选"的选择范围保持不变
- **IME延迟**: 从第二个字母开始显示IME候选项窗口，开始组合
- **结果**: 第一个字母保留为纯文本，从第二个字母开始IME组合

## 预期行为

- 输入第一个字母后应立即启动IME组合
- 选择范围应被IME组合替换

## 参考事项及可能解决方案

- **输入前清除选择**: 在用户开始新输入前清除现有选择
- **单独处理第一个字母**: 检测是否插入了纯文本，必要时删除
- **监听beforeinput事件**: 通过`inputType = 'insertText'`检测纯文本插入
- **用户引导**: 全选后开始新输入时显示UI提示

## 代码示例

```javascript
const editor = document.querySelector('div[contenteditable]');
let imeStarted = false;
let wasSelectAll = false;

// 检测全选
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'a') {
    wasSelectAll = true;
  }
});

// 追踪组合启动
editor.addEventListener('compositionstart', () => {
  imeStarted = true;
  // 如果有选择则清除
  const selection = window.getSelection();
  if (selection.rangeCount > 0 && !selection.isCollapsed) {
    selection.removeAllRanges();
  }
});

// 区分纯文本和IME
editor.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertText' && !imeStarted && wasSelectAll) {
    // IME启动前插入了纯文本
    console.warn('Plain text inserted before IME started:', e.data);
  }
});

editor.addEventListener('keydown', (e) => {
  if (wasSelectAll) {
    // 检测全选后第一个字母输入
    console.log('First letter after select all:', e.key);
    // 必要时添加清理逻辑
  }
});
```
