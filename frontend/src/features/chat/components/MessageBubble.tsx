import { Bot, User } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { SourceCard } from "./SourceCard";

import type { ChatMessage } from "../types";

interface Props {
  message: ChatMessage;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-4xl gap-4 ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary"
          }`}
        >
          {isUser ? (
            <User size={18} />
          ) : (
            <Bot size={18} />
          )}
        </div>

        <div
          className={`rounded-3xl border px-6 py-5 shadow-sm ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-card"
          }`}
        >
          {!isUser && (
            <div className="mb-4 text-sm font-semibold text-primary">
              CodeForge AI
            </div>
          )}

          {isUser ? (
            <p className="whitespace-pre-wrap leading-7">
              {message.content}
            </p>
          ) : (
            <MarkdownRenderer
              content={message.content}
            />
          )}

          {message.sources?.length ? (
            <div className="mt-5 space-y-3">
              {message.sources.map((source) => (
                <SourceCard
                  key={`${source.file_path}-${source.start_line}`}
                  source={source}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}