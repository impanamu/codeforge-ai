from app.services.embedding_service import EmbeddingService

service = EmbeddingService()

embedding = service.generate_embedding(
    "def login(username, password):"
)

print(len(embedding))
print(embedding[:10])