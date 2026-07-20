from pathlib import Path


class FileService:
    ALLOWED_EXTENSIONS = {
        ".py",
        ".js",
        ".ts",
        ".tsx",
        ".jsx",
        ".java",
        ".cpp",
        ".c",
        ".cs",
        ".go",
        ".rs",
        ".html",
        ".css",
        ".json",
        ".md",
        ".yml",
        ".yaml",
        ".sql",
        ".txt",
        ".gitignore",
        ".toml",
        ".xml",
        ".sh",
        ".ini",
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
    }

    def get_repository_files(self, repository_path: str) -> list[Path]:
        files = []

        for path in Path(repository_path).rglob("*"):
            if not path.is_file():
                continue

            if any(part in self.IGNORED_DIRECTORIES for part in path.parts):
                continue

            if path.suffix.lower() not in self.ALLOWED_EXTENSIONS:
                continue

            files.append(path)

        return files