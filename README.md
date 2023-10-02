# Insert Line Custom Text

[中文文档](README_CN.md)

- **Smart Insertion**: Quickly generate and insert code on the next line based on selected text (e.g., `console.log`).
- **Highly Customizable**: Supports custom text templates using `{}` as flexible placeholders.
- **TTS Reading**: Automatically reads selected English text in Markdown files (macOS exclusive).

## Usage Guide

### 1. Insert Line Custom Text

This is the core feature of the extension. Select a piece of code, press the shortcut, and the extension will automatically read the configured template, fill in the selected text, and insert it on the next line.

*   **Default Shortcut**: `Shift + Space`
*   **Default Behavior**: Generates `console.log` debug statements.

#### Example

Assuming your configuration is the default `console.log('{}', {})`.

**Before Operation**:
Select variable `userName`:
```javascript
const userName = "John Doe";
```

**After pressing `Shift + Space`**:
```javascript
const userName = "John Doe";
console.log('userName', userName); // Automatically inserted this line
```

#### Configuration

You can customize the insertion text template by modifying VS Code settings.

1.  Open Settings: `Cmd + ,` (macOS) / `Ctrl + ,` (Windows).
2.  Search for `insert-line-custom-text`.
3.  Modify the **Text** option.

**Common Template References:**
*   Python Print: `print(f"{}: {{}}")`
*   React Component: `<{} prop={{}} />`
*   Go Print: `fmt.Printf("v: %+v\n", v)`

![example](https://cdn.zhangzhankui.com/insert-line-custom-text.gif)

### 2. Markdown English TTS (Text-to-Speech)

This is an auxiliary feature for learning and reading, effective only on **macOS**.

- **How to Trigger**: In a `.md` (Markdown) file, select a piece of English text (word, phrase, or sentence) with the mouse.
- **Effect**: The system will automatically call the macOS `say` command to read the selected content.
- **Stop Reading**: If you want to stop midway, you can run the command `Stop TTS`.

Note: This feature automatically filters non-English content and is only active in Markdown files.

## Development & Installation Guide

### 1. Environment Preparation
Ensure Node.js and the VS Code extension packaging tool `vsce` are installed.
```bash
npm install -g vsce
```

### 2. Install Dependencies
After downloading the source code, run in the project root directory:
```bash
npm install
```

### 3. Debugging
Press `F5` to enter debug mode, which will open a new VS Code window where you can test the extension features.

### 4. Packaging the Extension
Before packaging, you must compile the TypeScript code to generate the `out` directory.

```bash
# 1. Compile code
npm run watch
# Or run one-time compilation
# tsc -p ./

# 2. Package to generate .vsix file
vsce package
```
After successful packaging, a file like `insert-line-custom-text-0.0.2.vsix` will be generated.

### 5. Manual Installation
1.  Open the Extensions view in VS Code (`Cmd+Shift+X`).
2.  Click the "..." menu in the top right corner.
3.  Select **"Install from VSIX..."**.
4.  Select the generated `.vsix` file.

## Advanced: TTS Feature Management

The TTS feature is enabled by default. If you don't need it, or want to port it to another project, refer to the following instructions.

### Remove TTS Feature
Modify the `src/extension.ts` file and comment out the activation code:

```typescript
// src/extension.ts
export function activate(context: vscode.ExtensionContext) {
  // activateTTS(context); // <-- Comment out this line
  
  // ... other code
}
```
