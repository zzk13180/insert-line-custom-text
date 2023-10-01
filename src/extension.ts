import * as vscode from "vscode";
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "insert-line-custom-text.insert",
    async () => {
      const activeTextEditor = vscode.window.activeTextEditor;
      if (!activeTextEditor) return;

      const activeDocument = activeTextEditor.document;
      const selections = activeTextEditor.selections;
      if (!selections.length || !activeDocument) return;

      const customText = vscode.workspace
        .getConfiguration()
        .get("insert-line-custom-text.text") as string;
      const regex = /{}/g;

      const curLineData = (selection: vscode.Selection) => {
        const { line, character } = selection.active;
        const text = activeDocument.getText(
          new vscode.Range(line, 0, line, character)
        );
        const blankText = text.substring(0, text.search(/\S/i));
        const selectedText = activeDocument.getText(selection);
        const newText = `${blankText}${customText.replace(
          regex,
          selectedText
        )}\n`;
        return { line, newText };
      };

      const curLineDatas = selections.map(curLineData).sort((a, b) => {
        return a.line - b.line;
      });

      const newPositions = [];
      for (let i = 0; i < curLineDatas.length; i++) {
        const { line, newText } = curLineDatas[i];
        const newline = line + 1 + i;
        await activeTextEditor.edit((edit) => {
          edit.insert(new vscode.Position(newline, 0), newText);
        });
        newPositions.push(new vscode.Position(newline, newText.length));
      }

      activeTextEditor.selections = newPositions.map(
        (position) => new vscode.Selection(position, position)
      );
    }
  );
  context.subscriptions.push(disposable);
}
