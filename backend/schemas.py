from pydantic import BaseModel
from typing import Union

class LoginRequest(BaseModel):
    username: str
    password: Union[str, int]
