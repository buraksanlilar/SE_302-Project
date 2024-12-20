import React, { useState, useContext } from "react";
import { ClassroomContext } from "../context/ClassroomContext";
import { CoursesContext } from "../context/CoursesContext";
import "./Classrooms.css";

function Classrooms() {
  const { classrooms, addClassroom, deleteClassroom } = useContext(ClassroomContext);
  const { courses } = useContext(CoursesContext);
  const [newClassroom, setNewClassroom] = useState("");
  const [capacity, setCapacity] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = ["08:30", "09:25", "10:20", "11:15", "12:10", "13:05", "14:00", "14:55", "15:50"];

  // Haftalık program tablosunu oluştur
  const getClassroomSchedule = (classroomName) => {
    const schedule = Array.from({ length: hours.length }, () => Array(days.length).fill("-"));
    courses
      .filter((course) => course.classroom === classroomName)
      .forEach((course) => {
        const dayIndex = days.indexOf(course.day);
        const hourIndex = hours.indexOf(course.hour);
        if (dayIndex !== -1 && hourIndex !== -1) {
          schedule[hourIndex][dayIndex] = course.courseName;
        }
      });
    return schedule;
  };

  // Yeni derslik ekle
  const handleAddClassroom = () => {
    if (newClassroom.trim() && capacity > 0) {
      const newClass = { id: Date.now(), name: newClassroom, capacity };
      addClassroom(newClass);
      setNewClassroom("");
      setCapacity("");
    }
  };

  return (
    <div className="classrooms-container">
      <h3>Manage Classrooms</h3>
      <div className="form-group">
        <input
          type="text"
          placeholder="Enter classroom name"
          value={newClassroom}
          onChange={(e) => setNewClassroom(e.target.value)}
        />
        <input
          type="number"
          placeholder="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />
        <button onClick={handleAddClassroom}>Add Classroom</button>
      </div>

      <ul>
        {classrooms.map((classroom) => (
          <li key={classroom.id}>
            {classroom.name} - Capacity: {classroom.capacity}
            <div className="button-group">
              <button
                className="schedule-button"
                onClick={() => setSelectedClassroom(classroom)}
              >
                Weekly Schedule
              </button>
              <button
                className="delete-button"
                onClick={() => deleteClassroom(classroom.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Haftalık Program Tablosu */}
      {selectedClassroom && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Weekly Schedule for {selectedClassroom.name}</h4>
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Time</th>
                  {days.map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getClassroomSchedule(selectedClassroom.name).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>{hours[rowIndex]}</td>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setSelectedClassroom(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Classrooms;
