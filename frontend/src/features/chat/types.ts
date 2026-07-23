export interface ChatRequest {
  question: string;
}

export interface Source {
  file_path: string;
  start_line: number;
  end_line: number;
}

export interface ChatResponse {
  answer: string;
  sources: Source[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}