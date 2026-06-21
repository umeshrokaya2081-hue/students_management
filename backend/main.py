from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from database import get_db, engine, Base
from models import Student as DBStudent
from schemas import StudentCreate

app = FastAPI()

# create tables
Base.metadata.create_all(bind=engine)

#Home
@app.get("/")
def home():
    return {"message": "Student Management API"}

#CREATE
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

    return {"message": "Student added successfully"}

#READ ALL
@app.get("/students")
def get_students(db: Session = Depends(get_db)):

    students = db.query(DBStudent).all()

    return students

#UPDATE
@app.put("/students/{student_id}")
def update_student(student_id: int, updated_student: StudentCreate, db: Session = Depends(get_db)):

    student = db.query(DBStudent).filter(DBStudent.id == student_id).first()

    if not student:
        return {"error": "Student not found"}

    student.name = updated_student.name
    student.age = updated_student.age
    student.grade = updated_student.grade

    db.commit()
    db.refresh(student)

    return {
        "message": "Student updated successfully",
        "student": student
    }

#DELETE
@app.delete("/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):

    student = db.query(DBStudent).filter(DBStudent.id == student_id).first()

    if not student:
        return {"error": "Student not found"}

    db.delete(student)
    db.commit()

    return {"message": "Student deleted successfully"}
