// Markdown English TTS Extension for VSCode （only macOS）
import * as vscode from "vscode";
import { spawn, ChildProcess } from "child_process";

const outputChannel = vscode.window.createOutputChannel("TTS Feature");

class TtsController {
  private currentProcess: ChildProcess | null = null;
  private debounceTimer: NodeJS.Timeout | null = null;
  private lastText: string | null = null;
  private readonly debounceMs = 120;

  public scheduleSpeak(text: string) {
    const trimmed = text.trim();
    if (!this.isValidText(trimmed)) {
      return;
    }

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    if (this.lastText === trimmed) {
      return;
    }

    this.lastText = trimmed;

    this.debounceTimer = setTimeout(() => {
      this.debounceTimer = null;
      this.speak(trimmed);
    }, this.debounceMs);
  }

  public stop() {
    this.clearDebounce();
    this.stopProcess();
    this.lastText = null;
  }

  public resetLastText() {
    this.lastText = null;
  }

  public dispose() {
    this.stop();
  }

  private isValidText(text: string): boolean {
    // Relaxed validation:
    // 1. Must not be empty
    // 2. Must not be too long (e.g. < 1000 chars)
    // 3. Should contain at least one alphanumeric character (English or other languages supported by system)
    return text.length > 0 && text.length < 1000 && /[a-zA-Z0-9]/.test(text);
  }

  private clearDebounce() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  private speak(text: string) {
    this.stopProcess();
    outputChannel.appendLine(`[TTS] Speaking: "${text}"`);

    try {
      const args = ["-r", "140", text + " [[slnc 400]]"];
      const child = spawn("say", args, { stdio: "ignore" });
      this.currentProcess = child;

      child.once("close", () => {
        if (this.currentProcess === child) {
          this.currentProcess = null;
        }
      });

      child.once("error", (err) => {
        console.error("TTS Error:", err);
        outputChannel.appendLine(`[TTS] Error: ${err.message}`);
        if (this.currentProcess === child) {
          this.currentProcess = null;
        }
      });
    } catch (e) {
      console.error("TTS Exception:", e);
      outputChannel.appendLine(`[TTS] Exception: ${e}`);
      this.currentProcess = null;
    }
  }

  private stopProcess() {
    const child = this.currentProcess;
    if (!child) {
      return;
    }

    this.currentProcess = null;

    try {
      child.kill("SIGTERM");
      const timeout = setTimeout(() => {
        if (!child.killed) {
          try {
            child.kill("SIGKILL");
          } catch {
            // ignore
          }
        }
      }, 1500);

      child.once("close", () => {
        clearTimeout(timeout);
      });
    } catch {
      // ignore
    }
  }
}

let ttsController: TtsController | null = null;

export function activateTTS(context: vscode.ExtensionContext) {
  console.log("TTS: Activating TTS feature");
  ttsController = new TtsController();

  const selectionChangeDisposable =
    vscode.window.onDidChangeTextEditorSelection((event) => {
      if (!ttsController) {
        return;
      }

      const editor = event.textEditor;
      if (!editor || editor.document.languageId !== "markdown") {
        ttsController.stop();
        return;
      }

      const selection = editor.selection;
      if (selection.isEmpty) {
        ttsController.resetLastText();
        return;
      }

      const selectedText = editor.document.getText(selection).trim();
      if (!selectedText) {
        return;
      }

      ttsController.scheduleSpeak(selectedText);
    });

  const activeEditorChangeDisposable =
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (!ttsController) {
        return;
      }

      if (!editor || editor.document.languageId !== "markdown") {
        ttsController.stop();
      }
    });

  const stopCommand = vscode.commands.registerCommand(
    "md-english-tts.stop",
    () => {
      ttsController?.stop();
    }
  );

  context.subscriptions.push(
    selectionChangeDisposable,
    activeEditorChangeDisposable,
    stopCommand,
    outputChannel
  );
}

export function deactivateTTS() {
  if (ttsController) {
    ttsController.dispose();
    ttsController = null;
  }
}
