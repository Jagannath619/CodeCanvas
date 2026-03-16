from pydantic import BaseModel


class StatusResponse(BaseModel):
    status: str
    message: str = ""


class PaginatedResponse(BaseModel):
    items: list
    total: int
    page: int = 1
    per_page: int = 20
