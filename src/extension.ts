import * as vscode from "vscode";
import { activateTTS, deactivateTTS } from "./ttsFeature";

export function activate(context: vscode.ExtensionContext) {
  // Activate TTS feature
  activateTTS(context);

  const disposable = vscode.commands.registerCommand(
    "insert-line-custom-text.insert",
    async () => {
      const activeTextEditor = vscode.window.activeTextEditor;
      if (!activeTextEditor) {
        return;
      }

      const activeDocument = activeTextEditor.document;
      const selections = activeTextEditor.selections;
      if (!selections.length || !activeDocument) {
        return;
      }

      const customText = vscode.workspace
        .getConfiguration()
        .get("insert-line-custom-text.text") as string;

      if (!customText) {
        return;
      }

      const regex = /{}/g;

      const curLineData = (selection: vscode.Selection) => {
        const { line, character } = selection.active;
        const text = activeDocument.getText(
          new vscode.Range(line, 0, line, character)
        );
        const firstNonWhitespace = text.search(/\S/i);
        const blankText =
          firstNonWhitespace === -1
            ? text
            : text.substring(0, firstNonWhitespace);
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

      await activeTextEditor.edit((editBuilder) => {
        curLineDatas.forEach(({ line, newText }) => {
          if (line >= activeDocument.lineCount - 1) {
            const lineLength = activeDocument.lineAt(line).text.length;
            const textToInsert =
              "\n" + newText.substring(0, newText.length - 1);
            editBuilder.insert(
              new vscode.Position(line, lineLength),
              textToInsert
            );
          } else {
            editBuilder.insert(new vscode.Position(line + 1, 0), newText);
          }
        });
      });

      const newPositions = curLineDatas.map(({ line, newText }, i) => {
        const newline = line + 1 + i;
        const charPos = Math.max(0, newText.length - 1);
        return new vscode.Position(newline, charPos);
      });

      activeTextEditor.selections = newPositions.map(
        (position) => new vscode.Selection(position, position)
      );
    }
  );
  context.subscriptions.push(disposable);
}
