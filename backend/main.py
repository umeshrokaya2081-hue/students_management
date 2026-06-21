from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from database import get_db, engine, Base
from models import Student as DBStudent
from schemas import StudentCreate

app = FastAPI()

# CORS (React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup
@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


# Home route
@app.get("/")
def home():
    return {"message": "Student Management API"}


# CREATE student
@app.post("/students")
def create_student(student: StudentCreate, db: Session = Depends(get_db)):

    new_student = DBStudent(
        name=student.name,
        age=student.age,
        grade=student.grade
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return {
        "message": "Student added successfully",
        "student": {
            "id": new_student.id,
            "name": new_student.name,
            "age": new_student.age,
            "grade": new_student.grade
        }
    }


# READ all students
@app.get("/students")
def get_students(db: Session = Depends(get_db)):

    students = db.query(DBStudent).all()

    return [
        {
            "id": s.id,
            "name": s.name,
            "age": s.age,
            "grade": s.grade
        }
        for s in students
    ]


# UPDATE student
@app.put("/students/{student_id}")
def update_student(
    student_id: int,
    updated_student: StudentCreate,
    db: Session = Depends(get_db)
):

    student = db.query(DBStudent).filter(DBStudent.id == student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student.name = updated_student.name
    student.age = updated_student.age
    student.grade = updated_student.grade

    db.commit()
    db.refresh(student)

    return {
        "message": "Student updated successfully",
        "student": {
            "id": student.id,
            "name": student.name,
            "age": student.age,
            "grade": student.grade
        }
    }


# DELETE student
@app.delete("/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):

    student = db.query(DBStudent).filter(DBStudent.id == student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    db.delete(student)
    db.commit()

    return {"message": "Student deleted successfully"}