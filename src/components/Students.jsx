import React, { useState } from "react";
import WeeklySchedule from "./weeklySchedule";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [newStudent, setNewStudent] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Yeni öğrenci ekleme
  const addStudent = () => {
    if (newStudent.trim()) {
      setStudents([
        ...students,
        {
          id: Date.now(),
          name: newStudent,
          weeklySchedule: Array.from({ length: 16 }, () => Array(5).fill(null)),
        },
      ]);
      setNewStudent("");
    }
  };

  // Öğrenci silme
  const deleteStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  // Öğrenci arama
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Student Management</h2>

      {/* Yeni Öğrenci Ekleme */}
      <div>
        <input
          type="text"
          placeholder="Enter student name"
          value={newStudent}
          onChange={(e) => setNewStudent(e.target.value)}
        />
        <button onClick={addStudent}>Add Student</button>
      </div>

      {/* Öğrenci Arama */}
      <input
        type="text"
        placeholder="Search student"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Öğrenci Listesi */}
      <ul>
        {filteredStudents.map((student) => (
          <li key={student.id}>
            {student.name}
            <button onClick={() => setSelectedStudent(student)}>
              Edit Schedule
            </button>
            <button onClick={() => deleteStudent(student.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Weekly Schedule Düzenleme */}
      {selectedStudent && (
        <WeeklySchedule
          student={selectedStudent}
          updateSchedule={(updatedSchedule) => {
            setStudents(
              students.map((s) =>
                s.id === selectedStudent.id
                  ? { ...s, weeklySchedule: updatedSchedule }
                  : s
              )
            );
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
}

export default Students;
