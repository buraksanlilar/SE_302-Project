import React, { useState, useContext } from "react";
import { ClassroomContext } from "../context/ClassroomContext";
import { CoursesContext } from "../context/CoursesContext";
import "./Classrooms.css";

function Classrooms() {
  const { classrooms, addClassroom, deleteClassroom } = useContext(ClassroomContext);
  const { courses } = useContext(CoursesContext);

  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [newClassroom, setNewClassroom] = useState("");
  const [capacity, setCapacity] = useState("");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = [
    "8:30",
    "9:25",
    "10:20",
    "11:15",
    "12:10",
    "13:05",
    "14:00",
    "14:55",
    "15:50",
    "16:45",
    "17:40",
    "18:35",
    "19:30",
    "20:25",
  ];

  // Haftalık programı oluştur
  const getClassroomSchedule = (classroomName) => {
    // Boş tablo oluştur
    const schedule = Array.from({ length: hours.length }, () => Array(days.length).fill("-"));

    // Kursları tarayıp tabloya yerleştir
    courses
      .filter((course) => course.classroom === classroomName) // Bu sınıfa atanmış kursları filtrele
      .forEach((course) => {
        const dayIndex = days.indexOf(course.day); // Günü bul
        const hourIndex = hours.indexOf(course.hour.trim()); // Başlangıç saatini bul

        if (dayIndex !== -1 && hourIndex !== -1) {
          const duration = parseInt(course.duration) || 1;

          // Süre kadar tabloyu doldur
          for (let i = 0; i < duration; i++) {
            if (hourIndex + i < hours.length) {
              schedule[hourIndex + i][dayIndex] = course.courseName; // Kursu tabloya ekle
            }
          }
        }
      });
    return schedule;
  };

  // Yeni sınıf ekleme
  const handleAddClassroom = () => {
    if (newClassroom && capacity > 0) {
      addClassroom({ id: Date.now(), name: newClassroom, capacity });
      setNewClassroom("");
      setCapacity("");
    }
  };

  return (
    <div className="classrooms-container">
      <h3>Manage Classrooms</h3>
      <div>
        <input
          type="text"
          placeholder="Classroom Name"
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
            <button onClick={() => setSelectedClassroom(classroom)}>Weekly Schedule</button>
            <button onClick={() => deleteClassroom(classroom.id)}>Delete</button>
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
