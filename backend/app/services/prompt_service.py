class PromptService:
    @staticmethod
    def build_prompt(
        question: str,
        contexts: list[str],
    ) -> str:
        context = "\n\n".join(contexts)

        return f"""
You are CodeForge AI, an expert software engineering assistant.

Answer ONLY using the repository context provided below.

If the answer cannot be found in the repository, say:

"I couldn't find enough information in the repository."

Repository Context:
--------------------
{context}

--------------------

User Question:
{question}

Answer:
""".strip()