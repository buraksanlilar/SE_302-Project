import React, { useState, useContext, useEffect } from "react";
import { ClassroomContext } from "../context/ClassroomContext";
import { CoursesContext } from "../context/CoursesContext";
import "./Classrooms.css";

function Classrooms() {
  const { classrooms, addClassroom, deleteClassroom } = useContext(ClassroomContext);
  const { courses } = useContext(CoursesContext);
  const [newClassroom, setNewClassroom] = useState("");
  const [capacity, setCapacity] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [schedule, setSchedule] = useState([]);

  // Gün ve saat aralıklarını oluştur
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = generateTimeSlots();

  function generateTimeSlots() {
    const slots = [];
    let hour = 8;
    let minute = 30;

    while (hour < 22 || (hour === 22 && minute <= 15)) {
      slots.push(
        `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
      );
      minute += 55;
      if (minute >= 60) {
        hour += 1;
        minute -= 60;
      }
    }
    return slots;
  }

  // Haftalık programı oluştur ve kurs süresine göre hücreleri doldur
  useEffect(() => {
    if (selectedClassroom) {
      const newSchedule = Array.from({ length: hours.length }, () => Array(days.length).fill("-"));
      courses
        .filter((course) => course.classroom === selectedClassroom.name)
        .forEach((course) => {
          const dayIndex = days.indexOf(course.day);
          const hourIndex = hours.indexOf(course.hour);
          const duration = parseInt(course.duration);

          if (dayIndex !== -1 && hourIndex !== -1) {
            for (let i = 0; i < duration; i++) {
              if (hourIndex + i < newSchedule.length) {
                newSchedule[hourIndex + i][dayIndex] = `${course.courseName} (${course.teacherName})`;
              }
            }
          }
        });
      setSchedule(newSchedule);
    }
  }, [selectedClassroom, courses]);

  // Yeni derslik ekleme işlemi
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
              <button onClick={() => setSelectedClassroom(classroom)}>Weekly Schedule</button>
              <button onClick={() => deleteClassroom(classroom.id)}>Delete</button>
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
                {schedule.map((row, rowIndex) => (
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
