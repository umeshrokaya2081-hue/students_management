import { useEffect, useState } from "react";
import { createStudent, deleteStudent, getStudents } from "../api/students";

const emptyForm = { name: "", age: "", grade: "" };

export default function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadStudents() {
    setLoading(true);
    setError("");
    try {
      const data = await getStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load students. Is the backend running on http://localhost:8000?");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await createStudent({
        name: form.name.trim(),
        age: Number(form.age),
        grade: form.grade.trim(),
      });
      setForm(emptyForm);
      await loadStudents();
    } catch {
      setError("Failed to add student. Check that name, age, and grade are filled in.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setError("Failed to delete student.");
    }
  }

  return (
    <div className="students-page">
      <header>
        <h1>Student Management</h1>
        <p>Add, view, and remove students.</p>
      </header>

      {error && <p className="error">{error}</p>}

      <section className="card">
        <h2>Add student</h2>
        <form onSubmit={handleSubmit} className="student-form">
          <label>
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              required
            />
          </label>
          <label>
            Age
            <input
              name="age"
              type="number"
              min="1"
              value={form.age}
              onChange={handleChange}
              placeholder="18"
              required
            />
          </label>
          <label>
            Grade
            <input
              name="grade"
              value={form.grade}
              onChange={handleChange}
              placeholder="A"
              required
            />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add student"}
          </button>
        </form>
      </section>

      <section className="card">
        <h2>All students</h2>
        {loading ? (
          <p>Loading students...</p>
        ) : students.length === 0 ? (
          <p>No students yet. Add one above.</p>
        ) : (
          <table className="students-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Grade</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.age}</td>
                  <td>{student.grade}</td>
                  <td>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => handleDelete(student.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
