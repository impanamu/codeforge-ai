from pydantic import BaseModel


class SearchRequest(BaseModel):
    question: str


class SearchResult(BaseModel):
    file_path: str
    start_line: int
    end_line: int
    content: str
    score: float = 0.0
    highlights: list[str] = []


class SearchResponse(BaseModel):
    results: list[SearchResult]