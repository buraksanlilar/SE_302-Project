import React, { useState, useContext } from "react";
import { StudentsContext } from "../context/StudentsContext";
import { ClassroomContext } from "../context/ClassroomContext";
import WeeklySchedule from "./weeklySchedule";
import "./StudentManagement.css";

function Students() {
  const { classrooms } = useContext(ClassroomContext);
  const { students, addStudent, deleteStudent, updateStudent } =
    useContext(StudentsContext);

  const [search, setSearch] = useState("");
  const [newStudent, setNewStudent] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleAddStudent = () => {
    if (newStudent.trim()) {
      const newStudentData = {
        id: Date.now(),
        name: newStudent.trim(),
        weeklySchedule: Array.from({ length: 16 }, () => Array(5).fill(null)),
      };
      addStudent(newStudentData);
      setNewStudent("");
    }
  };

  const filteredStudents = search.trim()
    ? students.filter((student) =>
        student.name.toLowerCase().includes(search.toLowerCase().trim())
      )
    : students;

  return (
    <div className="container">
      <h2>Student Management</h2>

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
                  <button onClick={() => deleteStudent(student.id)}>
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
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
}

export default Students;
