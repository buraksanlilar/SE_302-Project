import React, { useState, useContext } from "react";
import { StudentsContext } from "../context/StudentsContext";
import { ClassroomContext } from "../context/ClassroomContext";
import WeeklySchedule from "./WeeklySchedule";
import "./StudentManagement.css";

function Students() {
  const { classrooms } = useContext(ClassroomContext);
  const { students, addStudent, deleteStudent, updateStudent } =
    useContext(StudentsContext);

  const [search, setSearch] = useState("");
  const [newStudent, setNewStudent] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleAddStudent = () => {
    if (!newStudent.trim()) {
      setMessage({ text: "Student name cannot be empty!", type: "error" });
      return;
    }

    const newStudentData = {
      id: Date.now(),
      name: newStudent.trim(),
      weeklySchedule: Array.from({ length: 16 }, () => Array(5).fill(null)),
    };
    addStudent(newStudentData);
    setNewStudent("");
    setMessage({
      text: `"${newStudentData.name}" has been successfully added.`,
      type: "success",
    });
    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);
  };

  const normalizeString = (str) => {
    return str
      .toLocaleLowerCase("tr-TR") // Türkçe dil kurallarına göre küçültme
      .normalize("NFKD") // Unicode normalization
      .replace(/[\u0300-\u036f]/g, ""); // Diakritik işaretlerini kaldırır
  };

  const filteredStudents = students.filter((student) => {
    const studentNameNormalized = normalizeString(student.name);
    const searchNormalized = normalizeString(search);
    const isMatch = studentNameNormalized.includes(searchNormalized);
    return isMatch;
  });

  return (
    <div className="container">
      <h2>Student Management</h2>

      {/* Mesaj Gösterimi */}
      {message.text && (
        <p style={{ color: message.type === "success" ? "green" : "red" }}>
          {message.text}
        </p>
      )}

      {!selectedStudent && (
        <>
          <div className="form-group">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students..."
            />
            <input
              type="text"
              value={newStudent}
              onChange={(e) => setNewStudent(e.target.value)}
              placeholder="Add new student..."
            />
            <button onClick={handleAddStudent}>Add Student</button>
          </div>
          <ul>
            {filteredStudents.map((student) => (
              <li key={student.id}>
                {student.name}
                <div>
                  <button onClick={() => setSelectedStudent(student)}>
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      deleteStudent(student.id);
                      setMessage({
                        text: `"${student.name}" has been deleted.`,
                        type: "success",
                      });
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {selectedStudent && (
        <WeeklySchedule
          student={selectedStudent}
          classrooms={classrooms}
          updateSchedule={(updatedSchedule) => {
            const updatedStudent = {
              ...selectedStudent,
              weeklySchedule: updatedSchedule,
            };
            updateStudent(updatedStudent);
            setMessage({
              text: `Schedule for "${selectedStudent.name}" has been updated.`,
              type: "success",
            });
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
}

export default Students;
