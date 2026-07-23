import { useState } from "react";
import type { KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({
  onSend,
  disabled = false,
}: Props) {
  const [message, setMessage] = useState("");

  function send() {
    const text = message.trim();

    if (!text || disabled) return;

    onSend(text);
    setMessage("");
  }

  function handleKeyDown(
    e: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex items-end gap-3 rounded-2xl border bg-background p-3 shadow-sm transition-all focus-within:border-primary">

        <textarea
          rows={1}
          value={message}
          disabled={disabled}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask CodeForge AI about this repository..."
          className="max-h-40 flex-1 resize-none bg-transparent px-2 py-2 outline-none"
        />

        <button
          onClick={send}
          disabled={disabled || !message.trim()}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:scale-105 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SendHorizontal size={18} />
        </button>
      </div>

      <p className="mt-2 text-center text-xs text-muted-foreground">
        Press <kbd className="rounded border px-1">Enter</kbd> to send •{" "}
        <kbd className="rounded border px-1">Shift + Enter</kbd> for a new line
      </p>
    </div>
  );
}