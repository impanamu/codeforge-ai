from ollama import Client

from app.services.llm.base import BaseLLMProvider


class OllamaProvider(BaseLLMProvider):
    def __init__(
        self,
        host: str = "http://localhost:11434",
        model: str = "qwen2.5:3b",
    ):
        self.client = Client(host=host)
        self.model = model

    def generate_response(self, prompt: str) -> str:
        response = self.client.chat(
            model=self.model,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )

        return response["message"]["content"]