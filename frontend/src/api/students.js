const BASE_URL = "http://localhost:8000";

async function request(url, options = {}) {
  const res = await fetch(`${BASE_URL}${url}`, options);

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}

export function getStudents() {
  return request("/students");
}

export function createStudent(student) {
  return request("/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });
}

export function deleteStudent(id) {
  return request(`/students/${id}`, { method: "DELETE" });
}
