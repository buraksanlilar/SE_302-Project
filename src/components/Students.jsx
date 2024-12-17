import React, { useState, useEffect, useContext } from "react";
import { ClassroomContext } from "../context/ClassroomContext";
import WeeklySchedule from "./WeeklySchedule";
import "./StudentManagement.css";
 
function Students() {
  const { classrooms } = useContext(ClassroomContext);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [newStudent, setNewStudent] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
 
  // Load students from localStorage on component mount
  useEffect(() => {
    const storedStudents = localStorage.getItem("students");
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    }
  }, []);
 
  // Save students to localStorage whenever the students state changes
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem("students", JSON.stringify(students));
    }
  }, [students]);
 
  // Add a new student
  const addStudent = () => {
    if (newStudent.trim()) {
      const newStudentData = {
        id: Date.now(),
        name: newStudent,
        weeklySchedule: Array.from({ length: 16 }, () => Array(5).fill(null)),
      };
      setStudents((prevStudents) => [...prevStudents, newStudentData]);
      setNewStudent("");
    }
  };
 
  // Delete a student
  const deleteStudent = (id) => {
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.id !== id)
    );
  };
 
  // Filter students based on search input
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
            <button onClick={addStudent}>Add Student</button>
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
            const updatedStudents = students.map((s) =>
              s.id === selectedStudent.id
                ? { ...s, weeklySchedule: updatedSchedule }
                : s
            );
            setStudents(updatedStudents);
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
}
 
export default Students;
 
 