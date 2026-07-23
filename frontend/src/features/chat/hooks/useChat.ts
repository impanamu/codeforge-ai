import { useMutation } from "@tanstack/react-query";
import { chatWithRepository } from "@/features/repositories/api/repositoryApi";

export function useChat() {
  return useMutation({
    mutationFn: ({
      repositoryId,
      question,
    }: {
      repositoryId: number;
      question: string;
    }) =>
      chatWithRepository(repositoryId, {
        question,
      }),
  });
}