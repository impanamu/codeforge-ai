import {
  ArrowRight,
  GitBranch,
  KeyRound,
  Network,
  Search,
} from "lucide-react";

interface Props {
  onPromptClick: (prompt: string) => void;
}

const prompts = [
  {
    icon: <KeyRound className="h-5 w-5" />,
    title: "Explain JWT Authentication",
    prompt: "Explain JWT authentication in this project.",
  },
  {
    icon: <GitBranch className="h-5 w-5" />,
    title: "Project Architecture",
    prompt: "Explain the project architecture.",
  },
  {
    icon: <Network className="h-5 w-5" />,
    title: "Explain RAG Pipeline",
    prompt: "Explain how the RAG pipeline works.",
  },
  {
    icon: <Search className="h-5 w-5" />,
    title: "Find API Endpoints",
    prompt: "List all API endpoints.",
  },
];

export function ChatWelcome({ onPromptClick }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6">
      <div className="mb-12 text-center">
        <div className="mb-6 text-6xl">🤖</div>

        <h1 className="text-4xl font-bold tracking-tight">
          CodeForge AI
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Understand your repository using AI. Ask questions about
          architecture, authentication, APIs, implementation details,
          or any part of your codebase.
        </p>
      </div>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
        {prompts.map((item) => (
          <button
            key={item.title}
            onClick={() => onPromptClick(item.prompt)}
            className="group rounded-2xl border bg-card p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {item.icon}
            </div>

            <h3 className="text-lg font-semibold">
              {item.title}
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Click to instantly ask CodeForge AI.
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Ask now
              <ArrowRight className="h-4 w-4" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}