import { useState } from "react";

import { ChatHeader } from "../components/ChatHeader";
import { ChatInput } from "../components/ChatInput";
import { ChatMessages } from "../components/ChatMessages";
import { ChatWelcome } from "../components/ChatWelcome";
import { useChat } from "../hooks/useChat";

import type { ChatMessage } from "../types";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const repositoryId = 1;

  const chat = useChat();

  async function sendMessage(question: string) {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await chat.mutateAsync({
        repositoryId,
        question,
      });

      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.answer,
        sources: response.sources,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, something went wrong.",
        },
      ]);
    }
  }

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col bg-background">

      <ChatHeader />

      <main className="flex-1 overflow-hidden">
        {messages.length === 0 ? (
          <ChatWelcome onPromptClick={sendMessage} />
        ) : (
          <ChatMessages
            messages={messages}
            loading={chat.isPending}
          />
        )}
      </main>

      <footer className="border-t bg-background px-8 py-6">
        <ChatInput
          onSend={sendMessage}
          disabled={chat.isPending}
        />
      </footer>

    </div>
  );
}