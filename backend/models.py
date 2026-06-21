from sqlalchemy import Column, Integer, String
from database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True) #AUTO-INCREMENT
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    grade = Column(String, nullable=False)