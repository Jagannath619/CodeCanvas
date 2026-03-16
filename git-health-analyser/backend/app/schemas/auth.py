from pydantic import BaseModel


class UserResponse(BaseModel):
    id: str
    github_login: str
    display_name: str | None = None
    avatar_url: str | None = None

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
