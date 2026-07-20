from pathlib import Path
from app.services.file_service import FileService

repo_path = "repositories/main"

print("Repository exists:", Path(repo_path).exists())

service = FileService()

files = service.get_repository_files(repo_path)

print(f"Files found: {len(files)}")

for file in files[:20]:  # Print only the first 20 files
    print(file)