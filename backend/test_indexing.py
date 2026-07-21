from app.services.file_service import FileService

service = FileService()

files = service.get_repository_files("repositories/main")

print(f"Files: {len(files)}")

for file in files[:10]:
    print(file)