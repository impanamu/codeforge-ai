from app.services.llm.gemini_provider import GeminiProvider
from app.services.llm.ollama_provider import OllamaProvider


class LLMService:
    def __init__(self):
        self.gemini = GeminiProvider()
        self.ollama = OllamaProvider()

    def generate_response(self, prompt: str) -> str:
        try:
            return self.gemini.generate_response(prompt)

        except RuntimeError as e:
            print(f"Gemini unavailable: {e}")
            print("Falling back to Ollama...")

            return self.ollama.generate_response(prompt)