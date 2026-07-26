from pathlib import Path


class FileService:
    ALLOWED_EXTENSIONS = {
        ".py",
        ".js",
        ".jsx",
        ".ts",
        ".tsx",
        ".java",
        ".cpp",
        ".c",
        ".cs",
        ".go",
        ".rs",
        ".html",
        ".css",
        ".scss",
        ".md",
        ".json",
        ".yaml",
        ".yml",
        ".sql",
        ".xml",
        ".toml",
        ".ini",
        ".txt",
        ".gitignore",
        ".sh",
    }

    IGNORED_DIRECTORIES = {
        ".git",
        "node_modules",
        "__pycache__",
        ".venv",
        "venv",
        "dist",
        "build",
        ".idea",
        ".vscode",
        ".next",
        "coverage",
        ".pytest_cache",
        ".github",
    }

    MAX_FILE_SIZE = 1024 * 1024      # 1 MB
    MAX_JSON_SIZE = 200 * 1024       # 200 KB

    def is_binary(self, path: Path) -> bool:
        try:
            with open(path, "rb") as f:
                chunk = f.read(4096)
            return b"\x00" in chunk
        except Exception:
            return True

    def get_repository_files(self, repository_path: str) -> list[Path]:
        repository = Path(repository_path)

        files = []

        for path in repository.rglob("*"):

            if not path.is_file():
                continue

            if any(part in self.IGNORED_DIRECTORIES for part in path.parts):
                continue

            if path.suffix.lower() not in self.ALLOWED_EXTENSIONS:
                continue

            try:
                size = path.stat().st_size
            except OSError:
                continue

            if path.suffix.lower() == ".json" and size > self.MAX_JSON_SIZE:
                print(f"Skipping large JSON: {path}")
                continue

            if size > self.MAX_FILE_SIZE:
                print(f"Skipping large file: {path}")
                continue

            if self.is_binary(path):
                print(f"Skipping binary file: {path}")
                continue

            files.append(path)

        print(f"Total files selected: {len(files)}")

        return files