from pydantic import BaseModel

class StudentCreate(BaseModel):
    id: int
    name: str
    age: int
    grade: str