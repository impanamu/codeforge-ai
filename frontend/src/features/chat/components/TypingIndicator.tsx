import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
        <Bot className="h-5 w-5 text-primary" />
      </div>

      <div className="rounded-2xl border bg-card px-5 py-4 shadow-sm">
        <div className="mb-3 font-semibold text-primary">
          CodeForge AI
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary" />
          <span
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: "0.15s" }}
          />
          <span
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: "0.3s" }}
          />
        </div>
      </div>
    </div>
  );
}