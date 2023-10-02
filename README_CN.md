# Insert Line Custom Text

[English](README.md)

- 智能插入：根据选中文本快速生成并插入下一行代码（如 `console.log`）。
- 高度自定义：支持自定义文本模板，使用 `{}` 作为灵活的占位符。
- TTS 朗读：在 Markdown 文件中选中英文时自动朗读（macOS 独占）。

## 使用指南

### 1. 自定义文本插入 (Insert Line Custom Text)

这是插件的核心功能。选中一段代码，按下快捷键，插件会自动读取配置的模板，将选中文本填充进去，并插入到下一行。

*   **默认快捷键**：`Shift + Space`
*   **默认行为**：生成 `console.log` 调试语句。

#### 示例

假设你的配置是默认的 `console.log('{}', {})`。

**操作前**：
选中变量 `userName`：
```javascript
const userName = "John Doe";
```

**按下 `Shift + Space` 后**：
```javascript
const userName = "John Doe";
console.log('userName', userName); // 自动插入这一行
```

#### 配置

你可以通过修改 VS Code 的设置来自定义插入的文本模板。

1.  打开设置 (Settings)：`Cmd + ,` (macOS) / `Ctrl + ,` (Windows)。
2.  搜索 `insert-line-custom-text`。
3.  修改 **Text** 选项。

**常用模板参考：**
*   Python 打印：`print(f"{}: {{}}")`
*   React 组件：`<{} prop={{}} />`
*   Go 打印：`fmt.Printf("v: %+v\n", v)`

![example](https://cdn.zhangzhankui.com/insert-line-custom-text.gif)

### 2. Markdown 英文朗读 (TTS)

这是一个辅助学习和阅读的功能，仅在 **macOS** 系统下生效。

- 如何触发：在 `.md` (Markdown) 文件中，用鼠标选中一段英文文本（支持单词、短语或句子）。
- 效果：系统会自动调用 macOS 的 `say` 命令朗读选中的内容。
- 停止朗读：如果想中途停止，可以运行命令 `Stop TTS`。

注意：此功能会自动过滤非英文内容，且仅在 Markdown 文件中激活。

## 开发与安装指南

### 1. 环境准备
确保已安装 Node.js 和 VS Code 扩展打包工具 `vsce`。
```bash
npm install -g vsce
```

### 2. 安装依赖
下载源码后，在项目根目录运行：
```bash
npm install
```

### 3. 调试运行
按 `F5` 进入调试模式，会打开一个新的 VS Code 窗口，你可以在其中测试插件功能。

### 4. 打包插件
在打包之前，必须先编译 TypeScript 代码生成 `out` 目录。

```bash
# 1. 编译代码
npm run watch
# 或者运行一次性编译
# tsc -p ./

# 2. 打包生成 .vsix 文件
vsce package
```
打包成功后，会生成一个类似 `insert-line-custom-text-0.0.2.vsix` 的文件。

### 5. 手动安装
1.  在 VS Code 中打开扩展视图 (`Cmd+Shift+X`)。
2.  点击右上角的 "..." 菜单。
3.  选择 **"从 VSIX 安装..." (Install from VSIX...)**。
4.  选择刚才生成的 `.vsix` 文件即可。

## 进阶：TTS 功能管理

TTS 功能默认开启。如果你不需要它，或者想将其移植到其他项目，可以参考以下说明。

### 移除 TTS 功能
修改 `src/extension.ts` 文件，注释掉激活代码即可：

```typescript
// src/extension.ts
export function activate(context: vscode.ExtensionContext) {
  // activateTTS(context); // <-- 注释掉这一行
  
  // ... 其他代码
}
```
