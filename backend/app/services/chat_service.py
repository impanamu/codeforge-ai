from sqlalchemy.orm import Session

from app.services.llm.llm_service import LLMService
from app.services.prompt_service import PromptService
from app.services.search_service import SearchService


class ChatService:
    def __init__(self, db: Session):
        self.search_service = SearchService(db)
        self.prompt_service = PromptService()
        self.llm_service = LLMService()

    def chat(
        self,
        repository_id: int,
        question: str,
    ) -> dict:
        results = self.search_service.search(
            repository_id=repository_id,
            question=question,
        )

        MAX_CONTEXT_CHARS = 10000

        contexts = []
        current_size = 0

        for result in results:
            context = f"""File: {result.file_path}
Lines: {result.start_line}-{result.end_line}

{result.content}
"""

            if current_size + len(context) > MAX_CONTEXT_CHARS:
                break

            contexts.append(context)
            current_size += len(context)

        prompt = self.prompt_service.build_prompt(
            question=question,
            contexts=contexts,
        )

        answer = self.llm_service.generate_response(prompt)

        sources = [
            {
                "file_path": result.file_path,
                "start_line": result.start_line,
                "end_line": result.end_line,
            }
            for result in results
        ]

        return {
            "answer": answer,
            "sources": sources,
        }