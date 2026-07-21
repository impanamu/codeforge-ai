import time

from google import genai
from google.genai.errors import ClientError, ServerError

from app.core.config import settings
from app.services.llm.base import BaseLLMProvider


class GeminiProvider(BaseLLMProvider):
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

        self.models = [
            "models/gemini-flash-latest",
            "models/gemini-2.0-flash",
        ]

    def generate_response(self, prompt: str) -> str:
        last_error = None

        for model in self.models:
            print(f"Trying Gemini model: {model}")

            for attempt in range(3):
                try:
                    response = self.client.models.generate_content(
                        model=model,
                        contents=prompt,
                    )

                    if response.text:
                        print(f"Success using {model}")
                        return response.text

                except ServerError as e:
                    last_error = e
                    print(f"{model} unavailable. Retry {attempt + 1}/3")
                    time.sleep(2)

                except ClientError as e:
                    last_error = e

                    # Retry only rate limits
                    if getattr(e, "code", None) == 429:
                        print(f"{model} rate limited. Retry {attempt + 1}/3")
                        time.sleep(2)
                        continue

                    # Invalid key, invalid model, etc.
                    raise

        raise RuntimeError(f"Gemini unavailable.\n\n{last_error}")