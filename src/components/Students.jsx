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

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Student Management</h2>

      {!selectedStudent && (
        <>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter student name"
              value={newStudent}
              onChange={(e) => setNewStudent(e.target.value)}
            />
            <button onClick={handleAddStudent}>Add Student</button>
          </div>

          <input
            type="text"
            placeholder="Search student"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </>
      )}

      {!selectedStudent && (
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
      )}

      {selectedStudent && (
        <WeeklySchedule
          student={selectedStudent}
          classrooms={classrooms}
          updateSchedule={(updatedSchedule) => {
            updateStudent({
              ...selectedStudent,
              weeklySchedule: updatedSchedule,
            });
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
}

export default Students;
