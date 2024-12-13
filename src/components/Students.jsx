import React, { useState, useEffect } from "react";
import WeeklySchedule from "./WeeklySchedule";
import "./StudentManagement.css";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [newStudent, setNewStudent] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Sayfa ilk yüklendiğinde localStorage'dan öğrencileri al
  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem("students"));
    if (storedStudents) {
      setStudents(storedStudents);
    }
  }, []);

  // Öğrencileri localStorage'a kaydet
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem("students", JSON.stringify(students));
    }
  }, [students]);

  // Yeni öğrenci ekleme
  const addStudent = () => {
    if (newStudent.trim()) {
      const newStudentData = {
        id: Date.now(),
        name: newStudent,
        weeklySchedule: Array.from({ length: 16 }, () => Array(5).fill(null)),
      };
      setStudents([...students, newStudentData]);
      setNewStudent("");
    }
  };

  const deleteStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  // Öğrenci arama
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Student Management</h2>

      {/* Öğrenci düzenleme yoksa ekleme ve arama kısmını göster */}
      {!selectedStudent && (
        <>
          <div className="form-group">
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
        </>
      )}

      {/* Öğrenci Listesi */}
      {!selectedStudent && (
        <ul>
          {filteredStudents.map((student) => (
            <li key={student.id}>
              {student.name}
              <div>
                <button onClick={() => setSelectedStudent(student)}>Edit</button>
                <button onClick={() => deleteStudent(student.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

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
            setSelectedStudent(null);  // Düzenleme bittiğinde öğrenci listesini göstermek için
          }}
        />
      )}
    </div>
  );
}

export default Students;
