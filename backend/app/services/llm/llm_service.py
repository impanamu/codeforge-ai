from app.services.llm.gemini_provider import GeminiProvider
from app.services.llm.ollama_provider import OllamaProvider


class LLMService:
    def __init__(self):
        self.ollama = OllamaProvider()
        self.gemini = None

        try:
            self.gemini = GeminiProvider()
        except Exception as e:
            print(f"Gemini initialization failed: {e}")
            print("Ollama will be used as the fallback provider.")

    def generate_response(self, prompt: str) -> str:
        if self.gemini is not None:
            try:
                return self.gemini.generate_response(prompt)
            except Exception as e:
                print(f"Gemini failed: {e}")
                print("Falling back to Ollama...")

        return self.ollama.generate_response(prompt)