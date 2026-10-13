import time

from google import genai
from google.genai.errors import ClientError, ServerError

from app.core.config import settings
from app.services.llm.base import BaseLLMProvider


class GeminiProvider(BaseLLMProvider):
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise RuntimeError("GEMINI_API_KEY is not configured.")

        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

        # Verify these model IDs against the models available to your API key.
        self.models = [
            "gemini-flash-latest",
            "gemini-3.8-flash",
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
                        print(f"Gemini succeeded using {model}")
                        return response.text

                    last_error = RuntimeError(
                        f"Gemini returned an empty response for {model}"
                    )
                    print(f"{model} returned an empty response.")
                    break

                except ClientError as exc:
                    last_error = exc
                    status_code = getattr(exc, "code", None)

                    if status_code == 429:
                        if attempt < 2:
                            wait_seconds = 2 ** attempt
                            print(
                                f"{model} rate limited. "
                                f"Retrying in {wait_seconds}s "
                                f"({attempt + 1}/3)."
                            )
                            time.sleep(wait_seconds)
                            continue

                        print(f"{model} rate limit retries exhausted.")
                        break

                    if status_code == 404:
                        print(
                            f"{model} is unavailable. "
                            "Trying the next Gemini model."
                        )
                        break

                    # Keep invalid-key and permission errors visible.
                    raise

                except ServerError as exc:
                    last_error = exc

                    if attempt < 2:
                        wait_seconds = 2 ** attempt
                        print(
                            f"{model} server error. "
                            f"Retrying in {wait_seconds}s "
                            f"({attempt + 1}/3)."
                        )
                        time.sleep(wait_seconds)
                        continue

                    print(f"{model} server retries exhausted.")
                    break

        raise RuntimeError(
            f"All configured Gemini models failed. Last error: {last_error}"
        ) from last_error
