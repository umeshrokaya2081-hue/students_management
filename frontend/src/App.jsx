import { useEffect, useState } from "react";
import {
  getStudents,
  createStudent,
 deleteStudent,
} from "./api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    age: "",
    grade: "",
  });

  const loadStudents = async () => {
  try {
    const res = await getStudents();

    console.log("FULL RESPONSE:", res);
    console.log("IS ARRAY:", Array.isArray(res));

    setStudents(res);
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
  console.log("Component mounted");
  loadStudents();
}, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createStudent(form);
      setForm({ name: "", age: "", grade: "" });
      loadStudents();
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      loadStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Student Management System</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />

        <input
          type="text"
          name="grade"
          placeholder="Grade"
          value={form.grade}
          onChange={handleChange}
        />

        <button type="submit">Add Student</button>
      </form>
      {/* Keep button here */}
    <br />
    <button onClick={loadStudents}>View Students</button>


      <hr />

     <h2>Student List</h2>

{students.length > 0 ? (
  <table border="1" cellPadding="10">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Age</th>
        <th>Grade</th>
        <th>Action</th>
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
            <button onClick={() => handleDelete(student.id)}>
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p>No students found.</p>
)}
    </div>
  );
}

export default App;