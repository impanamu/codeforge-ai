from pydantic import BaseModel


class ChatRequest(BaseModel):
    question: str


class SourceResponse(BaseModel):
    file_path: str
    start_line: int
    end_line: int


class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceResponse]